import React from "react";
import _, { uniqueId } from "lodash";

const HealthAndSafety = ({ formData }) => {
    if (!formData) {
        return;
    }

    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Health and safety / compliance testing
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
                <div className=" col-span-2">
                    {new Date(formData?.uploaded)?.toDateString() ?? ""}
                </div>
                <div className="text-center">
                    {formData?.total?.green ?? ""}
                </div>
                <div className="text-center">
                    {formData?.total?.amber ?? ""}
                </div>
                <div className="text-center">{formData?.total?.red ?? ""}</div>
                {formData?.categories?.length > 0 && (
                    <>
                        {formData?.categories?.map((c) => {
                            return (
                                <React.Fragment key={uniqueId(c?.category)}>
                                    <div
                                        key={uniqueId(c?.dateType)}
                                        className=" col-span-2"
                                    >
                                        {c?.category ?? ""}
                                    </div>
                                    <div
                                        className="text-center"
                                        key={uniqueId(c?.green)}
                                    >
                                        {c?.green ?? ""}
                                    </div>
                                    <div
                                        className="text-center"
                                        key={uniqueId(c?.amber)}
                                    >
                                        {c?.amber ?? ""}
                                    </div>
                                    <div
                                        className="text-center"
                                        key={uniqueId(c?.red)}
                                    >
                                        {c?.red ?? ""}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthAndSafety;
