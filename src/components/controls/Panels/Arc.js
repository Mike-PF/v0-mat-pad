import React from 'react';
import Highcharts from 'highcharts'
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from 'lodash';
import { getDataItem } from '../../../site';

export default function Arc(options) {
    let panel = options.panel,
        dataSource = options.dataSource,
        selection = options.selection;

    if (!panel || (!panel.ds && !panel.ds?.params && !panel.chart && !panel.chart?.dsItem)) {
        return <>No Parameters set for ARC</>
    }

    let ds = dataSource?.data,
        urn = "NONE";

    if (panel.urn === true) {
        ds = _.find(ds, { urn: parseInt(selection.current.urn.urn) });
        urn = selection.current.urn.urn;
    }

    if (_.isNil(ds)) return null;

    highchartsMore(Highcharts);
    solidGauge(Highcharts);

    return <HighchartsReact
        key={panel.id + "-" + urn}
        highcharts={Highcharts}
        options={loadConfig()} />

    function loadConfig() {
        let arcTo = null,
            max = 100,
            template = panel.chart?.template || "{}";

        // get the data values to use for the arc, the getDataItem method uses the maths library to perform maths around the ds object
        arcTo = getDataItem(ds, panel.ds.params ?? panel.chart.dsItem);
        max = getDataItem(ds, template?.seriesInfo?.max, 100.0);

        // console.log("ARC: ", arcTo, panel.ds.params ?? panel.chart.dsItem, max, template?.seriesInfo?.max, ds);

        var data = {
            title: null,
            credits: {
                enabled: false
            },
            ...template,

            chart: {
                type: "solidgauge",
                margin: template?.chart?.margin ?? 0,
                style: {
                    fontFamily: "Poppins, sans-serif",
                    ...template?.chart?.style
                }
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}% ({point.y})</b>'
            },

            pane: {
                center: ['50%', '85%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    borderWidth: template?.pane?.background?.borderWidth || 10,
                    backgroundColor: "transparent",
                    shape: "arc",
                    borderColor: template?.pane?.background?.borderColor || "#f9efd8",
                    outerRadius: template?.pane?.background?.outerRadius || "95%",
                    innerRadius: template?.pane?.background?.innerRadius || "92%",
                }

            },

            yAxis: {
                min: 0,
                max: max ?? 100,
                minColor: "#009CE8",
                maxColor: "#009CE8",
                lineWidth: 0,
                tickWidth: 0,
                minorTickLength: 0,
                minTickInterval: 0,
                labels: {
                    enabled: false,
                },

            },

            plotOptions: {
                solidgauge: {
                    borderColor: template?.plotOptions?.solidgauge?.borderColor ?? "#009CE8",
                    borderWidth: template?.plotOptions?.solidgauge?.borderWidth ?? 10,
                    radius: template?.plotOptions?.solidgauge?.radius ?? 95,
                    innerRadius: template?.plotOptions?.solidgauge?.innerRadius ?? "90%",
                    dataLabels: {
                        y: template?.plotOptions?.solidgauge?.dataLabels?.y ?? 5,
                        borderWidth: template?.plotOptions?.solidgauge?.dataLabels?.borderWidth ?? 0,
                        useHTML: template?.plotOptions?.solidgauge?.dataLabels?.useHTML === true,
                    }
                },
            },

            series: [
                {
                    data: [arcTo],
                    name: template?.seriesInfo?.name || (template?.series?.length > 0 ? template.series[0].name : "Percentage At or Above"),
                    "dataLabels": {
                        "format": "<span style=\"font-size: 1.8rem; color:" + (template?.plotOptions?.solidgauge?.borderColor ?? "#009CE8") + "\">{percentage:.1f}%</span>"
                    }
                }
            ],
        };
        return data;
    }
}