import React, { useEffect, useState } from "react";
import _, { uniqueId } from "lodash";

const AcademyImprovement = ({ panelData }) => {
    const [improvements, setImprovements] = useState("");
    const [strengths, setStrengths] = useState("");
    const [concerns, setConcerns] = useState("");
    const [risks, setRisks] = useState("");
    const [mitigations, setMitigations] = useState("");

    useEffect(() => {
        if (!panelData) return;

        setImprovements(panelData?.form?.ss_ai_improvements ?? []);
        setStrengths(panelData?.form?.ss_ai_strengths ?? []);
        setConcerns(panelData?.form?.ss_ai_concerns ?? []);
        setRisks(panelData?.form?.ss_ai_risks ?? []);
        setMitigations(panelData?.form?.ss_ai_mitigations ?? []);
    }, [panelData]);

    if (!panelData) return;

    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Academy Improvement
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-2 gap-1">
                <div>
                    <div className="mb-2 bg-dashItem-100 text-white rounded- font-semibold w-full text-center">
                        Improvements
                    </div>
                    <div className="px-4">
                        {improvements?.length > 0 && (
                            <>
                                {improvements?.map((improvement) => {
                                    return (
                                        <li key={uniqueId(improvement)}>
                                            {improvement}
                                        </li>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-dashItem-100 text-white rounded-[3px] font-semibold w-full text-center">
                        Strengths
                    </div>
                    <div className="px-4">
                        {strengths?.length > 0 && (
                            <>
                                {strengths?.map((strength) => {
                                    return (
                                        <li key={uniqueId(strength)}>
                                            {strength}
                                        </li>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-dashItem-100 text-white rounded-[3px] font-semibold w-full text-center">
                        Concerns
                    </div>
                    <div className="px-4">
                        {concerns?.length > 0 && (
                            <>
                                {concerns?.map((concern) => {
                                    return (
                                        <li key={uniqueId(concern)}>
                                            {concern}
                                        </li>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-dashItem-100 text-white rounded-[3px] font-semibold w-full text-center">
                        Risks
                    </div>
                    <div className="px-4">
                        {risks?.length > 0 && (
                            <>
                                {risks?.map((risk) => {
                                    return <li key={uniqueId(risk)}>{risk}</li>;
                                })}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-dashItem-100 text-white rounded-[3px] font-semibold w-full text-center">
                        Mitigations
                    </div>
                    <div className="px-4">
                        {mitigations?.length > 0 && (
                            <>
                                {mitigations?.map((mitigation) => {
                                    return (
                                        <li key={uniqueId(mitigation)}>
                                            {mitigation}
                                        </li>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademyImprovement;
