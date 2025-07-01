import React from "react";
import _ from "lodash";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import PupilPieChart from "./PupilPieChart";
import PupilSummaryStaticTable from "./PupilSummaryStaticTable";
import PupilSummaryBarChart from "./PupilSummaryBarChart";
import PupilSummaryStackedBarChart from "./PupilSummaryStackedBarChart";
import FSMBarChart from "./FSMBarChart";
import PupilPrimaryNeedBarChart from "./PupilPrimaryNeedBarChart";
import { useMatpadContext } from "../../../context/applicationContext";
import { FindSchoolFilter, GetDashboardFilterList, GetSchoolFilterPhase } from "../../Elements/Common";

const PupilSummaryStaticReport = ({
    panelData,
    filterValues,
    setFilters,
    setIsCustomDashboard,
    filters,
    isCustomDashboard
}) => {
    const { userDetail } = useMatpadContext();

    const schoolFilter = FindSchoolFilter(filterValues, GetDashboardFilterList(filters, isCustomDashboard));
    const { phaseName } = GetSchoolFilterPhase(schoolFilter, filterValues);
    const name = panelData?.info?.name || schoolFilter?.value?.text || phaseName;
    const logoValue = schoolFilter?.value?.value.urn ?? userDetail?.organisation?.id;

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
                            alt="Logo"
                            className="max-w-[80px] max-h-[80px]"
                            src={`api/image/${logoValue}/logo?width=80&height=80`}
                        />
                    </div>
                )}
                <div className="text-2xl text-slate-900 font-semibold">{name}</div>
            </div>
            <div className="pl-2 mb-3 flex gap-x-1">
                <div className="text-slate-900 font-semibold">
                    Number Of Pupils:
                </div>
                <div>{new Intl.NumberFormat().format(panelData?.info?.pupils)}</div>
            </div>
            <div className="bg-gray-100 w-full rounded-xl p-2">
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-6 gap-2">
                    <div className="col-span-3 grid grid-cols-1 lg:grid-cols-2 lg:row-span-2 gap-2">
                        <div className="bg-white flex items-center justify-center h-full rounded-xl p-3">
                            {panelData?.data?.panel3 && (
                                <PupilPieChart
                                    chartData={panelData?.data?.panel3}
                                    title="% Pupils By Gender"
                                />
                            )}
                        </div>
                        <div className="bg-white flex items-center justify-center h-full rounded-xl p-3">
                            {panelData?.data?.panel5 && (
                                <PupilPieChart
                                    chartData={panelData?.data?.panel5}
                                    title="% Pupils By SEN"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-span-3 lg:row-span-3 lg:col-span-1">
                        <div className="bg-white w-full row-span-2 flex items-center justify-center h-full rounded-xl">
                            {panelData?.data?.panel4 && (
                                <PupilSummaryStackedBarChart
                                    chartData={panelData?.data?.panel4}
                                    title="Pupils By Ethnicity & EAL"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-1 lg:grid-cols-2  lg:row-span-2 gap-2">
                        <div className="bg-white flex items-center justify-center h-full rounded-xl">
                            {panelData?.data?.panel7 && (
                                <FSMBarChart
                                    chartData={panelData?.data?.panel7}
                                    title="Pupils By FSM Status"
                                />
                            )}
                        </div>
                        <div className="bg-white flex items-center justify-center h-full rounded-xl">
                            {panelData?.data?.panel2 && (
                                <PupilSummaryBarChart
                                    chartData={panelData?.data?.panel2}
                                    title="No. Of Pupils By Suspension Band"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-span-3 lg:row-span-3 lg:col-span-1">
                        <div className="bg-white flex items-center overflow-auto justify-center h-full rounded-xl">
                            {panelData?.data?.panel6 && (
                                <PupilPrimaryNeedBarChart
                                    chartData={panelData?.data?.panel6}
                                    title="Pupils By Primary Need"
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-span-3 lg:row-span-2 gap-2">
                        <div className="bg-white flex items-center overflow-auto justify-center h-full rounded-xl">
                            {panelData?.data?.panel1 && (
                                <PupilSummaryBarChart
                                    chartData={panelData?.data?.panel1}
                                    title="No. Of Pupils By Attendance Band"
                                />
                            )}
                        </div>
                    </div>
                </div>
                {panelData?.data?.panel8 && (
                    <div className="mt-2">
                        <PupilSummaryStaticTable
                            tableData={panelData?.data?.panel8}
                            setIsCustomDashboard={setIsCustomDashboard}
                            setFilters={setFilters}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PupilSummaryStaticReport;
