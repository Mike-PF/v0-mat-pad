import React from "react";
import _ from "lodash";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import YTDLineChart from "./YTDLineChart";
import MATAverageChart from "./MATAverage";
import LevelOfAbsenceBarChart from "./LevelOfAbsenceBarChart";
import PupilGroupAbsenceHeatmap from "./PupilGroupAbsenceHeatmap";
import AbsenceReasonsHeatmap from "./AbsenceReasonsHeatmap";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import { FindSchoolFilter, GetDashboardFilterList, GetSchoolFilterPhase } from "../../Elements/Common";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const PersistentAbsenceStaticReport = ({ setIsCustomDashboard, panelData, filterValues, schools, filters, isCustomDashboard }) => {
	const { userDetail } = useMatpadContext();

	const schoolFilter = FindSchoolFilter(filterValues, GetDashboardFilterList(filters, isCustomDashboard));
	const { phaseName } = GetSchoolFilterPhase(schoolFilter, filterValues);
	const name = panelData?.info?.name || schoolFilter?.value?.text || phaseName;
	const seriesname = panelData?.info?.seriesname || schoolFilter?.value?.text || phaseName;
	const logoValue = schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;

	const findAttendance = () => {
		setIsCustomDashboard("Attendance Summary Dashboard");
	};

	const lastWeekPercentage = (value, lastWeek, reverse) => {
		const difference = (value || 0) - (lastWeek || 0);

		if (Math.round(difference * 100) === 0) {
			return (
				<div
					className="flex h-5 flex-wrap items-center justify-center"
					title="No change week-on-week">
					<div className="font-semibold text-sm mr-1">0.00%</div>
					<div className="font-semibold text-sm">since last week</div>
				</div>
			);
		} else {
			if (reverse === true) {
				return (
					<div
						className="flex h-5 flex-wrap items-center justify-center"
						title={`Last week: ${lastWeek?.toFixed(2) || ""}\r\nThis week: ${value?.toFixed(2) || ""}`}>
						<div className={`font-semibold text-sm text-${difference < 0 ? "green" : "red"}-500 mr-1`}>{`${difference.toFixed(2)}%`}</div>
						<div className="font-semibold text-sm">since last week</div>
					</div>
				);
			} else {
				return (
					<div
						className="flex h-5 flex-wrap items-center justify-center"
						title={`Last week: ${lastWeek?.toFixed(2) || ""}\r\nThis week: ${value?.toFixed(2) || ""}`}>
						<div className={`font-semibold text-sm text-${difference < 0 ? "red" : "green"}-500 mr-1`}>{`${difference.toFixed(2)}%`}</div>
						<div className="font-semibold text-sm">since last week</div>
					</div>
				);
			}
		}
	};

	if (!panelData || panelData.loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	const getAverageName = () => {
		if (name !== "Whole MAT" && name !== "Primary phase" && name !== "Secondary phase") {
			return "Whole MAT";
		} else return name;
	};

	const nationalDate = panelData?.info?.lastCollected;
	const formattedDate = nationalDate
		? new Date(nationalDate).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
		  })
		: "";

	const noDataCard = () => {
		return (
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
		);
	};

	return (
		<div className="w-full h-full">
			<div className="flex w-full items-center gap-x-4 mb-2">
				{logoValue && (
					<div className="flex items-center justify-center w-[80px] h-[80px]">
						<img
							className="max-w-[80px] max-h-[80px]"
							src={`api/image/${logoValue}/logo?width=80&height=80`}
						/>
					</div>
				)}
				<div className="flex justify-between w-full h-[80px]">
					<div className="flex w-1/2 justify-between items-center text-2xl text-slate-900 font-semibold">
						<span> {name}</span>
					</div>
					<div className="flex h-full w-1/2 justify-end items-end text-2xl text-slate-900 font-semibold">
						<span className="text-lg font-medium">National Data Collected - {formattedDate}</span>
					</div>
				</div>
			</div>
			<div className="bg-gray-100 w-full rounded-xl p-2">
				<div className="w-full grid grid-cols-3 lg:grid-cols-6">
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel1?.on === true && (
							<button
								type="button"
								onClick={findAttendance}
								className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel1?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div
										className={classNames(
											(100 - (panelData?.data?.panel1?.pct / panelData?.data?.panel1?.national) * 100)?.toFixed(2) <= 0
												? "text-green-500"
												: 0 <
												  (100 - (panelData?.data?.panel1?.pct / panelData?.data?.panel1?.national) * 100)?.toFixed(2) <=
												  1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.data?.panel1?.pct?.toFixed(2) ? `${panelData?.data?.panel1?.pct?.toFixed(2)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex items-center justify-center">{`(nat. ${panelData?.data?.panel1?.national?.toFixed(
										2,
									)}%)`}</div>
								</div>
								{lastWeekPercentage(panelData?.data?.panel1?.pct, panelData?.data?.panel1?.lastWeekPct)}
							</button>
						)}
					</div>
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel2 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel2?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div
										className={classNames(
											(100 - (panelData?.data?.panel2?.pct / panelData?.data?.panel2?.national) * 100)?.toFixed(2) <= 0
												? "text-red-500"
												: (100 - (panelData?.data?.panel2?.pct / panelData?.data?.panel2?.national) * 100)?.toFixed(2) > 0 &&
												  (100 - (panelData?.data?.panel2?.pct / panelData?.data?.panel2?.national) * 100)?.toFixed(2) <= 1
												? "text-amber-500"
												: "text-green-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.data?.panel2?.pct?.toFixed(2) ? `${panelData?.data?.panel2?.pct?.toFixed(2)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex items-center justify-center">{`(nat. ${panelData?.data?.panel2?.national?.toFixed(
										2,
									)}%)`}</div>
								</div>
								{lastWeekPercentage(panelData?.data?.panel2?.pct, panelData?.data?.panel2?.lastWeekPct, true)}
							</div>
						)}
					</div>
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel3 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel3?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div
										className={classNames(
											(100 - (panelData?.data?.panel3?.pct / panelData?.data?.panel3?.national) * 100)?.toFixed(2) <= 0
												? "text-red-500"
												: (100 - (panelData?.data?.panel3?.pct / panelData?.data?.panel3?.national) * 100)?.toFixed(2) > 0 &&
												  (100 - (panelData?.data?.panel3?.pct / panelData?.data?.panel3?.national) * 100)?.toFixed(2) <= 1
												? "text-amber-500"
												: "text-green-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.data?.panel3?.pct?.toFixed(2) ? `${panelData?.data?.panel3?.pct?.toFixed(2)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex items-center justify-center">{`(nat. ${panelData?.data?.panel3?.national?.toFixed(
										2,
									)}%)`}</div>
								</div>
								{lastWeekPercentage(panelData?.data?.panel3?.pct, panelData?.data?.panel3?.lastWeekPct, true)}
							</div>
						)}
					</div>
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel4 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel4?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div
										className={classNames(
											(100 - (panelData?.data?.panel4?.pct / panelData?.data?.panel4?.national) * 100)?.toFixed(2) <= 0
												? "text-red-500"
												: (100 - (panelData?.data?.panel4?.pct / panelData?.data?.panel4?.national) * 100)?.toFixed(2) > 0 &&
												  (100 - (panelData?.data?.panel4?.pct / panelData?.data?.panel4?.national) * 100)?.toFixed(2) <= 1
												? "text-amber-500"
												: "text-green-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.data?.panel4?.pct?.toFixed(2) ? `${panelData?.data?.panel4?.pct?.toFixed(2)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex items-center justify-center">
										{`(nat. ${panelData?.data?.panel4?.national?.toFixed(2)}%)`}
									</div>
								</div>
								{lastWeekPercentage(panelData?.data?.panel4?.pct, panelData?.data?.panel4?.lastWeekPct, true)}
							</div>
						)}
					</div>
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel5 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel5?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div
										className={classNames(
											(100 - (panelData?.data?.panel5?.pct / panelData?.data?.panel5?.national) * 100)?.toFixed(2) <= 0
												? "text-red-500"
												: (100 - (panelData?.data?.panel5?.pct / panelData?.data?.panel5?.national) * 100)?.toFixed(2) > 0 &&
												  (100 - (panelData?.data?.panel5?.pct / panelData?.data?.panel5?.national) * 100)?.toFixed(2) <= 1
												? "text-amber-500"
												: "text-green-500",
											"font-semibold text-3xl",
										)}>
										{`${panelData?.data?.panel5?.pct?.toFixed(2) ? `${panelData?.data?.panel5?.pct?.toFixed(2)}%` : "-"}`}
									</div>
								</div>
								{lastWeekPercentage(panelData?.data?.panel5?.pct, panelData?.data?.panel5?.lastWeekPct)}
							</div>
						)}
					</div>
					<div className="relative lg:col-span-1 h-40 p-2 ">
						{panelData?.data?.panel6 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center">
									{panelData?.data?.panel6?.title}
								</div>
								<div className="flex-col items-center h-14 justify-center">
									<div className="font-semibold text-3xl text-red-500">
										{`${panelData?.data?.panel6?.pct?.toFixed(2) ? `${panelData?.data?.panel6?.pct?.toFixed(2)}%` : "-"}`}
									</div>
								</div>
								<div className="h-5 flex font-semibold overflow-hidden text-ellipsis linewrap-1 text-red-500">
									{panelData?.data?.panel6?.name}
								</div>
							</div>
						)}
					</div>
					<div className="w-full h-max col-span-3 grid grid-cols-3 lg:col-span-6 md:grid-cols-12">
						<div className="col-span-3 h-full md:col-span-12 lg:col-span-4 p-2">
							{panelData?.data?.panel7 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="Persistent Absence Trends"
										chartData={panelData?.data?.panel7}
										schoolName={seriesname}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-3 h-full md:col-span-6 lg:col-span-4 p-2">
							{panelData?.data?.panel8 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl p-3">
									<LevelOfAbsenceBarChart chartData={panelData?.data?.panel8} />
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-3 h-full md:col-span-6 lg:col-span-4 p-2">
							{panelData?.data?.panel9 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<BarChart
										title="Persistent Absence By NCY"
										chartData={panelData?.data?.panel9}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
					</div>
					<div className="w-full h-max col-span-3 grid grid-cols-3 lg:col-span-6 md:grid-cols-12">
						<div className="col-span-3 h-full md:col-span-12 lg:col-span-4 p-2">
							{panelData?.data?.panel10 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<YTDLineChart
										title="YTD Persistent Absence Trends"
										chartData={panelData?.data?.panel10}
										school={seriesname}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-3 h-full md:col-span-6 lg:col-span-4 p-2">
							{_.isArray(panelData?.data?.panel11?.schools) || _.isObject(panelData?.data?.panel11?.school) ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									{_.isArray(panelData?.data?.panel11?.schools) ? (
										<MATAverageChart
											schools={schools}
											chartData={panelData.data.panel11}
											title={`School With Persistent Absence Above ${getAverageName()} Average`}
											name={getAverageName()}
											type="pa"
										/>
									) : (
										<AbsenceReasonsHeatmap
											tableData={panelData?.data?.panel11}
											schoolName={seriesname}
											title="Absence reasons YTD"
										/>
									)}
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-3 h-full md:col-span-6 lg:col-span-4 p-2">
							{panelData?.data?.panel12 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<PupilGroupAbsenceHeatmap
										tableData={panelData?.data?.panel12}
										title="Persistent Absence By Pupil Group"
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PersistentAbsenceStaticReport;
