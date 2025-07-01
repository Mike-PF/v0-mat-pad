import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SinglePupilWeekdayBarChart = ({
    chartData,
    title,
    thisYear,
    lastYear,
}) => {
    if (!chartData) return;

    const thisYearDataSeries = chartData?.thisYear?.map((n) => {
        return [n?.day, parseFloat(n?.pct?.toFixed(2)) ?? null];
    });

    const lastYearDataSeries = chartData?.lastYear?.map((n) => {
        return [n?.day, parseFloat(n?.pct?.toFixed(2)) ?? null];
    });

    const chartOptions = {
        title: {
            text: title,
            style: {
                fontSize: "1rem",
                lineHeight: "1.5rem",
                fontWeight: "600",
                // textTransform: "capitalize",
            },
        },
        subtitle: {
            text: null,
        },
        exporting: {
            enabled: true,
        },
        chart: {
            type: "column",
            borderRadius: 5,
            borderWidth: 0,
            plotBorderWidth: 0,
            inverted: false,
            parallelAxes: {
                alignTicks: true,
                allowDecimals: true,
                gridLineDashStyle: "dash",
            },
            style: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-size": "1.2rem",
                fontWeight: "400",
            },
        },
        yAxis: {
            lineColor: "f0f2f4",
            endOnTick: false,
            tickColour: "#ffffff",
        },
        xAxis: {
            lineColor: "f0f2f4",
            type: "category",
            reversed: false,
            tickInterval: 0,
            tickAmount: 0,
            endOnTick: false,
        },
        credits: {
            enabled: false,
        },
        pane: {
            background: [],
        },
        responsive: {
            rules: [],
        },
        plotOptions: {
            series: {
                // stacking: "normal",
                dataLabels: {
                    verticalAlign: "bottom",
                    format: "{value:.2f}",
                    enabled: true,
                    style: {
                        "font-size": "1.5rem",
                        textOutline: null,
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
                },
                pointPadding: 0.1,
                groupPadding: 0.2,
                borderWidth: 0,
                borderColor: "#ffffff",
                borderRadius: 0,
            },
        },
        colors: ["#7150bf", "#ff997f"],
        series: [
            {
                name: lastYear,
                showInLegend: true,
                lineWidth: 2,
                allowPointSelect: true,
                crisp: true,
                showCheckbox: false,
                enableMouseTracking: true,
                dataLabels: {
                    style: {
                        fontWeight: "400",
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
                },
                cropThreshold: 300,
                opacity: 1,
                softThreshold: true,
                states: {
                    normal: {
                        animation: true,
                    },
                    hover: {
                        animation: {
                            duration: 150,
                        },
                        lineWidthPlus: 1,
                        halo: {
                            size: 10,
                            opacity: 0.25,
                        },
                    },
                    select: {
                        animation: {
                            duration: 0,
                        },
                    },
                    inactive: {
                        animation: {
                            duration: 150,
                        },
                        opacity: 0.2,
                    },
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: "x",
                dashStyle: "Solid",
                boostThreshold: 5000,
                colorAxis: false,
                compare: "",
                gapSize: 0,
                getExtremesFromAll: false,
                showInNavigator: false,
                shadow: false,
                selected: false,
                data: lastYearDataSeries,
            },
            {
                name: thisYear,
                showInLegend: true,
                lineWidth: 2,
                allowPointSelect: true,
                crisp: true,
                showCheckbox: false,
                enableMouseTracking: true,
                dataLabels: {
                    style: {
                        fontWeight: "400",
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
                },
                cropThreshold: 300,
                opacity: 1,
                softThreshold: true,
                states: {
                    normal: {
                        animation: true,
                    },
                    hover: {
                        animation: {
                            duration: 150,
                        },
                        lineWidthPlus: 1,
                        halo: {
                            size: 10,
                            opacity: 0.25,
                        },
                    },
                    select: {
                        animation: {
                            duration: 0,
                        },
                    },
                    inactive: {
                        animation: {
                            duration: 150,
                        },
                        opacity: 0.2,
                    },
                },
                stickyTracking: true,
                turboThreshold: 1000,
                findNearestPointBy: "x",
                dashStyle: "Solid",
                boostThreshold: 5000,
                colorAxis: false,
                compare: "",
                gapSize: 0,
                getExtremesFromAll: false,
                showInNavigator: false,
                shadow: false,
                selected: false,
                data: thisYearDataSeries,
            },
        ],
    };

    return (
        <div className="w-full h-full overflow-auto">
            <HighchartsReact
                key={uniqueId("bar")}
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
};

export default SinglePupilWeekdayBarChart;
