import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BarChart = ({ chartData, title }) => {
    const chartDataClone = chartData?.series
        ? structuredClone(chartData?.series)
        : [];

    if (!chartDataClone) return;

    const getplotLines = () => {
        let plotLines = [];

        if (chartData?.nationalAverage?.primary) {
            plotLines.push({
                width: 3,
                value: chartData?.nationalAverage?.primary,
                name: "Primary phase",
                zIndex: 20,
                dashStyle: "Dot",
            });
        }
        if (chartData?.nationalAverage?.secondary) {
            plotLines.push({
                width: 3,
                value: chartData?.nationalAverage?.secondary,
                name: "Secondary phase",
                zIndex: 20,
                dashStyle: "Dash",
            });
        } else if (chartData?.nationalAverage?.combined) {
            plotLines.push({
                width: 3,
                value: chartData?.nationalAverage?.combined,
                name: "All through",
                zIndex: 20,
                dashStyle: "Dot",
            });
        }
        return plotLines;
    };

    const MATChartDataValues = chartDataClone
        .map((n) => {
            return n.y?.toFixed(1);
        })
        .filter(function (element) {
            return element !== "";
        });

    const MATChartDataSeries = chartDataClone
        .map((n) => {
            return { x: n?.name, y: n?.y };
        })
        .filter(function (element) {
            return element !== "";
        });

    const allValues = [
        chartData?.nationalAverage?.primary,
        chartData?.nationalAverage?.secondary,
        chartData?.nationalAverage?.combined,
        Math.min(...MATChartDataValues),
        Math.max(...MATChartDataValues),
    ];

    const values = allValues.filter(function (element) {
        return element !== undefined;
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
            min: Math.min(...values) - 1,
            max: Math.max(...values) + 1,
            endOnTick: false,
            startOnTick: false,
            gridLineColor: "#ffffff",
            lineColor: "#ffffff",
            tickPositions: [Math.min(...values) - 1, Math.max(...values) + 1],
            enabled: false,
            title: {
                enabled: false,
            },
            plotLines: getplotLines(),
            labels: {
                enabled: false,
                style: {
                    color: "#000000",
                },
            },
            lineColor: "f0f2f4",
            tickInterval: 0,
            tickAmount: 0,
        },
        xAxis: {
            type: "category",
            reversed: false,
            labels: {
                format: "Y{text}",
            },
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
                dataLabels: {
                    verticalAlign: "bottom",
                    enabled: true,
                    style: {
                        "font-size": "1.5rem",
                        textOutline: null,
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
                },
                pointPadding: 0.05,
                groupPadding: 0.07,
                borderWidth: 2,
                borderColor: "#ffffff",
            },
        },
        colors: ["#7150bf"],
        series: [
            {
                showInLegend: false,
                lineWidth: 2,
                allowPointSelect: false,
                enableMouseTracking: true,
                crisp: true,
                showCheckbox: false,
                marker: {
                    enabledThreshold: 2,
                    lineColor: "#ffffff",
                    lineWidth: 0,
                    radius: 4,
                    states: {
                        normal: {
                            animation: true,
                        },
                        hover: {
                            animation: {
                                duration: 150,
                            },
                            enabled: true,
                            radiusPlus: 2,
                            lineWidthPlus: 1,
                        },
                        select: {
                            fillColor: "#cccccc",
                            lineColor: "#000000",
                            lineWidth: 2,
                        },
                    },
                    enabled: true,
                    symbol: "circle",
                },
                dataLabels: {
                    format: "{point.y:.1f}%",
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
                borderWidth: "",
                colorAxis: false,
                compare: "",
                gapSize: 0,
                getExtremesFromAll: false,
                showInNavigator: false,
                shadow: false,
                selected: false,
                data: MATChartDataSeries,
            },
        ],
        tooltip: {
            enabled: true,
            useHTML: true,
            style: {
                width: 200,
                display: "flex",
                color: "black",
            },
            formatter: function (e) {
                return `<div>${this.key}</div><div style="color: ${
                    this.point.color
                }; width: 200px; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.y?.toFixed(
                    1
                )}%</div>`;
            },
        },
    };

    return (
        <div className="w-full">
            <div className="w-full h-96">
                <HighchartsReact
                    key={uniqueId("bar")}
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
            <div className="w-full flex-wrap gap-x-4 items-center justify-center flex m-2 h-6">
                {chartData?.nationalAverage?.primary && (
                    <div className="gap-x-1 flex items-center justify-center">
                        <div className="h-1 w-1 rounded-sm bg-[#999999]" />
                        <div className="h-1 w-1 rounded-sm bg-[#999999]" />
                        <div className="h-1 w-1 rounded-sm bg-[#999999]" />
                        <div className="h-1 w-1 rounded-sm bg-[#999999] mr-1" />
                        <div>
                            Primary nat. av. - (
                            {chartData?.nationalAverage?.primary?.toFixed(1) ??
                                " "}
                            %)
                        </div>
                    </div>
                )}
                {chartData?.nationalAverage?.secondary && (
                    <div className="gap-x-1 flex items-center justify-center">
                        <div className="h-1 w-2 bg-[#999999]" />
                        <div className="h-1 w-2 bg-[#999999]" />
                        <div className="h-1 w-2 bg-[#999999]" />
                        <div className="h-1 w-2 bg-[#999999] mr-1" />
                        <div>
                            Secondary nat. av. - (
                            {chartData?.nationalAverage?.secondary?.toFixed(
                                1
                            ) ?? " "}
                            %)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarChart;
