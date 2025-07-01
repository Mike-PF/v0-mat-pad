import React, { useEffect, useState } from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { showAlert } from "../controls/Alert";
import Button from "../controls/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faPenToSquare,
} from "@fortawesome/pro-light-svg-icons";
import { Link } from "react-router-dom";
import { DropDownSelect } from "../controls/DropDownSelect";
import { faClipboard } from "@fortawesome/pro-light-svg-icons";
import { hasPermission } from "../../site";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const RoleSettings = (props) => {
    const { execute } = useFetchWithMsal();
    const [IdPrefix] = React.useState(_.uniqueId("role-"));
    const [settings, setSettings] = React.useState({ loading: true });
    const [selectedOrganisation, setSelectedOrganisation] =
        React.useState(null);
    const { setLocation, userDetail } = useMatpadContext();
    const [roles, setRoles] = useState([]);
    const [canView, setCanView] = useState(true);
    const [orgList, setOrgList] = useState([]);
    const [pageOrg, setPageOrg] = useState();

    useEffect(() => {
        const splitPath = window.location.pathname.split("/");
        const orgId = splitPath[3];

        setPageOrg(orgId);
        setSelectedOrganisation(orgId);
    }, [window.location]);

    React.useEffect(() => {
        setLocation(window.location.pathname);

        if (!hasPermission(userDetail, "rolemanagement")) {
            setCanView(false);
        } else if (!settings || settings.loading) {
            execute("GET", "/api/settings/organisation")
                .then((response) => {
                    if (response) {
                        if (response.error) {
                            showAlert({
                                body: (
                                    <>
                                        <p>Unable to load settings</p>
                                        <p>{response.error}</p>
                                    </>
                                ),
                            });
                            setSettings({ error: true });
                        }

                        setSettings(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }

        if (settings.organisations) {
            const contractOrganisations = settings?.organisations.filter(
                (item) => item?.contract === true
            );
            const nonContractOrganisations = settings?.organisations.filter(
                (item) => item?.contract !== true
            );
            const nameSortedContractOrgs = contractOrganisations.sort((a, b) =>
                a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
            );
            const nameSortedNonContractOrgs = nonContractOrganisations.sort(
                (a, b) =>
                    a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
            );

            setOrgList(
                nameSortedContractOrgs
                    .concat(nameSortedNonContractOrgs)
                    .map((o) => {
                        return {
                            id: o.id,
                            name: o.name,
                            selected:
                                o.id === selectedOrganisation ||
                                o.id === pageOrg,
                        };
                    })
            );
        }

        if (!selectedOrganisation && settings?.organisations?.length === 1) {
            setSelectedOrganisation(userDetail.organisation.id);
            return;
        }

        if (selectedOrganisation) {
            execute("GET", `/api/role/${selectedOrganisation}`)
                .then((response) => {
                    setRoles(response.roles);
                })
                .catch((e) => {
                    debugger;
                    showAlert({ body: <p>Unable to load roles!</p> });
                });
        }
    }, [setLocation, userDetail, settings, execute, selectedOrganisation]);

    const deleteRole = (r) => {
        showAlert({
            body: (
                <p>
                    Are you sure you want to delete <strong>{r.name}</strong>?
                </p>
            ),
            buttons: [
                {
                    text: "OK",
                    click: (e) => {
                        execute(
                            "POST",
                            `/api/role/${selectedOrganisation}/${r.id}`,
                            {
                                delete: true,
                            }
                        )
                            .then((response) => {
                                if (!response || response.error) {
                                    showAlert({
                                        body: (
                                            <p>
                                                {response
                                                    ? response.error
                                                    : "Unable to save details"}
                                            </p>
                                        ),
                                    });
                                    return;
                                }
                                const d = {
                                    ...roles,
                                    roles: _.filter((role) => role.id !== r.id),
                                };
                                setRoles(d);
                                showAlert({
                                    body: <p>Role deleted</p>,
                                });
                            })
                            .catch((e) => {
                                debugger;
                                console.log("ERROR", e);
                                showAlert({
                                    body: <p>Unable to delete role</p>,
                                });
                            });
                    },
                },
                { text: "Cancel" },
            ],
        });
    };

    if (!settings || settings.loading) return <LoadingSpinner />;

    if (!settings || settings.error) return <div>Page load error</div>;

    if (!canView) {
        return (
            <div className="h-full w-full">
                <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                    <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                        <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                            <FontAwesomeIcon
                                icon={faClipboard}
                                className="w-8 h-8 text-slate-600"
                            />
                        </div>
                        <div className="text-slate-600 font-medium text-sm">
                            You don't have permission to edit roles
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-y-4">
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="text-slate-900 text-lg font-semibold">
                        Organisation
                    </div>
                </div>
                <div className="flex mt-2">
                    {orgList && orgList.length > 1 ? (
                        <div className="flex items-end gap-3">
                            <div className="max-w-64">
                                <DropDownSelect
                                    key={IdPrefix + "sel"}
                                    id={IdPrefix + "org"}
                                    items={orgList}
                                    textField={"name"}
                                    valueField={"id"}
                                    placeholder={"Organisation"}
                                    value={selectedOrganisation}
                                    onChange={(e) =>
                                        setSelectedOrganisation(e.value.id)
                                    }
                                />
                            </div>
                            {selectedOrganisation &&
                                selectedOrganisation !== "***Refresh***" && (
                                    <button
                                        className="border-none h-10 underline text-primary-500"
                                        type="button"
                                        onClick={() =>
                                            setSelectedOrganisation(
                                                "***Refresh***"
                                            )
                                        }
                                    >
                                        Clear Selection
                                    </button>
                                )}
                        </div>
                    ) : (
                        <h3 className="font-medium text-2xl mb-3">
                            {userDetail.organisation.name}
                        </h3>
                    )}
                </div>
            </div>
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4 h-full">
                {selectedOrganisation &&
                    selectedOrganisation !== "***Refresh***" && (
                        <div className="h-1/6 max-h-20 p-2 flex items-center justify-end">
                            <Link
                                to={`/settings/role/${selectedOrganisation}/add`}
                            >
                                <Button
                                    type="button"
                                    className="flex justify-center items-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="text-white pr-2"
                                    />
                                    Add role
                                </Button>
                            </Link>
                        </div>
                    )}
                {roles && roles.length > 0 ? (
                    <div className="h-5/6 overflow-auto ">
                        <div className="bg-slate-50 flex w-full border-b border-slate-200">
                            <div className="py-2 px-2 sm:px-4 w-1/3 sm:w-3/12 text-slate-900 border-l border-t rounded-tl-lg  border-slate-200 font-bold text-base">
                                Role name
                            </div>
                            <div className="py-2 px-2 sm:px-4 w-1/3 sm:w-8/12 border-x border-t border-slate-200">
                                Users
                            </div>
                            <div className="w-1/3 sm:w-1/12 border-t border-r rounded-tr-lg border-slate-200" />
                        </div>
                        <div className="w-full border-x border-slate-200 last:rounded-b-lg">
                            {roles.map((r) => {
                                return (
                                    <div
                                        key={r.id}
                                        className="flex border-b border-slate-200"
                                    >
                                        <div className="py-2 px-2 w-1/3 truncate sm:px-4 sm:w-3/12">
                                            {r.name}
                                        </div>
                                        <div className="py-2 px-2 truncate w-1/3 border-x border-slate-200 sm:px-4 sm:w-8/12 ">
                                            {r.users}
                                        </div>
                                        <div className="p-2 w-1/3 sm:w-1/12 flex items-center justify-center">
                                            <div className="w-1/2 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteRole(r)
                                                    }
                                                    className="h-8 w-8 border border-slate-300"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="text-slate-600"
                                                    />
                                                </button>
                                            </div>
                                            <Link
                                                to={`/settings/role/${selectedOrganisation}/${r.id}`}
                                                className="w-1/2 flex justify-center"
                                            >
                                                <button
                                                    type="button"
                                                    className="h-8 w-8 border border-slate-300"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        className="text-slate-600"
                                                    />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div
                        className={classNames(
                            selectedOrganisation &&
                                selectedOrganisation !== "***Refresh***"
                                ? "h-5/6"
                                : "h-full",
                            "w-full "
                        )}
                    >
                        <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                                <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                    <FontAwesomeIcon
                                        icon={faClipboard}
                                        className="w-8 h-8 text-slate-600"
                                    />
                                </div>
                                <div className="text-slate-600 font-medium text-sm">
                                    {!selectedOrganisation ||
                                    selectedOrganisation === "***Refresh***"
                                        ? "Please select an organisation"
                                        : "Please add a role"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSettings;
