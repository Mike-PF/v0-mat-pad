import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { UncontrolledTooltip } from "reactstrap";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const TermlyAttendanceLineChart = ({ chartData, primarySchoolName, secondarySchoolName, title }) => {
	if (!chartData) {
		return null;
	}

	const year = _.maxBy(chartData?.matphases || [], "year").year;

	if (_.isNil(year)) return <></>;

	const periods = [
		{ year: year - 1, period: "aut" },
		{ year: year - 1, period: "spr" },
		{ year: year - 1, period: "sum" },
		{ year: year, period: "aut" },
		{ year: year, period: "spr" },
		{ year: year, period: "sum" },
	];
	const seriesPrimary = [],
		seriesSecondary = [],
		seriesNATPrimary = [],
		seriesNATSecondary = [],
		categories = [],
		includesPrimary = _.find(chartData.matphases, (p) => p?.stage?.toLowerCase() === "primary") ? true : false,
		includesSecondary = _.find(chartData.matphases, (p) => p?.stage?.toLowerCase() === "secondary") ? true : false;
	let name = "Total";
	if (includesPrimary && !includesSecondary) name = "Primary";
	if (!includesPrimary && includesSecondary) name = "Secondary";

	_.forEach(periods, (period) => {
		let primary = _.find(
				chartData.matphases,
				(p) => p?.stage?.toLowerCase() === "primary" && p.year === period.year && p.period === period.period,
			),
			secondary = _.find(
				chartData.matphases,
				(p) => p?.stage?.toLowerCase() === "secondary" && p.year === period.year && p.period === period.period,
			);

		const primaryY = (primary?.possible || 0) === 0 ? null : 100 * ((primary?.present || 0) / (primary?.possible || 0)) || null;
		const secondaryY = (secondary?.possible || 0) === 0 ? null : 100 * ((secondary?.present || 0) / (secondary?.possible || 0)) || null;
		const natPrimaryY =
			_.find(chartData?.national, (n) => n.stage?.toLowerCase() === name.toLowerCase() && n.year === period.year && n.period === period.period)
				?.attPct || null;
		const natSecondaryY =
			_.find(chartData?.national, (n) => n.stage?.toLowerCase() === name.toLowerCase() && n.year === period.year && n.period === period.period)
				?.attPct || null;

		const cat = `${period.period[0].toUpperCase()}${period.period.substring(1)}<br/>${(period.year % 100) - 1}/${period.year % 100}`;

		seriesPrimary.push({ name: cat, y: primaryY, labelName: primarySchoolName, national: natPrimaryY });
		seriesSecondary.push({ name: cat, y: secondaryY, labelName: secondarySchoolName, national: natSecondaryY });
		seriesNATPrimary.push({ name: cat, y: natPrimaryY, labelName: "National (Primary)", mat: primaryY });
		seriesNATSecondary.push({ name: cat, y: natSecondaryY, labelName: "National (Secondary)", mat: secondaryY });
		categories.push(cat);
	});

	const primaryChartOptions = {
		title: {
			text: "",
			style: { fontSize: "1rem", fontWeight: "600" },
		},
		chart: {
			type: "line",
			style: { fontFamily: "Source Sans Pro, sans-serif" },
		},
		xAxis: {
			type: "category",
			categories: categories,
			labels: {
				useHTML: true,
				style: { whiteSpace: "normal", textAlign: "center" },
			},
		},
		yAxis: {
			title: { text: null },
			labels: {},
		},
		tooltip: {
			shared: false,
			useHTML: true,
			formatter: function () {
				const termLabel = this.point.name.replace("<br/>", " ");
				const schoolSeries = this.series.chart.series.find((s) => s.name === `${primarySchoolName} (Primary)`);
				const nationalSeries = this.series.chart.series.find((s) => s.name.startsWith("National (Primary)"));

				if (this.series.name === `National (Primary)`) {
					const national = this.point.y
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${nationalSeries?.color}; margin-right:4px;">
                            ${this.point.y?.toFixed(1)}%
                            </div>
                            <div>— ${nationalSeries?.name}</div>
                        </div>
                        `
						: "";
					const school = this.point.y
						? `
                        <div style="display:flex; font-size:10px;">
                            <div style="color:${schoolSeries?.color}; margin-right:4px;">
                            ${this.point?.mat?.toFixed(1)}%
                            </div>
                            <div>— ${schoolSeries?.name}</div>
                        </div>
                        `
						: "";
					return `
                        <div style="text-align:center; font-weight:600; margin-bottom:4px;">${termLabel}</div>
                        ${national}
                        ${school}
                    `;
				} else if (this.series.name === `${primarySchoolName} (Primary)`) {
					const national = this.point.national
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${nationalSeries?.color}; margin-right:4px;">
                            ${this.point.national?.toFixed(1)}%
                            </div>
                            <div>— ${nationalSeries?.name}</div>
                        </div>
                        `
						: "";
					const school = this.point.y
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${schoolSeries?.color}; margin-right:4px;">
                            ${this.point.y?.toFixed(1)}%
                            </div>
                            <div>— ${schoolSeries?.name}</div>
                        </div>
                        `
						: "";
					return `
                        <div style="text-align:center; font-weight:600; margin-bottom:4px;">${termLabel}</div>
                        ${national}
                        ${school}
                    `;
				}
			},
		},
		series: [
			{
				name: `National (Primary)`,
				data: seriesNATPrimary,
				color: "#121051",
				lineWidth: 2,
				marker: { symbol: "circle", radius: 4 },
			},
			{
				name: `${primarySchoolName} (Primary)`,
				data: seriesPrimary,
				color: "#2395A4",
				lineWidth: 2,
				marker: { symbol: "circle", radius: 4 },
			},
		],
		credits: { enabled: false },
		plotOptions: { series: { dataLabels: { enabled: false } } },
		responsive: { rules: [] },
	};

	const secondaryChartOptions = {
		title: {
			text: "",
			style: { fontSize: "1rem", fontWeight: "600" },
		},
		chart: {
			type: "line",
			style: { fontFamily: "Source Sans Pro, sans-serif" },
		},
		xAxis: {
			type: "category",
			categories: categories,
			labels: {
				useHTML: true,
				style: { whiteSpace: "normal", textAlign: "center" },
			},
		},
		yAxis: {
			title: { text: null },
			labels: {},
		},
		tooltip: {
			shared: false,
			useHTML: true,
			formatter: function () {
				const termLabel = this.point.name.replace("<br/>", " ");
				const schoolSeries = this.series.chart.series.find((s) => s.name === `${secondarySchoolName} (Secondary)`);
				const nationalSeries = this.series.chart.series.find((s) => s.name === "National (Secondary)");

				if (this.series.name === `National (Secondary)`) {
					const national = this.point.y
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${nationalSeries?.color}; margin-right:4px;">
                            ${this.point.y?.toFixed(1)}%
                            </div>
                            <div>— ${nationalSeries?.name}</div>
                        </div>
                        `
						: "";
					const school = this.point.y
						? `
                        <div style="display:flex; font-size:10px;">
                            <div style="color:${schoolSeries?.color}; margin-right:4px;">
                            ${this.point?.mat?.toFixed(1)}%
                            </div>
                            <div>— ${schoolSeries?.name}</div>
                        </div>
                        `
						: "";
					return `
                        <div style="text-align:center; font-weight:600; margin-bottom:4px;">${termLabel}</div>
                        ${national}
                        ${school}
                    `;
				} else if (this.series.name === `${secondarySchoolName} (Secondary)`) {
					const national = this.point.national
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${nationalSeries?.color}; margin-right:4px;">
                            ${this.point.national?.toFixed(1)}%
                            </div>
                            <div>— ${nationalSeries?.name}</div>
                        </div>
                        `
						: "";
					const school = this.point.y
						? `
                         <div style="display:flex; font-size:10px; margin-bottom:2px;">
                            <div style="color:${schoolSeries?.color}; margin-right:4px;">
                            ${this.point.y?.toFixed(1)}%
                            </div>
                            <div>— ${schoolSeries?.name}</div>
                        </div>
                        `
						: "";
					return `
                        <div style="text-align:center; font-weight:600; margin-bottom:4px;">${termLabel}</div>
                        ${national}
                        ${school}
                    `;
				}
			},
		},
		series: [
			{
				name: `National (Secondary)`,
				data: seriesNATSecondary,
				color: "#121051",
				lineWidth: 2,
				marker: { symbol: "circle", radius: 4 },
			},
			{
				name: `${secondarySchoolName} (Secondary)`,
				data: seriesSecondary,
				color: "#2395A4",
				lineWidth: 2,
				marker: { symbol: "circle", radius: 4 },
			},
		],
		credits: { enabled: false },
		plotOptions: { series: { dataLabels: { enabled: false } } },
		responsive: { rules: [] },
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full flex items-center justify-center">
				<div
					id="graphTitle"
					className="mb-1 font-semibold text-left h-6 text-ellipsis line-clamp-1">
					{title}
					<UncontrolledTooltip
						target={"graphTitle"}
						autohide={true}
						placement={"top"}>
						{title}
					</UncontrolledTooltip>
				</div>
			</div>
			<div className="w-full h-full flex flex-wrap">
				{includesPrimary && (
					<div className={classNames(includesSecondary ? "w-1/2" : "w-full", " h-80")}>
						<HighchartsReact
							key={uniqueId("TermlyLine")}
							highcharts={Highcharts}
							options={primaryChartOptions}
						/>
					</div>
				)}
				{includesSecondary && (
					<div className={classNames(includesPrimary ? "w-1/2" : "w-full", " h-80")}>
						<HighchartsReact
							key={uniqueId("TermlyLine")}
							highcharts={Highcharts}
							options={secondaryChartOptions}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default TermlyAttendanceLineChart;
