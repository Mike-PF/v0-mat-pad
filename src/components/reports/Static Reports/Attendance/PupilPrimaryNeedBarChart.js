import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PupilPrimaryNeedBarChart = ({ chartData, title }) => {
	if (!chartData) return;

	let allPupils = 0;

	chartData?.data?.map((d) => {
		const allDPupils = d?.support + d?.ehcp + d?.none;
		allPupils = allPupils + allDPupils;
	});

	const sortedAll = _.orderBy(chartData?.data, (a) => {
		if (a?.name === "Unclassified") return Number.MIN_SAFE_INTEGER;
		return a?.support + a?.ehcp + a?.none;
	});

	const sortedSupportDataSeries = sortedAll?.map((n) => {
		return {
			y: n?.support,
			type: "SEN support",
			description: n?.description,
			name: n?.name,
			colour: "#64a0f5",
		};
	});

	const sortedEHCPDataSeries = sortedAll?.map((n) => {
		return {
			y: n?.ehcp,
			type: "EHCP",
			description: n?.description,
			name: n?.name,
			colour: "#121051",
		};
	});

	const sortedNoneDataSeries = sortedAll?.map((n) => {
		return {
			y: n?.none,
			type: "No support/EHCP",
			description: n?.description,
			name: n?.name,
			colour: "#121051",
		};
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
			tickInterval: 0,
			enabled: false,
			title: {
				enabled: false,
			},
			labels: {
				enabled: false,
			},
			endOnTick: false,
			startOnTick: false,
			gridLineColor: "#ffffff",
			lineColor: "#ffffff",
		},
		xAxis: {
			lineColor: "f0f2f4",
			tickInterval: 1,
			type: "category",
			reversed: false,
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
				stacking: "reverse",
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
				borderWidth: 2,
				borderColor: "#ffffff",
				borderRadius: 0,
			},
		},
		colors: ["#64a0f5", "#121051", "#fdbaa1"],
		series: [
			{
				name: "EHCP",
				id: "EHCP",
				// relatesTo: "SEN",
				showInLegend: true,
				lineWidth: 4,
				crisp: true,
				showCheckbox: false,
				marker: {
					enabled: false,
				},
				dataLabels: {
					style: {
						color: "#000000",
						fontWeight: "400",
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
				data: sortedEHCPDataSeries,
			},
			{
				name: "SEN support",
				id: "SEN",
				relatesTo: "EHCP",
				showInLegend: true,
				lineWidth: 4,
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
				enableMouseTracking: true,
				shadow: false,
				selected: false,
				data: sortedSupportDataSeries,
			},
			{
				name: "No Support/EHCP",
				id: "No Support/EHCP",
				relatesTo: "SEN",
				showInLegend: true,
				lineWidth: 4,
				crisp: true,
				showCheckbox: false,
				marker: {
					enabled: false,
				},
				dataLabels: {
					style: {
						color: "#000000",
						fontWeight: "400",
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
				data: sortedNoneDataSeries,
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

export default PupilPrimaryNeedBarChart;
