import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PupilSummaryBarChart = ({ chartData, title }) => {
	if (!chartData) return;

	let allPupils = 0;

	chartData?.data?.map((d) => {
		const allDPupils = d?.y;
		allPupils = allPupils + allDPupils;
	});

	const MATChartDataSeries = chartData?.data?.map((n) => {
		return [title === "No. Of Pupils By Attendance Band" ? `${n?.name}%` : n?.name, n?.y];
	});

	const showLegend = title === "No. Of Pupils By Suspension Band";

	let colours = title === "No. Of Pupils By Attendance Band" ? "#64a0f5" : "#65e086";

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
			lineColor: "f0f2f4",
			tickInterval: 0,
			tickAmount: 0,
			endOnTick: false,
			startOnTick: false,
			gridLineColor: "#ffffff",
			lineColor: "#ffffff",
		},
		xAxis: {
			type: "category",
			reversed: false,
			lineColor: "f0f2f4",
			tickInterval: 0,
			tickAmount: 0,
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
				pointPadding: 0.1,
				groupPadding: 0.2,
				borderWidth: 0,
				borderColor: "#ffffff",
				borderRadius: 0,
			},
		},
		colors: [colours],
		series: [
			{
				name: "Number of suspensions",
				showInLegend: showLegend,
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
				borderWidth: "",
				colorAxis: false,
				compare: "",
				gapSize: 0,
				getExtremesFromAll: false,
				showInNavigator: false,
				shadow: false,
				selected: false,
				data: MATChartDataSeries,
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
		<div className="w-full h-full">
			<HighchartsReact
				key={uniqueId("bar")}
				highcharts={Highcharts}
				options={chartOptions}
			/>
		</div>
	);
};

export default PupilSummaryBarChart;
