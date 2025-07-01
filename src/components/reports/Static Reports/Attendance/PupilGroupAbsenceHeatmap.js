import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/pro-solid-svg-icons";
import { boolContent } from "../../../../common/Utility";

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

const getHeatBg = (absence) => {
	const value = absence;

	if (!value || value < 20) {
		if (!value) {
			return "#ffffff";
		}
		if (value < 18) {
			return "#5d9af5";
		}
		const maxDifference = 20 - 18;
		const minDifference = (value - 18)?.toFixed(1);
		const difference = (minDifference / maxDifference)?.toFixed(1);

		const maxRGB = hexToRgb("#FFFFFF");
		const minRGB = hexToRgb("#5d9af5");

		const redDifference = maxRGB.r - minRGB.r;
		const greenDifference = maxRGB.g - minRGB.g;
		const blueDifference = maxRGB.b - minRGB.b;

		const valueRed = minRGB.r + redDifference * difference;
		const valueGreen = minRGB.g + greenDifference * difference;
		const valueBlue = minRGB.b + blueDifference * difference;

		const hex = rgbToHex(valueRed, valueGreen, valueBlue);

		return `${hex}`;
	}
	if (value > 20) {
		if (value > 38) {
			return "#F79400";
		}
		const maxDifference = 38 - 20;
		const minDifference = (value - 20)?.toFixed(1);
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
	}
};

const PupilGroupAbsenceHeatmap = ({ tableData, title }) => {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-3">
			<div className="mb-2 font-semibold">{title}</div>
			<div className="w-full grid grid-cols-10 h-fit">
				<div className="col-span-4 overflow-hidden grid grid-cols-1 h-16 items-center font-semibold mb-3">Pupil group</div>
				<div className="col-span-2 overflow-hidden grid grid-cols-1 h-16 items-center justify-center text-center font-semibold">
					No. of pupils
				</div>
				<div className="col-span-2 overflow-hidden grid grid-cols-1 h-16 items-center justify-center text-center font-semibold">PA YTD</div>
				<div className="col-span-2 overflow-hidden grid grid-cols-1 h-16 items-center justify-center text-center font-semibold">
					Change since YTD last year
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">All Pupils</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.pupils ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_pupils)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_pupils?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_pupils - tableData?.lastYear?.pct_pupils,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_pupils - tableData?.lastYear?.pct_pupils)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_pupils - tableData?.lastYear?.pct_pupils)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Girls</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.girls ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_girls)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_girls?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_girls - tableData?.lastYear?.pct_girls,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_girls - tableData?.lastYear?.pct_girls)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_girls - tableData?.lastYear?.pct_girls)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Boys</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.boys ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_boys)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_boys?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_boys - tableData?.lastYear?.pct_boys,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_boys - tableData?.lastYear?.pct_boys)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_boys - tableData?.lastYear?.pct_boys)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">SEN support</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.senK ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_senK)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_senK?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_senK - tableData?.lastYear?.pct_senK,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_senK - tableData?.lastYear?.pct_senK)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_senK - tableData?.lastYear?.pct_senK)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">EHCP</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.senE ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_senE)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_senE?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_senE - tableData?.lastYear?.pct_senE,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_senE - tableData?.lastYear?.pct_senE)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_senE - tableData?.lastYear?.pct_senE)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">No SEN</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.nosen ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_nosen)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_nosen?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_nosen - tableData?.lastYear?.pct_nosen,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_nosen - tableData?.lastYear?.pct_nosen)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_nosen - tableData?.lastYear?.pct_nosen)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">FSM</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.fsm ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_fsm)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_fsm?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_fsm - tableData?.lastYear?.pct_fsm,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_fsm - tableData?.lastYear?.pct_fsm)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_fsm - tableData?.lastYear?.pct_fsm)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Not FSM</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.nofsm ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_nofsm)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_nofsm?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_nofsm - tableData?.lastYear?.pct_nofsm,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_nofsm - tableData?.lastYear?.pct_nofsm)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_nofsm - tableData?.lastYear?.pct_nofsm)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">FSM6</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.fsm6 ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_fsm6)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_fsm6?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_fsm6 - tableData?.lastYear?.pct_fsm6,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_fsm6 - tableData?.lastYear?.pct_fsm6)?.toFixed(1) ?? ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Not FSM6</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.nofsm6 ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_nofsm6)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_nofsm6?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_nofsm6 - tableData?.lastYear?.pct_nofsm6,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_nofsm6 - tableData?.lastYear?.pct_nofsm6)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_nofsm6 - tableData?.lastYear?.pct_nofsm6)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">EAL</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.eal ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_eal)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_eal?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_eal - tableData?.lastYear?.pct_eal,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_eal - tableData?.lastYear?.pct_eal)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_eal - tableData?.lastYear?.pct_eal)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-4 grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1">Not EAL</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className="flex items-center justify-center">{tableData?.thisYear?.noeal ?? ""}</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(tableData?.thisYear?.pct_noeal)}`,
						}}
						className="flex items-center justify-center">
						{tableData?.thisYear?.pct_noeal?.toFixed(1) ?? ""}
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div className={"flex items-center justify-center"}>
						<div className="flex w-full items-center">
							<div className="w-4">
								{boolContent(
									tableData?.thisYear?.pct_noeal - tableData?.lastYear?.pct_noeal,
									<FontAwesomeIcon
										className="text-red-500 ml-2"
										icon={faArrowUp}
									/>,
									<FontAwesomeIcon
										className="text-green-500 ml-2"
										icon={faArrowDown}
									/>,
									<></>,
								)}
							</div>
							<div className="w-full items-center justify-center text-center">
								{(tableData?.thisYear?.pct_noeal - tableData?.lastYear?.pct_noeal)?.toFixed(1) !== "NaN"
									? (tableData?.thisYear?.pct_noeal - tableData?.lastYear?.pct_noeal)?.toFixed(1)
									: ""}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PupilGroupAbsenceHeatmap;
