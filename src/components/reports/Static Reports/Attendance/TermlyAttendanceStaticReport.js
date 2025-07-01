import React, { useEffect, useState } from "react";
import _ from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";
import TermlyAttendanceLineChart from "./TermlyAttendanceLineChart";
import TeamlyAttendanceTable from "./TermlyAttendanceTable";
import { FindSchoolFilter, GetDashboardFilterList, GetSchoolFilterPhase } from "../../Elements/Common";
import { UncontrolledTooltip } from "reactstrap";

const TermlyAttendanceStaticReport = ({ panelData, filterValues, filters, isCustomDashboard }) => {
	const { userDetail } = useMatpadContext();
	const schoolFilter = FindSchoolFilter(filterValues, GetDashboardFilterList(filters, isCustomDashboard));
	const { phaseName } = GetSchoolFilterPhase(schoolFilter, filterValues);
	const name = panelData?.info?.name || schoolFilter?.value?.text || phaseName;
	const logoValue = schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;
	const charFilter = filters?.filter((f) => {
		return f?.param === "characteristics";
	});
	const schoolFilterValue = filterValues?.filter((f) => {
		return f?.filterID === schoolFilter?.id;
	});
	const charFilterValue = filterValues?.filter((f) => {
		return f?.filterID === charFilter[0]?.id;
	});

	let primarySchoolNames = "";
	let secondarySchoolNames = "";

	schoolFilterValue[0]?.value?.map((sfv) => {
		if (sfv?.value?.phase === "primary") {
			if (primarySchoolNames.length === 0) {
				primarySchoolNames = sfv?.text;
			} else {
				primarySchoolNames = primarySchoolNames?.concat(`, ${sfv?.text}`);
			}
			return;
		}
		if (sfv?.value?.phase === "secondary") {
			if (secondarySchoolNames.length === 0) {
				secondarySchoolNames = sfv?.text;
			} else {
				secondarySchoolNames = secondarySchoolNames?.concat(`, ${sfv?.text}`);
			}
			return;
		}
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

	const [phaseNotes, setPhaseNotes] = useState(false);
	const [dayNotes, setDayNotes] = useState(false);
	const seriesPrimaryNames = panelData?.info?.seriesname || primarySchoolNames || phaseName;
	const seriesSecondaryNames = panelData?.info?.seriesname || secondarySchoolNames || phaseName;

	useEffect(() => {
		if (!panelData) return;

		setDayNotes(panelData?.notes?.daily ?? "");
	}, [panelData]);

	const dayNotesDiv = document.getElementById("dayNotes");

	if (dayNotesDiv) {
		dayNotesDiv.innerHTML = dayNotes;
	}

	useEffect(() => {
		if (!panelData) return;

		setPhaseNotes(panelData?.notes?.phase ?? "");
	}, [panelData]);

	const phaseNotesDiv = document.getElementById("phaseNotes");

	if (phaseNotesDiv) {
		phaseNotesDiv.innerHTML = phaseNotes;
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
				<TermlyAttendanceLineChart
					title={`Termly attendance trends ${charsApplied && `(${charsApplied})`}`}
					chartData={panelData}
					primarySchoolName={seriesPrimaryNames}
					secondarySchoolName={seriesSecondaryNames}
				/>
			</div>
			<div className="col-span-2 ">
				<div
					id="chartTitle"
					className="mb-1 font-semibold text-left h-6 text-ellipsis line-clamp-1">
					{`Termly attendance trends by phase ${charsApplied && `(${charsApplied})`}`}
					<UncontrolledTooltip
						target={"chartTitle"}
						autohide={true}
						placement={"top"}>
						{`Termly attendance trends by phase ${charsApplied && `(${charsApplied})`}`}
					</UncontrolledTooltip>
				</div>
				<div className="grid grid-cols-3">
					<div className="col-span-3 lg:col-span-2">
						<TeamlyAttendanceTable
							tableData={panelData}
							title={`Termly attendance trends by phase ${charsApplied && `(${charsApplied})`}`}
							primarySchoolName={seriesPrimaryNames}
							secondarySchoolName={seriesSecondaryNames}
							primarySchoolNames={primarySchoolNames}
							secondarySchoolNames={secondarySchoolNames}
						/>
					</div>
					<div className="col-span-3 lg:col-span-1">
						<div className="flex justify-end h-full w-full flex-col">
							<div className="text-primary-500">
								<div
									key="phaseNotes"
									id="phaseNotes"
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

export default TermlyAttendanceStaticReport;
