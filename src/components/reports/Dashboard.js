import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import DashboardContent from "./Elements/DashboardContent";
import { DropDownSelect } from "../controls/DropDownSelect";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faObjectsColumn } from "@fortawesome/pro-light-svg-icons";
import { LinkCard } from "./Elements/LinkCard";
import PanelFilter from "./Elements/PanelFilters";
import AbortController from "abort-controller";

export function ReportsDashboard(props) {
	const { execute, getIsLoading } = useFetchWithMsal();
	const { setLocation } = useMatpadContext();
	const controller = useRef(new AbortController());

	const [selectedDashboard, setSelectedDashboard] = useState(null);
	const [dashboards, setDashboards] = useState(null);
	const [dashboardConfig, setDashboardConfig] = useState(null);
	const schools = useRef();
	const [IdPrefix] = useState(_.uniqueId("ReportsDashboard-"));
	const [contentIdPrefix] = useState(_.uniqueId("DashboardContent-"));
	const [panelToShow, setPanelToShow] = useState();
	const [filterValues, setFilterValues] = useState([]);
	const [panelData, setPanelData] = React.useState({
		loaded: false,
		attempt: 0,
	});
	const [isCustomDashboard, _setIsCustomDashboard] = useState(false);
	const [dashPanelFilters, setDashPanelFilters] = useState([]);

	const [chosenPupil, setChosenPupil] = useState("");

	const setIsCustomDashboard = (e) => {
		setFilterValues([]);
		_setIsCustomDashboard(e);
	};

	const abort = () => {
		controller.current.abort();
		controller.current = new AbortController();
	};

	const dashboardSelected = (e) => {
		setPanelData({
			loaded: false,
			attempt: 0,
		});
		setSelectedDashboard(e.value);
		setPanelToShow(undefined);
	};

	const panelSelected = (p) => {
		setPanelData({
			loaded: false,
			attempt: 0,
		});
		setPanelToShow(p);
	};

	useEffect(() => {
		const postData = {
			dashboardId: selectedDashboard?.id,
		};

		setLocation(window.location.pathname);

		execute("POST", "/api/dashboard/getpageconfiguration", postData).then((response) => {
			if (response) {
				schools.current = response.schools || [];
				setDashPanelFilters(response?.filters ?? []);

				const schoolOverview = {
					id: "School Summary",
					name: "School Summary",
					mat: false,
					urn: {
						specific: true,
					},
				};

				const customsArray = [];
				const addCustomDashboards = customsArray.concat(response?.dashboards);
				const schoolIndex = addCustomDashboards?.findIndex((d) => d?.name === "School Summary");

				if (schoolIndex > -1) {
					addCustomDashboards[schoolIndex] = schoolOverview;
				}

				setDashboards(addCustomDashboards || []);
				setFilters(response?.filters, true);
			}
		});
	}, [execute, selectedDashboard]);

	const setFilters = (filterValue, stopCancelCalls) => {
		if (!filterValue) return;

		if (!stopCancelCalls) {
			abort();
		}

		let endPoint;

		if (selectedDashboard?.id === "School Summary" && isCustomDashboard === "School Summary" && filterValue?.length > 0) {
			endPoint = "/api/dashboard/SchoolDashboard";
		} else if (selectedDashboard?.name?.toLowerCase() === "ks2 summary" && isCustomDashboard === "KS2 Summary") {
			endPoint = "/api/dashboard/KS2Data";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Attendance Summary Dashboard") {
			endPoint = "/api/dashboard/AttendanceData";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Persistent Absence Dashboard") {
			endPoint = "/api/dashboard/PersistentAttendanceData";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Pupil Summary Dashboard") {
			endPoint = "/api/dashboard/PupilSummary";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Pupil View Dashboard") {
			endPoint = "/api/dashboard/PupilDetail";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "YTD And Full-Year Attendance") {
			endPoint = "/api/dashboard/AttendanceYtdData";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Termly Attendance") {
			endPoint = "/api/dashboard/AttendanceTermlyData";
		} else if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "School Comparisons") {
			endPoint = "/api/dashboard/AttendanceSchoolsData";
		} else if (panelToShow?.id) {
			endPoint = "/api/report/" + panelToShow?.id + "/dashboardpanel";
		}

		if (endPoint) {
			const filters = [];
			_.forEach(filterValue, (fv) => {
				if (fv.name?.toLowerCase() === "pupil") {
					filters.push(fv);
					return;
				}

				if (!fv.value) return;

				const filter = {
					filterID: fv.filterID,
					value: [],
				};

				if (!_.isArray(fv.value) && fv?.value?.value) {
					filter.value.push({ value: fv.value?.value });

					filters.push(filter);
					return;
				}

				_.forEach(fv.value, (v) => {
					if (v.value?.selectSiblings === true) return;

					filter.value.push({ value: v.value });
				});

				filters.push(filter);
			});

			execute("POST", endPoint, { filter: filters }, false, "application/json", controller.current)
				.then((response) => {
					if (response) setPanelData(response);
				})
				.catch((err) => {
					if (err.name === "AbortError") {
						return;
					} else {
						throw err;
					}
				});

			setPanelData({ loading: true });
			setFilterValues(filterValue);
		}
	};

	useEffect(() => {
		if ((!panelToShow || !selectedDashboard) && isCustomDashboard !== "KS2 Summary") return;
		setFilterValues([]);

		abort();

		let data = [];

		if (
			_.find(panelToShow?.filters, (f) => {
				return f.name === "school" && f.options?.indexOf("showMAT") < 0;
			}) &&
			schools?.length > 0
		)
			data.push({
				id: _.find(panelToShow?.filters, (f) => f.name === "school" && f.options?.indexOf("showMAT") < 0).id,
				values: [schools[0].urn],
			});

		var endPoint = "/api/report/" + panelToShow?.id + "/dashboardpanel";

		if (selectedDashboard?.name?.toLowerCase() === "school summary") {
			return;
		}

		if (selectedDashboard?.name === "KS2 Summary" && isCustomDashboard === "KS2 Summary") {
			endPoint = "/api/dashboard/KS2Data";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Attendance Summary Dashboard") {
			endPoint = "/api/dashboard/AttendanceData";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Persistent Absence Dashboard") {
			endPoint = "/api/dashboard/PersistentAttendanceData";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Pupil Summary Dashboard") {
			endPoint = "/api/dashboard/PupilSummary";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "YTD And Full-Year Attendance") {
			endPoint = "/api/dashboard/AttendanceYtdData";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "Termly Attendance") {
			endPoint = "/api/dashboard/AttendanceTermlyData";

			data = {
				school: "mat",
			};
		}

		if (selectedDashboard?.name?.toLowerCase() === "attendance" && isCustomDashboard === "School Comparisons") {
			endPoint = "/api/dashboard/AttendanceSchoolsData";

			data = {
				school: "mat",
			};
		}

		execute("POST", endPoint, { filter: data }, false, "application/json", controller.current)
			.then((response) => {
				if (response) {
					setPanelData(response);
				} else
					setPanelData({
						...panelData,
						attempt: panelData.attempt + 1,
					});
			})
			.catch((err) => {
				if (err.name === "AbortError") {
					return;
				} else {
					throw err;
				}
			});
		setPanelData({ loading: true });
	}, [selectedDashboard, panelToShow?.id, execute, isCustomDashboard]);

	useEffect(() => {
		if (!selectedDashboard || !dashboardConfig) return;

		const newPanels = structuredClone(dashboardConfig ? dashboardConfig?.panels : []);

		let lowest = Number.POSITIVE_INFINITY;
		let tmp;
		for (var i = newPanels?.length - 1; i >= 0; i--) {
			tmp = newPanels[i]?.seq;
			if (tmp < lowest) lowest = tmp;
		}

		const firstPanel = newPanels?.find((panel) => panel.seq === lowest);
		const firstPanelIndex = newPanels?.indexOf(firstPanel);
		setPanelToShow(newPanels && newPanels[firstPanelIndex]);
	}, [selectedDashboard, dashboardConfig]);

	const getFilters = () => {
		return (
			<>
				{((_.isArray(dashPanelFilters ?? panelToShow?.filters) && dashPanelFilters?.length > 0) || panelToShow?.filters?.length > 0) && (
					<PanelFilter
						filterValues={filterValues}
						panelToShow={panelToShow}
						isCustomDashboard={isCustomDashboard}
						filters={dashPanelFilters ?? panelToShow?.filters}
						schools={schools?.current}
						setFilters={setFilters}
					/>
				)}
			</>
		);
	};

	useEffect(() => {
		if (!selectedDashboard) return;

		if (selectedDashboard.id === "School Summary") {
			setIsCustomDashboard("School Summary");
			return;
		}

		setIsCustomDashboard(false);
	}, [selectedDashboard]);

	if (typeof dashboards === "undefined" || dashboards === null) return <LoadingSpinner idPrefix={IdPrefix} />;

	// No Forms configured
	if (!_.isArray(dashboards) || dashboards.length === 0) return <h5 className="text-center text-primary">No dashboard configured</h5>;

	return (
		<section
			key={IdPrefix + "area"}
			className="h-full flex gap-2 flex-col">
			<div className="min-h-1/6 flex gap-2 flex-col">
				<div className="dashboardControls z-40 flex items-center justify-between sticky w-full m-0 max-w-full px-3 min-h-1/6">
					<div>
						<div className="text-slate-900 font-medium text-sm">Dashboard</div>
						<div
							key={IdPrefix + "select-area"}
							className="mw300">
							<DropDownSelect
								key={IdPrefix + "dashboards"}
								onChange={dashboardSelected}
								value={selectedDashboard}
								items={dashboards}
								textField={"name"}
								valueField={"id"}
								placeholder={"Select Dashboard..."}
							/>
						</div>
					</div>
					{selectedDashboard && <div className="flex">{getFilters()}</div>}
				</div>
				{(dashboardConfig || selectedDashboard?.id === "School Summary") && (
					<LinkCard
						dashboard={selectedDashboard}
						dashboardConfig={dashboardConfig}
						IdPrefix={IdPrefix}
						isCustomDashboard={isCustomDashboard}
						panelToShow={panelToShow}
						setIsCustomDashboard={setIsCustomDashboard}
						setPanelData={setPanelData}
						setPanelToShow={panelSelected}
					/>
				)}
			</div>
			<div className="dashboardControls sticky w-full max-w-full px-3 py-4 h-5/6 z-0">
				{selectedDashboard && selectedDashboard.id ? (
					<DashboardContent
						key={IdPrefix + "dashboard-content-" + selectedDashboard.id}
						IdPrefix={contentIdPrefix}
						dashboard={selectedDashboard}
						setParentDashboardConfig={setDashboardConfig}
						panelToShow={panelToShow}
						panelData={panelData}
						setPanelData={setPanelData}
						dashboards={dashboards}
						setSelectedDashboard={setSelectedDashboard}
						dashboardConfig={dashboardConfig}
						setPanelToShow={panelSelected}
						schools={schools}
						filterValues={filterValues}
						isCustomDashboard={isCustomDashboard}
						setIsCustomDashboard={setIsCustomDashboard}
						setFilters={setFilters}
						filters={dashPanelFilters ?? panelToShow?.filters}
					/>
				) : (
					<div className="bg-slate-50 w-full min-h-full flex items-center justify-center rounded-lg border border-slate-200">
						<div className="w-80 h-40 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200">
							<div className="flex items-center justify-center border border-slate-200 w-12 h-12 bg-white rounded-lg">
								<FontAwesomeIcon
									icon={faObjectsColumn}
									className="h-8 w-8"
								/>
							</div>
							<div className="mt-2">Please select dashboard</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
