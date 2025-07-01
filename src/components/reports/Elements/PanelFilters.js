import React, { Fragment, useEffect, useState } from "react";
import _ from "lodash";
import SelectFilter from "./SelectFilter";
import { UncontrolledTooltip } from "reactstrap";
import { LoadingSpinner } from "../../controls/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilter, faFilterSlash } from "@fortawesome/pro-light-svg-icons";
import { typeOf } from "mathjs";
import PupilFilter from "../Static Reports/Attendance/PupilFilter";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import DialogOverlay from "../../controls/Dialog";
import { GetDashboardFilterList } from "./Common";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

/**
 * Dashboard panel filter with the elements for the fitlers contained
 * @param {any} param0
 * @returns
 */
const PanelFilter = ({ filterValues, panelToShow, isCustomDashboard, dashboard, filters, setFilters, schools }) => {
	const [filtered, setFiltered] = React.useState(false);
	const pendingFilters = React.useRef([]);
	const applyButtonRef = React.useRef([]);
	const [IdPrefix, setPrefix] = React.useState(_.uniqueId("pf-"));
	const [pupilFilterOpen, setPupilFilterOpen] = useState(false);
	const [pupils, setPupils] = useState([]);
	const { execute } = useFetchWithMsal();

	useEffect(() => {
		setFiltered(false);
	}, [panelToShow, isCustomDashboard]);

	const dashPanelName = typeOf(isCustomDashboard) === "string" && isCustomDashboard !== "***Refresh***" ? isCustomDashboard : panelToShow?.hdr;

	useEffect(() => {
		if (!pendingFilters) return;
		pendingFilters.current = [];
	}, [filters]);

	const pupilFilterValueSelected = (e) => {
		const pupilFilter = e?.find((f) => {
			return f?.name === "pupil";
		});
		const pupilFilterIndex = pendingFilters?.current?.findIndex((f) => {
			return f?.filterID === "pupil";
		});

		if (pupilFilterIndex > 0) {
			pendingFilters.current.splice(pupilFilter);
		} else {
			pendingFilters.current.push(pupilFilter);
		}
	};

	const filterValueSelected = React.useCallback(
		(event) => {
			// filter is clear - remove it from the pending list
			if (!event.value || event.value.length === 0) {
				const removed = _.remove(pendingFilters.current, {
					filterID: event.filter.id,
				});
				if (removed && removed.length > 0) {
					setFiltered(false);
				}
				return;
			}

			const filterSetting = _.find(pendingFilters.current, {
				filterID: event.filter.id,
			});
			if (!filterSetting) {
				pendingFilters.current.push({
					filterID: event.filter.id,
					value: event.value,
				});
				setFiltered(false);
			} else {
				filterSetting.value = event.value;
				setFiltered(false);
			}
		},
		[pendingFilters],
	);

	if (!_.isArray(filters)) return <LoadingSpinner idPrefix={IdPrefix} />;

	const applyFilters = (event) => {
		if (event && event.preventDefault) event.preventDefault();
		setFiltered(true);
		setFilters(pendingFilters.current);
	};

	function clearFilters(event) {
		event.preventDefault();
		pendingFilters.current = [];

		applyFilters(null);
		setFiltered(false);

		setPrefix(_.uniqueId("dds-"));
	}

	const pupilFilterClick = (ID) => {
		setPupils(null);
		setPupilFilterOpen(true);

		execute("POST", "/api/dashboard/PupilDetailConfiguration", {
			 filterID: ID ?? null,
		}).then((response) => {
			if (response) {
				setPupils(response?.data);
			} else {
				setPupils([]);
			}
		});
	};

	const filterPupils = () => {
		const pupilsncyFiltered = pupils?.sort((a, b) => a?.inYear - b?.inYear);

		return pupilsncyFiltered?.sort((a, b) =>
			a?.class?.toLowerCase() > b?.class?.toLowerCase() ? 1 : b?.class?.toLowerCase() > a?.class?.toLowerCase() ? -1 : 0,
		);
	};

	const schoolsFromFilter = filters?.find((f) => f?.param === "schools");

	const pupilFilter = (multiSelect, options, filter) => {
		return (
			<section
				className="panel-filters flex flex-wrap gap-y-2"
				key={IdPrefix + "filter-wrapper"}>
				<div className="max-w-52 mx-1">
					<button
						className={classNames(
							"min-w-32 rounded-m border border-[#ced4da] bg-[#f5f5f5] text-[#36454f] hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed",
						)}
						onClick={() => pupilFilterClick(filter?.id)}>
						Pupil
					</button>
					{pupilFilterOpen && (
						<DialogOverlay
							key={"pupil-filter-dlg"}
							open={true}
							setOpen={setPupilFilterOpen}
							title={"Pupil filter"}
							fullScreenWidth={false}>
							<PupilFilter
								setPupilFilterOpen={setPupilFilterOpen}
								setCustomDashFilters={isCustomDashboard === "Pupil View Dashboard" ? setFilters : pupilFilterValueSelected}
								pupils={filterPupils()}
								schoolsFilter={schoolsFromFilter}
								customDashFilters={pendingFilters?.current}
								multiSelect={multiSelect}
								filterOptions={options}
								filterID={filter?.id}
							/>
						</DialogOverlay>
					)}
				</div>
			</section>
		);
	};

	if (isCustomDashboard === "Pupil View Dashboard") {
		return <div>{pupilFilter(false)}</div>;
	}

	const wrapper = (
		<section
			className="panel-filters flex flex-wrap gap-y-2"
			key={IdPrefix + "filter-wrapper"}>
			{_.sortBy(GetDashboardFilterList(filters, isCustomDashboard, panelToShow?.hdr), ["seq"]).map((filter) => {
				let value = _.find(pendingFilters.current, { filterID: filter.id })?.value || null;

				switch (filter?.type?.toLowerCase()) {
					case "select":
					case "tree-select":
						const filterControl = (
							<SelectFilter
								panelToShow={panelToShow}
								isCustomDashboard={isCustomDashboard}
								tree={filter.type.toLowerCase() === "tree-select"}
								key={IdPrefix + "select-filter-" + filter.name + dashPanelName}
								filter={filter}
								schools={schools}
								onChange={filterValueSelected}
								value={value}
								IdPrefix={IdPrefix}
								dashPanelName={dashPanelName}
							/>
						);

						if (!filterControl) return <></>;

						return filterControl;
					case "pupil":
						const pupilFilterControl = (
							<Fragment key={IdPrefix + "select-filter-" + filter.name + dashPanelName}>
								{pupilFilter(filter?.multi, filter?.options, filter)}
							</Fragment>
						);

						if (!pupilFilterControl) return <></>;

						return pupilFilterControl;

					default:
						return <>Unknown filter type: {filter?.type}</>;
				}
			})}
			<div>
				<>
					<button
						ref={applyButtonRef}
						id={IdPrefix + "clearbutton"}
						onClick={clearFilters}
						className="bg-white border border-slate-300 text-slate-500 w-9 h-9 mx-1">
						<FontAwesomeIcon icon={faFilterSlash} />
					</button>
					<UncontrolledTooltip
						target={IdPrefix + "clearbutton"}
						placement="bottom">
						Clear All Filters
					</UncontrolledTooltip>
					<button
						className={classNames(
							filtered ? "action text-white bg-primary-500" : "bg-white text-slate-500",
							"border border-slate-300 w-9 h-9 mx-1",
						)}
						id={IdPrefix + "applybutton"}
						onClick={applyFilters}>
						<FontAwesomeIcon icon={faFilter} />
					</button>
					<UncontrolledTooltip
						target={IdPrefix + "applybutton"}
						placement="bottom">
						Apply Pending Filters
					</UncontrolledTooltip>
				</>
				<button
					id={IdPrefix + "downloadButton"}
					className="bg-white-200 border border-slate-300 text-slate-500 w-9 h-9 mx-1 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
					onClick={(event) => {
						debugger;
					}}
					disabled>
					<FontAwesomeIcon icon={faDownload} />
				</button>
				{/* uncomment when not disabled */}
				{/* <UncontrolledTooltip
                        target={IdPrefix + "downloadButton"}
                        placement="bottom"
                    >
                        Download panel
                    </UncontrolledTooltip> */}
			</div>
		</section>
	);

	return wrapper;
};

export default PanelFilter;
