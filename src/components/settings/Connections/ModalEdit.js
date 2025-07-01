import React, { useEffect, useState } from "react";
import ModalEditRow from "./ModalEditRow";
import { showAlert } from "../../controls/Alert";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import SearchInput from "../../forms/SearchInput";
import CustomPagination from "../../forms/CustomPagination";

function ModalEdit({ currentConnectionRow }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [dataSets, setDataSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [reloadDatasets, setReloadDatasets] = useState(false);
    const { execute } = useFetchWithMsal();

    useEffect(() => {
        execute("GET", `/api/sisra/datasets/${currentConnectionRow.urn}`)
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
                    }

                    const data = JSON.parse(response.data) ?? [];
                    setDataSets(data);
                }
            })
            .catch((err) => {
                showAlert({ body: <p>Unable to load settings</p> });
            });
        setReloadDatasets(false);
    }, [execute, reloadDatasets === true]);

    useEffect(() => {
        if (!dataSets) return;

        const academicYears = dataSets?.map(({ cohortName }) => {
            return { name: cohortName };
        });

        const uniqueTaxYears = academicYears.filter((value, index, self) => {
            return index === self.findIndex((a) => a.name === value.name);
        });

        setPages(uniqueTaxYears);
    }, [dataSets]);

    return (
        <div className="flex h-[650px] flex-col gap-2 w-full">
            <div className="flex h-full flex-col w-full">
                <div className="h-1/6 flex gap-4">
                    <SearchInput
                        searchTerm={searchTerm}
                        setSearch={setSearchTerm}
                        name="searchConnections"
                    />
                </div>
                <div className=" flex h-4/6 w-full justify-center overflow-auto">
                    <table className="border w-full h-max border-slate-200 rounded-lg">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        {/* Header Row */}
                        <thead className="border-b border-slate-200 bg-slate-50 rounded-t-lg">
                            <tr className="h-9">
                                <th className="p-2 border-r border-slate-200 font-bold">
                                    Academic Year
                                </th>
                                <th className="p-2 border-r w-60 border-slate-200 font-bold">
                                    Dataset Name
                                </th>
                                <th className="p-2 border-r w-60 border-slate-200 font-bold">
                                    School Name
                                </th>
                                <th className="border-r p-2 font-bold">
                                    Get Datasets
                                </th>
                                <th className="p-2 font-bold">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSets?.map((data, index) => {
                                if (
                                    !pages ||
                                    pages.length < 0 ||
                                    data?.cohortName !==
                                        pages[currentPage - 1]?.name
                                ) {
                                    return;
                                }

                                return (
                                    <ModalEditRow
                                        setReloadDatasets={setReloadDatasets}
                                        data={data}
                                        searchTerm={searchTerm}
                                        index={index}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="h-1/6 flex gap-4">
                    <CustomPagination
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        pages={pages}
                    />
                </div>
            </div>
        </div>
    );
}

export default ModalEdit;
