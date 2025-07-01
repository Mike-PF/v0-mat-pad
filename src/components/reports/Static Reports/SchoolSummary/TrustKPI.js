import React from "react";
import _, { uniqueId } from "lodash";

const TrustKPI = ({ panelData }) => {
    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Trust KPIs within Self-evaluation
            </div>
            <div className="grid grid-cols-4">
                <div className="text-center font-semibold bg-dashItem-100 text-white rounded-[3px]">
                    Date
                </div>
                <div className="text-center font-semibold bg-[#8ed973]">
                    SEF KPIs Green (meeting)
                </div>
                <div className="text-center font-semibold bg-[#ffc000]">
                    SEF KPIs Amber (almost meeting)
                </div>
                <div className="text-center font-semibold bg-[#f2aa84]">
                    SEF KPIs Red (not or partially meeting)
                </div>
                <div>
                    {panelData?.form?.sefKPI_date?.length > 0 && (
                        <>
                            {panelData?.form?.sefKPI_date?.map((kpi) => {
                                return (
                                    <div
                                        className="line-clamp-1"
                                        key={uniqueId(kpi)}
                                    >
                                        {kpi}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
                <div className="text-center">
                    {panelData?.form?.sefKPI_G?.length > 0 && (
                        <>
                            {panelData?.form?.sefKPI_G?.map((kpi) => {
                                return (
                                    <div
                                        className="line-clamp-1"
                                        key={uniqueId(kpi)}
                                    >
                                        {kpi}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
                <div className="text-center">
                    {panelData?.form?.sefKPI_A?.length > 0 && (
                        <>
                            {panelData?.form?.sefKPI_A?.map((kpi) => {
                                return (
                                    <div
                                        className="line-clamp-1"
                                        key={uniqueId(kpi)}
                                    >
                                        {kpi}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
                <div className="text-center">
                    {panelData?.form?.sefKPI_R?.length > 0 && (
                        <>
                            {panelData?.form?.sefKPI_R?.map((kpi) => {
                                return (
                                    <div
                                        className="line-clamp-1"
                                        key={uniqueId(kpi)}
                                    >
                                        {kpi}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrustKPI;
