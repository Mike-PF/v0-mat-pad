import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const FSMBarChart = ({ chartData, title }) => {
	if (!chartData) return;

	const FSMDataSeries = [
		["FSM", chartData?.fsm],
		["FSM6", chartData?.fsm6],
	];

	const NonFSMDataSeries = [
		["FSM", chartData?.pupils - chartData?.fsm],
		["FSM6", chartData?.pupils - chartData?.fsm6],
	];

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
			type: "column",
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
			tickInterval: 0,
			tickAmount: 0,
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
						"font-size": "1.5rem",
						textOutline: null,
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
					},
				},
				pointPadding: 0.05,
				groupPadding: 0.2,
				borderWidth: 2,
				borderColor: "#ffffff",
				borderRadius: 0,
			},
		},
		colors: ["#ff9e85", "#f85e63"],
		series: [
			{
				name: "Yes",
				id: "EAL",
				showInLegend: true,
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				dataLabels: {
					style: {
						fontWeight: "400",
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
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
				data: FSMDataSeries,
			},
			{
				name: "No",
				relatesTo: "EAL",
				showInLegend: true,
				lineWidth: 2,
				allowPointSelect: false,
				crisp: true,
				showCheckbox: false,
				enableMouseTracking: true,
				dataLabels: {
					style: {
						fontWeight: "400",
						color: "#000000",
						textOutline: "#ffffff",
						strokeWidth: 4,
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
				data: NonFSMDataSeries,
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
                        <div>${this.series.name} - ${this.y} - ${((this.y / chartData?.pupils) * 100)?.toFixed(2)}%</div>
                    </div>`;
			},
		},
	};

	return (
		<div className="w-full h-full">
			<HighchartsReact
				key={uniqueId("bar")}
				highcharts={Highcharts}
				options={chartOptions}
			/>
		</div>
	);
};

export default FSMBarChart;
