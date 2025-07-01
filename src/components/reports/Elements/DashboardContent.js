import React, { useEffect } from "react";
import _ from "lodash";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import DashboardPanel from "./DashboardPanel";
import { LoadingSpinner } from "../../controls/LoadingSpinner";
import AttendanceStaticReport from "../Static Reports/Attendance/AttendanceStaticReport";
import SchoolSummaryStaticReport from "../Static Reports/SchoolSummary/SchoolSummaryStaticReport";
import PersistentAbsenceStaticReport from "../Static Reports/Attendance/PersistentAbsenceStaticReport";
import PupilSummaryStaticReport from "../Static Reports/Attendance/PupilSummaryStaticReport";
import PupilViewStaticReport from "../Static Reports/Attendance/PupilViewStaticReport";
import YTDFullAttendanceStaticReport from "../Static Reports/Attendance/YTDFullAttendanceStaticReport";
import TermlyAttendanceStaticReport from "../Static Reports/Attendance/TermlyAttendanceStaticReport";
import SchoolComparisonsStaticReport from "../Static Reports/Attendance/SchoolComparisonsStaticReport";
import KS2SummaryStaticReport from "../Static Reports/SchoolSummary/KS2SummaryStaticReport";

const DashboardContent = ({
	dashboard,
	urn,
	schools,
	IdPrefix,
	setParentDashboardConfig,
	panelToShow,
	filterValues,
	panelData,
	isCustomDashboard,
	dashboards,
	setSelectedDashboard,
	setIsCustomDashboard,
	setFilters,
	filters,
}) => {
	const { execute } = useFetchWithMsal();
	const [dashboardConfigState, setDashboardConfig] = React.useState(null);

	useEffect(() => {
		if (dashboard?.id === "School Summary") {
			setDashboardConfig(null);
			setParentDashboardConfig(null);
			return;
		}

		if (!dashboardConfigState && dashboard) {
			execute("GET", "/api/report/" + dashboard.id + "/dashboard").then((response) => {
				if (response) {
					setDashboardConfig(response);
					setParentDashboardConfig(response);
					return;
				}
			});
			setDashboardConfig({ loading: true });
			setParentDashboardConfig({ loading: true });
		}
	}, [dashboardConfigState, execute, dashboard]);

	const RenderCustomDashboard = () => {
		if (dashboard?.name === "Attendance" && isCustomDashboard === "Attendance Summary Dashboard") {
			return (
				<AttendanceStaticReport
					key={IdPrefix + "attendance-static-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
					isCustomDashboard={isCustomDashboard}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "YTD And Full-Year Attendance") {
			return (
				<YTDFullAttendanceStaticReport
					key={IdPrefix + "attendance-ytd-static-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "Termly Attendance") {
			return (
				<TermlyAttendanceStaticReport
					key={IdPrefix + "termly-attendance-static-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "School Comparisons") {
			return (
				<SchoolComparisonsStaticReport
					key={IdPrefix + "termly-attendance-static-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "Persistent Absence Dashboard") {
			return (
				<PersistentAbsenceStaticReport
					key={IdPrefix + "attendance-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					dashboards={dashboards}
					setSelectedDashboard={setSelectedDashboard}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
					isCustomDashboard={isCustomDashboard}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "Pupil Summary Dashboard") {
			return (
				<PupilSummaryStaticReport
					key={IdPrefix + "pupil-summary-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					dashboards={dashboards}
					setSelectedDashboard={setSelectedDashboard}
					setIsCustomDashboard={setIsCustomDashboard}
					setFilters={setFilters}
					filters={filters}
					isCustomDashboard={isCustomDashboard}
				/>
			);
		}
		if (dashboard?.name === "Attendance" && isCustomDashboard === "Pupil View Dashboard") {
			return (
				<PupilViewStaticReport
					key={IdPrefix + "Attendance-pupil-view-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					dashboards={dashboards}
					setSelectedDashboard={setSelectedDashboard}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
		if (dashboard?.id === "School Summary") {
			return (
				<SchoolSummaryStaticReport
					key={IdPrefix + "attendance-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					dashboards={dashboards}
					setSelectedDashboard={setSelectedDashboard}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
		if (dashboard?.name === "KS2 Summary" && isCustomDashboard === "KS2 Summary") {
			return (
				<KS2SummaryStaticReport
					key={IdPrefix + "attendance-dashboard-" + panelToShow?.id}
					dashboard={dashboard}
					config={dashboardConfigState}
					panelData={panelData}
					panel={panelToShow}
					urn={urn}
					schools={schools.current}
					filterValues={filterValues}
					dashboards={dashboards}
					setSelectedDashboard={setSelectedDashboard}
					setIsCustomDashboard={setIsCustomDashboard}
					filters={filters}
				/>
			);
		}
	};

	const Dashboard = () => {
		if (isCustomDashboard) {
			return (
				<div className="flex w-full h-full">
					<section className="w-full pr-4 h-full overflow-auto">
						<RenderCustomDashboard />
					</section>
				</div>
			);
		}

		if (!dashboardConfigState || dashboardConfigState?.loading) return <LoadingSpinner idPrefix={IdPrefix} />;

		if (!_.isArray(dashboardConfigState?.panels) || dashboardConfigState?.panels.length === 0)
			return <h5 className="text-center text-primary">Invalid Configuration - {dashboard.name} has no panels</h5>;

		return (
			<div className="flex w-full h-full">
				<section
					key={IdPrefix + "dashboardpanels"}
					className="w-full pr-4 max-h-full overflow-auto">
					<DashboardPanel
						key={IdPrefix + "dashboard-" + panelToShow?.id}
						dashboard={dashboard}
						config={dashboardConfigState}
						panelData={panelData}
						panel={panelToShow}
						urn={urn}
						schools={schools.current}
						filterValues={filterValues}
						filters={filters}
					/>
				</section>
			</div>
		);
	};

	if ((!dashboardConfigState || !panelToShow) && !isCustomDashboard) {
		return <LoadingSpinner idPrefix={IdPrefix} />;
	}

	if (dashboardConfigState?.loading === true) return <LoadingSpinner idPrefix={IdPrefix} />;

	return <Dashboard key={IdPrefix + "dashboard-" + dashboard.id} />;
};

export default DashboardContent;
