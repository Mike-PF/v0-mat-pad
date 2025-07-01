import React, { useState } from "react";
import ToggleButton from "../../controls/Toggle";
import Button from "../../controls/Button";
import { LoadingSpinner } from "../../controls/LoadingSpinner";
import { showAlert } from "../../controls/Alert";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { useMatpadContext } from "../../context/applicationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";
import { noop } from "jquery";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ModalConnectionRow({
    data,
    index,
    connection,
    setRefresh,
    searchTerm,
    setEditModalOpen,
    setCurrentConnectionRow,
}) {
    const { userDetail } = useMatpadContext();
    const [domain, setDomain] = useState(data.domain ?? "");
    const [key, setKey] = useState(data.apiKey ?? "");
    const [username, setUsername] = useState(data.username ?? "");
    const [password, setPassword] = useState(data.password ?? "");
    const [baseURL, setBaseURL] = useState(data.baseURL ?? "");
    const [token, setToken] = useState(data.token ?? "");
    const [state, setState] = useState(data.isActive ?? false);
    const { execute } = useFetchWithMsal();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [collecting, setCollecting] = useState(false);
    const [collected, setCollected] = useState(false);

    const connectionCall = () => {
        setLoading(true);
        let postData = {
            organisationId: userDetail?.organisation?.id ?? "",
            schoolId: data?.schoolID,
            connectionSettingId: connection?.ConnectionSettingId,
        };

        if (connection?.requiresDomain) {
            postData.domain = domain;
        }
        if (connection?.requiresKey) {
            postData.apiKey = key;
        }
        if (connection?.requiresUsername) {
            postData.username = username;
        }
        if (connection?.requiresPassword) {
            postData.password = password;
        }
        if (connection?.requiresBaseURL) {
            postData.baseURL = baseURL;
        }
        if (connection?.requiresToken) {
            postData.token = token;
        }

        execute("POST", `/api/connections/insert`, postData)
            .then(() => {
                setRefresh(true);
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to create connection</p> });
            });

        setLoading(false);
    };

    const verifyCall = () => {
        setLoading(true);

        execute("PUT", `/api/connections/${data?.ConnectionID}/verify`)
            .then(() => {
                setRefresh(true);
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to verify connection</p> });
            });

        setLoading(false);
    };

    const editConnectionCall = () => {
        setLoading(true);
        let postData = {
            organisationId: userDetail?.organisation?.id ?? "",
            schoolId: data?.id,
            connectionSettingId: connection?.ConnectionSettingId,
            connectionID: data?.ConnectionID ?? "",
        };

        if (connection?.requiresDomain) {
            postData.domain = domain;
        }
        if (connection?.requiresKey) {
            postData.apiKey = key;
        }
        if (connection?.requiresUsername) {
            postData.username = username;
        }
        if (connection?.requiresPassword) {
            postData.password = password;
        }
        if (connection?.requiresBaseURL) {
            postData.baseURL = baseURL;
        }
        if (connection?.requiresToken) {
            postData.token = token;
        }

        execute("PUT", `/api/connections/update`, postData)
            .then(() => {
                setRefresh(true);
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to update connection</p> });
            });

        setLoading(false);
    };

    const toggleClick = (e) => {
        const type = e ? "enable" : "disable";

        setLoading(true);
        execute("PUT", `/api/connections/${data?.ConnectionID}/${type}`)
            .then((response) => {
                setState(e);
                showAlert({ body: <p>{`Connection ${type}d sucessfully`}</p> });
            })
            .catch((err) => {
                showAlert({ body: <p>{`Unable to ${type} connection`}</p> });
            });
        setLoading(false);
    };

    const getButton = () => {
        if (isEditing) {
            return (
                <Button
                    type="button"
                    className="h-7"
                    onClick={() => editConnectionCall()}
                >
                    Connect
                </Button>
            );
        }

        if (
            data?.userFriendlyMessage
                ?.toLowerCase()
                ?.includes("incorrect school name")
        ) {
            const siteName = data?.userFriendlyMessage?.split(
                "Incorrect School Name "
            );
            const filteredSiteName = siteName?.filter((sn) => sn !== "");

            return (
                <Button
                    type="button"
                    className="h-7"
                    onClick={() =>
                        showAlert({
                            title: "MATpad - Data mismatch",
                            body: (
                                <div className="flex flex-col items-center justify-center gap-2 flex-wrap">
                                    <p>
                                        {data?.schoolName ?? ""} is trying to
                                        obtain information linked to{" "}
                                        {filteredSiteName[0] ?? ""} from the{" "}
                                        {data?.connectionName} system.
                                    </p>
                                    <p>Do you wish to continue?</p>
                                    <Button onClick={verifyCall}>
                                        Connect
                                    </Button>
                                </div>
                            ),
                            buttons: [],
                        })
                    }
                >
                    Verify
                </Button>
            );
        }

        return !data?.ConnectionID && !isEditing ? (
            <Button
                type="button"
                className="h-7"
                onClick={() => connectionCall()}
            >
                Connect
            </Button>
        ) : (
            <button
                className={classNames(
                    "min-w-32 h-7 rounded-m border border-[#ced4da] bg-[#f5f5f5] text-[#36454f] hover:opacity-60 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
                )}
                onClick={editClick}
            >
                Edit
            </button>
        );
    };

    const fireCall = () => {
        setCollecting(true);
        execute("PUT", `/api/connections/${data?.ConnectionID}/launch`)
            .then((response) => {
                setCollected(true);
                setCollecting(false);
            })
            .catch((err) => {
                showAlert({ body: <p>{`Unable to collect datasets`}</p> });
            });
    };

    const getCollectButton = () => {
        return !data?.ConnectionID && !isEditing ? (
            <></>
        ) : (
            <Button className="h-7" onClick={fireCall}>
                Collect Data
            </Button>
        );
    };

    const editClick = () => {
        setPassword("");
        setIsEditing(true);
        setState(false);
    };

    const extraStepClick = () => {
        setCurrentConnectionRow(data);
        setEditModalOpen(true);
    };

    if (
        data?.URN &&
        !data?.URN?.toString()
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase()) &&
        !data?.schoolName
            ?.toString()
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase())
    ) {
        return;
    }

    return (
        <tr key={index} className={`${index > 0 ? "border-t " : ""}`}>
            <td
                className={classNames(
                    data?.lastRunStatus === "Error"
                        ? "text-red-500"
                        : "text-green-500",
                    "p-2 overflow-hidden"
                )}
            >
                {data?.userFriendlyMessage ?? ""}
            </td>
            {connection?.storageLevel !== "MAT" && (
                <td className="p-2  overflow-hidden">{data?.URN ?? ""}</td>
            )}
            {connection?.storageLevel !== "MAT" && (
                <td className="p-2  overflow-hidden">
                    {data?.schoolName ?? ""}
                </td>
            )}
            {connection?.requiresDomain && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="text"
                        value={domain}
                        onChange={(event) => setDomain(event.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                    />
                </td>
            )}
            {connection?.requiresKey && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="text"
                        value={key}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                        onChange={(event) => setKey(event.target.value)}
                    />
                </td>
            )}
            {connection?.requiresUsername && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                    />
                </td>
            )}
            {connection?.requiresPassword && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                    />
                </td>
            )}
            {connection?.requiresBaseURL && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="text"
                        value={baseURL}
                        onChange={(event) => setBaseURL(event.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                    />
                </td>
            )}
            {connection?.requiresToken && (
                <td className="p-[3px] min-w-36 ">
                    <input
                        type="text"
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-lg disabled:bg-slate-50"
                        disabled={data?.ConnectionID && !isEditing}
                    />
                </td>
            )}
            <td className="p-2">
                {loading ? <LoadingSpinner /> : <>{getButton()}</>}
            </td>
            <td className="p-2">
                {loading ? (
                    <LoadingSpinner />
                ) : !data?.lastRunStatus || data?.lastRunStatus === "Error" ? (
                    <div />
                ) : (
                    <ToggleButton
                        enabled={state}
                        setEnabled={isEditing ? noop : toggleClick}
                        srTitle="State toggle"
                    />
                )}
            </td>
            {/* extra step */}
            {connection?.requiresSecondStageConfig &&
            data?.lastRunStatus &&
            data?.lastRunStatus !== "Error" ? (
                <td className="p-[3px]">
                    <div className="w-full flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faPencilAlt}
                            onClick={extraStepClick}
                            className="text-slate-600 hover:cursor-pointer p-2 w-4 h-4 rounded-lg hover:bg-slate-50"
                        />
                    </div>
                </td>
            ) : null}
            <td className="p-2">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {!data?.lastRunStatus ||
                        data?.lastRunStatus === "Error" ? null : collecting ? (
                            <div className="flex flex-wrap items-center justify-center">
                                Download started
                            </div>
                        ) : collected ? (
                            <div>Data collected</div>
                        ) : (
                            getCollectButton()
                        )}
                    </>
                )}
            </td>
        </tr>
    );
}

export default ModalConnectionRow;
