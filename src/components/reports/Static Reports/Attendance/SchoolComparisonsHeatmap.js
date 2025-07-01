import React from "react";
import _, { uniqueId } from "lodash";
import { boolContent } from "../../../../common/Utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/pro-solid-svg-icons";
import { UncontrolledTooltip } from "reactstrap";

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

const getHeatBg = (absence, national) => {
	const value = absence;

	const minValue = national - national / 20;
	const maxValue = national + national / 20;

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
		const minDifference = (value - minValue)?.toFixed(1);
		const difference = (minDifference / maxDifference)?.toFixed(1);

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
		const minDifference = (value - national)?.toFixed(1);
		const difference = (minDifference / maxDifference)?.toFixed(1);

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
	} else return "#ffffff";
};

const getTrendHeatBG = (trend) => {
	const value = trend;

	const minValue = -5;
	const maxValue = 5;

	if (value === 0 || !value) {
		return "#ffffff";
	}

	if (value > 0) {
		if (value > maxValue) {
			return "#2395A4";
		}
		const maxDifference = 5;
		const minDifference = value;
		const difference = (minDifference / maxDifference)?.toFixed(1);

		const maxRGB = hexToRgb("#2395A4");
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
	if (value < 0) {
		if (value < minValue) {
			return "#F79400";
		}
		const maxDifference = 5;
		const minDifference = value * -1;
		const difference = (minDifference / maxDifference)?.toFixed(1);

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
	} else return "#ffffff";
};

const SchoolComparisonsHeatmap = ({ tableData, title }) => {
	if (!tableData) return;

	var groupBy = function (xs, key) {
		return xs?.reduce(function (rv, x) {
			(rv[x[key]] ??= []).push(x);
			return rv;
		}, {});
	};

	const schoolGrouped = groupBy(tableData?.trend?.phases, "urn");
	const flatSchoolGrouped = schoolGrouped && Object.values(schoolGrouped)?.flat();

	const schools = schoolGrouped && Object.values(schoolGrouped);

	let yearsArray = [];
	let cleanYearsArray = [];

	flatSchoolGrouped?.map((n) => {
		const yearMinus = n?.year - 2000;
		const yearString = `${yearMinus - 1}/${yearMinus}`;
		yearsArray.push(yearString);
	});

	flatSchoolGrouped?.map((n) => {
		cleanYearsArray.push(n?.year);
	});

	const years = [...new Set(yearsArray)].sort();
	const cleanYears = [...new Set(cleanYearsArray)].sort();

	const national = tableData?.national;
	const currentNational = national?.filter((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0]);
	const previousNational = national?.filter((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0]);
	const currentNationalPrimary = currentNational?.filter((y) => y.stage?.toLowerCase() === "primary");
	const previousNationalPrimary = previousNational?.filter((y) => y.stage?.toLowerCase() === "primary");
	const currentNationalSecondary = currentNational?.filter((y) => y.stage?.toLowerCase() === "secondary");
	const previousNationalSecondary = previousNational?.filter((y) => y.stage?.toLowerCase() === "secondary");

	const currentMATPrimary = tableData?.trend?.matphase?.filter(
		(y) => y.stage?.toLowerCase() === "primary" && y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0],
	);
	const previousMATPrimary = tableData?.trend?.matphase?.filter(
		(y) => y.stage?.toLowerCase() === "primary" && y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0],
	);

	const currentMATSecondary = tableData?.trend?.matphase?.filter(
		(y) => y.stage?.toLowerCase() === "secondary" && y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0],
	);
	const previousMATSecondary = tableData?.trend?.matphase?.filter(
		(y) => y.stage?.toLowerCase() === "secondary" && y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0],
	);

	const computeTrend = (curr, prev) => {
		if (prev == null || curr == null) return <td>&nbsp;</td>;
		if (isNaN(prev) || isNaN(curr)) return <td>&nbsp;</td>;
		return (
			<td
				style={{
					background: `${getTrendHeatBG(curr - prev)}`,
				}}>
				<div className="w-full h-full gap-2 flex justify-center items-center">{(curr - prev).toFixed(1)}</div>
			</td>
		);
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-3">
			<div
				id="title"
				className="mb-2 font-semibold h-6 text-ellipsis line-clamp-1">
				<UncontrolledTooltip
					target={"title"}
					autohide={true}
					placement={"bottom"}>
					{title}
				</UncontrolledTooltip>
				{title}
			</div>
			<table className="w-full text-center">
				<colgroup>
					<col />
					<col style={{ borderRight: "solid 10px white" }} />
					<col />
					<col />
					<col style={{ borderRight: "solid 10px white" }} />
					<col />
					<col />
					<col style={{ borderRight: "solid 10px white" }} />
					<col />
					<col />
					<col />
				</colgroup>
				<thead>
					<tr>
						<th colSpan="2" />
						<th colSpan="3">{years[years?.length - 2 > -1 ? years?.length - 2 : 0]}</th>
						<th colSpan="3">{years[years?.length - 1 > -1 ? years?.length - 1 : 0]}</th>
						<th colSpan="3">Trend</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td
							colSpan="2"
							className="text-left"
						/>
						<td className="items-center justify-center">Aut.</td>
						<td className="items-center justify-center">Spr. </td>
						<td className="items-center justify-center">Sum. </td>
						<td className="items-center justify-center">Aut. </td>
						<td className="items-center justify-center">Spr. </td>
						<td className="items-center justify-center">Sum. </td>
						<td className="items-center justify-center">Aut. </td>
						<td className="items-center justify-center">Spr. </td>
						<td className="items-center justify-center">Sum. </td>
					</tr>
					{(previousNationalPrimary?.find((n) => n?.period === "aut") !== undefined ||
						currentNationalPrimary?.find((n) => n?.period === "aut") !== undefined) && (
						<tr className="border-t border-black bg-slate-100">
							<td
								colSpan="2"
								className="text-left font-bold">
								National (primary)
							</td>
							<td className="items-center justify-center">
								{previousNationalPrimary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousNationalPrimary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousNationalPrimary?.find((n) => n?.period === "sum")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalPrimary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalPrimary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalPrimary?.find((n) => n?.period === "sum")?.attPct?.toFixed(1) ?? ""}
							</td>
							{computeTrend(
								currentNationalPrimary?.find((n) => n?.period === "aut")?.attPct,
								previousNationalPrimary?.find((n) => n?.period === "aut")?.attPct,
							)}
							{computeTrend(
								currentNationalPrimary?.find((n) => n?.period === "spr")?.attPct,
								previousNationalPrimary?.find((n) => n?.period === "spr")?.attPct,
							)}
							{computeTrend(
								currentNationalPrimary?.find((n) => n?.period === "sum")?.attPct,
								previousNationalPrimary?.find((n) => n?.period === "sum")?.attPct,
							)}
						</tr>
					)}
					{(previousMATPrimary?.find((n) => n?.period === "aut") !== undefined ||
						currentMATPrimary?.find((n) => n?.period === "aut") !== undefined) && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left font-bold">
								Primary
							</td>
							<td className="items-center justify-center">
								{previousMATPrimary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousMATPrimary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousMATPrimary?.find((n) => n?.period === "ytd")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATPrimary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATPrimary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATPrimary?.find((n) => n?.period === "ytd")?.attPct?.toFixed(1) ?? ""}
							</td>
							{computeTrend(
								currentMATPrimary?.find((n) => n?.period === "aut")?.attPct,
								previousMATPrimary?.find((n) => n?.period === "aut")?.attPct,
							)}
							{computeTrend(
								currentMATPrimary?.find((n) => n?.period === "spr")?.attPct,
								previousMATPrimary?.find((n) => n?.period === "spr")?.attPct,
							)}
							{computeTrend(
								currentMATPrimary?.find((n) => n?.period === "sum")?.attPct,
								previousMATPrimary?.find((n) => n?.period === "sum")?.attPct,
							)}
						</tr>
					)}
					{schools?.map((s) => {
						const primaryData = s?.filter((n) => n?.stage?.toLowerCase() === "primary");
						const autumnData = primaryData?.filter((n) => n?.period === "aut");
						const springData = primaryData?.filter((n) => n?.period === "spr");
						const summerData = primaryData?.filter((n) => n?.period === "ytd");

						if (primaryData?.length < 1) {
							return;
						}

						return (
							<tr
								key={uniqueId()}
								className="border-t border-black">
								<td
									colSpan="2"
									className="text-left">
									{s[0]?.name ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalPrimary?.find((n) => n?.period === "aut")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{autumnData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											springData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalPrimary?.find((n) => n?.period === "spr")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{springData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											summerData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalPrimary?.find((n) => n?.period === "sum")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{summerData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalPrimary?.find((n) => n?.period === "aut")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{autumnData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											springData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalPrimary?.find((n) => n?.period === "spr")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{springData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											summerData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalPrimary?.find((n) => n?.period === "sum")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{summerData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
							</tr>
						);
					})}
					{(previousNationalSecondary?.find((n) => n?.period === "aut") !== undefined ||
						currentNationalSecondary?.find((n) => n?.period === "aut") !== undefined) && (
						<tr className="border-t border-black bg-slate-100">
							<td
								colSpan="2"
								className="text-left font-bold">
								National (secondary)
							</td>
							<td className="items-center justify-center">
								{previousNationalSecondary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousNationalSecondary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousNationalSecondary?.find((n) => n?.period === "sum")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalSecondary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalSecondary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentNationalSecondary?.find((n) => n?.period === "sum")?.attPct?.toFixed(1) ?? ""}
							</td>
							{computeTrend(
								currentNationalSecondary?.find((n) => n?.period === "aut")?.attPct,
								previousNationalSecondary?.find((n) => n?.period === "aut")?.attPct,
							)}
							{computeTrend(
								currentNationalSecondary?.find((n) => n?.period === "spr")?.attPct,
								previousNationalSecondary?.find((n) => n?.period === "spr")?.attPct,
							)}
							{computeTrend(
								currentNationalSecondary?.find((n) => n?.period === "sum")?.attPct,
								previousNationalSecondary?.find((n) => n?.period === "sum")?.attPct,
							)}
						</tr>
					)}
					{(previousMATSecondary?.find((n) => n?.period === "aut") !== undefined ||
						currentMATSecondary?.find((n) => n?.period === "aut") !== undefined) && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left font-bold">
								Secondary
							</td>
							<td className="items-center justify-center">
								{previousMATSecondary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousMATSecondary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{previousMATSecondary?.find((n) => n?.period === "ytd")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATSecondary?.find((n) => n?.period === "aut")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATSecondary?.find((n) => n?.period === "spr")?.attPct?.toFixed(1) ?? ""}
							</td>
							<td className="items-center justify-center">
								{currentMATSecondary?.find((n) => n?.period === "ytd")?.attPct?.toFixed(1) ?? ""}
							</td>
							{computeTrend(
								currentMATSecondary?.find((n) => n?.period === "aut")?.attPct,
								previousMATSecondary?.find((n) => n?.period === "aut")?.attPct,
							)}
							{computeTrend(
								currentMATSecondary?.find((n) => n?.period === "spr")?.attPct,
								previousMATSecondary?.find((n) => n?.period === "spr")?.attPct,
							)}
							{computeTrend(
								currentMATSecondary?.find((n) => n?.period === "sum")?.attPct,
								previousMATSecondary?.find((n) => n?.period === "sum")?.attPct,
							)}
						</tr>
					)}
					{schools?.map((s) => {
						const secondaryData = s?.filter((n) => n?.stage?.toLowerCase() === "secondary");
						const autumnData = secondaryData?.filter((n) => n?.period === "aut");
						const springData = secondaryData?.filter((n) => n?.period === "spr");
						const summerData = secondaryData?.filter((n) => n?.period === "ytd");

						if (secondaryData?.length < 1) {
							return;
						}

						return (
							<tr className="border-t border-black">
								<td
									colSpan="2"
									className="text-left">
									{s[0]?.name ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalSecondary?.find((n) => n?.period === "aut")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{autumnData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											springData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalSecondary?.find((n) => n?.period === "spr")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{springData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											summerData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
												?.attPct,
											previousNationalSecondary?.find((n) => n?.period === "sum")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{summerData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalSecondary?.find((n) => n?.period === "aut")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{autumnData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											springData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalSecondary?.find((n) => n?.period === "spr")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{springData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>
								<td
									style={{
										background: `${getHeatBg(
											summerData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
												?.attPct,
											currentNationalSecondary?.find((n) => n?.period === "sum")?.attPct,
										)}`,
									}}
									className="items-center justify-center">
									{summerData
										?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])
										?.attPct?.toFixed(1) ?? ""}
								</td>

								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
								{computeTrend(
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 1 > -1 ? cleanYears?.length - 1 : 0])?.attPct,
									autumnData?.find((y) => y.year === cleanYears[cleanYears?.length - 2 > -1 ? cleanYears?.length - 2 : 0])?.attPct,
								)}
							</tr>
						);
					})}
					<tr className="border-t border-black">
						<td
							colSpan="2"
							className="text-left font-bold">
							Whole MAT
						</td>
						<td className="items-center justify-center">
							{(previousMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
								(previousMATSecondary?.find((n) => n?.period === "aut")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((previousMATPrimary?.find((n) => n?.period === "aut")?.present || 0) +
												(previousMATSecondary?.find((n) => n?.period === "aut")?.present || 0))) /
										((previousMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
											(previousMATSecondary?.find((n) => n?.period === "aut")?.possible || 0))
								  )?.toFixed(1)}
						</td>
						<td className="items-center justify-center">
							{(previousMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
								(previousMATSecondary?.find((n) => n?.period === "spr")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((previousMATPrimary?.find((n) => n?.period === "spr")?.present || 0) +
												(previousMATSecondary?.find((n) => n?.period === "spr")?.present || 0))) /
										((previousMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
											(previousMATSecondary?.find((n) => n?.period === "spr")?.possible || 0))
								  )?.toFixed(1)}
						</td>
						<td className="items-center justify-center">
							{(previousMATPrimary?.find((n) => n?.period === "ytd")?.possible || 0) +
								(previousMATSecondary?.find((n) => n?.period === "ytd")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((previousMATPrimary?.find((n) => n?.period === "ytd")?.present || 0) +
												(previousMATSecondary?.find((n) => n?.period === "ytd")?.present || 0))) /
										((previousMATPrimary?.find((n) => n?.period === "ytd")?.possible || 0) +
											(previousMATSecondary?.find((n) => n?.period === "ytd")?.possible || 0))
								  )?.toFixed(1)}
						</td>
						<td className="items-center justify-center">
							{(currentMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
								(currentMATSecondary?.find((n) => n?.period === "aut")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((currentMATPrimary?.find((n) => n?.period === "aut")?.present || 0) +
												(currentMATSecondary?.find((n) => n?.period === "aut")?.present || 0))) /
										((currentMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
											(currentMATSecondary?.find((n) => n?.period === "aut")?.possible || 0))
								  )?.toFixed(1)}
						</td>
						<td className="items-center justify-center">
							{(currentMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
								(currentMATSecondary?.find((n) => n?.period === "spr")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((currentMATPrimary?.find((n) => n?.period === "spr")?.present || 0) +
												(currentMATSecondary?.find((n) => n?.period === "spr")?.present || 0))) /
										((currentMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
											(currentMATSecondary?.find((n) => n?.period === "spr")?.possible || 0))
								  )?.toFixed(1)}
						</td>
						<td className="items-center justify-center">
							{(currentMATPrimary?.find((n) => n?.period === "ytd")?.possible || 0) +
								(currentMATSecondary?.find((n) => n?.period === "ytd")?.possible || 0) ===
							0
								? ""
								: (
										(100 *
											((currentMATPrimary?.find((n) => n?.period === "ytd")?.present || 0) +
												(currentMATSecondary?.find((n) => n?.period === "ytd")?.present || 0))) /
										((currentMATPrimary?.find((n) => n?.period === "ytd")?.possible || 0) +
											(currentMATSecondary?.find((n) => n?.period === "ytd")?.possible || 0))
								  )?.toFixed(1)}
						</td>

						{computeTrend(
							(100 *
								((currentMATPrimary?.find((n) => n?.period === "aut")?.present || 0) +
									(currentMATSecondary?.find((n) => n?.period === "aut")?.present || 0))) /
								((currentMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
									(currentMATSecondary?.find((n) => n?.period === "aut")?.possible || 0)),
							(100 *
								((previousMATPrimary?.find((n) => n?.period === "aut")?.present || 0) +
									(previousMATSecondary?.find((n) => n?.period === "aut")?.present || 0))) /
								((previousMATPrimary?.find((n) => n?.period === "aut")?.possible || 0) +
									(previousMATSecondary?.find((n) => n?.period === "aut")?.possible || 0)),
						)}
						{computeTrend(
							(100 *
								((currentMATPrimary?.find((n) => n?.period === "spr")?.present || 0) +
									(currentMATSecondary?.find((n) => n?.period === "spr")?.present || 0))) /
								((currentMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
									(currentMATSecondary?.find((n) => n?.period === "spr")?.possible || 0)),
							(100 *
								((previousMATPrimary?.find((n) => n?.period === "spr")?.present || 0) +
									(previousMATSecondary?.find((n) => n?.period === "spr")?.present || 0))) /
								((previousMATPrimary?.find((n) => n?.period === "spr")?.possible || 0) +
									(previousMATSecondary?.find((n) => n?.period === "spr")?.possible || 0)),
						)}
						{computeTrend(
							(100 *
								((currentMATPrimary?.find((n) => n?.period === "sum")?.present || 0) +
									(currentMATSecondary?.find((n) => n?.period === "sum")?.present || 0))) /
								((currentMATPrimary?.find((n) => n?.period === "sum")?.possible || 0) +
									(currentMATSecondary?.find((n) => n?.period === "sum")?.possible || 0)),
							(100 *
								((previousMATPrimary?.find((n) => n?.period === "sum")?.present || 0) +
									(previousMATSecondary?.find((n) => n?.period === "sum")?.present || 0))) /
								((previousMATPrimary?.find((n) => n?.period === "sum")?.possible || 0) +
									(previousMATSecondary?.find((n) => n?.period === "sum")?.possible || 0)),
						)}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default SchoolComparisonsHeatmap;
