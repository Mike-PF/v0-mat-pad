import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const YTDLineChart = ({ chartData, title, school }) => {
    const nationalChartData = chartData?.data?.map((n) => {
        return {
            y: parseFloat((n?.thisYear - n?.national)?.toFixed(2)),
            thisYear: n?.thisYear,
            national: n?.national,
            lineName: "nationalGap",
        };
    });
    const MATChartData = chartData?.data?.map((n) => {
        return {
            y: parseFloat((n?.thisYear - n?.lastYear)?.toFixed(2)),
            thisYear: n?.thisYear,
            lastYear: n?.lastYear,
            lineName: "change",
        };
    });

    const categories = chartData?.data?.map((n) => n.name);

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
        colors: ["#5b9bf5", "#f7555a"],
        xAxis: {
            reversed: false,
            title: {
                text: "Week",
            },
            labels: {
                enabled: true,
            },
            categories: categories,
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
                name: "MAT",
                data: MATChartData,
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
                    enabled: true,
                    symbol: "circle",
                },
                dataLabels: {
                    format: "{point.y:.1f}",
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
                name: "National",
                data: nationalChartData,
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
                if (this.point.lineName === "nationalGap") {
                    return `<div>Week ${this.key}</div><div style="color: ${
                        this.point.color
                    }; vertical-align: middle; text-overflow: ellipsis;  margin-bottom: 2px">Gap with national: ${this.point.y?.toFixed(
                        1
                    )}%</div><div style="color: ${
                        this.point.color
                    }; vertical-align: middle; text-overflow: ellipsis;  margin-bottom: 2px">${school} value: ${this.point.thisYear?.toFixed(
                        1
                    )}%</div><div style="color: ${
                        this.point.color
                    }; vertical-align: middle; text-overflow: ellipsis; margin-bottom: 2px">National: ${this.point.national?.toFixed(
                        1
                    )}%</div>`;
                } else if (this.point.lineName === "change") {
                    return `<div>Week ${this.key}</div><div style="color: ${
                        this.point.color
                    }; vertical-align: middle; text-overflow: ellipsis;  margin-bottom: 2px">Change since YTD last year: ${this.point.y?.toFixed(
                        1
                    )}%</div><div style="color: ${
                        this.point.color
                    };vertical-align: middle; text-overflow: ellipsis;  margin-bottom: 2px">This year value: ${this.point.thisYear?.toFixed(
                        1
                    )}%</div><div style="color: ${
                        this.point.color
                    }; vertical-align: middle; text-overflow: ellipsis;  margin-bottom: 2px">Last year value: ${this.point.lastYear?.toFixed(
                        1
                    )}%</div>`;
                }
            },
        },
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-96">
                <HighchartsReact
                    key={uniqueId("YTDLine")}
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
            <div className="w-full flex-wrap gap-x-2 items-center justify-center flex m-2 h-6">
                <div className="gap-x-1 flex items-center">
                    <div className="h-1 w-10 bg-[#5b9bf5]" />
                    <div>Change since this YTD last year</div>
                </div>
                <div className="gap-x-1 flex items-center">
                    <div className="h-1 w-10 bg-[#f7555a]" />
                    <div>Gap with national</div>
                </div>
            </div>
        </div>
    );
};

export default YTDLineChart;
