import React, { useEffect, useState } from "react";
import _, { uniqueId } from "lodash";

const SelfEvaluation = ({ panelData }) => {
    const [comments, setComments] = useState(false);

    useEffect(() => {
        if (!panelData) return;

        setComments(panelData?.form?.ss_se_trust_comments ?? "");
    }, [panelData]);

    const getDivColour = (value) => {
        if (value?.toLowerCase().includes("outstanding")) {
            return (
                <div
                    key={uniqueId(value)}
                    className="text-center h-full w-full bg-[#8ed973] flex items-center justify-center overflow-hidden"
                >
                    {value ?? ""}
                </div>
            );
        }
        if (value?.toLowerCase().includes("good")) {
            return (
                <div
                    key={uniqueId(value)}
                    className="text-center h-full w-full bg-[#b4e5a2] flex items-center justify-center overflow-hidden"
                >
                    {value ?? ""}
                </div>
            );
        }
        if (value?.toLowerCase().includes("requires improvement/good")) {
            return (
                <div
                    key={uniqueId(value)}
                    className="text-center h-full w-full bg-[#f5f87e] flex items-center justify-center overflow-hidden"
                >
                    {value ?? ""}
                </div>
            );
        }
        if (value?.toLowerCase().includes("requires improvement")) {
            return (
                <div
                    key={uniqueId(value)}
                    className="text-center h-full w-full bg-[#ffc000] flex items-center justify-center overflow-hidden"
                >
                    {value ?? ""}
                </div>
            );
        }
        if (value?.toLowerCase().includes("inadequate")) {
            return (
                <div
                    key={uniqueId(value)}
                    className="text-center h-full w-full bg-[#f2aa84] flex items-center justify-center overflow-hidden"
                >
                    {value ?? ""}
                </div>
            );
        }
        return (
            <div
                key={uniqueId(value)}
                className="text-center h-full w-full flex items-center justify-center overflow-hidden"
            >
                {value ?? ""}
            </div>
        );
    };

    const commentsDiv = document.getElementById("commentsDiv");

    if (commentsDiv) {
        commentsDiv.innerHTML = comments;
    }

    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Self evaluation
            </div>
            <div className="w-full grid grid-cols-5 gap-1 auto-rows-max">
                <div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
                    Self-evaluation
                </div>
                <div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
                    Predecessor grade
                </div>
                <div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
                    Current Ofsted
                </div>
                <div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
                    Academy Evaluation
                </div>
                <div className="font-semibold text-center p-1 bg-dashItem-100 text-white rounded-[3px] w-full justify-center">
                    Trust Evaluation
                </div>
                <div>Quality of education</div>
                {getDivColour(panelData?.ofsted?.previous?.qualityOfEducation?.rating
                )}
                {getDivColour(
                    panelData?.ofsted?.latest?.qualityOfEducation?.rating
                )}
                {getDivColour(panelData?.sef?.school_qoe)}
                {getDivColour(panelData?.sef?.trust_qoe)}
                <div>Behaviour & attitudes</div>
                {getDivColour(
                    panelData?.ofsted?.previous?.behaviourAndAttitudes?.rating
                )}
                {getDivColour(
                    panelData?.ofsted?.latest?.behaviourAndAttitudes?.rating
                )}
                {getDivColour(panelData?.sef?.school_baa)}
                {getDivColour(panelData?.sef?.trust_baa)}
                <div>Personal development</div>
                {getDivColour(
                    panelData?.ofsted?.previous?.personalDevelopment?.rating
                )}
                {getDivColour(
                    panelData?.ofsted?.latest?.personalDevelopment?.rating
                )}
                {getDivColour(panelData?.sef?.school_pd)}
                {getDivColour(panelData?.sef?.trust_pd)}
                <div>Leadership & management</div>
                {getDivColour(
                    panelData?.ofsted?.previous
                        ?.effectivenessOfLeadershipAndManagement?.rating
                )}
                {getDivColour(
                    panelData?.ofsted?.latest
                        ?.effectivenessOfLeadershipAndManagement?.rating
                )}
                {getDivColour(panelData?.sef?.school_lam)}
                {getDivColour(panelData?.sef?.trust_lam)}
                {(panelData?.years?.min < 1 &&
                    (panelData?.ofsted?.previous?.earlyYearsProvision?.rating !== "N/A" ||
                        panelData?.ofsted?.latest?.earlyYearsProvision?.rating !== "N/A")) && (
                        <>
                            <div>Early years</div>
                            {getDivColour(
                                panelData?.ofsted?.previous?.earlyYearsProvision
                                    ?.rating
                            )}
                            {getDivColour(
                                panelData?.ofsted?.latest?.earlyYearsProvision
                                    ?.rating
                            )}
                            {getDivColour(panelData?.sef?.school_ey)}
                            {getDivColour(panelData?.sef?.trust_ey)}
                        </>
                    )}
                {(panelData?.years?.max > 11 &&
                    (panelData?.ofsted?.previous?.sixthFormProvision?.rating !== "N/A" ||
                        panelData?.ofsted?.latest?.sixthFormProvision?.rating !== "N/A")) && (
                        <>
                            <div>Sixth form</div>
                            {getDivColour(
                                panelData?.ofsted?.previous?.sixthFormProvision
                                    ?.rating
                            )}
                            {getDivColour(
                                panelData?.ofsted?.latest?.sixthFormProvision
                                    ?.rating
                            )}
                            {getDivColour(panelData?.sef?.school_sixthform)}
                            {getDivColour(panelData?.sef?.trust_sixthform)}
                        </>
                    )}
                <div>Overall effectiveness</div>
                {getDivColour(panelData?.ofsted?.previous?.overall?.rating)}
                {getDivColour(panelData?.ofsted?.latest?.overall?.rating)}
                {getDivColour("N/A")/*panelData?.sef?.school_overalleffectiveness)*/}
                {getDivColour("N/A")/*panelData?.sef?.trust_overalleffectiveness)*/}
            </div>
            <div className="w-full flex mt-4">
                <div className="font-semibold mr-4">Trust comments</div>
                <div
                    key="commentsDiv"
                    id="commentsDiv"
                    className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                />
            </div>
        </div>
    );
};

export default SelfEvaluation;
