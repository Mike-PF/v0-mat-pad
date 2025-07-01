import React from "react";
import _ from "lodash";

const SafeguardingAudits = ({ panelData }) => {
    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Safeguarding audits
            </div>
            <div className="grid grid-cols-5">
                <div className="text-center font-semibold col-span-2 bg-dashItem-100 text-white rounded-[3px]">
                    Date/type
                </div>
                <div className="text-center font-semibold bg-[#8ed973]">
                    Green
                </div>
                <div className="text-center font-semibold bg-[#ffc000]">
                    Amber
                </div>
                <div className="text-center font-semibold bg-[#f2aa84]">
                    Red
                </div>
                <div className="col-span-2">
                    {panelData?.form?.ppp_type}
                    {panelData?.form?.ppp_date &&
                        `- ${panelData?.form?.ppp_date}`}
                </div>
                <div className="text-center">{panelData?.form?.ppp_green}</div>
                <div className="text-center">{panelData?.form?.ppp_amber} </div>
                <div className="text-center">{panelData?.form?.ppp_red} </div>
                <div className="col-span-2">
                    {panelData?.form?.ps_type}
                    {panelData?.form?.ps_date &&
                        `- ${panelData?.form?.ps_date}`}
                </div>
                <div className="text-center">{panelData?.form?.ps_green}</div>
                <div className="text-center">{panelData?.form?.ps_amber} </div>
                <div className="text-center">{panelData?.form?.ps_red} </div>
            </div>
        </div>
    );
};

export default SafeguardingAudits;
