import _ from "lodash";
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

const TeamlyAttendanceTable = ({ tableData, primarySchoolNames, secondarySchoolNames }) => {
	if (!tableData) return null;

	var groupBy = function (xs, key) {
		return xs?.reduce(function (rv, x) {
			(rv[x[key]] ??= []).push(x);
			return rv;
		}, {});
	};

	const schoolGrouped = groupBy(tableData?.phases, "urn");
	const flatSchoolGrouped = schoolGrouped && Object.values(schoolGrouped)?.flat();

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

	const nationalPrimary = tableData?.national?.filter((item) => item?.stage?.toLowerCase() === "primary");
	const nationalSecondary = tableData?.national?.filter((item) => item?.stage?.toLowerCase() === "secondary");

	//NATIONAL PRIMARY
	const natYears = Array.from(new Set(nationalPrimary?.map((item) => item?.year))).sort();

	function getNatPct(year, period) {
		const rec = nationalPrimary?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//PRIMARY MAT
	const matPrimary = tableData?.matphases?.filter((item) => item?.stage?.toLowerCase() === "primary");
	//prim helper
	function getMatPrimaryPct(year, period) {
		const rec = matPrimary?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//Secondary Mat
	const matSecondary = tableData?.matphases?.filter((item) => item?.stage?.toLowerCase() === "secondary");
	//secdnary helper
	function getMatSecPct(year, period) {
		const rec = matSecondary?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}
	//NATIONAL SECONDARY
	function getSecPct(year, period) {
		const rec = nationalSecondary?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	function getMatPct(year, period) {
		const recPrimary = matPrimary?.find((item) => item?.year === year && item?.period === period),
			recSecondary = matSecondary?.find((item) => item?.year === year && item?.period === period);

		if ((recPrimary?.possible || 0) + (recSecondary?.possible || 0) === 0) return null;

		return (100 * ((recPrimary?.present || 0) + (recSecondary?.present || 0))) / ((recPrimary?.possible || 0) + (recSecondary?.possible || 0));
	}

	//ks1
	const ks1MatStages = tableData?.matstages?.filter((item) => item?.stage === "KS1");

	function getKS1Pct(year, period) {
		const rec = ks1MatStages?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//ks2
	const ks2MatStages = tableData?.matstages?.filter((item) => item?.stage?.toLowerCase() === "ks2");
	function getKS2Pct(year, period) {
		const rec = ks2MatStages?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//ks3
	const ks3MatStages = tableData?.matstages?.filter((item) => item?.stage?.toLowerCase() === "ks3");
	function getKS3Pct(year, period) {
		const rec = ks3MatStages?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//ks4
	const ks4MatStages = tableData?.matstages?.filter((item) => item?.stage?.toLowerCase() === "ks4");
	function getKS4Pct(year, period) {
		const rec = ks4MatStages?.find((item) => item?.year === year && item?.period === period);
		return rec?.attPct ?? null;
	}

	//Helper Function
	const computeTrend = (getter, period) => {
		const prev = getter(natYears[1], period);
		const curr = getter(natYears[2], period);
		if (prev == null || curr == null) return <td>&nbsp;</td>;
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
		<div className="h-full w-full flex flex-col items-start justify-center p-3">
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
						<th colSpan="3">{years[years?.length - 1 > -2 ? years?.length - 2 : 0]}</th>
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
						<td className="min-w-12 items-center justify-center">Aut.</td>
						<td className="min-w-12 items-center justify-center">Spr. </td>
						<td className="min-w-12 items-center justify-center">Sum. </td>
						<td className="min-w-12 items-center justify-center">Aut. </td>
						<td className="min-w-12 items-center justify-center">Spr. </td>
						<td className="min-w-12 items-center justify-center">Sum. </td>
						<td className="min-w-12 items-center justify-center">Aut. </td>
						<td className="min-w-12 items-center justify-center">Spr. </td>
						<td className="min-w-12 items-center justify-center">Sum. </td>
					</tr>

					{(getKS1Pct(natYears[1], "aut") !== null || getKS2Pct(natYears[1], "aut") !== null) && (
						<tr className="border-t border-black bg-slate-100">
							<td
								colSpan="2"
								className="text-left font-bold">
								National (primary)
							</td>

							{/* 23/24:*/}
							<td className="min-w-12 items-center">{getNatPct(natYears[1], "aut")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getNatPct(natYears[1], "spr")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getNatPct(natYears[1], "sum")?.toFixed(1) ?? ""}</td>

							{/* 24/25: */}
							<td className="min-w-12 items-center">{getNatPct(natYears[2], "aut")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getNatPct(natYears[2], "spr")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getNatPct(natYears[2], "sum")?.toFixed(1) ?? ""}</td>
							{computeTrend(getNatPct, "aut")}
							{computeTrend(getNatPct, "spr")}
							{computeTrend(getNatPct, "sum")}
						</tr>
					)}
					{(getKS1Pct(natYears[1], "aut") !== null || getKS2Pct(natYears[1], "aut") !== null) && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left font-bold">
								<div
									id="primary"
									className="h-6 text-ellipsis line-clamp-1">
									{primarySchoolNames ? primarySchoolNames : "Primary (MAT)"}
									{primarySchoolNames && (
										<UncontrolledTooltip
											target={"primary"}
											autohide={true}
											placement={"top"}>
											{primarySchoolNames}
										</UncontrolledTooltip>
									)}
								</div>
							</td>

							{/* 23/24:*/}
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[1], "aut"), getNatPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[1], "spr"), getNatPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[1], "sum"), getNatPct(natYears[1], "sum"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25:*/}
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[2], "aut"), getNatPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[2], "spr"), getNatPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatPrimaryPct(natYears[2], "sum"), getNatPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getMatPrimaryPct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends */}
							{computeTrend(getMatPrimaryPct, "aut")}
							{computeTrend(getMatPrimaryPct, "spr")}
							{computeTrend(getMatPrimaryPct, "sum")}
						</tr>
					)}

					{getKS1Pct(natYears[1], "aut") !== null && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left pl-4">
								KS1
							</td>

							{/* 23/24 */}
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[1], "aut"), getNatPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[1], "spr"), getNatPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[1], "sum"), getNatPct(natYears[1], "sum"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25*/}
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[2], "aut"), getNatPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[2], "spr"), getNatPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS1Pct(natYears[2], "sum"), getNatPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getKS1Pct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends */}
							{computeTrend(getKS1Pct, "aut")}
							{computeTrend(getKS1Pct, "spr")}
							{computeTrend(getKS1Pct, "sum")}
						</tr>
					)}

					{getKS2Pct(natYears[1], "aut") !== null && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left pl-4">
								KS2
							</td>

							{/* 23/24:*/}
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[1], "aut"), getNatPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[1], "spr"), getNatPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[1], "sum"), getNatPct(natYears[1], "sum"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25:*/}
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[2], "aut"), getNatPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[2], "spr"), getNatPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS2Pct(natYears[2], "sum"), getNatPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getKS2Pct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends */}
							{computeTrend(getKS2Pct, "aut")}
							{computeTrend(getKS2Pct, "spr")}
							{computeTrend(getKS2Pct, "sum")}
						</tr>
					)}

					{(getKS3Pct(natYears[1], "aut") !== null || getKS4Pct(natYears[1], "aut") !== null) && (
						<tr className="border-t border-black bg-slate-100">
							<td
								colSpan="2"
								className="text-left font-bold">
								National (secondary)
							</td>

							{/* 23/24:*/}
							<td className="min-w-12 items-center">{getSecPct(natYears[1], "aut")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getSecPct(natYears[1], "spr")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getSecPct(natYears[1], "sum")?.toFixed(1) ?? ""}</td>

							{/* 24/25*/}
							<td className="min-w-12 items-center">{getSecPct(natYears[2], "aut")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getSecPct(natYears[2], "spr")?.toFixed(1) ?? ""}</td>
							<td className="min-w-12 items-center">{getSecPct(natYears[2], "sum")?.toFixed(1) ?? ""}</td>

							{/* Trends */}
							{computeTrend(getSecPct, "aut")}
							{computeTrend(getSecPct, "spr")}
							{computeTrend(getSecPct, "sum")}
						</tr>
					)}
					{(getKS3Pct(natYears[1], "aut") !== null || getKS4Pct(natYears[1], "aut") !== null) && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left font-bold">
								<div
									id={"secondary"}
									className="h-6 text-ellipsis line-clamp-1">
									{secondarySchoolNames ? secondarySchoolNames : "Secondary (MAT)"}
									{secondarySchoolNames && (
										<UncontrolledTooltip
											target={"secondary"}
											autohide={true}
											placement={"top"}>
											{secondarySchoolNames}
										</UncontrolledTooltip>
									)}
								</div>
							</td>

							{/* 23/24:*/}
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[1], "aut"), getSecPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[1], "spr"), getSecPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[1], "sum"), getSecPct(natYears[1], "sum"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25:*/}
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[2], "aut"), getSecPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[2], "spr"), getSecPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getMatSecPct(natYears[2], "sum"), getSecPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getMatSecPct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends:  */}
							{computeTrend(getMatSecPct, "aut")}
							{computeTrend(getMatSecPct, "spr")}
							{computeTrend(getMatSecPct, "sum")}
						</tr>
					)}
					{getKS3Pct(natYears[1], "aut") !== null && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left pl-4">
								KS3
							</td>

							{/* 23/24:*/}
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[1], "aut"), getSecPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[1], "spr"), getSecPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[1], "spr"), getSecPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25:*/}
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[2], "aut"), getSecPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[2], "spr"), getSecPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS3Pct(natYears[2], "sum"), getSecPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getKS3Pct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends */}
							{computeTrend(getKS3Pct, "aut")}
							{computeTrend(getKS3Pct, "spr")}
							{computeTrend(getKS3Pct, "sum")}
						</tr>
					)}

					{getKS4Pct(natYears[1], "aut") !== null && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left pl-4">
								KS4
							</td>

							{/* 23/24:*/}
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[1], "aut"), getSecPct(natYears[1], "aut"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[1], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[1], "spr"), getSecPct(natYears[1], "spr"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[1], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[1], "sum"), getSecPct(natYears[1], "sum"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[1], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* 24/25:*/}
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[2], "aut"), getSecPct(natYears[2], "aut"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[2], "aut")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[2], "spr"), getSecPct(natYears[2], "spr"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[2], "spr")?.toFixed(1) ?? ""}
							</td>
							<td
								style={{
									background: `${getHeatBg(getKS4Pct(natYears[2], "sum"), getSecPct(natYears[2], "sum"))}`,
								}}
								className="items-center">
								{getKS4Pct(natYears[2], "sum")?.toFixed(1) ?? ""}
							</td>

							{/* Trends */}

							{computeTrend(getKS4Pct, "aut")}
							{computeTrend(getKS4Pct, "spr")}
							{computeTrend(getKS4Pct, "sum")}
						</tr>
					)}

					{!primarySchoolNames && !secondarySchoolNames && (
						<tr className="border-t border-black">
							<td
								colSpan="2"
								className="text-left font-bold">
								Whole MAT
							</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[1], "aut")?.toFixed(1)}</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[1], "spr")?.toFixed(1)}</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[1], "sum")?.toFixed(1)}</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[2], "aut")?.toFixed(1)}</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[2], "spr")?.toFixed(1)}</td>
							<td className="min-w-12 items-center justify-center">{getMatPct(natYears[2], "sum")?.toFixed(1)}</td>

							{computeTrend(getMatPct, "aut")}
							{computeTrend(getMatPct, "spr")}
							{computeTrend(getMatPct, "sum")}
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TeamlyAttendanceTable;
