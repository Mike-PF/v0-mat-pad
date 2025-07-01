import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faArrowUp } from "@fortawesome/pro-light-svg-icons";
import { boolContent } from "../../../../common/Utility";

const Performance = ({ panelData, dashboards, setSelectedDashboard, setIsCustomDashboard, isPrimary, isSecondary, isAllThrough }) => {
	const getChangeArrowIcon = (value) => {
		if (value > 0) {
			return (
				<FontAwesomeIcon
					className="mr-1 text-green-500"
					icon={faArrowUp}
				/>
			);
		}
		if (value < 0) {
			return (
				<FontAwesomeIcon
					className="mr-1 text-red-500"
					icon={faArrowDown}
				/>
			);
		}
		if (value === 0) {
			return (
				<FontAwesomeIcon
					className="mr-1"
					icon={faArrowRight}
				/>
			);
		}
	};

	const getInverseColourChangeArrowIcon = (value) => {
		if (value > 0) {
			return (
				<FontAwesomeIcon
					className="mr-1 text-red-500"
					icon={faArrowUp}
				/>
			);
		}
		if (value < 0) {
			return (
				<FontAwesomeIcon
					className="mr-1 text-green-500"
					icon={faArrowDown}
				/>
			);
		}
		if (value === 0) {
			return (
				<FontAwesomeIcon
					className="mr-1"
					icon={faArrowRight}
				/>
			);
		}
	};

	const findAttendance = () => {
		const hasAttendance = dashboards.find((d) => d.name === "Attendance");
		hasAttendance.selected = true;

		if (hasAttendance) {
			setSelectedDashboard(hasAttendance);
		}
	};

	const findPersistantAbsence = () => {
		const hasAttendance = dashboards.find((d) => d.name === "Attendance");
		hasAttendance.selected = true;

		if (hasAttendance) {
			setSelectedDashboard(hasAttendance);
			setIsCustomDashboard("Persistent Absence Dashboard");
		}
	};

	const currentYear = panelData?.ks4?.current?.year
		? panelData?.ks4?.current?.year + 2000
		: panelData?.primary?.current?.yearEnd
		? panelData?.primary?.current?.yearEnd
		: "";

	const nationalFourPlusEAndM = (panelData?.attainment?.national?.yearM1Eng4Plus + panelData?.attainment?.national?.yearM1Math4Plus) / 2;

	return (
		<div className="w-full h-full bg-white px-2 rounded-xl pb-2">
			<div className="font-semibold text-lg w-full flex items-center text-center justify-center">Performance</div>
			<div className="flex flex-col">
				{(isSecondary || isAllThrough) && (
					<div className="w-full grid grid-cols-4 gap-x-1 gap-y-2">
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							Progress 8 ({currentYear})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							4+ English & Maths ({currentYear})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							5+ English & Maths ({currentYear})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							Attainment 8 ({currentYear})
						</div>
						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.p8AP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.p8AP2) - parseFloat(panelData?.ks4?.p8AP1))}
								{parseFloat(panelData?.ks4?.p8AP2) - parseFloat(panelData?.ks4?.p8AP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.p8AP2) - parseFloat(panelData?.ks4?.p8AP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.p8AP2) - parseFloat(panelData?.ks4?.p8AP1))?.toFixed(2)}
								{`)`}
							</div>
							<div>{panelData?.attainment?.national?.yearM1Prog8 && ` nat.av.(${panelData?.attainment?.national?.yearM1Prog8})`}</div>
						</div>
						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.basics4PlusAP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.basics4PlusAP2) - parseFloat(panelData?.ks4?.basics4PlusAP1))}
								{parseFloat(panelData?.ks4?.basics4PlusAP2) - parseFloat(panelData?.ks4?.basics4PlusAP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.basics4PlusAP2) - parseFloat(panelData?.ks4?.basics4PlusAP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.basics4PlusAP2) - parseFloat(panelData?.ks4?.basics4PlusAP1))?.toFixed(2)}
								{`)`}
							</div>
							<div>{nationalFourPlusEAndM && ` nat.av.(${(nationalFourPlusEAndM * 100)?.toFixed(2)}%)`}</div>
						</div>
						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.basics5PlusAP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.basics5PlusAP2) - parseFloat(panelData?.ks4?.basics5PlusAP1))}
								{parseFloat(panelData?.ks4?.basics5PlusAP2) - parseFloat(panelData?.ks4?.basics5PlusAP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.basics5PlusAP2) - parseFloat(panelData?.ks4?.basics5PlusAP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.basics5PlusAP2) - parseFloat(panelData?.ks4?.basics5PlusAP1))?.toFixed(2)}
								{`)`}
							</div>
							{panelData?.attainment?.national?.yearM15PlusME && ` nat.av.(${panelData?.attainment?.national?.yearM15PlusME}%)`}
						</div>
						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.att8AP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.att8AP2) - parseFloat(panelData?.ks4?.att8AP1))}
								{parseFloat(panelData?.ks4?.att8AP2) - parseFloat(panelData?.ks4?.att8AP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.att8AP2) - parseFloat(panelData?.ks4?.att8AP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.att8AP2) - parseFloat(panelData?.ks4?.att8AP1))?.toFixed(2)}
								{`)`}
							</div>
							{panelData?.attainment?.national?.yearM1Att8 && ` nat.av.(${panelData?.attainment?.national?.yearM1Att8}%)`}
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							Ebacc entry ({currentYear})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							Ebacc APS ({currentYear})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							{panelData?.years?.max > 11 && <>A-level av.grade ({currentYear}) </>}
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							{panelData?.years?.max > 11 && <>Applied General av.grade ({currentYear})</>}
						</div>

						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.ebaccEntryAP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.ebaccEntryAP2) - parseFloat(panelData?.ks4?.ebaccEntryAP1))}
								{parseFloat(panelData?.ks4?.ebaccEntryAP2) - parseFloat(panelData?.ks4?.ebaccEntryAP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.ebaccEntryAP2) - parseFloat(panelData?.ks4?.ebaccEntryAP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.ebaccEntryAP2) - parseFloat(panelData?.ks4?.ebaccEntryAP1))?.toFixed(2)}
								{`)`}
							</div>
							{panelData?.attainment?.national?.yearM1EntEbacc &&
								` nat.av.(${(panelData?.attainment?.national?.yearM1EntEbacc * 100)?.toFixed(2) ?? ""}%)`}
						</div>
						<div className="text-center">
							<div>
								{parseFloat(panelData?.ks4?.ebaccAPSAP2)?.toFixed(2) ?? ""}
								{`(`}
								{getChangeArrowIcon(parseFloat(panelData?.ks4?.ebaccAPSAP2) - parseFloat(panelData?.ks4?.ebaccAPSAP1))}
								{parseFloat(panelData?.ks4?.ebaccAPSAP2) - parseFloat(panelData?.ks4?.ebaccAPSAP1) !== 0 &&
								isNaN((parseFloat(panelData?.ks4?.ebaccAPSAP2) - parseFloat(panelData?.ks4?.ebaccAPSAP1))?.toFixed(2))
									? ""
									: (parseFloat(panelData?.ks4?.ebaccAPSAP2) - parseFloat(panelData?.ks4?.ebaccAPSAP1))?.toFixed(2)}
								{`)`}
							</div>
							<div>
								{panelData?.attainment?.national?.yearM1EntEbacc &&
									` nat.av.(${(panelData?.attainment?.national?.yearM1EntEbacc * 100)?.toFixed(2) ?? ""}%)`}
							</div>
						</div>
						<div className="text-center">
							{panelData?.years?.max > 11 && (
								<>
									{panelData?.ks4?.AlevelAP2 ?? ""}
									{panelData?.ks4?.AlevelAP1 && `(${panelData?.ks4?.AlevelAP1})`}
									<div>
										{panelData?.attainment?.national?.yearM1ALevelAvgGrade &&
											` nat.av.(${panelData?.attainment?.national?.yearM1ALevelAvgGrade ?? ""}%)`}
									</div>
								</>
							)}
						</div>
						<div className="text-center">
							{panelData?.years?.max > 11 && (
								<>
									{panelData?.ks4?.GeneralAP2 ?? ""}
									{panelData?.ks4?.GeneralAP1 && `(${panelData?.ks4?.GeneralAP1})`}
									<div>
										{panelData?.attainment?.national?.yearM1ALevelAvgApplied &&
											` nat.av.(${panelData?.attainment?.national?.yearM1ALevelAvgApplied ?? ""}%)`}
									</div>
								</>
							)}
						</div>
					</div>
				)}
				{(isPrimary || isAllThrough) && (
					<div className="w-full grid grid-cols-4 gap-x-1 gap-y-2">
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							GLD ({panelData?.primary?.current?.yearEnd ? panelData?.primary?.current?.yearEnd - 1 : ""})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							Phonics Y1 ({panelData?.primary?.current?.yearEnd ? panelData?.primary?.current?.yearEnd - 1 : ""})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							KS2 RWM ({panelData?.primary?.current?.yearEnd})
						</div>
						<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
							KS2 subjects ({panelData?.primary?.current?.yearEnd})
						</div>
						<div className="text-center m-auto">
							{panelData?.primary?.current?.gld && (
								<>
									{panelData?.primary?.current?.gld ? `${panelData?.primary?.current?.gld?.toFixed(2)}%` : ""}
									{panelData?.primary?.current?.gld && panelData?.primary?.lastYear?.gld && (
										<>
											{`(`}
											{getChangeArrowIcon(panelData?.primary?.current?.gld - panelData?.primary?.lastYear?.gld)}
											{isNaN((panelData?.primary?.current?.gld - panelData?.primary?.lastYear?.gld)?.toFixed(2))
												? ""
												: (panelData?.primary?.current?.gld - panelData?.primary?.lastYear?.gld)?.toFixed(2)}
											%{`)`}
										</>
									)}
									<div>
										{panelData?.primary?.lastYear?.nat_gld && ` nat.av. (${panelData?.primary?.lastYear?.nat_gld?.toFixed(2)}%)`}
									</div>
								</>
							)}
						</div>
						<div className="text-center m-auto">
							{panelData?.primary?.current?.phonics && (
								<>
									{panelData?.primary?.current?.phonics?.y1 ? `${panelData?.primary?.current?.phonics?.y1?.toFixed(2)}%` : ""}
									{panelData?.primary?.current?.phonics?.y1 && panelData?.primary?.lastYear?.phonics?.y1 && (
										<>
											{`(`}
											{getChangeArrowIcon(panelData?.primary?.current?.phonics?.y1 - panelData?.primary?.lastYear?.phonics?.y1)}
											{isNaN((panelData?.primary?.current?.phonics?.y1 - panelData?.primary?.lastYear?.phonics?.y1)?.toFixed(2))
												? ""
												: (panelData?.primary?.current?.phonics?.y1 - panelData?.primary?.lastYear?.phonics?.y1)?.toFixed(2)}
											%{`)`}
										</>
									)}
									<div>
										{panelData?.primary?.lastYear?.phonics?.natY1 &&
											` nat.av. (${panelData?.primary?.lastYear?.phonics?.natY1?.toFixed(2)}%)`}
									</div>
								</>
							)}
						</div>
						<div className="text-center m-auto">
							<div>
								{panelData?.primary?.current?.rwm?.toFixed(2) ?? ""}%
								{panelData?.primary?.current?.rwm && panelData?.primary?.lastYear?.rwm && (
									<>
										{`(`}
										{getChangeArrowIcon(panelData?.primary?.current?.rwm - panelData?.primary?.lastYear?.rwm)}
										{isNaN((panelData?.primary?.current?.rwm - panelData?.primary?.lastYear?.rwm)?.toFixed(2))
											? ""
											: (panelData?.primary?.current?.rwm - panelData?.primary?.lastYear?.rwm)?.toFixed(2)}
										%{`)`}
									</>
								)}
							</div>
							{panelData?.primary?.lastYear?.nat_rwm && ` nat.av. (${panelData?.primary?.lastYear?.nat_rwm?.toFixed(2)}%)`}
						</div>
						<div className="text-center">
							<div className="flex flex-wrap items-center justify-center">
								Reading: {panelData?.primary?.current?.reading?.toFixed(2) ?? ""}%
								{panelData?.primary?.current?.reading && panelData?.primary?.lastYear?.reading && (
									<div>
										{`(`}
										{getChangeArrowIcon(panelData?.primary?.current?.reading - panelData?.primary?.lastYear?.reading)}
										{isNaN((panelData?.primary?.current?.reading - panelData?.primary?.lastYear?.reading)?.toFixed(2))
											? ""
											: (panelData?.primary?.current?.reading - panelData?.primary?.lastYear?.reading)?.toFixed(2)}
										%{`)`}
									</div>
								)}
							</div>
							<div className="flex flex-wrap items-center justify-center">
								Writing: {panelData?.primary?.current?.writing?.toFixed(2) ?? ""}%
								{panelData?.primary?.current?.writing && panelData?.primary?.lastYear?.writing && (
									<div>
										{`(`}
										{getChangeArrowIcon(panelData?.primary?.current?.writing - panelData?.primary?.lastYear?.writing)}
										{isNaN((panelData?.primary?.current?.writing - panelData?.primary?.lastYear?.writing)?.toFixed(2))
											? ""
											: (panelData?.primary?.current?.writing - panelData?.primary?.lastYear?.writing)?.toFixed(2)}
										%{`)`}
									</div>
								)}
							</div>
							<div className="flex flex-wrap items-center justify-center">
								Maths: {panelData?.primary?.current?.maths?.toFixed(2) ?? ""}%
								{panelData?.primary?.current?.maths && panelData?.primary?.lastYear?.maths && (
									<div>
										{`(`}
										{getChangeArrowIcon(panelData?.primary?.current?.maths - panelData?.primary?.lastYear?.maths)}
										{isNaN((panelData?.primary?.current?.maths - panelData?.primary?.lastYear?.maths)?.toFixed(2))
											? ""
											: (panelData?.primary?.current?.maths - panelData?.primary?.lastYear?.maths)?.toFixed(2)}
										%{`)`}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="w-full mt-2 grid grid-cols-4 gap-x-1 gap-y-2">
					<button
						type="button"
						onClick={findAttendance}
						className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
						Attendance (YTD)
					</button>
					<button
						type="button"
						onClick={findPersistantAbsence}
						className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
						Persistent Absence (YTD)
					</button>
					<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
						Suspensions (YTD)
					</div>
					<div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
						Permanent Exclusions (YTD)
					</div>
					<div className="text-center m-auto">
						<div>
							{panelData?.attendance?.overallcurr && `${(panelData?.attendance?.overallcurr * 100)?.toFixed(2)}%`}
							{panelData?.attendance?.overallcurr && panelData?.attendance?.overallprev && (
								<>
									{`(`}
									{getChangeArrowIcon(panelData?.attendance?.overallcurr - panelData?.attendance?.overallprev)}
									{isNaN((panelData?.attendance?.overallcurr - panelData?.attendance?.overallprev)?.toFixed(2))
										? ""
										: ((panelData?.attendance?.overallcurr - panelData?.attendance?.overallprev) * 100)?.toFixed(2)}
									%{`)`}
								</>
							)}
						</div>
						{panelData?.attendance?.overallnat && ` nat.av. (${panelData?.attendance?.overallnat?.toFixed(2)}%)`}
					</div>
					<div className="text-center m-auto">
						<div>
							{panelData?.attendance?.lt90curr && `${(panelData?.attendance?.lt90curr * 100)?.toFixed(2)}%`}
							{panelData?.attendance?.lt90curr && panelData?.attendance?.lt90prev && (
								<>
									{`(`}
									{getChangeArrowIcon(panelData?.attendance?.lt90curr - panelData?.attendance?.lt90prev)}
									{isNaN((panelData?.attendance?.lt90curr - panelData?.attendance?.lt90prev)?.toFixed(2))
										? ""
										: ((panelData?.attendance?.lt90curr - panelData?.attendance?.lt90prev) * 100)?.toFixed(2)}
									%{`)`}
								</>
							)}
						</div>
						{panelData?.attendance?.lt90nat && ` nat.av. (${panelData?.attendance?.lt90nat?.toFixed(2)}%)`}
					</div>
					<div className="text-center m-auto">
						{Object.hasOwn(panelData?.exclusions, "suspensionsPct") && `${panelData?.exclusions?.suspensionsPct?.toFixed(2)}%`}
						{boolContent(
							panelData?.exclusions?.suspensionsPct - panelData?.exclusions?.suspensionsLYPct,
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
						{Object.hasOwn(panelData?.exclusions, "suspensionsPct") &&
							Object.hasOwn(panelData?.exclusions, "suspensionsLYPct") &&
							` (${(panelData?.exclusions?.suspensionsPct - panelData?.exclusions?.suspensionsLYPct)?.toFixed(2)}%)`}
					</div>
					<div className="text-center m-auto">
						{Object.hasOwn(panelData?.exclusions, "permExclPct") && `${panelData?.exclusions?.permExclPct?.toFixed(2)}%`}
						{Object.hasOwn(panelData?.exclusions, "permExclCount") && ` (${panelData?.exclusions?.permExclCount}PX)`}
						{boolContent(
							panelData?.exclusions?.permExclPct - panelData?.exclusions?.permExclLYPct,
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
						{Object.hasOwn(panelData?.exclusions, "permExclPct") &&
							Object.hasOwn(panelData?.exclusions, "permExclLYPct") &&
							` (${(panelData?.exclusions?.permExclPct - panelData?.exclusions?.permExclLYPct)?.toFixed(2)}%)`}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Performance;
