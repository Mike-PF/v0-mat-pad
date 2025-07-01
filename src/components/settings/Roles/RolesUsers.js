import React, { useEffect, useState } from "react";
import _ from "lodash";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { showAlert } from "../../controls/Alert";
import { DropDownSelect } from "../../controls/DropDownSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faClipboard,
    faTrash,
} from "@fortawesome/pro-light-svg-icons";
import { LoadingSpinner } from "../../controls/LoadingSpinner";
import SearchInput from "../../forms/SearchInput";

const userInput = (users, roleUsers, handleUserChange) => {
    if (!users || users.loading === true || users.load === true) return;
    const allRoleUserIds = [];

    if (roleUsers) {
        for (let i = 0; i < roleUsers.length; i++) {
            allRoleUserIds.push(roleUsers[i].id);
        }
    }

    const lst = users?.map((user) => {
        return {
            ...user,
            selected: allRoleUserIds?.includes(user.id),
        };
    });

    return (
        <div className="block my-2">
            <label className="flex flex-no-wrap mb-2">Users</label>
            <DropDownSelect
                items={lst}
                textField={"name"}
                valueField={"id"}
                placeholder={"Users"}
                multiSelect
                onChange={(e) => {
                    handleUserChange(e.value);
                }}
            />
        </div>
    );
};

const RolesUsers = ({ orgId, roleUsers, setRoleUsers }) => {
    const { execute } = useFetchWithMsal();
    const [users, setUsers] = useState({ load: true });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [paginatedFilteredUsers, setPaginatedFilteredUsers] = useState([]);
    const [searchFilteredUsers, setSearchFilteredUsers] = useState([]);

    const [startPoint, setStartPoint] = useState(0);
    const [endPoint, setEndPoint] = useState(0);

    useEffect(() => {
        if (!roleUsers) return;

        const newUsers = structuredClone(roleUsers);

        const newSearchFilteredUsers = newUsers.filter((user) => {
            return user.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

        setSearchFilteredUsers(newSearchFilteredUsers);

        const alphabeticalUsers = newSearchFilteredUsers?.sort(function (a, b) {
            const nameA = a?.name?.toUpperCase();
            const nameB = b?.name?.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });

        const maxPages = Math.ceil(alphabeticalUsers?.length / 5);
        let newStartPoint = 0;
        let newEndPoint = 0;

        if (currentUserPage !== maxPages) {
            newStartPoint = currentUserPage * 5 - 5;
            newEndPoint = currentUserPage * 5;
            setStartPoint(newStartPoint);
            setEndPoint(newEndPoint);
        } else {
            newStartPoint = currentUserPage * 5 - 5;
            newEndPoint = alphabeticalUsers?.length;
            setStartPoint(newStartPoint);
            setEndPoint(newEndPoint);
        }

        const newPaginatedFilteredUsers = alphabeticalUsers?.slice(
            newStartPoint,
            newEndPoint
        );

        setPaginatedFilteredUsers(newPaginatedFilteredUsers);
    }, [roleUsers, searchTerm, currentUserPage]);

    useEffect(() => {
        if (!orgId) return;
        if (orgId) {
            setUsers({ loading: true });

            execute("GET", "/api/settings/organisation/" + orgId + "/users")
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
                        }

                        setUsers(
                            response.users?.map((user) => {
                                return {
                                    key: user.id,
                                    id: user.id,
                                    name: user.name,
                                };
                            })
                        );
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load users</p> });
                });
        }
    }, [orgId]);

    useEffect(() => {
        setLoading(true);
        if (roleUsers && users && users.length) {
            for (let r = 0; r < roleUsers.length; r++) {
                const existingUser = users.find(
                    (user) => user.id === roleUsers[r].id
                );
                const existingUserIndex = users.indexOf(existingUser);

                if (existingUserIndex >= 0) {
                    users[existingUserIndex].selected = true;
                }
            }
            setLoading(false);
        }
        setLoading(false);
    }, [roleUsers]);

    const handleUserChange = (users) => {
        setRoleUsers(users);
    };

    const handleBinClick = (user) => {
        const newUsers = structuredClone(roleUsers);

        const selectedUser = newUsers.find((newUser) => newUser.id === user.id);
        const selectedUserIndex = newUsers.indexOf(selectedUser);

        newUsers.splice(selectedUserIndex, 1);

        handleUserChange(newUsers);
    };

    const searching = (event) => {
        setSearchTerm(event.target.value);
        setCurrentUserPage(1);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            {!users ? (
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
                                No users to select
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-2 h-full">
                    <div className="w-full h-1/6 overflow-auto">
                        <div className="w-full flex flex-col bg-white border border-slate-200 rounded-lg">
                            <div className="px-3">
                                <div className="flex">
                                    {orgId && (
                                        <div className="py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-green-900 text-lg font-semibold">
                                                    Users
                                                </div>
                                            </div>
                                            <div className="flex mt-2">
                                                <div style={{ maxWidth: 300 }}>
                                                    {userInput(
                                                        users,
                                                        roleUsers,
                                                        handleUserChange
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="border-slate-200 border rounded-lg mb-4">
                                    <div className="flex items-center divide-x divide-slate-200 rounded-t-lg bg-slate-50 border-b border-b-slate-200">
                                        <div className="w-1/3 h-full flex items-center p-2">
                                            Email/Login
                                        </div>
                                        <div className="w-2/3 flex justify-between items-center col-span-3 p-2">
                                            <div className="h-full flex items-center">
                                                Name
                                            </div>
                                            <SearchInput
                                                searchTerm={searchTerm}
                                                setSearch={searching}
                                                name="searchReports"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col divide-y divide-slate-200">
                                        {paginatedFilteredUsers?.map((user) => (
                                            <div
                                                key={_.uniqueId(user.id)}
                                                className="w-full flex divide-x divide-slate-200"
                                            >
                                                <div className="p-1 w-1/3">
                                                    {user?.email}
                                                </div>
                                                <div className="w-2/3 col-span-3 p-1 flex items-center justify-between">
                                                    {user?.name}
                                                    <button
                                                        type="button"
                                                        className="border-none p-1 mr-2 flex items-center"
                                                        onClick={() =>
                                                            handleBinClick(user)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            className="size-4 p-1 text-slate-600 rounded-lg border border-slate-200"
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-200 p-2 flex items-center">
                                        <div className="mr-2 w-20 flex justify-center items-center">
                                            {`${
                                                startPoint + 1
                                            } - ${endPoint} of ${
                                                searchFilteredUsers.length
                                            }`}
                                        </div>
                                        <div className="size-8 flex items-center justify-center">
                                            <button
                                                className="size-7 border-slate-200 rounded-lg flex items-center justify-center"
                                                type="button"
                                                onClick={() =>
                                                    currentUserPage > 1 &&
                                                    setCurrentUserPage(
                                                        currentUserPage - 1
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faChevronLeft}
                                                />
                                            </button>
                                        </div>
                                        <div className="size-8 flex items-center justify-center">
                                            <button
                                                className="size-7 border-slate-200 rounded-lg flex items-center justify-center"
                                                type="button"
                                                onClick={() =>
                                                    currentUserPage <
                                                        searchFilteredUsers?.length /
                                                            5 &&
                                                    setCurrentUserPage(
                                                        currentUserPage + 1
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faChevronRight}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RolesUsers;
