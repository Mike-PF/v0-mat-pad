import { useEffect, useState } from "react";
import { uniqueId } from "lodash";
import { DropDownSelect } from "../../../controls/DropDownSelect";

const KS2MATAverageChart = ({ chartData, title, name }) => {
	const [showAllSchools, setShowAllSchools] = useState(false);
	const [selectedType, setSelectedType] = useState({
		id: "rwm",
		name: "RWM",
	});
	const [largestValue, setLargestValue] = useState(0);
	const [schoolsAbove, setSchoolsAbove] = useState([]);
	const [schoolsBelow, setSchoolsBelow] = useState([]);

	useEffect(() => {
		if (!selectedType) return;
		if (chartData?.schools) {
			const largestSchoolValue = Math.max(...chartData?.schools?.map((o) => o[selectedType?.id]));
			const schoolsAboveMat = chartData?.schools?.filter((s) => {
				return s[selectedType?.id] > chartData?.mat[selectedType?.id];
			});
			const schoolsBelowMat = chartData?.schools?.filter((s) => {
				return s[selectedType?.id] <= chartData?.mat[selectedType?.id];
			});

			setLargestValue(Math.max(largestSchoolValue, chartData?.mat[selectedType?.id]));
			setSchoolsAbove(schoolsAboveMat?.sort((a, b) => b[selectedType?.id] - a[selectedType?.id]));
			setSchoolsBelow(schoolsBelowMat?.sort((a, b) => b[selectedType?.id] - a[selectedType?.id]));
		}
	}, [selectedType, chartData]);

	if (!chartData?.schools) return;

	const getWidth = (value) => {
		const percentage = ((value / largestValue) * 100)?.toFixed();

		return isNaN(percentage) ? "0%" : `${percentage}%`;
	};

	return (
		<div className="w-full h-full mt-4 overflow-auto">
			<div className="flex items-center flex-col justify-center">
				<div className="font-semibold w-full flex text-center items-center justify-center mb-4">{title}</div>
				<div className="mb-2 flex justify-end items-center  w-full px-4">
					<div className="flex items -center justify-center gap-2">
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
						<button
							className="px-2 border-none hover:underline text-primary-500"
							onClick={() => setShowAllSchools(!showAllSchools)}>
							{showAllSchools ? "Hide schools" : "Show all schools"}
						</button>
					</div>
				</div>
				{schoolsAbove.map((e) => {
					const widthValue = e[selectedType?.id];
					return (
						<div
							className="w-full flex flex-col items-start grid-cols-5 px-6"
							key={uniqueId(e?.urn)}>
							<div className="my-1 flex justify-end mr-2">{e?.name ?? e?.urn}</div>
							<div className="w-full my-1 pr-10 flex items-center gap-x-2">
								<div
									style={{
										width: `${getWidth(widthValue)}`,
									}}
									className={"h-4 bg-[#f7555a]"}
								/>
								<div className="">{e[selectedType?.id]?.toFixed(0)}</div>
							</div>
						</div>
					);
				})}
				{chartData?.mat && (
					<div className="w-full flex flex-col items-start grid-cols-5 px-6">
						<div className="my-1 flex justify-end mr-2">{name}</div>
						<div className="w-full my-1 pr-10 flex items-center gap-x-2">
							<div
								style={{
									width: `${getWidth(chartData?.mat[selectedType?.id]?.toFixed(0))}`,
								}}
								className={"h-4 bg-[#2395a4]"}
							/>
							<div className="">{chartData?.mat[selectedType?.id]?.toFixed(0)}</div>
						</div>
					</div>
				)}
				{showAllSchools &&
					schoolsBelow.map((e) => {
						const widthValue = e[selectedType?.id];

						return (
							<div
								className="w-full flex flex-col items-start grid-cols-5 px-6"
								key={uniqueId(e?.urn)}>
								<div className="my-1 flex justify-end mr-2">{e?.name ?? e?.urn}</div>
								<div className="w-full my-1 pr-10 flex items-center gap-x-2">
									<div
										style={{
											width: `${getWidth(widthValue)}`,
										}}
										className={"h-4 bg-[#74b4ff]"}
									/>
									<div className="">{e[selectedType?.id]?.toFixed(0)}</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default KS2MATAverageChart;
