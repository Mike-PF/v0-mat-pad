import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LevelOfAbsenceBarChart = ({ chartData }) => {
    const chartDataClone = structuredClone(chartData);

    if (!chartDataClone) return;

    const MATChartDataValues = chartDataClone.map((n) => {
        return parseFloat(n.y?.toFixed(2));
    });
    const MATChartDataLabels = chartDataClone.map((n) => {
        return n.name;
    });

    const chartOptions = {
        title: {
            text: "% pupils by level of persistent absence",
            style: {
                fontSize: "1rem",
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
            enabled: false,
            title: {
                enabled: false,
            },
            labels: {
                enabled: false,
            },
            lineColor: "f0f2f4",
            gridLineColor: "#ffffff",
            lineColor: "#ffffff",
            tickInterval: 0,
            tickAmount: 0,
        },
        xAxis: {
            type: "category",
            reversed: false,
            title: {
                text: "",
            },
            categories: MATChartDataLabels,
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
                pointPadding: 0.01,
                groupPadding: 0.05,
                borderWidth: 0,
                colorByPoint: true,
                colors: ["#5bde80", "#5b9bf5", "#7150bf", "#b30089", "#f79400"],
            },
        },
        series: [
            {
                showInLegend: false,
                lineWidth: 2,
                allowPointSelect: false,
                crisp: true,
                showCheckbox: false,
                enableMouseTracking: true,
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
                    format: "{point.y:.1f}",
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
                data: MATChartDataValues,
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
        </div>
    );
};

export default LevelOfAbsenceBarChart;
