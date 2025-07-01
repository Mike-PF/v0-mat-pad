import React, { useEffect, useState } from "react";
import _ from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";
import YTDFullAttendanceLineChart from "./YTDFullAttendanceLineChart";
import YTDFullAttendanceHeatmap from "./YTDFullAttendanceHeatmap";
import YTDDailyAttendanceHeatmap from "./YTDDailyAttendanceHeatmap";

const YTDFullAttendanceStaticReport = ({ panelData, filterValues }) => {
    const { userDetail } = useMatpadContext();
    const schoolFilter =
        filterValues &&
        filterValues?.length > 0 &&
        filterValues?.find((f) => {
            if (
                f?.value &&
                typeof f?.value === "object" &&
                !Array.isArray(f?.value) &&
                f?.value !== null &&
                f?.value?.value &&
                typeof f?.value === "object" &&
                Object.hasOwn(f?.value?.value, "urn")
            ) {
                return true;
            }
            return false;
        });
    const getPhaseName = () => {
        if (
            filterValues &&
            filterValues?.find((f) => f?.value?.id?.toLowerCase() === "primary")
        ) {
            return "Primary";
        }

        if (
            filterValues &&
            filterValues?.find((f) => f?.value?.id?.toLowerCase() === "secondary")
        ) {
            return "Secondary";
        }

        return "Whole MAT";
    };

    const name = schoolFilter?.value?.text ?? getPhaseName();
    const logoValue =
        schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;

    const [phaseNotes, setPhaseNotes] = useState(false);
    const [dayNotes, setDayNotes] = useState(false);

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
                <div className="text-2xl text-slate-900 font-semibold">
                    YTD and full-year attendance - {name}
                </div>
            </div>
            <div className="w-full grid grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                    <YTDFullAttendanceLineChart
                        title="Full-year attendance trends"
                        chartData={panelData}
                        schoolName={name}
                    />
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <YTDFullAttendanceLineChart
                        title="YTD attendance trends"
                        chartData={panelData}
                        schoolName={name}
                    />
                </div>
                <div className="col-span-2 ">
                    <div className="grid grid-cols-3">
                        <div className="col-span-3 lg:col-span-2">
                            <YTDFullAttendanceHeatmap
                                tableData={panelData?.trend}
                                title="YTD attendance trends by phase"
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
                <div className="col-span-2 ">
                    <div className="grid grid-cols-3">
                        <div className="col-span-3 lg:col-span-2">
                            <YTDDailyAttendanceHeatmap
                                tableData={panelData?.weekdays}
                                title="YTD daily attendance averages"
                            />
                        </div>
                        <div className="col-span-3 lg:col-span-1">
                            <div className="flex justify-end h-full w-full flex-col">
                                <div className="text-primary-500">
                                    <div
                                        key="dayNotes"
                                        id="dayNotes"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YTDFullAttendanceStaticReport;
