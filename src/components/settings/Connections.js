import React, { useRef, useState } from "react";
import _, { uniqueId } from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { showAlert } from "../controls/Alert";
import { hasPermission } from "../../site";
import { PageError } from "../controls/PageError";
import ModalConnection from "./Connections/ModalConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-light-svg-icons";
import { NoPermission } from "../controls/NoPermission";
import DialogOverlay from "../controls/Dialog";
import SearchInput from "../forms/SearchInput";

const ConnectionsSettings = (props) => {
    const { execute } = useFetchWithMsal();
    const [settings, setSettings] = useState({ loading: true });
    const { setLocation, userDetail } = useMatpadContext();
    const [permissions, setPermissions] = useState({
        viewSettings: false,
        schoolsMaintenance: false,
    });
    const refOrganisation = useRef(userDetail?.organisation?.id || null);
    const [modalOpen, setModalOpen] = useState(false);
    const [chosenConnection, setChosenConnection] = useState(null);
    const [connectionsData, setConnectionsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    /**
     * Get the page setup information on initial load
     */
    React.useEffect(() => {
        setLocation(window.location.pathname);

        //if (userDetail.organisationRole !== "Admin") {
        //    setSettings({ organisationRole: "User" });
        //} else
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

                        setSettings(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }
    }, [execute, settings, setLocation, userDetail]);

    React.useEffect(() => {
        setLocation(window.location.pathname);

        //if (userDetail.organisationRole !== "Admin") {
        //    setSettings({ organisationRole: "User" });
        //} else
        if (!settings || settings.loading) {
            execute("GET", "/api/connections/settings")
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

                        const data = JSON.parse(response.data) ?? [];

                        setConnectionsData(data);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }
    }, [execute, userDetail]);

    React.useEffect(() => {
        if (!userDetail || userDetail.notLoaded === true) return;

        if (refOrganisation.current !== userDetail?.organisation?.id) {
            refOrganisation.current = userDetail?.organisation?.id;
            setSettings({ loading: true });
        }

        setPermissions({
            viewSettings: hasPermission(userDetail, "viewsettings"),
            schoolsMaintenance: hasPermission(userDetail, "changeurns"),
            editconnections: hasPermission(userDetail, "editconnections"),
            globalAdmin: userDetail.isAdmin === true,
        });
    }, [userDetail, setPermissions]);

    if (!settings || settings.loading) return <LoadingSpinner />;

    if (!settings || settings.error)
        return (
            <PageError
                area={"connections settings"}
                error={settings.error || ""}
            />
        );

    const filteredConnections = connectionsData.filter((conn) => {
        const query = searchQuery?.toLowerCase();
        return (
            conn?.connectionName?.toLowerCase().includes(query) ||
            (conn?.description &&
                conn?.description?.toLowerCase().includes(query))
        );
    });

    if (
        !hasPermission(userDetail, "viewsettings") ||
        !hasPermission(userDetail, "editconnections")
    ) {
        return <NoPermission area={"the connections settings"} />;
    }

    const modalOpenClick = (conn) => {
        setChosenConnection(conn);
        setModalOpen(true);
    };

    return (
        <>
            <div className="w-full bg-white border border-slate-200 rounded-lg mt-3 p-4">
                <div className="flex justify-between items-center pb-4">
                    <h1 className="font-bold text-xl">Connections</h1>
                    <SearchInput
                        searchTerm={searchQuery}
                        setSearch={setSearchQuery}
                        name="searchConnections"
                    />
                </div>

                {filteredConnections.map((conn) => (
                    <div key={uniqueId(conn.id)} className="mb-2">
                        <div className=" mx-auto p-3 rounded-lg border border-slate-200">
                            <div className="flex items-start">
                                {/* Image Section */}
                                {conn.imageBase64 && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={conn?.imageBase64}
                                            alt={`${conn?.connectionName} Logo`}
                                            className="w-20 h-20 rounded-lg object-contain"
                                        />
                                    </div>
                                )}
                                {/* Text Section */}
                                <div className="flex-grow px-4">
                                    <p className="font-bold capitalize">
                                        {conn?.displayName}
                                    </p>
                                    <p className="mt-2">{conn?.description}</p>
                                </div>

                                {/* Icon Section */}
                                <div className="flex-shrink-0 flex items-start ml-4">
                                    {/* <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        onClick={() => editClick(conn)}
                                        className="text-slate-600 hover:cursor-pointer p-2 w-4 h-4 rounded-lg hover:bg-slate-50"
                                    /> */}
                                    <FontAwesomeIcon
                                        icon={faCog}
                                        onClick={() => modalOpenClick(conn)}
                                        className="text-slate-600 hover:cursor-pointer p-2 w-4 h-4 rounded-lg hover:bg-slate-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <DialogOverlay
                    key={_.uniqueId("Edit modal")}
                    open={modalOpen}
                    setOpen={setModalOpen}
                    title={chosenConnection?.displayName ?? ""}
                    fullScreenWidth={true}
                >
                    <ModalConnection connection={chosenConnection} />
                </DialogOverlay>
            </div>
        </>
    );
};

export default ConnectionsSettings;
