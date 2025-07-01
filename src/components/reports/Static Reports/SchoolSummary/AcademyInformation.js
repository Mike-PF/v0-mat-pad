import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowRight,
    faArrowUp,
} from "@fortawesome/pro-light-svg-icons";

const AcademyInformation = ({
    panelData,
    dashboards,
    setSelectedDashboard,
    isPrimary,
    isSecondary,
    isAllThrough,
}) => {
    const getChangeArrowIcon = (value) => {
        if (value > 0) {
            return (
                <FontAwesomeIcon
                    className="mr-1 text-green-500"
                    icon={faArrowUp}
                />
            );
        }
        if (value < 0) {
            return (
                <FontAwesomeIcon
                    className="mr-1 text-red-500"
                    icon={faArrowDown}
                />
            );
        }
        if (value === 0) {
            return <FontAwesomeIcon className="mr-1" icon={faArrowRight} />;
        }
    };

    const findAdmissions = () => {
        const hasAdmissions = dashboards.find((d) => d.name === "Admissions");
        hasAdmissions.selected = true;

        if (hasAdmissions) {
            setSelectedDashboard(hasAdmissions);
        }
    };

    return (
        <div className="w-full h-full bg-white px-2 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Academy Information
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-x-1 gap-y-2">
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        Local authority
                    </div>
                    <div>{panelData?.la?.name ?? ""}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        Headteacher
                    </div>
                    <div>
                        {(panelData?.school?.head?.title ?? "") +
                            " " +
                            (panelData?.school?.head?.firstName ?? "") +
                            " " +
                            (panelData?.school?.head?.lastName ?? "") ?? ""}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        Age range
                    </div>
                    <div>
                        {panelData?.school?.ages?.low ?? ""}
                        {panelData?.school?.ages?.high
                            ? `-${panelData?.school?.ages?.high}`
                            : ""}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={findAdmissions}
                    className="flex flex-col items-center border-none"
                >
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        NOR
                    </div>
                    <div>
                        {panelData?.school?.nursery && (
                            <div className="text-center">
                                {panelData?.school?.nor?.thisYear?.totalNursery}
                                {` (`}
                                {getChangeArrowIcon(
                                    panelData?.school?.nor?.thisYear
                                        ?.totalNursery -
                                        panelData?.school?.nor?.lastYear
                                            ?.totalNursery
                                )}
                                {panelData?.school?.nor?.thisYear
                                    ?.totalNursery -
                                    panelData?.school?.nor?.lastYear
                                        ?.totalNursery !==
                                    0 &&
                                    Math.abs(
                                        panelData?.school?.nor?.thisYear
                                            ?.totalNursery -
                                            panelData?.school?.nor?.lastYear
                                                ?.totalNursery
                                    )}
                                {`) `}
                                {`Nursery`}
                            </div>
                        )}
                        {panelData?.school?.nor?.thisYear?.totalY1_11 > 0 && (
                            <div className="text-center">
                                {panelData?.school?.nor?.thisYear?.totalY1_11}
                                {` (`}
                                {getChangeArrowIcon(
                                    panelData?.school?.nor?.thisYear
                                        ?.totalY1_11 -
                                        panelData?.school?.nor?.lastYear
                                            ?.totalY1_11
                                )}
                                {panelData?.school?.nor?.thisYear?.totalY1_11 -
                                    panelData?.school?.nor?.lastYear
                                        ?.totalY1_11 !==
                                    0 &&
                                    Math.abs(
                                        panelData?.school?.nor?.thisYear
                                            ?.totalY1_11 -
                                            panelData?.school?.nor?.lastYear
                                                ?.totalY1_11
                                    )}
                                {`) `}
                                {panelData?.school?.phase?.toLowerCase() === "primary"
                                    ? `Y1 - Y6`
                                    : panelData?.school?.phase?.toLowerCase() === "secondary"
                                    ? `Y7 - Y11`
                                    : `Y1 - Y11`}
                            </div>
                        )}
                        {panelData?.school?.sixthForm && (
                            <div className="text-center">
                                {
                                    panelData?.school?.nor?.thisYear
                                        ?.totalSixthForm
                                }
                                {` (`}
                                {getChangeArrowIcon(
                                    panelData?.school?.nor?.thisYear
                                        ?.totalSixthForm -
                                        panelData?.school?.nor?.lastYear
                                            ?.totalSixthForm
                                )}
                                {panelData?.school?.nor?.thisYear
                                    ?.totalSixthForm -
                                    panelData?.school?.nor?.lastYear
                                        ?.totalSixthForm !==
                                    0 &&
                                    Math.abs(
                                        panelData?.school?.nor?.thisYear
                                            ?.totalSixthForm -
                                            panelData?.school?.nor?.lastYear
                                                ?.totalSixthForm
                                    )}
                                {`) `}
                                {`Sixth Form`}
                            </div>
                        )}
                    </div>
                </button>
                <button className="flex flex-col items-center border-none">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        Capacity
                    </div>
                    <div>{panelData?.school?.pan?.total}</div>
                </button>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        SEND support
                    </div>
                    <div className="text-center">
                        {panelData?.characteristics?.stats?.senKPct?.toFixed(2)
                            ? `${(
                                  panelData?.characteristics?.stats?.senKPct *
                                  100
                              )?.toFixed(2)}%`
                            : ""}

                        {/* {panelData?.characteristics?.stats?.senKPct &&
                            panelData?.characteristicsLY?.senKPct && (
                                <>
                                    {`(`}
                                    {getChangeArrowIcon(
                                        panelData?.characteristics?.stats
                                            ?.senKPct -
                                            panelData?.characteristicsLY
                                                ?.senKPct
                                    )}
                                    {isNaN(
                                        (
                                            panelData?.characteristics?.stats
                                                ?.senKPct -
                                            panelData?.characteristicsLY
                                                ?.senKPct
                                        )?.toFixed(2)
                                    )
                                        ? ""
                                        : (
                                              panelData?.characteristics?.stats
                                                  ?.senKPct -
                                              panelData?.characteristicsLY
                                                  ?.senKPct
                                          )?.toFixed(2)}
                                    %{`)`}
                                </>
                            )} */}
                        {panelData?.characteristics?.national && (
                            <div>
                                {` nat.av.(${
                                    isPrimary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1PrimarySenK * 100
                                          )?.toFixed(2)
                                        : isSecondary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1SecondarySenK * 100
                                          )?.toFixed(2)
                                        : (
                                              panelData?.characteristics
                                                  ?.national?.yearM1TotalSenK *
                                              100
                                          )?.toFixed(2)
                                }%)`}
                            </div>
                        )}
                        {panelData?.deciles?.senK ?? ""}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        EHCP
                    </div>
                    <div className="text-center">
                        {panelData?.characteristics?.stats?.senEPct?.toFixed(2)
                            ? `${(
                                  panelData?.characteristics?.stats?.senEPct *
                                  100
                              )?.toFixed(2)}%`
                            : ""}

                        {/* {panelData?.characteristics?.stats?.senEPct &&
                            panelData?.characteristicsLY?.senEPct && (
                                <>
                                    {`(`}
                                    {getChangeArrowIcon(
                                        panelData?.characteristics?.stats
                                            ?.senEPct -
                                            panelData?.characteristicsLY
                                                ?.senEPct
                                    )}
                                    {isNaN(
                                        (
                                            panelData?.characteristics?.stats
                                                ?.senEPct -
                                            panelData?.characteristicsLY
                                                ?.senEPct
                                        )?.toFixed(2)
                                    )
                                        ? ""
                                        : (
                                              panelData?.characteristics?.stats
                                                  ?.senEPct -
                                              panelData?.characteristicsLY
                                                  ?.senEPct
                                          )?.toFixed(2)}
                                    %{`)`}
                                </>
                            )} */}
                        {panelData?.characteristics?.national && (
                            <div>
                                {` nat.av.(${
                                    isPrimary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1PrimaryEHCP * 100
                                          )?.toFixed(2)
                                        : isSecondary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1SecondaryEHCP * 100
                                          )?.toFixed(2)
                                        : (
                                              panelData?.characteristics
                                                  ?.national?.yearM1TotalEHCP *
                                              100
                                          )?.toFixed(2)
                                }%)`}
                            </div>
                        )}
                        {panelData?.deciles?.senE ?? ""}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        FSM
                    </div>
                    <div className="text-center">
                        {panelData?.characteristics?.stats?.fsmPct?.toFixed(2)
                            ? `${(
                                  panelData?.characteristics?.stats?.fsmPct *
                                  100
                              )?.toFixed(2)}%`
                            : ""}

                        {/* {panelData?.characteristics?.stats?.fsmPct &&
                            panelData?.characteristicsLY?.FSMPct && (
                                <>
                                    {`(`}
                                    {getChangeArrowIcon(
                                        panelData?.characteristics?.stats
                                            ?.fsmPct -
                                            panelData?.characteristicsLY?.FSMPct
                                    )}
                                    {isNaN(
                                        (
                                            panelData?.characteristics?.stats
                                                ?.fsmPct -
                                            panelData?.characteristicsLY?.FSMPct
                                        )?.toFixed(2)
                                    )
                                        ? ""
                                        : (
                                              panelData?.characteristics?.stats
                                                  ?.fsmPct -
                                              panelData?.characteristicsLY
                                                  ?.FSMPct
                                          )?.toFixed(2)}
                                    %{`)`}
                                </>
                            )} */}
                        {panelData?.characteristics?.national && (
                            <div>
                                {` nat.av.(${
                                    isPrimary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national?.yearM1PrimaryFSM *
                                              100
                                          )?.toFixed(2)
                                        : isSecondary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1SecondaryFSM * 100
                                          )?.toFixed(2)
                                        : (
                                              panelData?.characteristics
                                                  ?.national?.yearM1TotalFSM *
                                              100
                                          )?.toFixed(2)
                                }%)`}
                            </div>
                        )}
                        {panelData?.deciles?.fsm ?? ""}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 font-semibold bg-dashItem-100 text-white rounded-[3px] w-full text-center">
                        EAL
                    </div>
                    <div className="text-center">
                        {panelData?.characteristics?.stats?.ealPct?.toFixed(2)
                            ? `${(
                                  panelData?.characteristics?.stats?.ealPct *
                                  100
                              )?.toFixed(2)}%`
                            : ""}

                        {/* {panelData?.characteristics?.stats?.ealPct &&
                            panelData?.characteristicsLY?.ealPct && (
                                <>
                                    {`(`}
                                    {getChangeArrowIcon(
                                        panelData?.characteristics?.stats
                                            ?.ealPct -
                                            panelData?.characteristicsLY?.ealPct
                                    )}
                                    {isNaN(
                                        (
                                            panelData?.characteristics?.stats
                                                ?.ealPct -
                                            panelData?.characteristicsLY?.ealPct
                                        )?.toFixed(2)
                                    )
                                        ? ""
                                        : (
                                              panelData?.characteristics?.stats
                                                  ?.ealPct -
                                              panelData?.characteristicsLY
                                                  ?.ealPct
                                          )?.toFixed(2)}
                                    %{`)`}
                                </>
                            )} */}
                        {panelData?.characteristics?.national && (
                            <div>
                                {` nat.av.(${
                                    isPrimary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national?.yearM1PrimaryEAL *
                                              100
                                          )?.toFixed(2)
                                        : isSecondary
                                        ? (
                                              panelData?.characteristics
                                                  ?.national
                                                  ?.yearM1SecondaryEAL * 100
                                          )?.toFixed(2)
                                        : (
                                              panelData?.characteristics
                                                  ?.national?.yearM1TotalEAL *
                                              100
                                          )?.toFixed(2)
                                }%)`}
                            </div>
                        )}
                        {panelData?.deciles?.eal ?? ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademyInformation;
