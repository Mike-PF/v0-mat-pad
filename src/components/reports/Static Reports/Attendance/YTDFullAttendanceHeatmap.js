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

const getHeatBg = (absence, national) => {
    const value = absence;

    const minValue = national - national / 10;
    const maxValue = national + national / 10;

    if (!national) {
        return "#ffffff";
    }

    if (!value || value < national) {
        if (!value) {
            return "#ffffff";
        }
        if (value < minValue) {
            return "#2395A4";
        }
        const maxDifference = national - minValue;
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
    if (value > national) {
        if (value > maxValue) {
            return "#F79400";
        }
        const maxDifference = maxValue - national;
        const minDifference = (value - national)?.toFixed(1);
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

const YTDFullAttendanceHeatmap = ({ tableData, title }) => {
    if (!tableData) return;

    const nationalYTD = tableData?.national?.ytd;
    const nationalYearEnd = tableData?.national?.yearEnd;

    let yearsArray = [];
    let cleanYearsArray = [];

    nationalYTD?.map((n) => {
        const yearMinus = n?.year - 2000;
        const yearString = `${yearMinus - 1}/${yearMinus}`;
        yearsArray.push(yearString);
    });
    nationalYearEnd?.map((n) => {
        const yearMinus = n?.year - 2000;
        const yearString = `${yearMinus - 1}/${yearMinus}`;
        yearsArray.push(yearString);
    });

    nationalYTD?.map((n) => {
        cleanYearsArray.push(n?.year);
    });
    nationalYearEnd?.map((n) => {
        cleanYearsArray.push(n?.year);
    });

    const years = [...new Set(yearsArray)].sort();
    const cleanYears = [...new Set(cleanYearsArray)].sort();

    const nationalYTDPrimary = nationalYTD?.filter((n) => n?.phase === "p");
    const nationalYTDSecondary = nationalYTD?.filter((n) => n?.phase === "s");
    const nationalYTDMAT = nationalYTD?.filter((n) => n?.phase === "*");
    const nationalYearEndPrimary = nationalYearEnd?.filter(
        (n) => n?.phase === "p"
    );
    const nationalYearEndSecondary = nationalYearEnd?.filter(
        (n) => n?.phase === "s"
    );
    const nationalYearEndMAT = nationalYearEnd?.filter((n) => n?.phase === "*");

    const primaryYearEnd = tableData?.phases?.filter(
        (p) => p?.stage?.toLowerCase() === "primary" && p?.period === "end"
    );
    const primaryYTD = tableData?.phases?.filter(
        (p) => p?.stage?.toLowerCase() === "primary" && p?.period === "ytd"
    );

    const secondaryYearEnd = tableData?.phases?.filter(
        (p) => p?.stage?.toLowerCase() === "secondary" && p?.period === "end"
    );
    const secondaryYTD = tableData?.phases?.filter(
        (p) => p?.stage?.toLowerCase() === "secondary" && p?.period === "ytd"
    );

    const KS1YearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks1" && p?.period === "end"
    );
    const KS1YTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks1" && p?.period === "ytd"
    );

    const KS2YearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks2" && p?.period === "end"
    );
    const KS2YTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks2" && p?.period === "ytd"
    );

    const FSYearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "fs" && p?.period === "end"
    );
    const FSYTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "fs" && p?.period === "ytd"
    );

    const KS3YearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks3" && p?.period === "end"
    );
    const KS3YTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks3" && p?.period === "ytd"
    );

    const KS4YearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks4" && p?.period === "end"
    );
    const KS4YTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks4" && p?.period === "ytd"
    );

    const KS5YearEnd = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks5" && p?.period === "end"
    );
    const KS5YTD = tableData?.stages?.filter(
        (p) => p?.stage?.toLowerCase() === "ks5" && p?.period === "ytd"
    );

    const MATYearEnd = tableData?.mat?.filter((p) => p?.period === "end");
    const MATYTD = tableData?.mat?.filter((p) => p?.period === "ytd");

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
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th colSpan="2" />
                        <th colSpan="2">Full-year</th>
                        <th>Trend</th>
                        <th colSpan="3">YTD</th>
                        <th colSpan="2">Trend</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="2" className="text-left" />
                        <td className="items-center justify-center">
                            {years[0]}
                        </td>
                        <td className="items-center justify-center">
                            {years[1]}
                        </td>
                        <td className="items-center justify-center">
                            {`${years[0]} to ${years[1]}`}
                        </td>
                        <td className="items-center justify-center">
                            {years[0]}
                        </td>
                        <td className="items-center justify-center">
                            {years[1]}
                        </td>
                        <td className="items-center justify-center">
                            {years[2]}
                        </td>
                        <td className="items-center justify-center">
                            {`${years[0]} to ${years[1]}`}
                        </td>
                        <td className="items-center justify-center">
                            {`${years[1]} to ${years[2]}`}
                        </td>
                    </tr>
                    <tr className="border-t border-black bg-slate-100">
                        <td colSpan="2" className="text-left font-bold">
                            National (primary)
                        </td>
                        <td className="items-center justify-center">
                            {nationalYearEndPrimary
                                ?.find((y) => y.year === cleanYears[0])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYearEndPrimary
                                ?.find((y) => y.year === cleanYears[1])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct -
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYearEndPrimary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct -
                                      nationalYearEndPrimary?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDPrimary
                                ?.find((y) => y.year === cleanYears[0])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDPrimary
                                ?.find((y) => y.year === cleanYears[1])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDPrimary
                                ?.find((y) => y.year === cleanYears[2])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct -
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYTDPrimary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct -
                                      nationalYTDPrimary?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct -
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYTDPrimary?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.presentPct -
                                      nationalYTDPrimary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left font-bold">
                            Primary
                        </td>
                        <td className="items-center justify-center">
                            {primaryYearEnd
                                ?.find((y) => y.year === cleanYears[0])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {primaryYearEnd
                                ?.find((y) => y.year === cleanYears[1])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    primaryYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    primaryYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      primaryYearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      primaryYearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {primaryYTD
                                ?.find((y) => y.year === cleanYears[0])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {primaryYTD
                                ?.find((y) => y.year === cleanYears[1])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {primaryYTD
                                ?.find((y) => y.year === cleanYears[2])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    primaryYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    primaryYTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      primaryYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      primaryYTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    primaryYTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    primaryYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      primaryYTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      primaryYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left">
                            KS1
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS1YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS1YearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS1YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS1YearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS1YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS1YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS1YearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS1YearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS1YTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS1YTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS1YTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS1YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS1YTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    KS1YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS1YTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      KS1YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="">
                        <td colSpan="2" className="text-left">
                            KS2
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS2YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS2YearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS2YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS2YearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS2YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS2YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS2YearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS2YearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS2YTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS2YTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS2YTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS2YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS2YTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    KS2YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS2YTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      KS2YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left">
                            FS*
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    FSYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {FSYearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    FSYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {FSYearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    FSYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    FSYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      FSYearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      FSYearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    FSYTD?.find((y) => y.year === cleanYears[0])
                                        ?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {FSYTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    FSYTD?.find((y) => y.year === cleanYears[1])
                                        ?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {FSYTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    FSYTD?.find((y) => y.year === cleanYears[2])
                                        ?.attPct,
                                    nationalYTDPrimary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {FSYTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    FSYTD?.find((y) => y.year === cleanYears[1])
                                        ?.attPct -
                                    FSYTD?.find((y) => y.year === cleanYears[0])
                                        ?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      FSYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      FSYTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    FSYTD?.find((y) => y.year === cleanYears[2])
                                        ?.attPct -
                                    FSYTD?.find((y) => y.year === cleanYears[1])
                                        ?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      FSYTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      FSYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black bg-slate-100">
                        <td colSpan="2" className="text-left font-bold">
                            National (secondary)
                        </td>
                        <td className="items-center justify-center">
                            {nationalYearEndSecondary
                                ?.find((y) => y.year === cleanYears[0])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYearEndSecondary
                                ?.find((y) => y.year === cleanYears[1])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct -
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYearEndSecondary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct -
                                      nationalYearEndSecondary?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDSecondary
                                ?.find((y) => y.year === cleanYears[0])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDSecondary
                                ?.find((y) => y.year === cleanYears[1])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {nationalYTDSecondary
                                ?.find((y) => y.year === cleanYears[2])
                                ?.presentPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct -
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYTDSecondary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct -
                                      nationalYTDSecondary?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct -
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      nationalYTDSecondary?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.presentPct -
                                      nationalYTDSecondary?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.presentPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left font-bold">
                            Secondary
                        </td>
                        <td className="items-center justify-center">
                            {secondaryYearEnd
                                ?.find((y) => y.year === cleanYears[0])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {secondaryYearEnd
                                ?.find((y) => y.year === cleanYears[1])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    secondaryYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    secondaryYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      secondaryYearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      secondaryYearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {secondaryYTD
                                ?.find((y) => y.year === cleanYears[0])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {secondaryYTD
                                ?.find((y) => y.year === cleanYears[1])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {secondaryYTD
                                ?.find((y) => y.year === cleanYears[2])
                                ?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    secondaryYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    secondaryYTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      secondaryYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      secondaryYTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    secondaryYTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    secondaryYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      secondaryYTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      secondaryYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left">
                            KS3
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS3YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS3YearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS3YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS3YearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS3YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS3YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS3YearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS3YearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS3YTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS3YTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS3YTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS3YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS3YTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    KS3YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS3YTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      KS3YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="">
                        <td colSpan="2" className="text-left">
                            KS4
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS4YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS4YearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS4YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS4YearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS4YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS4YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS4YearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS4YearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS4YTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS4YTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS4YTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS4YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS4YTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    KS4YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS4YTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      KS4YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left">
                            6th form
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS5YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS5YearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS5YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS5YearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS5YearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS5YearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS5YearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS5YearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS5YTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS5YTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDSecondary?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {KS5YTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS5YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      KS5YTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    KS5YTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      KS5YTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      KS5YTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                    <tr className="border-t border-black">
                        <td colSpan="2" className="text-left font-bold">
                            Whole MAT
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    MATYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYearEndMAT?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {MATYearEnd?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    MATYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYearEndMAT?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {MATYearEnd?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    MATYearEnd?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    MATYearEnd?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      MATYearEnd?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      MATYearEnd?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct,
                                    nationalYTDMAT?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {MATYTD?.find(
                                (y) => y.year === cleanYears[0]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct,
                                    nationalYTDMAT?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {MATYTD?.find(
                                (y) => y.year === cleanYears[1]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td
                            style={{
                                background: `${getHeatBg(
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct,
                                    nationalYTDMAT?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.presentPct
                                )}`,
                            }}
                            className="items-center justify-center"
                        >
                            {MATYTD?.find(
                                (y) => y.year === cleanYears[2]
                            )?.attPct?.toFixed(2) ?? ""}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct -
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[0]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      MATYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct -
                                      MATYTD?.find(
                                          (y) => y.year === cleanYears[0]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                        <td className="items-center justify-center">
                            {isNaN(
                                (
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[2]
                                    )?.attPct -
                                    MATYTD?.find(
                                        (y) => y.year === cleanYears[1]
                                    )?.attPct
                                )?.toFixed(2)
                            )
                                ? ""
                                : (
                                      MATYTD?.find(
                                          (y) => y.year === cleanYears[2]
                                      )?.attPct -
                                      MATYTD?.find(
                                          (y) => y.year === cleanYears[1]
                                      )?.attPct
                                  )?.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default YTDFullAttendanceHeatmap;
