import React, { useRef, useState } from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { showAlert } from "../controls/Alert";
import { DropDownSelect } from "../controls/DropDownSelect";
import {
    hasPermission,
    requiredEmailValidator,
    requiredValidator,
} from "../../site";
import FormInput from "../forms/FormInput";
import Button from "../controls/Button";
import DialogOverlay from "../controls/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faPenToSquare,
    faPlus,
    faTrashCan,
} from "@fortawesome/pro-light-svg-icons";

const schoolInput = (schools, user, setSchoolInputValue) => {
    const lst = schools?.map((s) => {
        return {
            ...s,
            selected: _.find(user?.schools || [], { urn: s.urn })
                ? true
                : false,
        };
    });

    return (
        <div className="block my-2">
            <label htmlFor={"school"} className="flex flex-no-wrap mb-2">
                Select school(s)
            </label>
            <DropDownSelect
                items={lst}
                textField={"name"}
                valueField={"urn"}
                placeholder={"All Schools"}
                multiSelect
                onChange={(e) => setSchoolInputValue(e.value)}
                customWidth={true}
            />
        </div>
    );
};

const roleInput = (roles, user, setRoleInputValue) => {
    if (roles.load === true) return;

    const lst = roles?.map((r) => {
        return {
            ...r,
            selected: user?.roles?.includes(r.id),
        };
    });

    return (
        <div className="block my-2">
            <label htmlFor={"school"} className="flex flex-no-wrap mb-2">
                Select role(s)
            </label>
            <DropDownSelect
                items={lst}
                textField={"name"}
                valueField={"id"}
                placeholder={"Select roles"}
                multiSelect
                onChange={(e) => setRoleInputValue(e.value)}
                customWidth={true}
            />
        </div>
    );
};

const EditUser = ({
    schools,
    organisation,
    roles,
    IdPrefix,
    updateUsers,
    userDetail,
    currentUserEdit,
    execute,
    open,
    setOpen,
}) => {
    const [schoolInputValue, setSchoolInputValue] = useState(undefined);
    const [roleInputValue, setRoleInputValue] = useState(undefined);

    const firstName = currentUserEdit?.name?.split(" ")[0];
    const surname = currentUserEdit?.name?.split(" ")[1];

    const defaultSchools = schools
        ?.map((s) => {
            if (_.find(currentUserEdit?.schools || [], { urn: s.urn })) {
                return s.urn;
            }
        })
        .filter(function (element) {
            return element !== undefined;
        });

    const save = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const schools = schoolInputValue
            ? schoolInputValue?.map((school) => school.urn)
            : defaultSchools;

        const roles = roleInputValue
            ? roleInputValue?.map((role) => role.id)
            : [];

        const data = {
            email: formData.get("email")?.toString() ?? "",
            firstName: formData.get("firstName")?.toString() ?? "",
            organisation,
            schools,
            roles,
            surname: formData.get("surname")?.toString() ?? "",
            id: formData.get("id")?.toString() || null,
        };

        showAlert({
            body: (
                <p>
                    Are you sure you want to{" "}
                    {currentUserEdit ? "update" : "add"} the user?
                </p>
            ),
            buttons: [
                {
                    text: "OK",
                    click: () => {
                        execute("POST", "/api/settings/user", data)
                            .then((response) => {
                                if (!response || response.error) {
                                    showAlert({
                                        body: (
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: response
                                                        ? response.error
                                                        : "Unable to save details",
                                                }}
                                            />
                                        ),
                                    });
                                    return;
                                }
                                updateUsers(response);
                                setSchoolInputValue(undefined);
                                setRoleInputValue(undefined);
                            })
                            .catch((e) => {
                                debugger;
                                console.log("ERROR", e);
                                showAlert({
                                    body: <p>Unable to save details</p>,
                                });
                            });
                    },
                },
                { text: "Cancel" },
            ],
        });
    };

    return (
        <DialogOverlay
            key={IdPrefix + "user-dlg"}
            open={open}
            setOpen={setOpen}
            title={currentUserEdit ? "Update user" : "Create user"}
        >
            <form id="addUserForm" onSubmit={save}>
                <FormInput
                    name="id"
                    type="hidden"
                    defaultValue={currentUserEdit?.id || null}
                />
                <div style={{ width: 400 }}>
                    <fieldset className="">
                        <FormInput
                            name="firstName"
                            type="text"
                            required
                            defaultValue={
                                currentUserEdit?.firstName
                                    ? currentUserEdit?.firstName
                                    : firstName
                            }
                            validator={requiredValidator}
                            label="First name"
                            maxLength={30}
                        />
                        <FormInput
                            name="surname"
                            type="text"
                            required
                            defaultValue={
                                currentUserEdit?.surname
                                    ? currentUserEdit?.surname
                                    : surname
                            }
                            validator={requiredValidator}
                            label="Last name"
                            maxLength={30}
                        />
                        <FormInput
                            name="email"
                            type="email"
                            required
                            defaultValue={currentUserEdit?.email}
                            validator={requiredEmailValidator}
                            label="Email"
                            maxLength={250}
                            readOnly={currentUserEdit?.email ? true : false}
                            className={"w-full border-1 border-gray-300 text-start z-1 rounded-md flex flex-1-1 px-3 py-2" + (currentUserEdit?.email ? " bg-slate-300" : "")}
                        />
                        {hasPermission(userDetail, "changeuserurns")
                            ?.available && (
                                <>
                                    {schoolInput(
                                        schools,
                                        currentUserEdit,
                                        setSchoolInputValue
                                    )}
                                </>
                            )}
                        {roles &&
                            hasPermission(userDetail, "rolemanagement")
                                ?.available && (
                                <>
                                    {roleInput(
                                        roles,
                                        currentUserEdit,
                                        setRoleInputValue
                                    )}
                                </>
                            )}
                        <div className="p-2 flex items-center justify-end w-full">
                            <Button form="addUserForm" type="submit">
                                Save
                            </Button>
                        </div>
                    </fieldset>
                </div>
            </form>
        </DialogOverlay>
    );
};

const UserSettings = (props) => {
    const { execute } = useFetchWithMsal();
    const [IdPrefix] = useState(_.uniqueId("usr-"));
    const [settings, setSettings] = useState({ loading: true });
    const [users, setUsers] = useState({ load: true });
    const [roles, setRoles] = useState({ load: true });
    const [addUser, setAddUser] = useState(false);
    const [currentUserEdit, setCurrentUserEdit] = useState(false);
    const { setLocation, userDetail } = useMatpadContext();
    const [selectedOrganisation, setSelectedOrganisation] =
        React.useState(null);
    const refOrganisation = useRef(userDetail?.organisation?.id || null);

    React.useEffect(() => {
        setLocation(window.location.pathname);

        //if (userDetail.organisationRole !== "Admin") {
        //    setSettings({ organisationRole: "User" });
        //    setSelectedOrganisation(userDetail?.organisation?.id || null);
        //    setUsers({ loading: false });
        //}
        //else
        if (!settings || settings.loading) {
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

                        if (
                            _.isArray(response?.organisations) &&
                            response.organisations.length === 1
                        )
                            setSelectedOrganisation(
                                response?.organisations[0].id
                            );

                        setSettings(response);
                        setUsers({ load: true });
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }
    }, [setLocation, userDetail, settings, execute]);

    React.useEffect(() => {
        if (
            !settings ||
            settings.loading === true ||
            !users ||
            !selectedOrganisation ||
            users.loading
        )
            return;

        if (users.load === true) {
            setUsers({ loading: true });
            execute(
                "GET",
                "/api/settings/organisation/" + selectedOrganisation + "/users"
            )
                .then((response) => {
                    if (response) {
                        if (response.error) {
                            showAlert({
                                body: (
                                    <>
                                        <p>Unable to load users</p>
                                        <p>{response.error}</p>
                                    </>
                                ),
                            });
                            setSettings({ error: true });
                        }

                        setUsers(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }
    }, [selectedOrganisation, users, execute, settings]);

    React.useEffect(() => {
        if (refOrganisation.current !== userDetail?.organisation?.id) {
            refOrganisation.current = userDetail?.organisation?.id;
            setSettings({ loading: true });
        }
    }, [userDetail]);

    React.useEffect(() => {
        if (!selectedOrganisation) return;

        execute("GET", `/api/role/${selectedOrganisation}`)
            .then((response) => {
                setRoles(response.roles);
            })
            .catch((e) => {
                debugger;
                showAlert({ body: <p>Unable to load roles!</p> });
            });
    }, [selectedOrganisation]);

    const deleteUser = (u) => {
        showAlert({
            body: (
                <p>
                    Are you sure you want to delete <strong>{u.email}</strong>{" "}
                    from the system?
                </p>
            ),
            buttons: [
                {
                    text: "OK",
                    click: (e) => {
                        execute("POST", "/api/settings/user", {
                            email: u.email,
                            delete: true,
                            id: u.id,
                        })
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
                                console.log("DELETE ", u.id);
                                const d = {
                                    ...users,
                                    users: _.filter(
                                        users.users,
                                        (user) => user.id !== u.id
                                    ),
                                };
                                setUsers(d);
                            })
                            .catch((e) => {
                                debugger;
                                console.log("ERROR", e);
                                showAlert({
                                    body: <p>Unable to save details</p>,
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

    let orgSelect = (
        <h3 className="font-medium text-2xl mb-3">
            {userDetail.organisation.name}
        </h3>
    );

    if (
        hasPermission(userDetail, "usermanagement")?.available &&
        settings?.organisations?.length > 1
    ) {
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

        const orgList = nameSortedContractOrgs
            .concat(nameSortedNonContractOrgs)
            ?.map((o) => {
                return {
                    id: o.id,
                    name: o.name,
                    selected: o.id === selectedOrganisation,
                };
            });

        orgSelect = (
            <div style={{ maxWidth: 300 }}>
                <DropDownSelect
                    key={IdPrefix + "sel"}
                    id={IdPrefix + "org"}
                    items={orgList}
                    textField={"name"}
                    valueField={"id"}
                    placeholder={"Organisation"}
                    value={selectedOrganisation}
                    onChange={(e) => {
                        setUsers({ load: true });
                        setSelectedOrganisation(e.value.id);
                    }}
                />
            </div>
        );
    }

    const editUserClick = (user) => {
        setCurrentUserEdit(user);
        setAddUser(true);
    };

    const addUserClick = () => {
        setCurrentUserEdit();
        setAddUser(true);
    };

    return (
        <div className="flex flex-col h-full gap-y-4">
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="text-slate-900 text-lg font-semibold">
                        Organisations
                    </div>
                </div>
                <div className="flex gap-3 mt-2">
                    {orgSelect}
                    {selectedOrganisation &&
                        selectedOrganisation !== "***Refresh***" && (
                            <button
                                className="border-none h-10 underline text-primary-500"
                                type="button"
                                onClick={() =>
                                    setSelectedOrganisation("***Refresh***")
                                }
                            >
                                Clear Selection
                            </button>
                        )}
                </div>
            </div>
            {selectedOrganisation &&
                selectedOrganisation !== "***Refresh***" ? (
                <div className="w-full h-5/6">
                    <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between h-1/6">
                            <div className="text-slate-900 text-lg font-semibold">
                                Users
                            </div>
                            {users?.canEditUsers === true && (
                                <Button onClick={addUserClick}>
                                    <div className="flex mx-2 items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="mr-2"
                                        />
                                        <div>Add user</div>
                                    </div>
                                </Button>
                            )}
                        </div>
                        <div className="h-5/6 pt-2 overflow-auto">
                            <div className=" border border-slate-300 overflow-auto rounded-lg">
                                <table className="w-full divide divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr className="divide divide-slate-200">
                                            <th
                                                scope="col"
                                                className="px-3 text-left text-base border-r border-r-slate-200 border-b border-b-slate-200 font-bold text-slate-900 sm:pl-6"
                                            >
                                                Email/Login
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 text-left text-base border-r border-r-slate-200 border-b border-b-slate-200 font-bold text-slate-900"
                                            >
                                                Has logged in
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 text-left text-base border-r border-r-slate-200 border-b border-b-slate-200 font-bold text-slate-900"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 text-left text-base border-r border-r-slate-200 border-b border-b-slate-200 font-bold text-slate-900"
                                            >
                                                Role
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 text-left text-base font-bold text-slate-900 border-b border-b-slate-200"
                                            >
                                                Schools
                                            </th>
                                            <th className="px-3 text-left text-base font-bold text-slate-900 border-b border-b-slate-200"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y overflow-hidden divide-slate-200 bg-white">
                                        {_.orderBy(users.users, (x) => x.name?.toLowerCase())?.map(
                                            (u, idx) => (
                                                <tr key={u.email + idx}>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm border-r border-r-slate-200 text-slate-900 sm:pl-6">
                                                        {u.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm border-r border-r-slate-200">
                                                        {u.b2cID ? (
                                                            <div className="text-green-600 bg-green-50 border-green-200 rounded-lg p-2 w-fit">
                                                                Yes
                                                            </div>
                                                        ) : (
                                                            <div className="bg-slate-50 border-slate-200 rounded-lg p-2 w-fit">
                                                                No
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm border-r border-r-slate-200 text-slate-900">
                                                        {u.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm border-r border-r-slate-200 text-slate-900">
                                                        {u.role}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-900">
                                                        <div className="flex items-center justify-between">
                                                            {_.isArray(
                                                                u.schools
                                                            ) &&
                                                                u.schools
                                                                    .length >
                                                                0 && (
                                                                    <table>
                                                                        <tbody>
                                                                            {_.orderBy(
                                                                                u.schools,
                                                                                [
                                                                                    "name",
                                                                                ]
                                                                            )?.map(
                                                                                (
                                                                                    s
                                                                                ) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            {
                                                                                                s.urn
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                s.name
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            {!(
                                                                _.isArray(
                                                                    u.schools
                                                                ) &&
                                                                u.schools
                                                                    .length > 0
                                                            ) && (
                                                                    <>All Schools</>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-row-reverse">
                                                            {hasPermission(
                                                                userDetail,
                                                                "usermanagement"
                                                            )?.available && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            editUserClick(
                                                                                u
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 rounded-lg border bg-white border-slate-300 mr-2"
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faPenToSquare
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            {hasPermission(
                                                                userDetail,
                                                                "usermanagement"
                                                            )?.available && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            deleteUser(
                                                                                u
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 rounded-lg border bg-white border-slate-300 mr-2"
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faTrashCan
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <EditUser
                            updateUsers={(u) => {
                                if (!u) {
                                    setAddUser(false);
                                    return
                                }

                                let userList = _.filter(users.users, (i) => i.id !== u.id) || [];
                                userList.push(u);

                                setUsers({
                                    ...users,
                                    users: userList
                                });
                                setAddUser(false);
                            }}
                            userDetail={userDetail}
                            IdPrefix={IdPrefix}
                            currentUserEdit={currentUserEdit}
                            schools={users.organisations}
                            organisation={selectedOrganisation}
                            execute={execute}
                            open={addUser}
                            setOpen={setAddUser}
                            roles={roles}
                        />
                    </div>
                </div>
            ) : (
                <div className="w-full h-5/6">
                    <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                        <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                                <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                    <FontAwesomeIcon
                                        icon={faClipboard}
                                        className="w-8 h-8 text-slate-600"
                                    />
                                </div>
                                <div className="text-slate-600 font-medium text-sm">
                                    Please select an organisation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSettings;
