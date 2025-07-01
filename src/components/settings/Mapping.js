import React, { Fragment, useEffect, useRef, useState } from "react";
import _, { uniqueId } from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { showAlert } from "../controls/Alert";
import { hasPermission } from "../../site";
import { NoPermission } from "../controls/NoPermission";
import MappingPrimaryRow from "./Mapping/MappingPrimaryRow";
import MappingSecondaryRow from "./Mapping/MappingSecondaryRow";
import { DropDownSelect } from "../controls/DropDownSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import Button from "../controls/Button";
import SearchInput from "../forms/SearchInput";

const MappingSettings = (props) => {
    const { execute } = useFetchWithMsal();
    const [settings, setSettings] = useState({ loading: true });
    const { setLocation, userDetail } = useMatpadContext();
    const [permissions, setPermissions] = useState({
        viewSettings: false,
        schoolsMaintenance: false,
    });
    const refOrganisation = useRef(userDetail?.organisation?.id || null);
    const [primarySearch, setPrimarySearch] = useState("");
    const [secondarySearch, setSecondarySearch] = useState("");
    const [selectedOrganisation, setSelectedOrganisation] =
        React.useState(null);
    const [selectedDataMapId, setSelectedDataMapId] = useState(null);
    const [dataMaps, setDataMaps] = useState([]);
    const [mapTo, setMapTo] = useState([]);
    const [orgList, setOrgList] = useState([]);
    const [dataSets, setDataSets] = useState([]);
    const selectedDataMap = dataMaps?.find((e) => e?.id === selectedDataMapId);
    const [collapsed, setCollapsed] = useState([]);

    useEffect(() => {
        setLocation(window.location.pathname);

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
                            selected: o.id === selectedOrganisation,
                        };
                    })
            );
        }

        if (!selectedOrganisation && settings?.organisations?.length === 1) {
            setSelectedOrganisation(userDetail.organisation.id);
            return;
        }
    }, [setLocation, userDetail, settings, execute, selectedOrganisation]);

    useEffect(() => {
        if (!userDetail || userDetail.notLoaded === true) return;

        if (refOrganisation.current !== userDetail?.organisation?.id) {
            refOrganisation.current = userDetail?.organisation?.id;
            setSettings({ loading: true });
        }

        setPermissions({
            viewSettings: hasPermission(userDetail, "viewsettings"),
            schoolsMaintenance: hasPermission(userDetail, "changeurns"),
            editMapping: hasPermission(userDetail, "editmapping"),
            globalAdmin: userDetail.isAdmin === true,
        });
    }, [userDetail, setPermissions]);

    useEffect(() => {
        execute("GET", "/api/settings/mapping")
            .then((response) => {
                if (response) {
                    if (response.error) {
                        showAlert({
                            body: (
                                <>
                                    <p>Unable to load mapping</p>
                                    <p>{response.error}</p>
                                </>
                            ),
                        });
                        setSettings({ error: true });
                    }

                    setDataMaps(response);
                }
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to load mapping</p> });
                setSettings({ error: true });
            });
    }, [execute]);

    useEffect(() => {
        if (!selectedDataMapId) return;
        if (!selectedOrganisation) return;
        if (selectedDataMapId === "***Refresh***") return;
        if (selectedOrganisation === "***Refresh***") return;

        execute(
            "GET",
            `/api/settings/${selectedDataMapId}/mapping?organisationId=${selectedOrganisation}`
        )
            .then((response) => {
                if (response) {
                    if (response.error) {
                        showAlert({
                            body: (
                                <>
                                    <p>Unable to load mapping</p>
                                    <p>{response.error}</p>
                                </>
                            ),
                        });
                        setSettings({ error: true });
                    }

                    const mapToWithMapping = [];

                    if (response?.map?.length > 0) {
                        for (let i = 0; i < response?.defaults?.length; i++) {
                            const currentDefault = response?.defaults[i];
                            const mappings = response?.map?.filter(
                                (m) =>
                                    m?.field1 === response?.defaults[i]?.field1
                            );
                            currentDefault.mapping = mappings;
                            mapToWithMapping.push(currentDefault);
                        }
                    }

                    let mappings = [];
                    for (var i = 0; i < mapToWithMapping.length; i++) {
                        if (mapToWithMapping[i]?.mapping) {
                            mappings.push(mapToWithMapping[i]?.mapping);
                        }
                    }
                    const faltMappings = mappings.flat();

                    const values = response?.options.filter((o) => {
                        const foundCategory = faltMappings.find(
                            (m) =>
                                m?.field1?.toLowerCase() ===
                                    o?.field1?.toLowerCase() &&
                                m?.field2?.toLowerCase() ===
                                    o?.field2?.toLowerCase()
                        );
                        const foundCategoryIndex =
                            faltMappings?.indexOf(foundCategory);
                        return foundCategoryIndex < 0;
                    });

                    setMapTo(
                        mapToWithMapping?.length > 0
                            ? mapToWithMapping
                            : response?.defaults
                    );
                    setDataSets(values);
                }
            })
            .catch((err) => {
                setMapTo([]);
                setDataSets([]);
                showAlert({ body: <p>Unable to load mapping</p> });
                setSettings({ error: true });
            });
    }, [selectedDataMapId, selectedOrganisation]);

    const saveClick = () => {
        if (!selectedDataMapId) return;

        execute(
            "POST",
            `/api/settings/${selectedDataMapId}/mapping?organisationId=${selectedOrganisation}`,
            { data: mapTo }
        )
            .then((response) => {
                if (response) {
                    if (response.error) {
                        showAlert({
                            body: (
                                <>
                                    <p>Unable to update mapping</p>
                                    <p>{response.error}</p>
                                </>
                            ),
                        });
                    }
                    showAlert({
                        body: (
                            <>
                                <p>Mapping updated successfully</p>
                            </>
                        ),
                    });
                }
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to update mapping</p> });
            });
    };

    const clearSelection = () => {
        setSelectedOrganisation("***Refresh***");
        setSelectedDataMapId("***Refresh***");
    };

    if (!settings || settings.loading) return <LoadingSpinner />;

    // if (!settings || settings.error)
    //     return (
    //         <PageError area={"mapping settings"} error={settings.error || ""} />
    //     );

    if (
        !hasPermission(userDetail, "viewsettings") ||
        !hasPermission(userDetail, "editmapping")
    ) {
        return <NoPermission area={"the mapping settings"} />;
    }

    return (
        <div className="flex flex-col w-full h-full gap-3">
            <div className="flex gap-3 flex-col">
                <div className="dashboardControls z-40 flex flex-col sticky w-full m-0 max-w-full px-3 h-full">
                    <div className="text-slate-900 text-lg font-semibold flex justify-between">
                        Data Mapping
                    </div>
                    <div className="flex h-full items-center gap-x-2">
                        <div className="w-full items-end flex gap-2">
                            <div className="flex flex-col">
                                <div className="text-slate-900 h-4 mb-2 font-medium text-sm">
                                    Data mapping
                                </div>
                                <div className="max-w-64">
                                    <DropDownSelect
                                        key={"dataMap"}
                                        id={"mapping"}
                                        textField={"name"}
                                        items={dataMaps}
                                        valueField={"id"}
                                        placeholder={"Select Data Set..."}
                                        value={selectedDataMapId}
                                        onChange={(e) => {
                                            setSelectedDataMapId(e.value.id);
                                            setSelectedOrganisation(
                                                "***Refresh***"
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            {selectedDataMapId &&
                                selectedDataMapId !== "***Refresh***" && (
                                    <div className="flex flex-col">
                                        <div className="text-slate-900 h-4 mb-2 font-medium text-sm">
                                            Organisation
                                        </div>
                                        {orgList && orgList.length > 1 ? (
                                            <div className="max-w-64">
                                                <DropDownSelect
                                                    key={uniqueId("sel")}
                                                    id={uniqueId("org")}
                                                    items={orgList}
                                                    textField={"name"}
                                                    valueField={"id"}
                                                    placeholder={"Organisation"}
                                                    value={selectedOrganisation}
                                                    onChange={(e) => {
                                                        setSelectedOrganisation(
                                                            e.value.id
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="font-medium text-2xl mb-3">
                                                {userDetail.organisation.name}
                                            </h3>
                                        )}
                                    </div>
                                )}
                            {selectedOrganisation &&
                                selectedOrganisation !== "***Refresh***" &&
                                selectedDataMapId &&
                                selectedDataMapId !== "***Refresh***" && (
                                    <button
                                        className="border-none h-10 underline text-primary-500"
                                        type="button"
                                        onClick={clearSelection}
                                    >
                                        Clear Selection
                                    </button>
                                )}
                        </div>
                        {selectedOrganisation &&
                            selectedOrganisation !== "***Refresh***" &&
                            selectedDataMapId &&
                            selectedDataMapId !== "***Refresh***" && (
                                <div>
                                    <div className="h-4" />
                                    <Button onClick={saveClick}>Save</Button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div className="w-full h-5/6 flex gap-3">
                {!selectedOrganisation ||
                selectedOrganisation === "***Refresh***" ? (
                    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                            <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                <FontAwesomeIcon
                                    icon={faClipboardList}
                                    className="w-8 h-8 text-slate-600"
                                />
                            </div>
                            <div className="text-slate-600 font-medium text-sm">
                                Please select an organisation
                            </div>
                        </div>
                    </div>
                ) : !selectedDataMapId ||
                  selectedDataMapId === "***Refresh***" ? (
                    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                            <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                <FontAwesomeIcon
                                    icon={faClipboardList}
                                    className="w-8 h-8 text-slate-600"
                                />
                            </div>
                            <div className="text-slate-600 font-medium text-sm">
                                Please select data mapping
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col h-full w-1/2 p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>{selectedDataMap?.name ?? ""}</div>
                                <SearchInput
                                    searchTerm={secondarySearch}
                                    setSearch={setSecondarySearch}
                                    name="searchSecondary"
                                />
                            </div>
                            <div className="flex overflow-auto pt-2 gap-3 flex-col w-full h-full">
                                {dataSets?.length > 0 ? (
                                    <div>
                                        {dataSets?.map((c) => {
                                            if (
                                                !c?.field1
                                                    ?.toLowerCase()
                                                    .includes(
                                                        secondarySearch?.toLowerCase()
                                                    ) &&
                                                !c?.field2
                                                    ?.toLowerCase()
                                                    .includes(
                                                        secondarySearch?.toLowerCase()
                                                    )
                                            ) {
                                                return;
                                            }
                                            return (
                                                <Fragment
                                                    key={uniqueId(c?.field1)}
                                                >
                                                    <MappingSecondaryRow
                                                        mapCategories={mapTo}
                                                        valuesToMap={c ?? []}
                                                        setMapTo={setMapTo}
                                                        setValuesToMap={
                                                            setDataSets
                                                        }
                                                        dataSets={dataSets}
                                                    />
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                                        <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                                            <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                                <FontAwesomeIcon
                                                    icon={faClipboardList}
                                                    className="w-8 h-8 text-slate-600"
                                                />
                                            </div>
                                            <div className="text-slate-600 font-medium text-sm">
                                                Nothing to map
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col h-full w-1/2 p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex w-full items-center gap-2">
                                    Mapped Values
                                </div>
                                <SearchInput
                                    searchTerm={primarySearch}
                                    setSearch={setPrimarySearch}
                                    name="searchPrimary"
                                />
                            </div>
                            <div className="flex overflow-auto pt-2 gap-3 flex-col w-full h-full">
                                {mapTo?.map((c) => {
                                    if (
                                        !c?.field1
                                            ?.toLowerCase()
                                            .includes(
                                                primarySearch?.toLowerCase()
                                            ) &&
                                        !c?.field2
                                            ?.toLowerCase()
                                            .includes(
                                                primarySearch?.toLowerCase()
                                            )
                                    ) {
                                        return;
                                    }

                                    return (
                                        <Fragment key={uniqueId(c?.id)}>
                                            <MappingPrimaryRow
                                                category={c}
                                                dataSets={dataSets}
                                                mapCategories={mapTo}
                                                setCollapsed={setCollapsed}
                                                collapsed={collapsed}
                                                setMapTo={setMapTo}
                                                setValuesToMap={setDataSets}
                                            />
                                        </Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MappingSettings;
