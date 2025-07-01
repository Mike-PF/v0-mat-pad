import React, { useEffect, useState } from "react";
import _ from "lodash";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const People = ({ panelData }) => {
    const [absence, setAbsence] = useState(false);
    const [vacancies, setVacancies] = useState(false);

    useEffect(() => {
        if (!panelData) return;

        setAbsence(panelData?.form?.absenceLT ?? "");
        setVacancies(panelData?.form?.vacanciesPeople ?? "");
    }, [panelData]);

    // const absenceDiv = document.getElementById("absenceDiv");
    // const vacanciesDiv = document.getElementById("vacanciesDiv");

    // if (absenceDiv) {
    //     absenceDiv.innerHTML = absence;
    // }
    // if (vacanciesDiv) {
    //     vacanciesDiv.innerHTML = vacancies;
    // }

    const expenseRag = panelData?.finance?.kpi?.staffCostExpensePctRAG
        ? panelData?.finance?.kpi?.staffCostExpensePctRAG.split(":")
        : "no-colour";

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                People
            </div>
            <div className="w-full grid grid-cols-2 gap-y-2">
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Staff absence (av. No. days sick per person)
                </div>
                <div className="text-center items-center flex justify-center">
                    {panelData?.people?.avgDaysPerPerson?.toFixed(2)}
                </div>
                <div className="flex items-center bg-dashItem-100 text-white rounded-[3px] pl-2">
                    Long-term absence cases
                </div>
                <div className="text-center items-center flex justify-center">
                    <div
                        key="absenceDiv"
                        id="absenceDiv"
                        className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
                    >
                        {absence}
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
                    {`% staffing costs`}
                </div>
                <div
                    className={classNames(
                        expenseRag.length > 0 ?
                            expenseRag[1] === "#00ff00" ? `bg-[#8ed973]` :
                            expenseRag[1] === "#ff0000" ? `bg-[#f2aa84]` :
                            expenseRag[1] === "#ffbf00" ? `bg-[#ffc000]` :
                            "bg-white-50"
                        : "bg-white-50",
                        "text-center items-center flex justify-center"
                    )}
                >
                    {panelData?.finance?.kpi?.staffCostExpensePct?.toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

export default People;
