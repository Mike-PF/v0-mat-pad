import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort, faArrowUpWideShort, faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import _, { uniqueId } from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import SearchInput from "../../../forms/SearchInput";
import Pagination from "../../../forms/Pagination";
import { DropDownSelect } from "../../../controls/DropDownSelect";
import Button from "../../../controls/Button";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const PupilFilter = ({
	pupils,
	setCustomDashFilters,
	customDashFilters,
	setPupilFilterOpen,
	schoolsFilter,
	multiSelect = true,
	filterOptions = {},
	filterID = "",
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [currentFilter, setCurrentFilter] = useState({
		name: "",
		ascending: false,
	});
	const [perPage, setPerPage] = useState(25);
	const [schoolFilter, setSchoolFilter] = useState();
	const schoolsToShow = useMemo(() => {
		const list = [];
		_.forEach(schoolsFilter.values, (val, idx) => {
			let value, items;
			if (_.isArray(val.value)) {
				items = [];
				_.forEach(val.value, (innerVal, innerIdx) => {
					items.push({
						sequence: innerIdx,
						text: innerVal.text,
						urn: innerVal?.value?.urn || null,
						phase: innerVal?.value?.phase || null,
					});
				});

				list.push({
					sequence: idx + 1,
					text: val.text,
					value: value || null,
					items: items || null,
				});
			} else {
				list.push(val);
			}
		});
		return list;
	}, [schoolsFilter]);
	const [pupilsToShow, setPupilsToShow] = useState([]);
	const [pupilsSelected, setPupilsSelected] = useState([]);

	useEffect(() => {
		const newPupils = structuredClone(pupils ? pupils : []) ?? [];
		const filteredPupils = [];
		const phase = (schoolFilter?.value?.phase?.substring(0, 1) || "").toLowerCase();
		const urn = schoolFilter?.value?.urn || -1;

		newPupils.forEach((p) => {
			if (
				!schoolFilter ||
				!schoolFilter?.value ||
				schoolFilter === "***Refresh***" ||
				schoolFilter?.value?.text?.toLowerCase() === "whole mat"
			) {
				filteredPupils.push(p);
				return;
			}

			if (phase.length === 0 && urn > 0) {
				if (p?.urn === schoolFilter?.value.urn) {
					filteredPupils.push(p);
					return;
				}
			}
			if (phase.length > 0 && urn < 1) {
				let phase = (schoolFilter?.value?.phase?.substring(0, 1) || "").toLowerCase();
				switch (phase) {
					case "p":
						if (p.inYear < 7) filteredPupils.push(p);
						break;
					case "s":
						if (p.inYear > 6) filteredPupils.push(p);
						break;
					default:
						filteredPupils.push(p);
				}
				return;
			}
			if (phase.length > 0 && urn > 0 && p?.urn === urn) {
				switch (phase) {
					case "p":
						if (p.inYear < 7) filteredPupils.push(p);
						break;
					case "s":
						if (p.inYear > 6) filteredPupils.push(p);
						break;
					default:
						filteredPupils.push(p);
				}
			}
		});

		setPupilsToShow(filteredPupils);
	}, [pupils, schoolFilter]);

	if (!pupilsToShow) return;

	const nameSearchedPupils = pupilsToShow?.filter((p) => {
		return p?.name?.toString().toLowerCase().includes(searchTerm.toLowerCase());
	});

	const urnSearchedPupils = pupilsToShow?.filter((p) => {
		return p?.upn?.toString().toLowerCase().includes(searchTerm.toLowerCase());
	});

	const NCYSearchedPupils = pupilsToShow?.filter((p) => {
		return p?.inYear?.toString().toLowerCase().includes(searchTerm.toLowerCase());
	});

	const classSearchedPupils = pupilsToShow?.filter((p) => {
		return p?.class?.toString().toLowerCase().includes(searchTerm.toLowerCase());
	});

	const searchedPupils = new Set([...nameSearchedPupils, ...urnSearchedPupils, ...NCYSearchedPupils, ...classSearchedPupils]);
	const searchedPupilsArray = [...searchedPupils];

	const searchedAndFilteredPupils = () => {
		if (!currentFilter?.name) return searchedPupilsArray;

		const newSearchedPupils = structuredClone(searchedPupilsArray);

		if (currentFilter?.name === "Pupil name") {
			let nameFiltered;
			if (currentFilter?.ascending) {
				nameFiltered = newSearchedPupils?.sort((a, b) =>
					a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : b.name?.toLowerCase() > a.name?.toLowerCase() ? -1 : 0,
				);
			} else {
				nameFiltered = newSearchedPupils?.sort((a, b) =>
					b.name?.toLowerCase() > a.name?.toLowerCase() ? 1 : a.name?.toLowerCase() > b.name?.toLowerCase() ? -1 : 0,
				);
			}

			return nameFiltered;
		}
		if (currentFilter?.name === "NCY") {
			let ncyFiltered;
			if (currentFilter?.ascending) {
				ncyFiltered = newSearchedPupils?.sort((a, b) => a?.inYear - b?.inYear);
			} else {
				ncyFiltered = newSearchedPupils?.sort((a, b) => b?.inYear - a?.inYear);
			}

			return ncyFiltered;
		}
		if (currentFilter?.name === "Form/Class") {
			let classFiltered;
			if (currentFilter?.ascending) {
				classFiltered = newSearchedPupils?.sort((a, b) =>
					a?.class?.toLowerCase() > b?.class?.toLowerCase() ? 1 : b?.class?.toLowerCase() > a?.class?.toLowerCase() ? -1 : 0,
				);
			} else {
				classFiltered = newSearchedPupils?.sort((a, b) =>
					b?.class?.toLowerCase() > a?.class?.toLowerCase() ? 1 : a?.class?.toLowerCase() > b?.class?.toLowerCase() ? -1 : 0,
				);
			}

			return classFiltered;
		}
		if (currentFilter?.name === "Attendance") {
			let attendanceFiltered;

			if (currentFilter?.ascending) {
				attendanceFiltered = newSearchedPupils.sort((a, b) => {
					if (a.attendance !== undefined && b.attendance !== undefined) {
						return a.attendance > b.attendance ? -1 : 1;
					} else {
						return b.attendance !== undefined ? 1 : -1;
					}
				});
			} else {
				attendanceFiltered = newSearchedPupils.sort((a, b) => {
					if (a.attendance !== undefined && b.attendance !== undefined) {
						return b.attendance > a.attendance ? -1 : 1;
					} else {
						return a.attendance !== undefined ? -1 : 1;
					}
				});
			}

			return attendanceFiltered;
		} else {
			return searchedPupilsArray;
		}
	};

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

	const filteredPupils = searchedAndFilteredPupils()?.slice(startPoint, endPoint);

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

	const searchChange = (event) => {
		setSearchTerm(event?.target?.value ?? event);
		setCurrentPage(1);
	};

	const rowClick = (e) => {
		if (multiSelect) {
			if (pupilsSelected?.includes(e?.pk)) {
				const pupilsClone = [...pupilsSelected];

				const filteredClone = pupilsClone?.filter((pc) => {
					return pc !== e?.pk;
				});

				setPupilsSelected(filteredClone);
			} else {
				const pupilsClone = [...pupilsSelected];

				pupilsClone.push(e?.pk);
				setPupilsSelected(pupilsClone);
			}
		} else {
			const previousFilters = customDashFilters ?? [];
			const filteredPreviousFilters = previousFilters?.filter((f) => {
				return f?.name !== "pupil";
			});

			setCustomDashFilters([
				...filteredPreviousFilters,
				{
					name: "pupil",
					value: e?.pk,
				},
			]);
			setPupilFilterOpen(false);
		}
	};

	const saveClick = () => {
		const previousFilters = customDashFilters ?? [];
		const filteredPreviousFilters = previousFilters?.filter((f) => {
			return f?.name !== "pupil";
		});
		const mappedPupils = pupilsSelected?.map((p) => {
			return {
				value: {
					pk: p,
				},
			};
		});
		setCustomDashFilters([
			...filteredPreviousFilters,
			{
				name: "pupil",
				filterID: filterID,
				value: mappedPupils,
			},
		]);
		setPupilFilterOpen(false);
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

	const filterChange = (event) => {
		setPerPage(event);
		setCurrentPage(1);
	};

	const clearSelection = () => {
		setSchoolFilter("***Refresh***");
	};

	if (!pupils) {
		return (
			<div className="w-[900px] h-[720px] flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="w-full flex-grow flex items-center justify-center">
			<div className="h-[720px] w-full flex flex-col ">
				<div className="py-2 flex flex-col gap-2">
					<div className="flex justify-between">
						<div className="flex gap-2">
							<div className="mw300 flex gap-2">
								<DropDownSelect
									onChange={setSchoolFilter}
									value={schoolFilter}
									items={schoolsToShow}
									textField={"text"}
									valueField={"text"}
									placeholder={"Select school..."}
								/>
								{schoolFilter && schoolFilter !== "***Refresh***" && (
									<button
										className="border-none h-10 underline text-primary-500"
										type="button"
										onClick={clearSelection}>
										Clear Selection
									</button>
								)}
							</div>
							{schoolFilter && schoolFilter !== "***Refresh***" && (
								<SearchInput
									setSearch={searchChange}
									searchTerm={searchTerm}
									name="searchPupilFilter"
								/>
							)}
						</div>
						{multiSelect && (
							<Button
								disabled={pupilsSelected?.length < 1}
								onClick={saveClick}
								key={"save-filter"}>
								{`Select ${pupilsSelected?.length > 1 ? `pupils` : `pupil`}`}
							</Button>
						)}
					</div>
				</div>
				{(schoolsFilter && !schoolFilter) || schoolFilter === "***Refresh***" || filteredPupils?.length < 1 ? (
					<div className="flex w-[900px] h-full overflow-auto">
						<div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
							<div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
								<div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
									<FontAwesomeIcon
										icon={faClipboardList}
										className="w-8 h-8 text-slate-600"
									/>
								</div>
								<div className="text-slate-600 font-medium text-sm">No data to show</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex w-[900px] overflow-auto">
						<table className="w-full relative whitespace-nowrap text-left text-sm leading-6 overscroll-y-auto mb-4">
							<colgroup>
								{multiSelect && <col />}
								<col />
								<col />
								<col />
								<col />
								<col />
							</colgroup>
							<thead className="border-none sticky top-0">
								<tr
									key="head"
									className="gap-x-2 px-2">
									{multiSelect && (
										<th className="rounded-l-[3px] sticky items-center left-0 bg-dashItem-100 text-white h-20 lg:h-12">
											<div className="w-full flex items-center justify-center">{filterOptions?.checkTitle ?? "Check"}</div>
										</th>
									)}
									<th
										className={classNames(
											multiSelect ? "" : "rounded-l-[3px]",
											"sticky items-center left-0 bg-dashItem-100 text-white h-20 lg:h-12",
										)}
										scope="col">
										<button
											onClick={() => setFilter("Pupil name")}
											className="p-1 w-full border-none flex items-center">
											<div className="w-full h-full flex items-center justify-center">Pupil name</div>
											{currentFilter?.name === "Pupil name" &&
												(currentFilter?.ascending ? (
													<FontAwesomeIcon icon={faArrowDownWideShort} />
												) : (
													<FontAwesomeIcon icon={faArrowUpWideShort} />
												))}
										</button>
									</th>
									<th
										className="bg-dashItem-100 text-white p-1 h-20 lg:h-12"
										scope="col">
										<div className="w-full h-full flex items-center justify-center">UPN</div>
									</th>
									<th
										className="bg-dashItem-100 text-white p-1 h-20 lg:h-12"
										scope="col">
										<button
											onClick={() => setFilter("NCY")}
											className="p-1 w-full border-none flex items-center">
											<div className="w-full h-full flex items-center justify-center">NCY</div>
											{currentFilter?.name === "NCY" &&
												(currentFilter?.ascending ? (
													<FontAwesomeIcon icon={faArrowDownWideShort} />
												) : (
													<FontAwesomeIcon icon={faArrowUpWideShort} />
												))}
										</button>
									</th>
									<th
										className="bg-dashItem-100 text-white p-1 h-20 lg:h-12 "
										scope="col">
										<button
											onClick={() => setFilter("Form/Class")}
											className="p-1 w-full border-none flex items-center">
											<div className="w-full h-full flex items-center justify-center">Form/Class</div>
											{currentFilter?.name === "Form/Class" &&
												(currentFilter?.ascending ? (
													<FontAwesomeIcon icon={faArrowDownWideShort} />
												) : (
													<FontAwesomeIcon icon={faArrowUpWideShort} />
												))}
										</button>
									</th>
									<th
										className="bg-[#64a0f5] rounded-r-[3px] text-white p-1 h-20 lg:h-12"
										scope="col">
										<button
											onClick={() => setFilter("Attendance")}
											className="p-1 w-full border-none flex items-center">
											<div className="w-full h-full flex items-center justify-center">Attendance YTD</div>
											{currentFilter?.name === "Attendance" &&
												(currentFilter?.ascending ? (
													<FontAwesomeIcon icon={faArrowDownWideShort} />
												) : (
													<FontAwesomeIcon icon={faArrowUpWideShort} />
												))}
										</button>
									</th>
								</tr>
							</thead>
							<tbody>
								{(filteredPupils ?? []).map((p) => {
									const isChecked = pupilsSelected?.includes(p?.pk);

									return (
										<tr
											onClick={() => rowClick(p)}
											key={uniqueId(p?.upn)}
											className={classNames("max-h-6 hover:bg-gray-200 group hover:cursor-pointer")}>
											{multiSelect && (
												<td className="sticky top-20 lg:top-12 left-0 bg-[#ffffff] group-hover:bg-gray-200">
													<div className="flex items-center justify-center">
														<input
															type="checkbox"
															key={uniqueId(p?.upn) + "check"}
															checked={isChecked}
															readOnly
														/>
													</div>
												</td>
											)}
											<td className="sticky top-20 lg:top-12 left-0 bg-[#ffffff] group-hover:bg-gray-200">
												<div className="text-ellipsis pl-2 line-clamp-1 text-nowrap">{p?.name ? p?.name : " "}</div>
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
													{p?.attendance ? `${p?.attendance?.toFixed(2)}%` : " "}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
				{(!schoolsFilter || schoolFilter) && schoolFilter !== "***Refresh***" && filteredPupils?.length >= 1 && (
					<div className="flex items-center justify-center w-full gap-2 mt-3">
						<Pagination
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
							maxPages={maxPages}
							pageOptions={pageOptions}
							filterChange={filterChange}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default PupilFilter;
