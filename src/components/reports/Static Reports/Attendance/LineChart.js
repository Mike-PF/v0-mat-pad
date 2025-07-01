import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { numericContent } from "../../../../common/Utility";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const LineChart = ({ chartData, schoolName, title, showTrend = false, show3YearAvg = false }) => {
	if (!chartData) {
		return;
	}
	const national = chartData?.find((c) => c.name === "National");
	const MAT = chartData?.find((c) => c.name === "MAT");
	const nat3YearAvgs = [];
	const MAT3YearAvgs = [];

	const nationalChartData = national?.data?.map((n) => {
		return {
			y: parseFloat(n.y?.toFixed(1)),
			// x: finalYear + 2000,
			labelName: "National",
			colour: "#121051",
		};
	});
	const MATChartData = MAT?.data?.map((n) => {
		return {
			y: parseFloat(n.y?.toFixed(1)),
			// x: finalYear + 2000,
			labelName: schoolName,
			schoolsValues: n?.values,
			colour: "#2395A4",
		};
	});

	const chartDataLabels = MAT?.data?.map((n) => {
		return `${n?.name}`;
	});

	const chartOptions = {
		title: {
			text: title,
			style: {
				fontSize: "1rem",
				lineHeight: "1.5rem",
				fontWeight: "600",
				// textTransform: "capitalize",
			},
		},
		subtitle: {
			text: null,
		},
		exporting: {
			enabled: true,
		},
		chart: {
			type: "line",
			borderRadius: 5,
			borderWidth: 0,
			plotBorderWidth: 0,
			inverted: false,
			parallelAxes: {
				alignTicks: true,
				allowDecimals: false,
				gridLineDashStyle: "dash",
			},
			style: {
				"font-family": "Source Sans Pro, sans-serif",
				"font-size": "1.2rem",
				fontWeight: "400",
			},
		},
		series: [
			{
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				marker: {
					enabledThreshold: 2,
					lineColor: "#ffffff",
					lineWidth: 0,
					radius: 4,
					states: {
						normal: {
							animation: true,
						},
						hover: {
							animation: {
								duration: 150,
							},
							enabled: true,
							radiusPlus: 2,
							lineWidthPlus: 1,
						},
						select: {
							fillColor: "#cccccc",
							lineColor: "#000000",
							lineWidth: 2,
						},
					},
					enabled: true,
					symbol: "circle",
				},
				cropThreshold: 300,
				opacity: 1,
				pointRange: 0,
				softThreshold: true,
				states: {
					normal: {
						animation: true,
					},
					hover: {
						animation: {
							duration: 150,
						},
						lineWidthPlus: 1,
						halo: {
							size: 10,
							opacity: 0.25,
						},
					},
					select: {
						animation: {
							duration: 0,
						},
					},
					inactive: {
						animation: {
							duration: 150,
						},
						opacity: 0.2,
					},
				},
				stickyTracking: true,
				turboThreshold: 1000,
				findNearestPointBy: "x",
				legendSymbol: "lineMarker",
				type: "line",
				dashStyle: "Solid",
				boostThreshold: 5000,
				borderWidth: "",
				colorAxis: false,
				compare: "",
				gapSize: 0,
				getExtremesFromAll: false,
				showInNavigator: false,
				shadow: false,
				selected: false,
				name: "National",
				data: nationalChartData,
			},
			{
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				marker: {
					enabledThreshold: 2,
					lineColor: "#ffffff",
					lineWidth: 0,
					radius: 4,
					states: {
						normal: {
							animation: true,
						},
						hover: {
							animation: {
								duration: 150,
							},
							enabled: true,
							radiusPlus: 2,
							lineWidthPlus: 1,
						},
						select: {
							fillColor: "#cccccc",
							lineColor: "#000000",
							lineWidth: 2,
						},
					},
					symbol: "circle",
					enabled: true,
				},
				cropThreshold: 300,
				opacity: 1,
				pointRange: 0,
				softThreshold: true,
				states: {
					normal: {
						animation: true,
					},
					hover: {
						animation: {
							duration: 150,
						},
						lineWidthPlus: 1,
						halo: {
							size: 10,
							opacity: 0.25,
						},
					},
					select: {
						animation: {
							duration: 0,
						},
					},
					inactive: {
						animation: {
							duration: 150,
						},
						opacity: 0.2,
					},
				},
				stickyTracking: true,
				turboThreshold: 1000,
				findNearestPointBy: "x",
				legendSymbol: "lineMarker",
				type: "line",
				name: schoolName,
				data: MATChartData,
			},
		],
		tooltip: {
			enabled: true,
			useHTML: true,
			style: {
				// height: 280,
				// overflow: "auto",
				zIndex: 1000,
				width: 200,
				display: "flex",
				color: "black",
			},
			formatter: function (e) {
				if (
					this.point?.labelName === "Primary phase" ||
					this.point?.labelName === "Secondary phase" ||
					this.point?.labelName === "Whole MAT"
				) {
					const sortedSchools =
						title === "Persistent Absence Trends"
							? this?.point?.schoolsValues?.sort((a, b) => b.pct - a.pct)
							: this?.point?.schoolsValues?.sort((a, b) => a.pct - b.pct);
					const tooltipString = sortedSchools
						?.map((sv) => {
							return `<div style="display: flex; width: 200px; overflow: hidden; text-overflow: ellipsis; font-size: 10px;">
                            <div style="color: ${this.point.color}; margin: 0 2px 0 0;">${sv?.pct?.toFixed(1)}% </div>
                            <div style="overflow: hidden; text-overflow: ellipsis;"> - ${sv?.name}</div>
                            </div>`;
						})
						.toString();
					const tooltipStringNoCommas = tooltipString?.replace(/,/g, " ");

					return `<div>
                        <div style="color: ${this.point.color}; width: 200px; text-align: center; vertical-align: middle; margin-bottom: 2px">${
						this.x
					}</div>
                        <div style="width: 200px; overflow: hidden; text-overflow: ellipsis; font-size: 10px;">
                        <div style="display: flex; flex-wrap: "no-wrap"; height: 12px; width: 200px; line-clamp: 1; overflow: hidden; text-overflow: ellipsis; font-size: 10px;">
                            <div style="color: ${this.point.color}; margin: 0 2px 0 0;">${this.y}%</div>
                            <div style="overflow: hidden; text-overflow: ellipsis;"> - ${this.point?.labelName}</div>
                        </div>
                       ${tooltipStringNoCommas ?? ""}
                        </div>
                    </div>`;
				} else {
					return `<div>
                       <div style="color: ${this.point.color}; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.x}</div>
                        <div>${this.y}% - ${this.point?.labelName}</div>
                    </div>`;
				}
			},
		},
		yAxis: {
			title: {
				text: "",
			},
			labels: {
				format: "{value}%",
			},
			type: "linear",
			opposite: false,
			allowDecimals: false,
			tickInterval: 5,
		},
		colors: ["#121051", "#2395A4"],
		xAxis: {
			type: "category",
			reversed: false,
			title: {
				text: "",
			},
			categories: chartDataLabels,
		},
		credits: {
			enabled: false,
		},
		pane: {
			background: [],
		},
		responsive: {
			rules: [],
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: false,
				},
			},
		},
	};

	return (
		<div className="w-full h-full pb-2">
			<div className="w-full h-80">
				<HighchartsReact
					key={uniqueId("Line")}
					highcharts={Highcharts}
					options={chartOptions}
				/>
			</div>
			<div className="w-full px-2">
				<div className="w-full px-3 grid grid-cols-5">
					<div className="grid grid-rows-3">
						<div />
						<div className="border-gray-200 overflow-hidden p-1 gap-x-1 border-t-2 border-l-2 flex items-center pl-2 justify-start flex-wrap">
							<div className="w-8 h-1 bg-dashItem-100 text-white rounded-[3px]" />
							<div className="text-ellipsis overflow-hidden">National</div>
						</div>
						<div className="border-gray-200 p-1 border-l-2 gap-x-1 border-b-2 flex items-center pl-2 justify-start flex-wrap">
							<div className="w-8 h-1 bg-[#2395A4]" />
							<div className="line-clamp-2 text-ellipsis overflow-hidden">{schoolName}</div>
						</div>
					</div>
					{MAT?.data?.map((m) => {
						return (
							<div
								key={uniqueId(m?.name)}
								className="grid grid-rows-3 last:border-x-2 border-l-2 border-r-gray-200">
								<div className="border-gray-200 h-full break-word border-t-2 flex flex-wrap overflow-hidden items-center text-center justify-center">
									{m?.name}
								</div>
								<div className="border-gray-200 border-t-2 flex items-center text-center justify-center">
									{national?.data?.find((e) => e?.name === m?.name)
										? `${national?.data?.find((e) => e?.name === m?.name).y?.toFixed(1)}%`
										: ""}
								</div>
								<div className="border-gray-200 border-b-2 flex items-center text-center justify-center">
									{m?.y?.toFixed(1) ? `${m?.y?.toFixed(1)}%` : ""}
								</div>
							</div>
						);
					})}
					{showTrend && (
						<div
							key={uniqueId()}
							className="grid grid-rows-3 last:border-x-2 border-l-2 border-r-gray-200">
							<div className="border-gray-200 h-full break-word border-t-2 flex flex-wrap overflow-hidden items-center text-center justify-center">
								Trend
							</div>
							<div
								className={classNames(
									numericContent(
										national?.data[national?.data.length - 1]?.y - national?.data[national?.data.length - 2]?.y,
										1,
										"",
									) === ""
										? ""
										: numericContent(
												national?.data[national?.data.length - 1]?.y - national?.data[national?.data.length - 2]?.y,
												1,
												"",
										  ) >= 0
										? "bg-green-500"
										: "bg-red-500",
									"border-gray-200 border-t-2 flex items-center text-center justify-center",
								)}>
								{numericContent(national?.data[national?.data.length - 1]?.y - national?.data[national?.data.length - 2]?.y, 1, "")}
							</div>
							<div
								className={classNames(
									numericContent(MAT?.data[MAT?.data.length - 1]?.y - MAT?.data[MAT?.data.length - 2]?.y, 1, "") === ""
										? ""
										: numericContent(MAT?.data[MAT?.data.length - 1]?.y - MAT?.data[MAT?.data.length - 2]?.y, 1, "") >= 0
										? "bg-green-500"
										: "bg-red-500",
									"border-gray-200 border-b-2 flex items-center text-center justify-center",
								)}>
								{numericContent(MAT?.data[MAT?.data.length - 1]?.y - MAT?.data[MAT?.data.length - 2]?.y, 1, "")}
							</div>
						</div>
					)}
				</div>
			</div>
			{show3YearAvg && (
				<div className="w-full px-2">
					<div className="w-full px-3 grid grid-cols-5">
						<div className="grid grid-rows-3">
							<div className="border-gray-200 overflow-hidden p-1 gap-x-1 border-t-2 border-l-2 flex items-center pl-2 justify-start flex-wrap">
								3 yr av.
							</div>
							<div className="border-gray-200 overflow-hidden p-1 gap-x-1 border-t-2 border-l-2 flex items-center pl-2 justify-start flex-wrap">
								<div className="w-8 h-1 bg-dashItem-100 text-white rounded-[3px]" />
								<div className="text-ellipsis overflow-hidden">National</div>
							</div>
							<div className="border-gray-200 p-1 border-l-2 gap-x-1 border-b-2 flex items-center pl-2 justify-start flex-wrap">
								<div className="w-8 h-1 bg-[#2395A4]" />
								<div className="line-clamp-2 text-ellipsis overflow-hidden">{schoolName}</div>
							</div>
						</div>
						{MAT?.data?.map((m, index) => {
							if (index < 2) {
								return (
									<div
										key={uniqueId(m?.name)}
										className="grid grid-rows-3 last:border-x-2 border-l-2 border-r-gray-200">
										<div className="border-gray-200 h-full break-word border-t-2 flex flex-wrap overflow-hidden items-center text-center justify-center" />
										<div className="border-gray-200 border-t-2 flex items-center text-center justify-center" />
										<div className="border-gray-200 border-b-2 flex items-center text-center justify-center" />
									</div>
								);
							}
							const natAvg = (national?.data[index]?.y + national?.data[index - 1]?.y + national?.data[index - 2]?.y) / 3;
							const MATAvg = (MAT?.data[index]?.y + MAT?.data[index - 1]?.y + MAT?.data[index - 2]?.y) / 3;
							const nameStart = MAT?.data[index - 2]?.name?.split("/");
							const nameEnd = MAT?.data[index]?.name?.split("/");
							const name = `${nameStart[1]}/${nameEnd[1]}`;
							nat3YearAvgs.push(natAvg);
							MAT3YearAvgs.push(MATAvg);

							return (
								<div
									key={uniqueId(m?.name)}
									className="grid grid-rows-3 last:border-x-2 border-l-2 border-r-gray-200">
									<div className="border-gray-200 h-full break-word border-t-2 flex flex-wrap overflow-hidden items-center text-center justify-center">
										{name}
									</div>
									<div className="border-gray-200 border-t-2 flex items-center text-center justify-center">
										{`${numericContent(natAvg, 1, "")}%`}
									</div>
									<div className="border-gray-200 border-b-2 flex items-center text-center justify-center">
										{`${numericContent(MATAvg, 1, "")}%`}
									</div>
								</div>
							);
						})}
						{showTrend && (
							<div
								key={uniqueId()}
								className="grid grid-rows-3 last:border-x-2 border-l-2 border-r-gray-200">
								<div className="border-gray-200 h-full break-word border-t-2 flex flex-wrap overflow-hidden items-center text-center justify-center">
									Trend
								</div>
								<div
									className={classNames(
										numericContent(nat3YearAvgs[nat3YearAvgs.length - 1] - nat3YearAvgs[nat3YearAvgs.length - 2], 1, "") === ""
											? ""
											: numericContent(nat3YearAvgs[nat3YearAvgs.length - 1] - nat3YearAvgs[nat3YearAvgs.length - 2], 1, "") >=
											  0
											? "bg-green-500"
											: "bg-red-500",
										"border-gray-200 border-t-2 flex items-center text-center justify-center",
									)}>
									{numericContent(nat3YearAvgs[nat3YearAvgs.length - 1] - nat3YearAvgs[nat3YearAvgs.length - 2], 1, "")}
								</div>
								<div
									className={classNames(
										numericContent(MAT3YearAvgs[MAT3YearAvgs.length - 1] - MAT3YearAvgs[MAT3YearAvgs.length - 2], 1, "") === ""
											? ""
											: numericContent(MAT3YearAvgs[MAT3YearAvgs.length - 1] - MAT3YearAvgs[MAT3YearAvgs.length - 2], 1, "") >=
											  0
											? "bg-green-500"
											: "bg-red-500",
										"border-gray-200 border-b-2 flex items-center text-center justify-center",
									)}>
									{numericContent(MAT3YearAvgs[MAT3YearAvgs.length - 1] - MAT3YearAvgs[MAT3YearAvgs.length - 2], 1, "")}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default LineChart;
