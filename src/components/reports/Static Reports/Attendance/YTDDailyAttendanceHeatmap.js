import React, { useEffect, useState } from "react";
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

const YTDDailyAttendanceHeatmap = ({ tableData, title }) => {
    const [sortedValues, setSortedValues] = useState([]);

    const getHeatBg = (absence) => {
        const value = absence;

        const minValue = sortedValues?.length > 0 ? sortedValues[0] : 90;
        const maxValue =
            sortedValues?.length > 0
                ? sortedValues[sortedValues?.length - 1]
                : 100;

        const middleValue = (minValue + maxValue) / 2;

        if (!value || value < middleValue) {
            if (!value) {
                return "#ffffff";
            }
            if (value < minValue) {
                return "#2395A4";
            }
            const maxDifference = middleValue - minValue;
            const minDifference = (value - minValue)?.toFixed(1);
            const difference = (minDifference / maxDifference)?.toFixed(1);

            const maxRGB = hexToRgb("#FFFFFF");
            const minRGB = hexToRgb("#2395A4");

            const redDifference = maxRGB.r - minRGB.r;
            const greenDifference = maxRGB.g - minRGB.g;
            const blueDifference = maxRGB.b - minRGB.b;

            const valueRed = minRGB.r + redDifference * difference;
            const valueGreen = minRGB.g + greenDifference * difference;
            const valueBlue = minRGB.b + blueDifference * difference;

            const hex = rgbToHex(valueRed, valueGreen, valueBlue);

            return `${hex}`;
        }
        if (value > middleValue) {
            if (value > maxValue) {
                return "#F79400";
            }
            const maxDifference = maxValue - middleValue;
            const minDifference = (value - middleValue)?.toFixed(1);
            const difference = (minDifference / maxDifference)?.toFixed(1);

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
        } else return "#ffffff";
    };

    useEffect(() => {
        if (!tableData) return;
        const sortedVals = [];

        tableData.map((td) => {
            const pct = (td?.presentSessions / td?.possibleSessions) * 100;
            sortedVals?.push(pct);
        });

        sortedVals.sort(function (a, b) {
            return a - b;
        });

        setSortedValues(sortedVals);
    }, [tableData]);

    if (!tableData) return;
    if (sortedValues?.length < 1) return;

    const monday = tableData.filter((d) => d?.day === "Mon");
    const tuesday = tableData.filter((d) => d?.day === "Tue");
    const wednesday = tableData.filter((d) => d?.day === "Wed");
    const thursday = tableData.filter((d) => d?.day === "Thu");
    const friday = tableData.filter((d) => d?.day === "Fri");

    const mondayAm = monday.filter((d) => d?.session === "AM");
    const tuesdayAm = tuesday.filter((d) => d?.session === "AM");
    const wednesdayAm = wednesday.filter((d) => d?.session === "AM");
    const thursdayAm = thursday.filter((d) => d?.session === "AM");
    const fridayAm = friday.filter((d) => d?.session === "AM");

    const mondayPm = monday.filter((d) => d?.session === "PM");
    const tuesdayPm = tuesday.filter((d) => d?.session === "PM");
    const wednesdayPm = wednesday.filter((d) => d?.session === "PM");
    const thursdayPm = thursday.filter((d) => d?.session === "PM");
    const fridayPm = friday.filter((d) => d?.session === "PM");

    mondayAm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    tuesdayAm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    wednesdayAm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    thursdayAm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    fridayAm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });

    mondayPm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    tuesdayPm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    wednesdayPm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    thursdayPm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });
    fridayPm.sort(function (a, b) {
        return a?.phase.localeCompare(b?.phase);
    });

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-3 pt-3">
            <div className="mb-2 font-semibold">{title}</div>
            <table className="w-full text-center">
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th colSpan="2" />
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thur</th>
                        <th>Fri</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-black">
                        <td className="text-left font-bold">Primary (MAT)</td>
                        <td className="text-left">AM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (mondayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (tuesdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (wednesdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (thursdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (fridayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="">
                        <td className="text-left"></td>
                        <td className="text-left">PM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (mondayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (mondayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (mondayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayPm.find((a) => a?.phase === "p")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (tuesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (tuesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (tuesdayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (wednesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (wednesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (wednesdayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          wednesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (thursdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (thursdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (thursdayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (fridayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (fridayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (fridayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayPm.find((a) => a?.phase === "p")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td className="text-left"></td>
                        <td className="text-left">Total</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((mondayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          mondayPm.find((a) => a?.phase === "p")
                                              ?.presentSessions /
                                              mondayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((tuesdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          tuesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              tuesdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((wednesdayAm.find(
                                          (a) => a?.phase === "p"
                                      )?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          wednesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              wednesdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((thursdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          thursdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              thursdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((fridayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          fridayPm.find((a) => a?.phase === "p")
                                              ?.presentSessions /
                                              fridayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td className="text-left font-bold">Secondary (MAT)</td>
                        <td className="text-left">AM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (mondayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (mondayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (mondayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "s")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (tuesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (tuesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (tuesdayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (wednesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (wednesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (wednesdayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (thursdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (thursdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (thursdayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (fridayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (fridayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (fridayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "s")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="">
                        <td className="text-left"></td>
                        <td className="text-left">PM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (mondayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (mondayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (mondayPm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          mondayPm.find((a) => a?.phase === "s")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (tuesdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (tuesdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (tuesdayPm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          tuesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (wednesdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (wednesdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (wednesdayPm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          wednesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (thursdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (thursdayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (thursdayPm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          thursdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    (fridayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    (fridayPm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.possibleSessions) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      (fridayPm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          fridayPm.find((a) => a?.phase === "s")
                                              ?.possibleSessions) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td className="text-left"></td>
                        <td className="text-left">Total</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((mondayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((mondayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((mondayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "s")
                                              ?.possibleSessions +
                                          mondayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              mondayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((tuesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((tuesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((tuesdayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions +
                                          tuesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              tuesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((wednesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((wednesdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((wednesdayAm.find(
                                          (a) => a?.phase === "s"
                                      )?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions +
                                          wednesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              wednesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((thursdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((thursdayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((thursdayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.possibleSessions +
                                          thursdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              thursdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((fridayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((fridayAm.find((a) => a?.phase === "s")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((fridayAm.find((a) => a?.phase === "s")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "s")
                                              ?.possibleSessions +
                                          fridayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              fridayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td className="text-left font-bold">Whole MAT</td>
                        <td className="text-left">AM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((mondayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          mondayAm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              mondayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((tuesdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          tuesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              tuesdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((wednesdayAm.find(
                                          (a) => a?.phase === "p"
                                      )?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          wednesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              wednesdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((thursdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          thursdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              thursdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((fridayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          fridayAm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              fridayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="">
                        <td className="text-left"></td>
                        <td className="text-left">PM</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((mondayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((mondayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((mondayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayPm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          mondayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              mondayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((tuesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((tuesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((tuesdayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          tuesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              tuesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((wednesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((wednesdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((wednesdayPm.find(
                                          (a) => a?.phase === "p"
                                      )?.presentSessions /
                                          wednesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          wednesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              wednesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((thursdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((thursdayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((thursdayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          thursdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              thursdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((fridayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((fridayPm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        2) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((fridayPm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayPm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          fridayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              fridayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          2) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td className="text-left"></td>
                        <td className="text-left">Total</td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((mondayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        mondayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        mondayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        mondayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            mondayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((mondayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          mondayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          mondayAm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              mondayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions +
                                          mondayPm.find((a) => a?.phase === "p")
                                              ?.presentSessions /
                                              mondayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions +
                                          mondayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              mondayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          4) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((tuesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        tuesdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        tuesdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        tuesdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            tuesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                    100
                                ).toFixed(1)
                            )
                                ? ""
                                : (
                                      ((tuesdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          tuesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          tuesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              tuesdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions +
                                          tuesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              tuesdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions +
                                          tuesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              tuesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          4) *
                                      100
                                  ).toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((wednesdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        wednesdayAm.find(
                                            (a) => a?.phase === "p"
                                        )?.possibleSessions +
                                        wednesdayAm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "p"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        wednesdayPm.find(
                                            (a) => a?.phase === "s"
                                        )?.presentSessions /
                                            wednesdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((wednesdayAm.find(
                                          (a) => a?.phase === "p"
                                      )?.presentSessions /
                                          wednesdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          wednesdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              wednesdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions +
                                          wednesdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              wednesdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions +
                                          wednesdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              wednesdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          4) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((thursdayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        thursdayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        thursdayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        thursdayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            thursdayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((thursdayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          thursdayAm.find(
                                              (a) => a?.phase === "p"
                                          )?.possibleSessions +
                                          thursdayAm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              thursdayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions +
                                          thursdayPm.find(
                                              (a) => a?.phase === "p"
                                          )?.presentSessions /
                                              thursdayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions +
                                          thursdayPm.find(
                                              (a) => a?.phase === "s"
                                          )?.presentSessions /
                                              thursdayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          4) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                        100
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {isNaN(
                                (
                                    ((fridayAm.find((a) => a?.phase === "p")
                                        ?.presentSessions /
                                        fridayAm.find((a) => a?.phase === "p")
                                            ?.possibleSessions +
                                        fridayAm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayAm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "p")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "p"
                                            )?.possibleSessions +
                                        fridayPm.find((a) => a?.phase === "s")
                                            ?.presentSessions /
                                            fridayPm.find(
                                                (a) => a?.phase === "s"
                                            )?.possibleSessions) /
                                        4) *
                                    100
                                )?.toFixed(1)
                            )
                                ? ""
                                : (
                                      ((fridayAm.find((a) => a?.phase === "p")
                                          ?.presentSessions /
                                          fridayAm.find((a) => a?.phase === "p")
                                              ?.possibleSessions +
                                          fridayAm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              fridayAm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions +
                                          fridayPm.find((a) => a?.phase === "p")
                                              ?.presentSessions /
                                              fridayPm.find(
                                                  (a) => a?.phase === "p"
                                              )?.possibleSessions +
                                          fridayPm.find((a) => a?.phase === "s")
                                              ?.presentSessions /
                                              fridayPm.find(
                                                  (a) => a?.phase === "s"
                                              )?.possibleSessions) /
                                          4) *
                                      100
                                  )?.toFixed(1)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default YTDDailyAttendanceHeatmap;
