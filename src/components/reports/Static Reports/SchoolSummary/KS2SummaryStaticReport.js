import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";
import { GetSchoolFilterPhase } from "../../Elements/Common";
import { numericContent } from "../../../../common/Utility";
import LineChart from "../Attendance/LineChart";
import KS2MATAverageChart from "./KS2MATAverage";
import KS2Cohort from "./KS2Cohort";
import PieChart from "../Attendance/PieChart";
import KS2RWMHeatmap from "./KS2RWMHeatmap";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const KS2SummaryStaticReport = ({ dashboards, filterValues, setSelectedDashboard, setIsCustomDashboard, panelData, schools }) => {
	const { userDetail } = useMatpadContext();
	const schoolFilter =
		filterValues &&
		filterValues?.length > 0 &&
		filterValues?.find((f) => {
			if (
				f?.value &&
				typeof f?.value === "object" &&
				!Array.isArray(f?.value) &&
				f?.value !== null &&
				f?.value?.value &&
				typeof f?.value === "object" &&
				Object.hasOwn(f?.value?.value, "urn")
			) {
				return true;
			}
			return false;
		});
	const getPhaseName = () => {
		if (filterValues && filterValues?.find((f) => f?.value?.id?.toLowerCase() === "primary")) {
			return "Primary";
		}

		if (filterValues && filterValues?.find((f) => f?.value?.id?.toLowerCase() === "secondary")) {
			return "Secondary";
		}

		return "Whole MAT";
	};

	const name = schoolFilter?.value?.text ?? getPhaseName();
	const { phaseName } = GetSchoolFilterPhase(schoolFilter, filterValues);

	const logoValue = schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;
	const seriesname = panelData?.info?.seriesname || schoolFilter?.value?.text || phaseName;

	const lastYearPercentage = (value, lastWeek, reverse) => {
		const difference = (value || 0) - (lastWeek || 0);

		if (Math.round(difference * 100) === 0) {
			return (
				<div className="flex flex-wrap items-center justify-center">
					<div className="font-semibold text-sm mr-1">0.00%</div>
					<div className="font-semibold text-sm">since last year</div>
				</div>
			);
		} else {
			if (reverse === true) {
				return (
					<div className="flex flex-wrap items-center justify-center">
						<div className={`font-semibold text-sm text-${difference < 0 ? "green" : "red"}-500 mr-1`}>{`${difference.toFixed(0)}%`}</div>
						<div className="font-semibold text-sm">since last year</div>
					</div>
				);
			} else {
				return (
					<div className="flex flex-wrap items-center justify-center">
						<div className={`font-semibold text-sm text-${difference < 0 ? "red" : "green"}-500 mr-1`}>{`${difference.toFixed(0)}%`}</div>
						<div className="font-semibold text-sm">since last year</div>
					</div>
				);
			}
		}
	};

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
			<div className="w-full h-full p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
				<div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
					<div className="border border-slate-200 w-12 h-12 flex justify-center rounded-lg mb-3">
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

	const schoolPieValues = [
		{
			name: "Reading, writing & maths",
			y: panelData?.panel12?.all ?? 0,
			color: "#121051",
		},
		{
			name: "ALL BUT reading",
			y: panelData?.panel12?.allButReading ?? 0,
			color: "#5a9bf6",
		},
		{
			name: "ALL BUT writing",
			y: panelData?.panel12?.allButWriting ?? 0,
			color: "#7150bf",
		},
		{
			name: "ALL BUT maths",
			y: panelData?.panel12?.allButMaths ?? 0,
			color: "#b30089",
		},
		{
			name: "Only reading",
			y: panelData?.panel12?.onlyReading ?? 0,
			color: "#f79400",
		},
		{
			name: "Only writing",
			y: panelData?.panel12?.onlyWriting ?? 0,
			color: "#5bde80",
		},
		{
			name: "Only maths",
			y: panelData?.panel12?.onlyMaths ?? 0,
			color: "#2395a4",
		},
		{
			name: "No subjects",
			y: panelData?.panel12?.noSubjects ?? 0,
			color: "#f7555a",
		},
	];

	if (!panelData || panelData.loading) {
		return <LoadingSpinner />;
	}

	if (panelData?.error) {
		return (
			<div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
				<div className="text-slate-600 font-medium text-sm">Error loading school dashboard</div>
			</div>
		);
	}
	const currentYear = parseInt(panelData?.info?.yearEnd?.toString()?.split(/0(.*)/s)[1]);

	const year = `${currentYear}/${currentYear + 1}`;
	const previousYear = `${currentYear - 1}/${currentYear}`;

	console.log(panelData?.info?.yearEnd?.toString()?.split(/0(.*)/s)[1]);

	return (
		<div className="w-full h-full">
			<div className="flex w-full items-center gap-x-4 mb-2">
				{logoValue && (
					<div className="flex items-center justify-center w-[80px] h-[80px]">
						<img
							className="max-w-[80px] max-h-[80px]"
							src={`api/image/${logoValue}/logo?width=160&height=160`}
						/>
					</div>
				)}
				<div className="flex justify-between w-full h-[80px]">
					<div className="flex w-1/2 justify-between items-center text-2xl text-slate-900 font-semibold">
						<span>{name} - KS2 summary dashboard</span>
					</div>
					<div className="flex flex-col h-full w-1/2 justify-end items-end text-2xl text-slate-900 font-semibold">
						<span className="text-lg font-medium">{panelData?.info?.standard}</span>
					</div>
				</div>
			</div>
			<div className="bg-gray-100 w-full p-3 rounded-xl">
				<div className="w-full grid grid-cols-6 lg:grid-cols-10">
					<div className="relative col-span-2 h-40 p-2 ">
						{panelData?.panel1 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center ">
									RWM - {panelData?.info?.standard}
								</div>
								<div className="flex-col items-center justify-center">
									<div
										className={classNames(
											(100 - (panelData?.panel1[0]?.pct / panelData?.panel1[0]?.national) * 100)?.toFixed(0) <= 0
												? "text-green-500"
												: (100 - (panelData?.panel1[0]?.pct / panelData?.panel1[0]?.national) * 100)?.toFixed(0) > 0 &&
												  (100 - (panelData?.panel1[0]?.pct / panelData?.panel1[0]?.national) * 100)?.toFixed(0) <= 1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.panel1[0]?.pct?.toFixed(0) ? `${panelData?.panel1[0]?.pct?.toFixed(0)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex flex-col items-center justify-center">
										{lastYearPercentage(panelData?.panel1[0]?.pupils, panelData?.panel1[0]?.pupilsLastYear, false)}
										{`(nat. ${numericContent(panelData?.panel1[0]?.national, 0, "")}%)`}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="relative col-span-2 h-40 p-2 ">
						{panelData?.panel2 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center ">
									Reading - {panelData?.info?.standard}
								</div>
								<div className="flex-col items-center justify-center">
									<div
										className={classNames(
											(100 - (panelData?.panel2[0]?.pct / panelData?.panel2[0]?.national) * 100)?.toFixed(0) <= 0
												? "text-green-500"
												: (100 - (panelData?.panel2[0]?.pct / panelData?.panel2[0]?.national) * 100)?.toFixed(0) > 0 &&
												  (100 - (panelData?.panel2[0]?.pct / panelData?.panel2[0]?.national) * 100)?.toFixed(0) <= 1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.panel2[0]?.pct?.toFixed(0) ? `${panelData?.panel2[0]?.pct?.toFixed(0)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex flex-col items-center justify-center">
										{lastYearPercentage(panelData?.panel2[0]?.pupils, panelData?.panel2[0]?.pupilsLastYear, false)}
										{`(nat. ${numericContent(panelData?.panel2[0]?.national, 0, "")}%)`}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="relative col-span-2 h-40 p-2 ">
						{panelData?.panel3 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center ">
									Writing - {panelData?.info?.standard}
								</div>
								<div className="flex-col items-center justify-center">
									<div
										className={classNames(
											(100 - (panelData?.panel3[0]?.pct / panelData?.panel3[0]?.national) * 100)?.toFixed(0) <= 0
												? "text-green-500"
												: (100 - (panelData?.panel3[0]?.pct / panelData?.panel3[0]?.national) * 100)?.toFixed(0) > 0 &&
												  (100 - (panelData?.panel3[0]?.pct / panelData?.panel3[0]?.national) * 100)?.toFixed(0) <= 1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.panel3[0]?.pct?.toFixed(0) ? `${panelData?.panel3[0]?.pct?.toFixed(0)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex flex-col items-center justify-center">
										{lastYearPercentage(panelData?.panel3[0]?.pupils, panelData?.panel3[0]?.pupilsLastYear, false)}
										{`(nat. ${numericContent(panelData?.panel3[0]?.national, 0, "")}%)`}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="relative col-span-2 h-40 p-2 ">
						{panelData?.panel4 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center ">
									Maths - {panelData?.info?.standard}
								</div>
								<div className="flex-col items-center justify-center">
									<div
										className={classNames(
											(100 - (panelData?.panel4[0]?.pct / panelData?.panel4[0]?.national) * 100)?.toFixed(0) <= 0
												? "text-green-500"
												: (100 - (panelData?.panel4[0]?.pct / panelData?.panel4[0]?.national) * 100)?.toFixed(0) > 0 &&
												  (100 - (panelData?.panel4[0]?.pct / panelData?.panel4[0]?.national) * 100)?.toFixed(0) <= 1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.panel4[0]?.pct?.toFixed(0) ? `${panelData?.panel4[0]?.pct?.toFixed(0)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex flex-col items-center justify-center">
										{lastYearPercentage(panelData?.panel4[0]?.pupils, panelData?.panel4[0]?.pupilsLastYear, false)}
										{`(nat. ${numericContent(panelData?.panel4[0]?.national, 0, "")}%)`}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="relative col-span-2 h-40 p-2 ">
						{panelData?.panel5 && (
							<div className="w-full h-full overflow-hidden border-none bg-white rounded-xl p-2 flex flex-col items-center justify-center">
								<div className="font-semibold overflow-hidden text-ellipsis h-6 flex text-center justify-center ">
									GPS - {panelData?.info?.standard}
								</div>
								<div className="flex-col items-center justify-center">
									<div
										className={classNames(
											(100 - (panelData?.panel5[0]?.pct / panelData?.panel5[0]?.national) * 100)?.toFixed(0) <= 0
												? "text-green-500"
												: (100 - (panelData?.panel5[0]?.pct / panelData?.panel5[0]?.national) * 100)?.toFixed(0) > 0 &&
												  (100 - (panelData?.panel5[0]?.pct / panelData?.panel5[0]?.national) * 100)?.toFixed(0) <= 1
												? "text-amber-500"
												: "text-red-500",
											"font-semibold text-3xl flex items-center justify-center",
										)}>
										{`${panelData?.panel5[0]?.pct?.toFixed(0) ? `${panelData?.panel5[0]?.pct?.toFixed(0)}%` : "-"}`}
									</div>
									<div className="font-semibold text-sm flex flex-col items-center justify-center">
										{lastYearPercentage(panelData?.panel5[0]?.pupils, panelData?.panel5[0]?.pupilsLastYear, false)}
										{`(nat. ${numericContent(panelData?.panel5[0]?.national, 0, "")}%)`}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="w-full h-max col-span-6 grid grid-cols-2 md:grid-cols-4 lg:col-span-10 xl:grid-cols-10">
						<div className="col-span-2 h-full p-2">
							{panelData?.panel6 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="RWM trends"
										chartData={panelData?.panel6}
										schoolName={seriesname}
										showTrend={true}
										show3YearAvg={true}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-2 h-full p-2">
							{panelData?.panel7 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="Reading trends"
										chartData={panelData?.panel7}
										schoolName={seriesname}
										showTrend={true}
										show3YearAvg={true}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-2 h-full p-2">
							{panelData?.panel8 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="Writing trends"
										chartData={panelData?.panel8}
										schoolName={seriesname}
										showTrend={true}
										show3YearAvg={true}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-2 h-full p-2">
							{panelData?.panel9 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="Maths trends"
										chartData={panelData?.panel9}
										schoolName={seriesname}
										showTrend={true}
										show3YearAvg={true}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-2 h-full p-2">
							{panelData?.panel10 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<LineChart
										title="GPS trends"
										chartData={panelData?.panel10}
										schoolName={seriesname}
										showTrend={true}
										show3YearAvg={true}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
					</div>
					<div className="w-full h-max col-span-6 grid lg:col-span-10 grid-cols-6">
						<div className="col-span-2 h-full p-2">
							{panelData?.panel11 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									<KS2Cohort
										tableData={panelData?.panel11}
										schoolName={seriesname}
										title={panelData?.panel11?.title}
										year={year}
									/>
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-6 lg:col-span-2 h-full p-2">
							{panelData?.panel12 ? (
								<div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
									{_.isArray(panelData?.panel12?.schools) ? (
										<KS2MATAverageChart
											schools={schools}
											chartData={panelData?.panel12}
											title={`RWM % exp, by school`}
											name={getAverageName()}
										/>
									) : (
										<div className="flex w-full h-full">
											<PieChart
												chartData={schoolPieValues}
												title={"Achievement across KS2 subjects"}
											/>
										</div>
									)}
								</div>
							) : (
								noDataCard()
							)}
						</div>
						<div className="col-span-6 lg:col-span-2 h-full p-2">
							{panelData?.panel13 ? (
								<div className="bg-white flex items-center justify-center h-full rounded-xl">
									<KS2RWMHeatmap
										name={name}
										tableData={panelData?.panel13}
										year={year}
										previousYear={previousYear}
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

export default KS2SummaryStaticReport;
