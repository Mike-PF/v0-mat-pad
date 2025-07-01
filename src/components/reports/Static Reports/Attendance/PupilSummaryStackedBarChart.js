import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PupilSummaryStackedBarChart = ({ chartData, title }) => {
	if (!chartData) return;

	let allPupils = 0;

	chartData?.data?.map((d) => {
		const allDPupils = d?.eal + d?.noeal;
		allPupils = allPupils + allDPupils;
	});

	const sortedAll = _.orderBy(chartData?.data, (a) => {
		if (a?.name === "Unclassified" || a?.ethnicity === "Unclassified") return Number.MIN_SAFE_INTEGER;
		return (a?.eal || 0) + (a?.noeal || 0);
	});

	const sortedEALArray = sortedAll?.map((n) => {
		return [n?.ethnicity, n?.eal];
	});

	const sortedNonEALArray = sortedAll?.map((n) => {
		return [n?.ethnicity, n?.noeal];
	});

	const chartOptions = {
		title: {
			text: title,
			style: {
				fontSize: "1rem",
				lineHeight: "1.5rem",
				fontWeight: "600",
			},
		},
		subtitle: {
			text: null,
		},
		exporting: {
			enabled: true,
		},
		chart: {
			type: "bar",
			borderRadius: 5,
			borderWidth: 0,
			plotBorderWidth: 0,
			inverted: false,
			parallelAxes: {
				alignTicks: true,
				allowDecimals: true,
				gridLineDashStyle: "dash",
			},
			style: {
				"font-family": "Source Sans Pro, sans-serif",
				"font-size": "1.2rem",
				fontWeight: "400",
			},
		},
		yAxis: {
			enabled: false,
			title: {
				enabled: false,
			},
			labels: {
				enabled: false,
			},
			lineColor: "f0f2f4",
			tickInterval: 0,
			tickAmount: 0,
			endOnTick: false,
			tickLength: 0,
			endOnTick: false,
			startOnTick: false,
			tickColour: "#ffffff",
			gridLineColor: "#ffffff",
			lineColor: "#ffffff",
		},
		xAxis: {
			lineColor: "f0f2f4",
			type: "category",
			reversed: false,
			tickInterval: 0,
			tickAmount: 0,
			endOnTick: false,
			tickLength: 0,
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
				stacking: "normal",
				dataLabels: {
					verticalAlign: "bottom",
					enabled: true,
					style: {
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
						"font-size": "1.5rem",
						textOutline: null,
					},
				},
				pointPadding: 0.1,
				groupPadding: 0.2,
				borderWidth: 2,
				borderColor: "#ffffff",
				borderRadius: 0,
			},
		},
		colors: ["#b7008f", "#f89a00"],
		series: [
			{
				name: "EAL = Yes",
				relatesTo: "EAL No",
				showInLegend: true,
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				dataLabels: {
					style: {
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
						fontWeight: "400",
					},
				},
				cropThreshold: 300,
				opacity: 1,
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
				dashStyle: "Solid",
				boostThreshold: 5000,
				colorAxis: false,
				compare: "",
				gapSize: 0,
				getExtremesFromAll: false,
				showInNavigator: false,
				shadow: false,
				selected: false,
				data: sortedEALArray,
			},
			{
				name: "EAL = No",
				id: "EAL No",
				showInLegend: true,
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				dataLabels: {
					style: {
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
						fontWeight: "400",
					},
				},
				cropThreshold: 300,
				opacity: 1,
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
				dashStyle: "Solid",
				boostThreshold: 5000,
				colorAxis: false,
				compare: "",
				gapSize: 0,
				getExtremesFromAll: false,
				showInNavigator: false,
				shadow: false,
				selected: false,
				data: sortedNonEALArray,
			},
		],
		tooltip: {
			enabled: true,
			useHTML: true,
			style: {
				zIndex: 1000,
				width: 200,
				display: "flex",
				color: "black",
			},
			formatter: function (e) {
				return `<div>
                       <div style="color: ${this.point.color}; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.key}</div>
                        <div>${this.series.name} - ${this.y} - ${((this.y / allPupils) * 100)?.toFixed(2)}%</div>
                    </div>`;
			},
		},
	};

	return (
		<div className="w-full h-full overflow-auto">
			<HighchartsReact
				key={uniqueId("bar")}
				highcharts={Highcharts}
				options={chartOptions}
			/>
		</div>
	);
};

export default PupilSummaryStackedBarChart;
