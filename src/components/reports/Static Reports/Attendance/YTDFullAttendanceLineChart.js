import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const YTDFullAttendanceLineChart = ({ chartData, schoolName, title }) => {
    if (!chartData) {
        return;
    }

    const national =
        title === "YTD attendance trends"
            ? chartData?.trend?.national?.ytd
            : chartData?.trend?.national?.yearEnd;

    const allThroughNational = national.filter((n) => n?.phase === "*");
    const nationalToUse =
        allThroughNational?.length > 0 ? allThroughNational : national;

    const nationalChartData = nationalToUse?.map((n) => {
        return {
            y: parseFloat(n?.presentPct?.toFixed(1)),
            x: n?.year,
            labelName: "National",
            colour: "#121051",
        };
    });
    const MATChartData = chartData?.charts?.map((c) => {
        return {
            y:
                title === "YTD attendance trends"
                    ? parseFloat(c?.ytd?.pct?.toFixed(1))
                    : parseFloat(c?.end?.pct?.toFixed(1)),
            x: c?.year,
            labelName: schoolName,
            colour: "#2395A4",
        };
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
            type: "line",
            borderRadius: 5,
            borderWidth: 0,
            plotBorderWidth: 0,
            inverted: false,
            parallelAxes: {
                alignTicks: true,
                allowDecimals: false,
                gridLineDashStyle: "dash",
            },
            style: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-size": "1.2rem",
                fontWeight: "400",
            },
        },
        series: [
            {
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
                cropThreshold: 300,
                opacity: 1,
                pointRange: 0,
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
                legendSymbol: "lineMarker",
                type: "line",
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
                name: "National",
                data: nationalChartData,
            },
            {
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
                    symbol: "circle",
                    enabled: true,
                },
                cropThreshold: 300,
                opacity: 1,
                pointRange: 0,
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
                legendSymbol: "lineMarker",
                type: "line",
                name: schoolName,
                data: MATChartData,
            },
        ],
        tooltip: {
            enabled: true,
            useHTML: true,
            style: {
                // height: 280,
                // overflow: "auto",
                zIndex: 1000,
                width: 200,
                display: "flex",
                color: "black",
            },
            formatter: function (e) {
                return `<div>
                       <div style="color: ${this.point.color}; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.x}</div>
                        <div>${this.y}% - ${this.point?.labelName}</div>
                    </div>`;
            },
        },
        yAxis: {
            title: {
                text: "",
            },
            labels: {
                format: "{value}%",
            },
            type: "linear",
            opposite: false,
            allowDecimals: false,
            tickInterval: 5,
        },
        colors: ["#121051", "#2395A4"],
        xAxis: {
            type: "category",
            reversed: false,
            title: {
                text: "",
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
                    enabled: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-80">
                <HighchartsReact
                    key={uniqueId("Line")}
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
        </div>
    );
};

export default YTDFullAttendanceLineChart;
