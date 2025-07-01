import _ from "lodash";
import { useState } from "react";
import { DropDownSelect } from "../../../controls/DropDownSelect";
import { numericContent } from "../../../../common/Utility";

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

	if (val === national) {
		return "#fee883";
	}

	if (!value || value < national) {
		if (!value) {
			return "#ffffff";
		}
		if (value < minValue) {
			return "#f8696b";
		}
		const maxDifference = national - minValue;
		const minDifference = value - minValue;
		const difference = minDifference / maxDifference;

		const maxRGB = hexToRgb("#fee883");
		const minRGB = hexToRgb("#f8696b");

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
			return "#6ec27c";
		}
		const maxDifference = maxValue - national;
		const minDifference = value - national;
		const difference = minDifference / maxDifference;

		const maxRGB = hexToRgb("#6ec27c");
		const minRGB = hexToRgb("#fee883");

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

const KS2RWMHeatmap = ({ tableData, year, previousYear, name }) => {
	const [selectedType, setSelectedType] = useState({
		id: "rwm",
		name: "RWM",
	});
	console.log(tableData);

	return (
		<div className="h-full w-full flex flex-col items-center justify-center px-3">
			<div className="w-full flex justify-between items-center">
				<div className="mb-2 font-semibold w-full">{`${selectedType?.name} trends`}</div>
				<DropDownSelect
					key={"rwm-sel"}
					multiSelect={false}
					valueField={"id"}
					textField={"name"}
					placeholder={"Select type"}
					selectedField={"start"}
					id="rwm-sel"
					onChange={(value) => setSelectedType(value?.value)}
					value={selectedType}
					items={[
						{
							id: "rwm",
							name: "RWM",
							start: true,
						},
						{
							id: "reading",
							name: "Reading",
						},
						{
							id: "writing",
							name: "Writing",
						},
						{
							id: "maths",
							name: "Maths",
						},
						{
							id: "gps",
							name: "GPS",
						},
					]}
				/>
			</div>
			<div className="w-full grid grid-cols-5 h-fit">
				<div className="overflow-hidden grid grid-cols-1 items-center font-semibold">Pupil group</div>
				<div className=" overflow-hidden grid grid-cols-1 items-center justify-center text-center font-semibold">No. of pupils</div>
				<div className=" overflow-hidden grid grid-cols-1 items-center justify-center text-center font-semibold">
					<div>
						<div className="h-12 overflow-clip">{name}</div>
						<div>{year}</div>
					</div>
				</div>
				<div className=" overflow-hidden grid grid-cols-1 items-center justify-center text-center font-semibold">National</div>
				<div className=" overflow-hidden grid grid-cols-1 items-center justify-center text-center font-semibold">
					<div>
						<div className="h-12 overflow-clip">{name}</div>
						<div>change since ({previousYear})</div>
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold bg-gray-100">
					<div className="pl-1 overflow-clip">All Pupils</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.pupils, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.pupils / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.pupils,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.pupils / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.pupils, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.pupils / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.pupils,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.pupils / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.pupils / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">Girls</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.female, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.female / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.female,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.female / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.female, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.female / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.female,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.female / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.female / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">Boys</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.male, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.male / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.male,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.male / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.male, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.male / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.male,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.male / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.male / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">SEN support</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.thisYear?.sen, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.sen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.sen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.sen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.national?.sen, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.sen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.sen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.sen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.sen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">EHCP</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.ehcp, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.ehcp / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.ehcp,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.ehcp / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.ehcp, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.ehcp / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.ehcp,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.ehcp / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.ehcp / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">All SEN</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.allsen, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.allsen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.allsen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.allsen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.allsen, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.allsen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.allsen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.allsen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.allsen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">No SEN</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.nosen, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.nosen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nosen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nosen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.nosen, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.nosen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nosen,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nosen / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.nosen / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">FSM</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.thisYear?.fsm, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.fsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.fsm,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.fsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.national?.fsm, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.fsm / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.fsm,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.fsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.fsm / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">not FSM</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.nofsm, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.nofsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nofsm,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nofsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.nofsm, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.nofsm / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nofsm,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nofsm / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.nofsm / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">Disadvantaged</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.thisYear?.dis, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.dis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.dis,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.dis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.national?.dis, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.dis / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.dis,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.dis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.dis / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">not disadvantaged</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.nodis, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.nodis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nodis,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nodis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.nodis, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.nodis / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.nodis,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.nodis / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.nodis / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center font-semibold">
					<div className="pl-1 overflow-clip">EAL</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.thisYear?.eal, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.eal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.eal,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.eal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center  text-center font-semibold">
					<div className="flex h-full items-center justify-center">{numericContent(tableData[selectedType?.id]?.national?.eal, 0, "")}</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.eal / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.eal,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.eal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.eal / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-h-6 items-center bg-gray-100 font-semibold">
					<div className="pl-1 overflow-clip">not EAL</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.thisYear?.noeal, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.thisYear?.noeal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.noeal,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.noeal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center bg-gray-100 text-center font-semibold">
					<div className="flex h-full items-center justify-center">
						{numericContent(tableData[selectedType?.id]?.national?.noeal, 0, "")}
					</div>
				</div>
				<div className=" grid grid-cols-1 min-h-6 items-center justify-center text-center font-semibold">
					<div
						style={{
							background: `${getHeatBg(
								(tableData[selectedType?.id]?.lastYear?.noeal / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
								tableData[selectedType?.id]?.national?.noeal,
							)}`,
						}}
						className="flex h-full items-center justify-center">
						{numericContent(
							(tableData[selectedType?.id]?.thisYear?.noeal / tableData[selectedType?.id]?.thisYear?.totalPupils) * 100 -
								(tableData[selectedType?.id]?.lastYear?.noeal / tableData[selectedType?.id]?.lastYear?.totalPupils) * 100,
							0,
							"",
						)}
					</div>
				</div>
			</div>
			<div className="w-full mt-3">{tableData?.notes}</div>
		</div>
	);
};

export default KS2RWMHeatmap;
