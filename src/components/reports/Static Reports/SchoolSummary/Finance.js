import React from "react";
import _ from "lodash";

const Finance = ({ panelData }) => {
    if (!panelData) return;

    const formatText = (v, dp) => {
        const stringToNumber = typeof v === "string" ? parseFloat(v) : v;
        let currencyString;

        if (isNaN(stringToNumber)) {
            return;
        }

        if (_.isNil(dp)) dp = 2;

        if (stringToNumber < 0) {
            const positiveValue = stringToNumber * -1;
            const stringToChange = positiveValue.toLocaleString("en-GB", {
                minimumFractionDigits: dp,
                maximumFractionDigits: dp,
            });
            currencyString = `£${stringToChange}`;

            return (
                <div className="line-clamp-1 text-red-500">
                    {`(${currencyString})`}
                </div>
            );
        } else {
            const stringToChange = stringToNumber.toLocaleString("en-GB", {
                minimumFractionDigits: dp,
                maximumFractionDigits: dp,
            });
            currencyString = `£${stringToChange}`;

            return <div className="line-clamp-1">{currencyString}</div>;
        }
    };

    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Finance
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    B/F Reserves
                </div>
                <div className="text-center items-center flex justify-center">
                    {formatText(panelData?.bf ?? "", 0)}
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Income
                </div>
                <div className="text-center items-center flex justify-center">
                    {formatText(panelData?.income ?? "", 0)}
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Expenditure
                </div>
                <div className="text-center items-center text-red-500 flex justify-center">
                    {formatText(panelData?.expenditure ?? "", 0)}
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    C/F Reserves
                </div>
                <div className="text-center items-center flex justify-center">
                    {formatText(panelData?.surplus_deficit ?? "", 0)}
                </div>
            </div>
        </div>
    );
};

export default Finance;
