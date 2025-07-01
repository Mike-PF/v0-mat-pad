import React from "react";
import _ from "lodash";
import PupilSummaryStaticTable from "./PupilSummaryStaticTable";
import PupilAttendanceLineChart from "./PupilAttendanceLineChart";
import SinglePupilWeekdayBarChart from "./SinglePupilWeekdayBarChart";
import PupilReasonsHeatmap from "./PupilReasonsHeatmap";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PupilViewStaticReport = ({ panelData }) => {
    if (!panelData || panelData.loading || !panelData?.student) {
        return (
            <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                    <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                        <FontAwesomeIcon
                            icon={faClipboardList}
                            className="w-8 h-8 text-slate-600"
                        />
                    </div>
                    <div className="text-slate-600 font-medium text-sm">
                        Please select a pupil from the filter
                    </div>
                </div>
            </div>
        );
    }
    const noDataCard = () => {
        return (
            <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                    <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                        <FontAwesomeIcon
                            icon={faClipboardList}
                            className="w-8 h-8 text-slate-600"
                        />
                    </div>
                    <div className="text-slate-600 font-medium text-sm">
                        No data to show
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            <div className="flex w-full items-center gap-x-4 mb-2">
                <div className="text-2xl mb-3 text-slate-900 font-semibold">
                    Pupil View Dashboard
                </div>
            </div>
            <div className="bg-gray-100 w-full rounded-xl p-2">
                {panelData?.student && (
                    <PupilSummaryStaticTable
                        tableData={{
                            data: [panelData?.student],
                        }}
                        singlePupil={true}
                    />
                )}
                <div className="w-full h-max col-span-3 grid grid-cols-3 lg:col-span-6 md:grid-cols-12">
                    <div className="col-span-3 h-full md:col-span-12 lg:col-span-4 pt-2 pr-2">
                        {panelData?.weekly ? (
                            <div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
                                <PupilAttendanceLineChart
                                    title="Weekly attendance (cumulative)"
                                    chartData={panelData?.weekly}
                                    name={panelData?.student?.name}
                                />
                            </div>
                        ) : (
                            noDataCard()
                        )}
                    </div>
                    <div className="col-span-3 h-full md:col-span-12 lg:col-span-4 pt-2">
                        {panelData?.codes ? (
                            <div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
                                <PupilReasonsHeatmap
                                    tableData={panelData?.codes}
                                    title="Absence reasons"
                                    thisYear={panelData?.thisYear}
                                    lastYear={panelData?.lastYear}
                                />
                            </div>
                        ) : (
                            noDataCard()
                        )}
                    </div>
                    <div className="col-span-3 h-full md:col-span-12 lg:col-span-4 pt-2 pl-2">
                        {panelData?.daily ? (
                            <div className="bg-white flex items-center justify-center h-full min-h-96 rounded-xl">
                                <SinglePupilWeekdayBarChart
                                    title="Attendance by weekday"
                                    chartData={panelData?.daily}
                                    name={panelData?.student?.name}
                                    thisYear={panelData?.thisYear}
                                    lastYear={panelData?.lastYear}
                                />
                            </div>
                        ) : (
                            noDataCard()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PupilViewStaticReport;
