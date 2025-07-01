import React, { useState } from "react";
import _, { uniqueId } from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDownWideShort,
    faArrowUpWideShort,
} from "@fortawesome/pro-solid-svg-icons";
import SearchInput from "../../../forms/SearchInput";
import Pagination from "../../../forms/Pagination";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const PupilSummaryStaticTable = ({
    tableData,
    singlePupil,
    setFilters,
    setIsCustomDashboard,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState({
        name: "",
        ascending: false,
    });
    const [perPage, setPerPage] = useState(25);

    if (!tableData) return;

    const newPupils =
        structuredClone(tableData?.data ? tableData?.data : []) ?? [];

    if (!newPupils) return;

    const nameSearchedPupils = newPupils?.filter((p) => {
        return p?.name
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const urnSearchedPupils = newPupils?.filter((p) => {
        return p?.upn
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const NCYSearchedPupils = newPupils?.filter((p) => {
        return p?.inYear
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const classSearchedPupils = newPupils?.filter((p) => {
        return p?.class
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const ethnicitySearchedPupils = newPupils?.filter((p) => {
        return p?.ethnicity
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const searchedPupils = new Set([
        ...nameSearchedPupils,
        ...urnSearchedPupils,
        ...NCYSearchedPupils,
        ...classSearchedPupils,
        ...ethnicitySearchedPupils,
    ]);
    const searchedPupilsArray = [...searchedPupils];

    const searchedAndFilteredPupils = () => {
        if (!currentFilter?.name) return searchedPupilsArray;

        const newSearchedPupils = structuredClone(searchedPupilsArray);

        if (currentFilter?.name === "Pupil name") {
            let nameFiltered;
            if (currentFilter?.ascending) {
                nameFiltered = newSearchedPupils?.sort((a, b) =>
                    a.name?.toLowerCase() > b.name?.toLowerCase()
                        ? 1
                        : b.name?.toLowerCase() > a.name?.toLowerCase()
                        ? -1
                        : 0
                );
            } else {
                nameFiltered = newSearchedPupils?.sort((a, b) =>
                    b.name?.toLowerCase() > a.name?.toLowerCase()
                        ? 1
                        : a.name?.toLowerCase() > b.name?.toLowerCase()
                        ? -1
                        : 0
                );
            }

            return nameFiltered;
        }
        if (currentFilter?.name === "NCY") {
            let ncyFiltered;
            if (currentFilter?.ascending) {
                ncyFiltered = newSearchedPupils?.sort(
                    (a, b) => a?.inYear - b?.inYear
                );
            } else {
                ncyFiltered = newSearchedPupils?.sort(
                    (a, b) => b?.inYear - a?.inYear
                );
            }

            return ncyFiltered;
        }
        if (currentFilter?.name === "Form/Class") {
            let classFiltered;
            if (currentFilter?.ascending) {
                classFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.class?.toLowerCase() > b?.class?.toLowerCase()
                        ? 1
                        : b?.class?.toLowerCase() > a?.class?.toLowerCase()
                        ? -1
                        : 0
                );
            } else {
                classFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.class?.toLowerCase() > a?.class?.toLowerCase()
                        ? 1
                        : a?.class?.toLowerCase() > b?.class?.toLowerCase()
                        ? -1
                        : 0
                );
            }

            return classFiltered;
        }
        if (currentFilter?.name === "Attendance") {
            let attendanceFiltered;

            if (currentFilter?.ascending) {
                attendanceFiltered = newSearchedPupils.sort((a, b) => {
                    if (
                        a.attendance !== undefined &&
                        b.attendance !== undefined
                    ) {
                        return a.attendance > b.attendance ? -1 : 1;
                    } else {
                        return b.attendance !== undefined ? 1 : -1;
                    }
                });
            } else {
                attendanceFiltered = newSearchedPupils.sort((a, b) => {
                    if (
                        a.attendance !== undefined &&
                        b.attendance !== undefined
                    ) {
                        return b.attendance > a.attendance ? -1 : 1;
                    } else {
                        return a.attendance !== undefined ? -1 : 1;
                    }
                });
            }

            return attendanceFiltered;
        }
        if (currentFilter?.name === "Susp.") {
            let suspFiltered;
            if (currentFilter?.ascending) {
                suspFiltered = newSearchedPupils?.sort(
                    (a, b) => a?.suspensions - b?.suspensions
                );
            } else {
                suspFiltered = newSearchedPupils?.sort(
                    (a, b) => b?.suspensions - a?.suspensions
                );
            }

            return suspFiltered;
        }
        if (currentFilter?.name === "Exc.") {
            let excFiltered;
            if (currentFilter?.ascending) {
                excFiltered = newSearchedPupils?.sort(
                    (a, b) => a?.internalExclusions - b?.internalExclusions
                );
            } else {
                excFiltered = newSearchedPupils?.sort(
                    (a, b) => b?.internalExclusions - a?.internalExclusions
                );
            }

            return excFiltered;
        }
        if (currentFilter?.name === "Gender") {
            let genderFiltered;
            if (currentFilter?.ascending) {
                genderFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.gender?.toLowerCase() > b?.gender?.toLowerCase()
                        ? 1
                        : b?.gender?.toLowerCase() > a?.gender?.toLowerCase()
                        ? -1
                        : 0
                );
            } else {
                genderFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.gender?.toLowerCase() > a?.gender?.toLowerCase()
                        ? 1
                        : a?.gender?.toLowerCase() > b?.gender?.toLowerCase()
                        ? -1
                        : 0
                );
            }

            return genderFiltered;
        }
        if (currentFilter?.name === "SEN") {
            let senFiltered;
            if (currentFilter?.ascending) {
                senFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.sen?.toLowerCase() > b?.sen?.toLowerCase()
                        ? 1
                        : b?.sen?.toLowerCase() > a?.sen?.toLowerCase()
                        ? -1
                        : 0
                );
            } else {
                senFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.sen?.toLowerCase() > a?.sen?.toLowerCase()
                        ? 1
                        : a?.sen?.toLowerCase() > b?.sen?.toLowerCase()
                        ? -1
                        : 0
                );
            }

            return senFiltered;
        }
        if (currentFilter?.name === "Primary need") {
            let senFiltered;
            if (currentFilter?.ascending) {
                senFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.senNeeds?.toLowerCase() > b?.senNeeds?.toLowerCase()
                        ? 1
                        : b?.senNeeds?.toLowerCase() >
                          a?.senNeeds?.toLowerCase()
                        ? -1
                        : 0
                );
            } else {
                senFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.senNeeds?.toLowerCase() > a?.senNeeds?.toLowerCase()
                        ? 1
                        : a?.senNeeds?.toLowerCase() >
                          b?.senNeeds?.toLowerCase()
                        ? -1
                        : 0
                );
            }

            return senFiltered;
        }
        if (currentFilter?.name === "FSM") {
            let FSMFiltered;
            if (currentFilter?.ascending) {
                FSMFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.fsm > a?.fsm ? 1 : a?.fsm > b?.fsm ? -1 : 0
                );
            } else {
                FSMFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.fsm > b?.fsm ? 1 : b?.fsm > a?.fsm ? -1 : 0
                );
            }

            return FSMFiltered;
        }
        if (currentFilter?.name === "FSM6") {
            let FSM6Filtered;
            if (currentFilter?.ascending) {
                FSM6Filtered = newSearchedPupils?.sort((a, b) =>
                    b?.fsm6 > a?.fsm6 ? 1 : a?.fsm6 > b?.fsm6 ? -1 : 0
                );
            } else {
                FSM6Filtered = newSearchedPupils?.sort((a, b) =>
                    a?.fsm6 > b?.fsm6 ? 1 : b?.fsm6 > a?.fsm6 ? -1 : 0
                );
            }

            return FSM6Filtered;
        }
        if (currentFilter?.name === "EAL") {
            let ealFiltered;
            if (currentFilter?.ascending) {
                ealFiltered = newSearchedPupils?.sort((a, b) =>
                    b?.eal > a?.eal ? 1 : a?.eal > b?.eal ? -1 : 0
                );
            } else {
                ealFiltered = newSearchedPupils?.sort((a, b) =>
                    a?.eal > b?.eal ? 1 : b?.eal > a?.eal ? -1 : 0
                );
            }

            return ealFiltered;
        } else {
            return searchedPupilsArray;
        }
    };

    const pageOptions = [
        {
            name: "25",
            value: 25,
            start: true,
        },
        {
            name: "50",
            value: 50,
        },
        {
            name: "100",
            value: 100,
        },
        {
            name: "500",
            value: 500,
        },
    ];

    const maxPages = Math.ceil(searchedAndFilteredPupils()?.length / perPage);
    let startPoint = 0;
    let endPoint = 0;

    if (currentPage !== maxPages) {
        startPoint = currentPage * perPage - perPage;
        endPoint = currentPage * perPage;
    } else {
        startPoint = currentPage * perPage - perPage;
        endPoint = searchedAndFilteredPupils()?.length;
    }

    const filteredPupils = searchedAndFilteredPupils()?.slice(
        startPoint,
        endPoint
    );

    if (!tableData || tableData.loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const searchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filterChange = (event) => {
        setPerPage(event);
        setCurrentPage(1);
    };

    const getGender = (p) => {
        if (p === "M") {
            return "Male";
        }
        if (p === "F") {
            return "Female";
        } else return "";
    };

    const setFilter = (name) => {
        if (name === currentFilter.name) {
            setCurrentFilter({
                name: name,
                ascending: !currentFilter.ascending,
            });
            return;
        } else {
            setCurrentFilter({
                name: name,
                ascending: true,
            });
        }
    };

    const rowClick = (e) => {
        setIsCustomDashboard("Pupil View Dashboard");
        setFilters([
            {
                name: "pupil",
                value: e?.pk,
            },
        ]);
    };

    return (
        <div className="bg-white flex flex-col h-full rounded-l">
            {!singlePupil && (
                <div className="p-2 flex flex-col gap-2">
                    <SearchInput
                        setSearch={searchChange}
                        searchTerm={searchTerm}
                        name="searchPupils"
                    />
                </div>
            )}
            <div className="flex max-h-[500px] overflow-auto m-2">
                <table className="w-full relative whitespace-nowrap text-left text-sm leading-6 overscroll-y-auto mb-4">
                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead className="border-none sticky top-0">
                        <tr key="head" className="gap-x-2 px-2">
                            <th
                                className="rounded-l-[3px] sticky items-center left-0 bg-dashItem-100 text-white h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Pupil name")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Pupil name
                                    </div>
                                    {currentFilter?.name === "Pupil name" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-dashItem-100 text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    UPN
                                </div>
                            </th>
                            <th
                                className="bg-dashItem-100 text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("NCY")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        NCY
                                    </div>
                                    {currentFilter?.name === "NCY" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-dashItem-100 text-white p-1 h-20 lg:h-12 "
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Form/Class")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Form/Class
                                    </div>
                                    {currentFilter?.name === "Form/Class" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#64a0f5] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Attendance")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Attendance YTD
                                    </div>
                                    {currentFilter?.name === "Attendance" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#7958c2] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Susp.")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Susp. YTD
                                    </div>
                                    {currentFilter?.name === "Susp." &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#7958c2] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Exc.")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Internal exc. YTD
                                    </div>
                                    {currentFilter?.name === "Exc." &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-dashItem-100 text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("Gender")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        Gender
                                    </div>
                                    {currentFilter?.name === "Gender" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#f89a00] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    SEN status
                                </div>
                                {currentFilter?.name === "SEN" &&
                                    (currentFilter?.ascending ? (
                                        <FontAwesomeIcon
                                            icon={faArrowDownWideShort}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faArrowUpWideShort}
                                        />
                                    ))}
                            </th>
                            <th
                                className="bg-[#f89a00] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <div className="p-1 w-full border-none flex items-center">
                                    <div className="w-full h-full flex items-center justify-center">
                                        Primary need
                                    </div>
                                    {/* {currentFilter?.name === "Primary need" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))} */}
                                </div>
                            </th>
                            <th
                                className="bg-[#b7008f] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("FSM")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        FSM
                                    </div>
                                    {currentFilter?.name === "FSM" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#b7008f] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("FSM6")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        FSM6
                                    </div>
                                    {currentFilter?.name === "FSM6" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="bg-[#65e086] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <button
                                    onClick={() => setFilter("EAL")}
                                    className="p-1 w-full border-none flex items-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        EAL
                                    </div>
                                    {currentFilter?.name === "EAL" &&
                                        (currentFilter?.ascending ? (
                                            <FontAwesomeIcon
                                                icon={faArrowDownWideShort}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faArrowUpWideShort}
                                            />
                                        ))}
                                </button>
                            </th>
                            <th
                                className="rounded-r-[3px] bg-[#65e086] text-white p-1 h-20 lg:h-12"
                                scope="col"
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    Ethnicity
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredPupils ?? []).map((p) => (
                            <tr
                                // onClick={() => rowClick(p)}
                                key={uniqueId(p?.upn)}
                                className={classNames(
                                    "max-h-6 hover:bg-gray-200 group"
                                )}
                            >
                                <td className="sticky top-20 lg:top-12 left-0 bg-[#ffffff] group-hover:bg-gray-200">
                                    <div className="text-ellipsis pl-2 line-clamp-1 text-nowrap">
                                        {p?.name ? p?.name : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.upn ? p?.upn : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.inYear ? p?.inYear : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.class ? p?.class : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.attendance
                                            ? `${p?.attendance?.toFixed(2)}%`
                                            : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.suspensions.toString()
                                            ? p?.suspensions.toString()
                                            : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.internalExclusions.toString()
                                            ? p?.internalExclusions.toString()
                                            : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {getGender(p?.gender)}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.sen ? p?.sen : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.senNeeds?.length > 0
                                            ? p.senNeeds
                                                  .map((v) => v.code)
                                                  .join("; ")
                                            : ""}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.fsm ? "Yes" : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.fsm6 ? "Yes" : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.eal ? "Yes" : " "}
                                    </div>
                                </td>
                                <td className="pl-2">
                                    <div className="text-ellipsis line-clamp-1 text-nowrap flex items-center justify-center">
                                        {p?.ethnicity?.toString()
                                            ? p?.ethnicity?.toString()
                                            : " "}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!singlePupil && (
                <Pagination
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    maxPages={maxPages}
                    pageOptions={pageOptions}
                    filterChange={filterChange}
                />
            )}
        </div>
    );
};

export default PupilSummaryStaticTable;
