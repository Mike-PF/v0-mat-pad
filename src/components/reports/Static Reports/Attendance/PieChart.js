import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ chartData, title }) => {
	if (!chartData) return;

	const chartOptions = {
		legend: {
			layout: "horizontal",
			align: "center",
			verticalAlign: "bottom",
		},
		chart: {
			type: "pie",
			inverted: false,
			borderWidth: 0,
			style: {
				"font-family": "Source Sans Pro, sans-serif",
				"font-size": "1.2rem",
			},
			spacing: [0, 0, 0, 0],
			margin: [0, 0, 0, 0],
		},
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
		credits: {
			enabled: false,
		},
		tooltip: { enabled: false },
		exporting: {
			enabled: true,
		},
		plotOptions: {
			series: {
				borderRadius: 0,
				allowPointSelect: false,
				borderWidth: 0,
				size: "100%",
				innerSize: "50%",
				cursor: "pointer",
			},
		},
		series: [
			// {
			// 	type: "pie",
			// 	name: "Header",
			// 	data: [
			// 		{
			// 			name: "95%+",
			// 			color: "#5bde80",
			// 			y: 0,
			// 		},
			// 		{
			// 			name: "90%-95%",
			// 			color: "#5b9bf5",
			// 			y: 0,
			// 		},
			// 		{
			// 			name: "80-90%+",
			// 			color: "#7150bf",
			// 			y: 0,
			// 		},
			// 		{
			// 			name: "50-80%+",
			// 			color: "#b30089",
			// 			y: 0,
			// 		},
			// 		{
			// 			name: "<50%",
			// 			color: "#f79400",
			// 			y: 0,
			// 		},
			// 	],
			// 	size: 200,
			// 	showInLegend: true,
			// 	dataLabels: [
			// 		{
			// 			enabled: false,
			// 		},
			// 	],
			// },
			{
				type: "pie",
				name: "",
				borderWidth: 2,
				borderCoor: "#fff",
				data: chartData,
				size: 200,
				showInLegend: true,
				dataLabels: [
					{
						enabled: true,
						distance: 0,
						useHTML: true,
						format: "{point.percentage:.1f}%",
						style: {
							"font-family": "Source Sans Pro, sans-serif",
							"font-size": "1.2rem",
							fontWeight: "400",
							color: "#000000",
							textOutline: "#ffffff",
							strokeWidth: 4,
						},
					},
				],
			},
		],
		tooltip: {
			enabled: true,
			useHTML: true,
			style: {
				width: 200,
				display: "flex",
				color: "black",
			},
			formatter: function (e) {
				return `<div>${this.key}</div><div style="color: ${this.point.color}; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.y} pupils</div>`;
			},
		},
	};

	return (
		<HighchartsReact
			key={uniqueId("Pie")}
			highcharts={Highcharts}
			options={chartOptions}
		/>
	);
};

export default PieChart;
