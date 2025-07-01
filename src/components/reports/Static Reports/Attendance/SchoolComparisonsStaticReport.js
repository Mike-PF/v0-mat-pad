import React, { useEffect, useState } from "react";
import _ from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";
import SchoolComparisonsHeatmap from "./SchoolComparisonsHeatmap";
import { FindSchoolFilter, GetDashboardFilterList, GetSchoolFilterPhase } from "../../Elements/Common";

const SchoolComparisonsStaticReport = ({ panelData, filterValues, filters, isCustomDashboard }) => {
	const { userDetail } = useMatpadContext();

	const schoolFilter = FindSchoolFilter(filterValues, GetDashboardFilterList(filters, isCustomDashboard));
	const { phaseName } = GetSchoolFilterPhase(schoolFilter, filterValues);
	const name = panelData?.info?.name || schoolFilter?.value?.text || phaseName;
	const logoValue = schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;
	const charFilter = filters?.filter((f) => {
		return f?.param === "characteristics";
	});
	const charFilterValue = filterValues?.filter((f) => {
		return f?.filterID === charFilter[0]?.id;
	});

	let charsApplied = "";

	charFilterValue[0]?.value?.map((cfv) => {
		if (charsApplied.length === 0) {
			charsApplied = cfv?.text;
		} else {
			charsApplied = charsApplied?.concat(`, ${cfv?.text}`);
		}
		return;
	});

	const [notes, setNotes] = useState(false);

	useEffect(() => {
		if (!panelData) return;

		setNotes(panelData?.notes?.table1 ?? "");
	}, [panelData]);

	const notesDiv = document.getElementById("notesDiv");

	if (notesDiv) {
		notesDiv.innerHTML = notes;
	}

	if (!panelData || panelData.loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="w-full h-full">
			<div className="flex w-full items-center gap-x-4 mb-2">
				{logoValue && (
					<div className="flex items-center justify-center w-[80px] h-[80px]">
						<img
							className="max-w-[80px] max-h-[80px]"
							src={`api/image/${logoValue}/logo?width=80&height=80`}
						/>
					</div>
				)}
				<div className="flex items-center justify-between w-full h-[80px]">
					<div className="flex w-1/2 justify-between items-center text-2xl text-slate-900 font-semibold">
						<span>{name}</span>
					</div>
					<div className="flex h-full items-center w-1/2 justify-end text-2xl text-slate-900 font-semibold">
						<span className="text-lg font-medium">National data is for all pupils</span>
					</div>
				</div>
			</div>
			<div className="w-full">
				<div className="grid grid-cols-3">
					<div className="col-span-3 lg:col-span-2">
						<SchoolComparisonsHeatmap
							tableData={panelData}
							title={`Termly attendance trends by school ${charsApplied && `(${charsApplied})`}`}
						/>
					</div>
					<div className="col-span-3 lg:col-span-1">
						<div className="flex justify-end h-full w-full flex-col">
							<div className="text-primary-500">
								<div
									key="notesDiv"
									id="notesDiv"
									className="w-full"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SchoolComparisonsStaticReport;
