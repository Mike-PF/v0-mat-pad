import { useEffect, useState } from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/pro-light-svg-icons";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const debounce = (mainFunction, delay) => {
	let timer;

	return function (...args) {
		clearTimeout(timer);

		timer = setTimeout(() => {
			mainFunction(...args);
		}, delay);
	};
};

export function LinkCard({
	dashboard,
	dashboardConfig,
	IdPrefix,
	isCustomDashboard,
	panelToShow,
	setIsCustomDashboard,
	setPanelData,
	setPanelToShow,
}) {
	const [collapsed, setCollapsed] = useState(true);
	const [linksHeight, setLinksHeight] = useState(document.getElementById(IdPrefix + "dashboardselectors")?.scrollHeight);

	useEffect(() => {
		if (!dashboardConfig) return;
		if (dashboardConfig?.name === "Attendance") {
			setIsCustomDashboard("Attendance Summary Dashboard");
		}
		if (dashboardConfig?.name === "KS2 Summary") {
			setIsCustomDashboard("KS2 Summary");
		}
	}, [dashboardConfig, dashboard]);

	const setHeight = () => {
		setLinksHeight(document.getElementById(IdPrefix + "dashboardselectors")?.scrollHeight);
	};

	const panelButtonClick = (p) => {
		if (p?.hdr === panelToShow?.hdr && !isCustomDashboard) return;

		setIsCustomDashboard(false);
		setPanelToShow(p);
	};

	window.onresize = debounce(setHeight, 500);

	useEffect(() => {
		setHeight();
	}, [panelToShow]);

	if (!dashboardConfig?.panels) {
		return;
	}

	return (
		<div className="dashboardControls container w-full m-0 max-w-full px-3 relative flex items-center justify-between">
			<div className="flex flex-row flex-wrap w-full justify-center items-center">
				<section
					id={IdPrefix + "dashboardselectors"}
					key={IdPrefix + "dashboardselectors"}
					className={classNames(collapsed ? "max-h-10" : "", "w-full flex flex-wrap overflow-hidden")}>
					{dashboardConfig?.name === "KS2 Summary" && (
						<>
							<button
								onClick={() => {
									if (isCustomDashboard !== "KS2 Summary") {
										setIsCustomDashboard("KS2 Summary");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "KS2 Summary" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "KS2SummaryDash"}
								data-tag={"KS2SummaryDash"}>
								KS2 Summary Dashboard
							</button>
						</>
					)}
					{dashboardConfig?.name === "Attendance" && (
						<>
							<button
								onClick={() => {
									if (isCustomDashboard !== "Attendance Summary Dashboard") {
										setIsCustomDashboard("Attendance Summary Dashboard");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "Attendance Summary Dashboard" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "attendanceDash"}
								data-tag={"attendanceDash"}>
								Attendance Summary Dashboard
							</button>
							<button
								onClick={() => {
									if (isCustomDashboard !== "Persistent Absence Dashboard") {
										setIsCustomDashboard("Persistent Absence Dashboard");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "Persistent Absence Dashboard" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "attendanceSummaryDash"}
								data-tag={"attendanceSummaryDash"}>
								Persistent Absence Dashboard
							</button>
							<button
								onClick={() => {
									if (isCustomDashboard !== "Pupil Summary Dashboard") {
										setIsCustomDashboard("Pupil Summary Dashboard");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "Pupil Summary Dashboard" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "pupilSummaryDash"}
								data-tag={"pupilSummaryDash"}>
								Pupil Summary Dashboard
							</button>
							<button
								onClick={() => {
									if (isCustomDashboard !== "Pupil View Dashboard") {
										setIsCustomDashboard("Pupil View Dashboard");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "Pupil View Dashboard" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "AttendancePupilView"}
								data-tag={"AttendancePupilView"}>
								Pupil View Dashboard
							</button>
							{/* <button
                                onClick={() => {
                                    if (
                                        isCustomDashboard !==
                                        "YTD And Full-Year Attendance"
                                    ) {
                                        setIsCustomDashboard(
                                            "YTD And Full-Year Attendance"
                                        );
                                        setPanelData({ loading: true });
                                    }
                                }}
                                className={classNames(
                                    isCustomDashboard ===
                                        "YTD And Full-Year Attendance"
                                        ? "bg-slate-200"
                                        : "bg-slate-50",
                                    "min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate"
                                )}
                                key={IdPrefix + "YTDFullYearDash"}
                                data-tag={"attendanceDash"}
                            >
                                YTD And Full-Year Attendance
                            </button> */}
							<button
								onClick={() => {
									if (isCustomDashboard !== "Termly Attendance") {
										setIsCustomDashboard("Termly Attendance");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "Termly Attendance" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "TermlyDash"}
								data-tag={"attendanceDash"}>
								Termly Attendance
							</button>
							<button
								onClick={() => {
									if (isCustomDashboard !== "School Comparisons") {
										setIsCustomDashboard("School Comparisons");
										setPanelData({ loading: true });
									}
								}}
								className={classNames(
									isCustomDashboard === "School Comparisons" ? "bg-slate-200" : "bg-slate-50",
									"min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
								)}
								key={IdPrefix + "SchoolComparisonsDash"}
								data-tag={"attendanceDash"}>
								School Comparisons
							</button>
						</>
					)}
					{_.sortBy(dashboardConfig?.panels, ["seq"]).map((p) => {
						return (
							p.hdr && (
								<button
									onClick={(e) => panelButtonClick(p)}
									className={classNames(
										panelToShow?.id === p.id && !isCustomDashboard ? "bg-slate-200" : "bg-slate-50",
										"w-40 min-h-9 p-1 mb-2 mx-1  border border-slate-200 rounded-md truncate",
									)}
									key={IdPrefix + "dashboardselector-" + p.id}
									data-tag={"dashboard-panel-" + p.id}>
									{p.hdr}
								</button>
							)
						);
					})}
				</section>
			</div>
			{linksHeight && linksHeight > 39 && (
				<button
					className="border-none flex justify-center items-center w-7 h-full"
					onClick={() => setCollapsed(!collapsed)}>
					<FontAwesomeIcon
						icon={collapsed ? faChevronDown : faChevronUp}
						className="text-slate-500 w-5 h-5"
					/>
				</button>
			)}
		</div>
	);
}
