import React, { Fragment, useEffect, useState } from "react";
import ModalConnectionRow from "./ModalConnectionRow";
import _ from "lodash";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { showAlert } from "../../controls/Alert";
import { useMatpadContext } from "../../context/applicationContext";
import { LoadingSpinner } from "../../controls/LoadingSpinner";
import DialogOverlay from "../../controls/Dialog";
import ModalEdit from "./ModalEdit";
import SearchInput from "../../forms/SearchInput";

function ModalConnection({ connection }) {
    const { userDetail } = useMatpadContext();
    const { execute } = useFetchWithMsal();
    const [schoolConnections, setSchoolConnections] = useState([]);
    const [matConnections, setMatConnections] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentConnectionRow, setCurrentConnectionRow] = useState(null);

    useEffect(() => {
        const data = {
            organisationId: userDetail?.organisation?.id?.toString() ?? "",
            connectionSettingId:
                connection?.ConnectionSettingId?.toString() ?? "",
        };

        if (connection?.storageLevel === "MAT") {
            execute(
                "GET",
                `/api/connections/organisation?organisationId=${data.organisationId}&connectionSettingId=${data.connectionSettingId}`
            )
                .then((response) => {
                    if (response) {
                        setMatConnections(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load connection</p> });
                });
        } else {
            execute(
                "GET",
                `/api/connections/schoolconnections?organisationId=${data.organisationId}&connectionSettingId=${data.connectionSettingId}`
            )
                .then((response) => {
                    if (response) {
                        setSchoolConnections(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load connection</p> });
                });
        }
        setRefresh(false);
    }, [execute, connection, refresh === true]);

    return (
        <div className="flex flex-col h-[650px]">
            <SearchInput
                setSearch={setSearchTerm}
                searchTerm={searchTerm}
                name="searchConnections"
            />
            <div className="">
                <table className="w-full mt-4 overflow-auto rounded-lg border border-slate-200 text-left text-sm">
                    <colgroup>
                        <col />
                        {connection?.storageLevel !== "MAT" && <col />}
                        {connection?.storageLevel !== "MAT" && <col />}
                        {connection?.requiresDomain && <col />}
                        {connection?.requiresKey && <col />}
                        {connection?.requiresUsername && <col />}
                        {connection?.requiresPassword && <col />}
                        {connection?.requiresBaseURL && <col />}
                        {connection?.requiresToken && <col />}
                        <col />
                        <col />
                        {connection?.requiresSecondStageConfig && <col />}
                        <col />
                    </colgroup>
                    <thead className="rounded-t-lg">
                        <tr
                            key="head"
                            className="gap-x-2 bg-slate-50 rounded-t-lg"
                        >
                            <th className="p-2 font-bold" scope="col">
                                <div className="w-max rounded-tl-lg h-full flex items-center">
                                    Connection Status
                                </div>
                            </th>
                            {connection?.storageLevel !== "MAT" && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        URN
                                    </div>
                                </th>
                            )}
                            {connection?.storageLevel !== "MAT" && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max min-w-[250px] h-full flex items-center">
                                        Organisation Name
                                    </div>
                                </th>
                            )}
                            {connection?.requiresDomain && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Domain
                                    </div>
                                </th>
                            )}
                            {connection?.requiresKey && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Key
                                    </div>
                                </th>
                            )}
                            {connection?.requiresUsername && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Username
                                    </div>
                                </th>
                            )}
                            {connection?.requiresPassword && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Password
                                    </div>
                                </th>
                            )}
                            {connection?.requiresBaseURL && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Base URL
                                    </div>
                                </th>
                            )}
                            {connection?.requiresToken && (
                                <th className="p-2 font-bold" scope="col">
                                    <div className="w-max h-full flex items-center">
                                        Token
                                    </div>
                                </th>
                            )}
                            <th
                                className="p-2 rounded-tr-lg font-bold"
                                scope="col"
                            >
                                <div className="w-max h-full flex items-center">
                                    Connect/Edit
                                </div>
                            </th>
                            <th
                                className="p-2 rounded-tr-lg font-bold"
                                scope="col"
                            >
                                <div className="w-max h-full flex items-center">
                                    Enabled
                                </div>
                            </th>
                            {/* extra steps */}
                            {connection?.requiresSecondStageConfig && (
                                <th
                                    className="p-2 rounded-tr-lg font-bold"
                                    scope="col"
                                >
                                    <div className="w-max h-full flex items-center">
                                        Data set
                                    </div>
                                </th>
                            )}
                            <th
                                className="p-2 rounded-tr-lg font-bold"
                                scope="col"
                            >
                                <div className="w-max h-full flex items-center">
                                    Data Collection
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {schoolConnections?.length > 0 &&
                        connection?.storageLevel !== "MAT" ? (
                            schoolConnections?.map((data, index) => (
                                <Fragment key={data?.ID ?? _.uniqueId()}>
                                    <ModalConnectionRow
                                        setEditModalOpen={setEditModalOpen}
                                        setCurrentConnectionRow={
                                            setCurrentConnectionRow
                                        }
                                        data={data}
                                        index={index}
                                        connection={connection}
                                        setRefresh={setRefresh}
                                        searchTerm={searchTerm}
                                    />
                                </Fragment>
                            ))
                        ) : matConnections?.length > 0 ? (
                            matConnections?.map((data, index) => {
                                return (
                                    <Fragment key={_.uniqueId()}>
                                        <ModalConnectionRow
                                            setEditModalOpen={setEditModalOpen}
                                            setCurrentConnectionRow={
                                                setCurrentConnectionRow
                                            }
                                            data={data}
                                            index={index}
                                            connection={connection}
                                            setRefresh={setRefresh}
                                            searchTerm={searchTerm}
                                        />
                                    </Fragment>
                                );
                            })
                        ) : (
                            <Fragment key={_.uniqueId()}>
                                <ModalConnectionRow
                                    setEditModalOpen={setEditModalOpen}
                                    setCurrentConnectionRow={
                                        setCurrentConnectionRow
                                    }
                                    data={{}}
                                    index={1}
                                    connection={connection}
                                    setRefresh={setRefresh}
                                    searchTerm={searchTerm}
                                />
                            </Fragment>
                        )}
                    </tbody>
                </table>
            </div>
            <DialogOverlay
                key={_.uniqueId("Edit modal")}
                open={editModalOpen}
                setOpen={setEditModalOpen}
                title={`Configure ${connection?.connectionName} datasets`}
                fullScreenWidth={true}
            >
                <ModalEdit
                    connection={connection}
                    currentConnectionRow={currentConnectionRow}
                />
            </DialogOverlay>
        </div>
    );
}

export default ModalConnection;
