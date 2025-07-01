import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import { uniqueId } from "lodash";
import { numericContent } from "../../../../common/Utility";

highchartsMore(Highcharts);

function hexToRgb(hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const getHeatBg = (val, national) => {
	const value = val;
	const minValue = national - 5;
	const maxValue = national + 5;

	if (!national) {
		return "#ffffff";
	}

	if (!value || value < national) {
		if (!value) {
			return "#ffffff";
		}
		if (value < minValue) {
			return "#2395A4";
		}
		const maxDifference = national - minValue;
		const minDifference = (value - minValue)?.toFixed(0);
		const difference = (minDifference / maxDifference)?.toFixed(0);

		const maxRGB = hexToRgb("#FFFFFF");
		const minRGB = hexToRgb("#2395A4");

		const redDifference = maxRGB.r - minRGB.r;
		const greenDifference = maxRGB.g - minRGB.g;
		const blueDifference = maxRGB.b - minRGB.b;

		const valueRed = minRGB.r + redDifference * difference;
		const valueGreen = minRGB.g + greenDifference * difference;
		const valueBlue = minRGB.b + blueDifference * difference;

		const hex = rgbToHex(valueRed, valueGreen, valueBlue);

		return `${hex}`;
	}
	if (value > national) {
		if (value > maxValue) {
			return "#F79400";
		}
		const maxDifference = maxValue - national;
		const minDifference = (value - national)?.toFixed(0);
		const difference = (minDifference / maxDifference)?.toFixed(0);

		const maxRGB = hexToRgb("#F79400");
		const minRGB = hexToRgb("#FFFFFF");

		const redDifference = maxRGB.r - minRGB.r;
		const greenDifference = maxRGB.g - minRGB.g;
		const blueDifference = maxRGB.b - minRGB.b;

		const valueRed = minRGB.r + redDifference * difference;
		const valueGreen = minRGB.g + greenDifference * difference;
		const valueBlue = minRGB.b + blueDifference * difference;

		const hex = rgbToHex(valueRed, valueGreen, valueBlue);

		return `${hex}`;
	}
};

const KS2Cohort = ({ title = "KS2 cohort context", tableData, year }) => {
	const matOptions = [
		tableData?.mat?.malePct,
		tableData?.mat?.senPct,
		tableData?.mat?.ehcpPct,
		tableData?.mat?.ealPct,
		tableData?.mat?.fsmPct,
		tableData?.mat?.fsm6Pct,
	];
	const nationalOptions = [
		tableData?.national?.male ?? 0,
		tableData?.national?.sen ?? 0,
		tableData?.national?.ehcp ?? 0,
		tableData?.national?.eal ?? 0,
		tableData?.national?.fsm ?? 0,
		tableData?.national?.fsm6 ?? 0,
	];

	const heatmap = () => {
		return (
			<div className="w-full grid grid-cols-3 h-fit">
				<div className="overflow-hidden grid grid-cols-1 h-5 items-center font-bold mb-3">% of pupils</div>
				<div className=" overflow-hidden grid grid-cols-1 h-5 items-center justify-center text-center font-bold">School ({year})</div>
				<div className=" overflow-hidden grid grid-cols-1 h-5 items-center justify-center text-center font-bold">National ({year})</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Boys</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.malePct, tableData?.national?.male)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.malePct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.male?.toFixed(0) ?? ""}</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">SEN Support</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.senPct, tableData?.national?.sen)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.senPct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.sen?.toFixed(0) ?? ""}</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">EHCP</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.ehcpPct, tableData?.national?.ehcp)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.ehcpPct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.ehcp?.toFixed(0) ?? ""}</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">EAL</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.ealPct, tableData?.national?.eal)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.ealPct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.eal?.toFixed(0) ?? ""}</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">FSM</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.fsmPct, tableData?.national?.fsm)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.fsmPct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.fsm?.toFixed(0) ?? ""}</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Disadvantaged</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.mat?.fsm6Pct, tableData?.national?.fsm6)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.mat?.fsm6Pct?.toFixed(0) ?? ""}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.national?.fsm6?.toFixed(0) ?? ""}</div>
				</div>
			</div>
		);
	};

	const chartOptions = {
		title: {
			enabled: false,
			text: "",
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
			polar: true,
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
				name: "MAT",
				data: matOptions,
				pointPlacement: "on",
			},
			{
				name: "National",
				data: nationalOptions,
				pointPlacement: "on",
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
			pointFormat: '<span style="color:{series.color}">{series.name}: <b>' + "{point.y:,.2f}</b><br/>",

			// formatter: function (e) {
			// 	return `<div>
			//            <div style="color: ${this.point.color}; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.x}</div>
			//             <div>${this.y}% - ${this.point?.labelName}</div>
			//         </div>`;
			// },
		},
		xAxis: {
			categories: ["Boys", "SEN Support", "EHCP", "EAL", "FSM", "FSM6"],
			tickmarkPlacement: "off",
			lineWidth: 0,
		},

		yAxis: {
			gridLineInterpolation: "polygon",
			lineWidth: 0,
			min: 0,
		},
		colors: ["#121051", "#2395A4"],
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
				marker: {
					enabled: false,
				},
			},
		},
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-3">
			<div className="mb-2 font-semibold">{title}</div>
			<div className="w-full h-full flex flex-col items-center justify-center">
				<div className="w-full h-80">
					<HighchartsReact
						key={uniqueId("Cohort context")}
						highcharts={Highcharts}
						options={chartOptions}
					/>
				</div>
				<div className="w-full flex flex-col gap-3">
					{heatmap()}
					<div>{tableData?.notes}</div>
				</div>
			</div>
		</div>
	);
};

export default KS2Cohort;
