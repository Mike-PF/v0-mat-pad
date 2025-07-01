import React from "react";
import _, { uniqueId } from "lodash";

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const getHeatBg = (absence) => {
    const value = absence;

    if (!value) {
        return "#ffffff";
    }

    if (value > 2.5) {
        return "#F79400";
    }
    const maxDifference = 2.5 - 0;
    const minDifference = (value - 0)?.toFixed(2);
    const difference = (minDifference / maxDifference)?.toFixed(2);

    const maxRGB = hexToRgb("#F79400");
    const minRGB = hexToRgb("#FFFFFF");

    const redDifference = maxRGB.r - minRGB.r;
    const greenDifference = maxRGB.g - minRGB.g;
    const blueDifference = maxRGB.b - minRGB.b;

    const valueRed = minRGB.r + redDifference * difference;
    const valueGreen = minRGB.g + greenDifference * difference;
    const valueBlue = minRGB.b + blueDifference * difference;

    const hex = rgbToHex(valueRed, valueGreen, valueBlue);

    return `${hex}`;
};

const PupilReasonsHeatmap = ({ tableData, title, thisYear, lastYear }) => {
    if (!tableData) return;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-3">
            <div className="mb-2 font-semibold">{title}</div>
            <div className="w-full">
                <div className="w-full h-fit flex">
                    <div className="min-h-full overflow-hidden flex items-center justify-center text-center w-1/5 bg-[#9bc2f9] mt-6">
                        Authorised absence
                    </div>

                    <div className="w-full grid grid-cols-4 h-fit">
                        <div className="col-span-2 grid grid-cols-1">
                            <div className="h-6"></div>
                            <div className="pl-1">Illness</div>
                            <div className="pl-1">Medical/dental</div>
                            <div className="pl-1">Other authorised</div>
                            <div className="pl-1">Part-time timetables</div>
                            <div className="pl-1">Exclusions</div>
                            <div className="pl-1">Religious observance</div>
                            <div className="pl-1">Regulated performance</div>
                            <div className="pl-1">Interviews</div>
                            <div className="pl-1">Study leave</div>
                            <div className="pl-1">Mobile child absence</div>
                        </div>
                        <div className="col-span-1 grid grid-cols-1">
                            <div className="h-6 w-full flex overflow-hidden text-ellipsis  justify-center font-semibold">
                                {lastYear}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.illnessPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.illnessPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.appointmentsPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.appointmentsPct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.authOtherPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.authOtherPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.partTimePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.partTimePct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.excludedPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.excludedPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.religionPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.religionPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.performancePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.performancePct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.interviewPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.interviewPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.studyPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.studyPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.mobilePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.mobilePct?.toFixed(2)}
                            </div>
                        </div>
                        <div className="col-span-1 grid grid-cols-1">
                            <div className="h-6 flex items-center justify-center font-semibold">
                                {thisYear}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.illnessPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.illnessPct?.toFixed(2) ??
                                    ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.appointmentsPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.appointmentsPct?.toFixed(
                                    2
                                ) ?? ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.authOtherPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.authOtherPct?.toFixed(
                                    2
                                ) ?? ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.partTimePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.partTimePct?.toFixed(2) ??
                                    ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.excludedPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.excludedPct?.toFixed(2) ??
                                    ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.religionPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.religionPct?.toFixed(2) ??
                                    ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.performancePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.performancePct?.toFixed(
                                    2
                                ) ?? ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.interviewPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.interviewPct?.toFixed(
                                    2
                                ) ?? ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.studyPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.studyPct?.toFixed(2) ??
                                    ""}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.mobilePct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.mobilePct?.toFixed(2) ??
                                    ""}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit flex border-t-black border-t-2">
                    <div className="min-h-full overflow-hidden flex items-center justify-center text-center w-1/5 bg-[#ffc1b3]">
                        Unauth. absence
                    </div>
                    <div className="w-full grid grid-cols-4 h-fit">
                        <div className="col-span-2 grid grid-cols-1">
                            <div className="pl-1">Holiday (unauthorised)</div>
                            <div className="pl-1">Other (unauthorised)</div>
                            <div className="pl-1">Late (unauthorised)</div>
                            <div className="pl-1">No reason yet</div>
                        </div>
                        <div className="col-span-1 grid grid-cols-1">
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.unauthHolPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.unauthHolPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.unauthOtherPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.unauthOtherPct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.unauthLateRegPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.unauthLateRegPct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.lastYear?.unauthNoReasonPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.lastYear?.unauthNoReasonPct?.toFixed(
                                    2
                                )}
                            </div>
                        </div>
                        <div className="col-span-1  grid grid-cols-1">
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.unauthHolPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.unauthHolPct?.toFixed(2)}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.unauthOtherPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.unauthOtherPct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.unauthLateRegPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.unauthLateRegPct?.toFixed(
                                    2
                                )}
                            </div>
                            <div
                                style={{
                                    background: `${getHeatBg(
                                        tableData?.thisYear?.unauthNoReasonPct
                                    )}`,
                                }}
                                className="flex items-center justify-center"
                            >
                                {tableData?.thisYear?.unauthNoReasonPct?.toFixed(
                                    2
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PupilReasonsHeatmap;
