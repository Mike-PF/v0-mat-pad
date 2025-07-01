import React, { useCallback, useEffect, useState } from "react";
import _, { noop } from "lodash";
import { requiredValidator } from "../../../site";
import FormInput from "../../forms/FormInput";
import { faBan, faCheck, faQuestion } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PermissionToggle from "./PermissionToggle";
import RolesUsers from "./RolesUsers";
import Button from "../../controls/Button";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { showAlert } from "../../controls/Alert";
import { Link } from "react-router-dom";

const ManageRole = (props) => {
    const { execute } = useFetchWithMsal();
    const [permissions, setPermissions] = useState([]);
    const [roleName, setRoleName] = useState(null);
    const [isAdd, setIsAdd] = useState(null);
    const [orgId, setOrgId] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [roleUsers, setRoleUsers] = useState(null);
    const [alteredPermissions, setAlteredPermissions] = useState(null);

    const setName = useCallback(
        _.debounce((e) => setRoleName(e.target.value), 300),
        []
    );

    useEffect(() => {
        const splitPath = window.location.pathname.split("/");
        const addPath = splitPath[4] === "add";
        const orgId = splitPath[3];

        setOrgId(orgId);
        setIsAdd(addPath);

        if (!addPath) {
            const roleId = splitPath[4];
            setRoleId(roleId);
        }
    }, [window.location]);

    useEffect(() => {
        if (orgId) {
            execute("GET", `/api/role/${orgId}`)
                .then((response) => {
                    setPermissions(response.permissions);
                })
                .catch((e) => {
                    debugger;
                    showAlert({ body: <p>Unable to load roles!</p> });
                });
        }
    }, [roleId, orgId]);

    useEffect(() => {
        if (orgId && roleId) {
            execute("GET", `/api/role/${orgId}/${roleId}`)
                .then((response) => {
                    const newRolePermissionsArray = [...permissions];

                    if (permissions && response.permissions) {
                        for (
                            let i = 0;
                            i < newRolePermissionsArray.length;
                            i++
                        ) {
                            for (
                                let r = 0;
                                r < response.permissions.length;
                                r++
                            ) {
                                const existingPermission =
                                    newRolePermissionsArray[i].permissions.find(
                                        (section) =>
                                            section.code ===
                                            response.permissions[r].code
                                    );

                                const existingPermissionIndex =
                                    newRolePermissionsArray[
                                        i
                                    ].permissions.indexOf(existingPermission);

                                if (existingPermissionIndex >= 0) {
                                    newRolePermissionsArray[i].permissions[
                                        existingPermissionIndex
                                    ].granted = response.permissions[r].granted;

                                    newRolePermissionsArray[i].permissions[
                                        existingPermissionIndex
                                    ].denied = response.permissions[r].denied;
                                }
                            }
                        }
                    }

                    setRoleName(response.name);
                    if (response.users) {
                        setRoleUsers(
                            response?.users?.map((user) => {
                                return {
                                    id: user.userID,
                                    name: `${user.firstName} ${user.surname}`,
                                };
                            })
                        );
                    } else {
                        setRoleUsers([]);
                    }
                })
                .catch((e) => {
                    debugger;
                    showAlert({ body: <p>Unable to load roles!</p> });
                });
        }
    }, [orgId, roleId, permissions]);

    useEffect(() => {}, [orgId, roleId]);

    const toggleClick = (currentSection, currentPermission, state) => {
        const selectedSection = permissions.find(
            (section) => section.section === currentSection.section
        );
        const selectedSectionIndex = permissions.indexOf(selectedSection);
        const selectedPermission = permissions[
            selectedSectionIndex
        ].permissions.find(
            (permission) => permission.code === currentPermission.code
        );
        const selectedPermissionIndex =
            permissions[selectedSectionIndex].permissions.indexOf(
                selectedPermission
            );

        const newPermissions = [];
        permissions.forEach((val) =>
            newPermissions.push(Object.assign({}, val))
        );

        if (state === "deny") {
            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].granted = false;

            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].denied = true;
        }

        if (state === "allow") {
            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].granted = true;

            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].denied = false;
        }

        if (state === "undetermined") {
            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].granted = false;

            newPermissions[selectedSectionIndex].permissions[
                selectedPermissionIndex
            ].denied = false;
        }

        setAlteredPermissions(newPermissions);
    };

    const bulkSection = (currentSection, state) => {
        const selectedSection = permissions.find(
            (section) => section.section === currentSection.section
        );
        const selectedSectionIndex = permissions.indexOf(selectedSection);
        const newPermissions = [];
        permissions.forEach((val) =>
            newPermissions.push(Object.assign({}, val))
        );

        if (state === "deny") {
            newPermissions[selectedSectionIndex].permissions.map(
                (permission) => (
                    (permission.granted = false), (permission.denied = true)
                )
            );
        }

        if (state === "allow") {
            newPermissions[selectedSectionIndex].permissions.map(
                (permission) => (
                    (permission.granted = true), (permission.denied = false)
                )
            );
        }

        if (state === "undetermined") {
            newPermissions[selectedSectionIndex].permissions.map(
                (permission) => (
                    (permission.granted = false), (permission.denied = false)
                )
            );
        }

        setAlteredPermissions(newPermissions);
    };

    const createRole = () => {
        execute("POST", `/api/role/${orgId}`, {
            name: roleName,
            permissions: permissions,
            users: roleUsers,
        })
            .then(() => {
                window.location = "/settings/role";
            })
            .catch((error) => {
                console.log("ANSWER ERROR", error);
                debugger;
                showAlert({ body: <p>Unable to save role!</p> });
            });
    };

    const updateRole = () => {
        execute("POST", `/api/role/${orgId}/${roleId}`, {
            name: roleName,
            permissions: permissions,
            users: roleUsers,
        })
            .then(showAlert({ body: <p>Role updated</p> }))
            .catch((error) => {
                console.log("ANSWER ERROR", error);
                debugger;
                showAlert({ body: <p>Unable to edit role!</p> });
            });
    };

    return (
        <div className="w-full bg-white overflow-auto border border-slate-200 rounded-lg p-4 h-full">
            <div className="h-24 p-2 flex items-center justify-between">
                <FormInput
                    name={"name"}
                    label={"Role name*"}
                    type="text"
                    defaultValue={roleName}
                    maxLength={50}
                    onChange={setName}
                    validator={requiredValidator}
                />
                <div className="flex gap-2">
                    {isAdd ? (
                        <Link to={`/settings/role/${orgId}`}>
                            <button
                                type="button"
                                className="min-w-32 rounded-m border-none bg-slate-200 hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
                                onClick={noop}
                            >
                                Cancel
                            </button>
                        </Link>
                    ) : (
                        <Link to={`/settings/role/${orgId}`}>
                            <button
                                type="button"
                                className="min-w-32 rounded-m border-none bg-slate-200 hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
                                onClick={noop}
                            >
                                Back
                            </button>
                        </Link>
                    )}
                    {isAdd ? (
                        <Button onClick={createRole} disabled={roleName === ""}>
                            Create role
                        </Button>
                    ) : (
                        <Button onClick={updateRole} disabled={roleName === ""}>
                            Save
                        </Button>
                    )}
                </div>
            </div>
            <div className="max-h-1/6 p-2">
                <RolesUsers
                    orgId={orgId}
                    roleUsers={roleUsers}
                    setRoleUsers={setRoleUsers}
                    isAdd={isAdd}
                />
            </div>
            <div className="max-h-4/6 p-2">
                <div className="h-full flex flex-col overflow-auto rounded-lg border border-slate-200">
                    <div className="w-full flex items-center justify-start p-4 text-slate-900 font-semibold text-lg">
                        Permissions
                    </div>
                    <div className="h-full overflow-auto flex flex-col p-3 gap-2 lg:flex-row">
                        {permissions.map((section) => (
                            <div
                                key={section.id}
                                className="w-full h-max bg-white border border-slate-200 rounded-lg pb-2 lg:w-1/5"
                            >
                                <div className="flex items-center  justify-between p-2 font-semibold bg-white rounded-t-lg">
                                    <div className="font-semibold text-lg">
                                        {section.section}
                                    </div>
                                    <div className="mr-1">
                                        <button
                                            className="border-none"
                                            onClick={() =>
                                                bulkSection(section, "deny")
                                            }
                                        >
                                            <FontAwesomeIcon
                                                className="h-4 w-4 p-1 text-red-400"
                                                icon={faBan}
                                            />
                                        </button>
                                        <button
                                            className="border-none"
                                            onClick={() =>
                                                bulkSection(
                                                    section,
                                                    "undetermined"
                                                )
                                            }
                                        >
                                            <FontAwesomeIcon
                                                className="h-4 w-4 p-1"
                                                icon={faQuestion}
                                            />
                                        </button>
                                        <button
                                            className="border-none"
                                            onClick={() =>
                                                bulkSection(section, "allow")
                                            }
                                        >
                                            <FontAwesomeIcon
                                                className="h-4 w-4 p-1 text-green-400"
                                                icon={faCheck}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    {section.permissions.map((permission) => (
                                        <div
                                            className="p-2 flex justify-between"
                                            key={permission.id}
                                        >
                                            <div>{permission.name}</div>
                                            <div className="flex justify-end pr-2">
                                                <PermissionToggle
                                                    onLeftClick={() =>
                                                        toggleClick(
                                                            section,
                                                            permission,
                                                            "deny"
                                                        )
                                                    }
                                                    onMiddleClick={() =>
                                                        toggleClick(
                                                            section,
                                                            permission,
                                                            "undetermined"
                                                        )
                                                    }
                                                    onRightClick={() =>
                                                        toggleClick(
                                                            section,
                                                            permission,
                                                            "allow"
                                                        )
                                                    }
                                                    permission={permission}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRole;
