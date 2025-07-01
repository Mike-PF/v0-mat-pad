import React from "react";
import _, { uniqueId } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PupilPieChart = ({ chartData, title }) => {
    if (!chartData) return;

    let MATChartData = [];

    const getColour = (name) => {
        switch (name) {
            case "SEN Support":
                return "#ff9e85";
            case "EHCP":
                return "#65e086";
            case "No SEN":
                return "#7958c2";
        }
    };

    if (title === "% Pupils By Gender") {
        MATChartData = [
            {
                name: "Male",
                y: chartData?.data?.boys,
                color: "#b7008f",
            },
            {
                name: "Female",
                y: chartData?.data?.girls,
                color: "#f89a00",
            },
        ];
    }
    if (title === "% Pupils By SEN") {
        MATChartData = chartData?.data?.map((n) => {
            return {
                name: n?.name,
                y: n?.y,
                color: getColour(n.name),
            };
        });
    }

    const chartOptions = {
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
        },
        chart: {
            type: "pie",
            inverted: false,
            borderWidth: 0,
            style: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-size": "1.2rem",
            },
            spacing: [0, 0, 0, 0],
            margin: [0, 0, 0, 0],
        },
        title: {
            text: title ?? "",
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
        credits: {
            enabled: false,
        },
        tooltip: { enabled: false },
        exporting: {
            enabled: true,
        },
        plotOptions: {
            series: {
                borderRadius: 0,
                allowPointSelect: false,
                borderWidth: 0,
                size: "100%",
                innerSize: "50%",
                cursor: "pointer",
            },
        },
        series: [
            {
                type: "pie",
                name: "",
                borderWidth: 2,
                borderCoor: "#fff",
                data: MATChartData,
                size: 200,
                showInLegend: true,
                enableMouseTracking: true,
                dataLabels: [
                    {
                        enabled: true,
                        distance: 0,
                        useHTML: true,
                        format: "{point.percentage:.2f}%",
                        style: {
                            "font-family": "Source Sans Pro, sans-serif",
                            "font-size": "1.2rem",
                            fontWeight: "400",
                            color: "#000000",
                            textOutline: "#ffffff",
                            strokeWidth: 4,
                        },
                    },
                ],
            },
        ],
        tooltip: {
            enabled: true,
            // useHTML: true,
            // style: {
            //     width: 200,
            //     display: "flex",
            //     color: "black",
            // },
            // formatter: function (e) {
            //     return `<div style="color: #7150bf; text-align: center; vertical-align: middle; margin-bottom: 2px">${this.x}</div>`;
            // },
        },
    };

    return (
        <HighchartsReact
            key={uniqueId("Pupil Pie")}
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
};

export default PupilPieChart;
