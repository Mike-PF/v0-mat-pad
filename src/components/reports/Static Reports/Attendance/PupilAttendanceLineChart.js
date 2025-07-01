import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PupilAttendanceLineChart = ({ chartData, title, name }) => {
    if (!chartData) return;

    const PupilChartData = chartData?.map((p) => {
        return { y: parseFloat(p?.attendance?.toFixed(2)), x: p?.weekNo };
    });

    const chartOptions = {
        title: {
            style: {
                fontSize: "1rem",
                lineHeight: "1.5rem",
                fontWeight: "600",
            },
            text: title,
            useHTML: true,
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
                // textTransform: "capitalize",
            },
        },
        yAxis: {
            plotLines: [
                {
                    width: 2,
                    value: 0,
                    zIndex: 0,
                },
            ],
            title: {
                text: "",
            },
            type: "linear",
            opposite: false,
            allowDecimals: false,
            labels: {
                enabled: true,
            },
        },
        colors: ["#5597f5"],
        xAxis: {
            reversed: false,
            title: {
                text: "Week",
            },
            labels: {
                enabled: true,
            },
        },
        legend: {
            layout: "horizontal",
            align: "left",
            verticalAlign: "top",
            enabled: false,
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
                connectNulls: true,
                dataLabels: {
                    enabled: false,
                    format: "{value:.2f}",
                    style: {
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
                },
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
                dataLabels: {
                    format: "{point.y:.2f}",
                    style: {
                        color: "#000000",
                        textOutline: "#ffffff",
                        strokeWidth: 4,
                    },
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
                name: name,
                data: PupilChartData,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <HighchartsReact
                key={uniqueId("YTDLine")}
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
};

export default PupilAttendanceLineChart;
