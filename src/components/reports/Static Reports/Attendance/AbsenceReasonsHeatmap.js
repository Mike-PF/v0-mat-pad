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
        return "#fff";
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

const AbsenceReasonsHeatmap = ({ tableData, title }) => {
    if (!tableData || !tableData?.school) return;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-3">
            <div className="mb-2 font-semibold">{title}</div>
            <table className="w-full text-center">
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th />
                        <th />
                        <th>10-30%</th>
                        <th>30-50%</th>
                        <th>{`>50%`}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan="9" className="bg-[#9bc2f9]">
                            Authorised absence
                        </td>
                        <td className="text-left">Illness</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.illness
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.illness?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.illness
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.illness?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.illness
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.illness?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Medical/dental</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.appointments
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.appointments?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.appointments
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.appointments?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.appointments
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.appointments?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Other authorised</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.authOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.authOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.authOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.authOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.authOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.authOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Part-time timetables</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.partTime
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.partTime?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.partTime
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.partTime?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.partTime
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.partTime?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Exclusions</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.excluded
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.excluded?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.excluded
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.excluded?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.excluded
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.excluded?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Religious observance</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.religion
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.religion?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.religion
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.religion?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.religion
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.religion?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Interviews</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.interview
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.interview?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.interview
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.interview?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.interview
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.interview?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Study leave</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.study
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.study?.toFixed(2) ??
                                ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.study
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.study?.toFixed(2) ??
                                ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.study
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.study?.toFixed(2) ??
                                ""}
                        </td>
                    </tr>
                    <tr className="border-black border-b-2">
                        <td className="text-left">Mobile child absence</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.mobile
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.mobile?.toFixed(2) ??
                                ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.mobile
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.mobile?.toFixed(2) ??
                                ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.mobile
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.mobile?.toFixed(2) ??
                                ""}
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={4} className="bg-[#ffc1b3]">
                            Unauth. absence
                        </td>
                        <td className="text-left">Holiday (unauthorised)</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.unauthHol
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.unauthHol?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.unauthHol
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.unauthHol?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.unauthHol
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.unauthHol?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Other (unauthorised)</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.unauthOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.unauthOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.unauthOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.unauthOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.unauthOther
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.unauthOther?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">Late (unauthorised)</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.unauthLateReg
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.unauthLateReg?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.unauthLateReg
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.study?.toFixed(2) ??
                                ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.unauthLateReg
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.unauthLateReg?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left">No reason yet</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa1030?.[0]?.unauthNoReason
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa1030?.[0]?.unauthNoReason?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.pa3050?.[0]?.unauthNoReason
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.pa3050?.[0]?.unauthNoReason?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    tableData?.school?.palt50?.[0]?.unauthNoReason
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {tableData?.school?.palt50?.[0]?.unauthNoReason?.toFixed(
                                2
                            ) ?? ""}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AbsenceReasonsHeatmap;
