import React, { useEffect, useState } from "react";
import _ from "lodash";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Governance = ({ panelData }) => {
    const [chair, setChair] = useState(false);
    const [govs, setGovs] = useState(false);
    const [vacancies, setVacancies] = useState(false);
    const [rag, setRag] = useState(false);

    useEffect(() => {
        if (!panelData) return;

        setChair(panelData?.form?.chairOfLGB ?? "");
        setGovs(panelData?.form?.noOfGovs ?? "");
        setVacancies(panelData?.form?.vacancies ?? "");
        setRag(panelData?.form?.rag ?? "");
    }, [panelData]);

    // const chairDiv = document.getElementById("commentsDiv");
    // const govsDiv = document.getElementById("govsDiv");
    // const vacanciesDiv = document.getElementById("vacanciesDiv");
    // const ragDiv = document.getElementById("ragDiv");

    // if (chairDiv) {
    //     chairDiv.innerHTML = chair;
    // }
    // if (govsDiv) {
    //     govsDiv.innerHTML = govs;
    // }
    // if (vacanciesDiv) {
    //     vacanciesDiv.innerHTML = vacancies;
    // }
    // if (ragDiv) {
    //     ragDiv.innerHTML = rag;
    // }

    const getRag = () => {
        if (rag === "#00ff00") {
            return "Green";
        }
        if (rag === "#ffbf00") {
            return "Amber";
        }
        if (rag === "#ff0000") {
            return "Red";
        }
        if (rag === "#ffffff00") {
            return "White";
        }
    };

    return (
        <div className="w-full h-full bg-white px-4 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Governance
            </div>
            <div className="w-full grid grid-cols-2 gap-y-2">
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Chair of LGB
                </div>
                <div className="text-center items-center flex justify-center">
                    <div
                        key="chairDiv"
                        id="chairDiv"
                        className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                    >
                        {chair}
                    </div>
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    No. of governors
                </div>
                <div className="text-center items-center flex justify-center">
                    <div
                        key="govsDiv"
                        id="govsDiv"
                        className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                    >
                        {govs}
                    </div>
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Vacancies
                </div>
                <div className="text-center items-center flex justify-center">
                    <div
                        key="vacanciesDiv"
                        id="vacanciesDiv"
                        className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                    >
                        {vacancies}
                    </div>
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    RAG rating
                </div>
                <div className="text-center items-center flex justify-center">
                    <div
                        key="ragDiv"
                        id="ragDiv"
                        className={classNames(
                            rag === "#00ff00"
                                ? `bg-[#8ed973]`
                                : rag === "#ff0000"
                                    ? `bg-[#f2aa84]`
                                    : rag === "#ffbf00"
                                        ? `bg-[#ffc000]`
                                        : "bg-white-50",
                            "list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                        )}
                    >&nbsp;
                        {/*{getRag()}*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Governance;
