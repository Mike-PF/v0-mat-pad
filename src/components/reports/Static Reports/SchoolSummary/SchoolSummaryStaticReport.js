import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import AcademyInformation from "./AcademyInformation";
import AcademyImprovement from "./AcademyImprovement";
import Performance from "./Performance";
import SelfEvaluation from "./SelfEvaluation";
import TrustKPI from "./TrustKPI";
import SafeguardingAudits from "./SafeguardingAudits";
import HealthAndSafety from "./HealthAndSafety";
import People from "./People";
import Governance from "./Governance";
import Finance from "./Finance";
import Estates from "./Estates";
import { LoadingSpinner } from "../../../controls/LoadingSpinner";
import { useMatpadContext } from "../../../context/applicationContext";

const SchoolSummaryStaticReport = ({
    dashboards,
    filterValues,
    setSelectedDashboard,
    setIsCustomDashboard,
    panelData,
}) => {
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
    const isPrimary = panelData?.school?.phase?.toLowerCase() === "primary";
    const isSecondary = panelData?.school?.phase?.toLowerCase() === "secondary";
    const isAllThrough = panelData?.school?.phase?.toLowerCase() === "all-through";

    if (!panelData || panelData.loading) {
        return <LoadingSpinner />;
    }

    if (panelData?.error) {
        return (
            <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <div className="text-slate-600 font-medium text-sm">
                    Error loading school dashboard
                </div>
            </div>
        );
    }

    if (panelData?.loaded === false || !panelData?.urn) {
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
                        Please select a school from the filter
                    </div>
                </div>
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
                <div className="text-2xl mb-3 text-slate-900 font-semibold">
                    {panelData?.school?.name ?? name} - Summary Dashboard
                </div>
            </div>
            <div className="bg-gray-100 w-full p-3 rounded-xl">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="w-full lg:col-span-2">
                        <AcademyInformation
                            panelData={panelData}
                            dashboards={dashboards}
                            setSelectedDashboard={setSelectedDashboard}
                            isPrimary={isPrimary}
                            isSecondary={isSecondary}
                            isAllThrough={isAllThrough}
                        />
                    </div>
                    <div className="w-full lg:col-span-2">
                        <AcademyImprovement panelData={panelData} />
                    </div>
                    <div className="w-full flex flex-col lg:flex-row lg:col-span-2 gap-y-3 gap-2">
                        <div className="w-full flex flex-col lg:w-1/2 gap-2">
                            <div className="w-full h-full">
                                <Performance
                                    isPrimary={isPrimary}
                                    isSecondary={isSecondary}
                                    isAllThrough={isAllThrough}
                                    panelData={panelData}
                                    dashboards={dashboards}
                                    setSelectedDashboard={setSelectedDashboard}
                                    setIsCustomDashboard={setIsCustomDashboard}
                                />
                            </div>
                            <div className="w-full h-full">
                                <TrustKPI panelData={panelData} />
                            </div>
                        </div>
                        <div className="w-full h-full lg:w-1/2">
                            <SelfEvaluation panelData={panelData} />
                        </div>
                    </div>
                    <div className="w-full h-full flex lg:col-span-2 gap-y-3 gap-2">
                        <div className="w-full flex flex-col lg:w-1/2 gap-2">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <div className="w-full lg:w-1/2">
                                    <People panelData={panelData} />
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <Governance panelData={panelData} />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-2">
                                <div className="w-full h-full lg:w-1/3">
                                    <Finance panelData={panelData?.finance} />
                                </div>
                                <div className="w-full h-full lg:w-2/3">
                                    <Estates panelData={panelData} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col lg:flex-row lg:w-1/2 gap-2">
                            <div className="w-full h-full lg:w-1/2">
                                <SafeguardingAudits panelData={panelData} />
                            </div>
                            <div className="w-full h-full lg:w-1/2">
                                <HealthAndSafety
                                    formData={panelData?.compliance}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolSummaryStaticReport;
