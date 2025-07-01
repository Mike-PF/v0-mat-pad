import React from 'react';
import Highcharts from 'highcharts'
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from 'lodash';

export default function Pie(options) {
    let panel = options.panel,
        dataSource = options.dataSource,
        dsName = panel?.ds?.name || panel?.id,
        selection = options.selection,
        colors = options.colors;

    if (!panel || (!panel.ds && !panel.ds?.params && !panel.chart && !panel.chart?.dsItem)) {
        return <>No Parameters set for PIE</>
    }

    let ds = dataSource.current[dsName].data,
        urn = "NONE";

    if (panel.urn === true) {
        ds = _.filter(ds, { urn: parseInt(selection.current.urn.urn) });
        urn = selection.current.urn.urn;
    }

    highchartsMore(Highcharts);
    solidGauge(Highcharts);

    var config = loadConfig();
    if (config.type) return config;

    return <HighchartsReact
        key={panel.id + "-" + urn}
        highcharts={Highcharts}
        options={config} />

    function loadConfig() {
        let template = JSON.parse(panel.chart?.template || "{}"),
            series = null,
            outerSeriesData = {},
            innerSeriesData = {},
            seriesData = [],
            hasDrillDown = false;

        _.each(ds, (dsItem) => {
            let simpleElements = (panel.ds.params ?? panel.chart.dsItem).split('/');
            let item = dsItem[simpleElements[0]];

            // Convert a single number to an array
            if (_.isNumber(item)) {
                let value = parseFloat(item),
                    altVal = 100 - value;

                if (simpleElements.length === 2) {
                    altVal = parseFloat(dsItem[simpleElements[1]]);
                }

                series = [{
                    name: "With",
                    y: value
                },
                {
                    name: "Without",
                    y: altVal
                }];
            }

            if (_.isArray(item))
                series = item;

            return false;

        });

        if (!series) return <>Invalid PIE configuration</>;

        _.each(series, (i) => {
            if (i.drilldown) {
                hasDrillDown = true;
                return false;
            }
        });

        if (hasDrillDown) {
            innerSeriesData = {
                name: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.name || "Inner",
                colorByPoint: true,
                size: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.size || "60%",
                innerSize: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.innerSize || null,
                dataLabels: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.dataLabels || { distance: 10 },
                data: []
            }

            outerSeriesData = {
                name: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.subname || "Outer",
                colorByPoint: true,
                size: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.size || null,
                innerSize: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.innerSize || "60%",
                dataLabels: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.dataLabels || { distance: 10 },
                data: []
            }

            seriesData.push(innerSeriesData, outerSeriesData);
        }
        else {
            innerSeriesData = {
                name: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.name || template?.seriesInfo?.name || "With",
                colorByPoint: true,
                size: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.size || null,
                innerSize: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.innerSize || "0",
                dataLabels: ((template?.series && template.series.length > 0) ? template.series[0] : {})?.dataLabels || { distance: 10 },
                data: []
            }
            seriesData.push(innerSeriesData);
        }

        _.each(series, (i, idx) => {
            let color = i.color || colors[idx % colors.length],
                valueProp = template?.seriesInfo?.value || "y",
                nameProp = template?.seriesInfo?.data || "name";

            if (template && template.colors && template.colors.length > idx)
                color = template.colors[idx];

            innerSeriesData.data.push({
                name: i[nameProp],
                y: i[valueProp] || 0,
                color: color
            });

            if (hasDrillDown) {
                _.each(i.drilldown, (d) => {
                    outerSeriesData.data.push({
                        name: d.name || i.name,
                        y: d.y,
                        color: Highcharts.color(i.color || colors[idx % colors.length]).brighten(.1).get()
                    });
                });
            }
        });

        var data = {
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}% ({point.y})</b>'
            },
            ...template,
            title: null,
            chart: {
                type: 'pie',
                margin: template?.chart?.margin ?? 0,
                plotBackgroundColor: null,
                plotBorderWidth: null,
            },
            plotOptions: {
                pie: {
                    shadow: template?.plotOptions?.pie?.shadow === true,
                    center: ['50%', '50%'],
                    allowPointSelect: template?.plotOptions?.pie?.allowPointSelect !== false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: template?.plotOptions?.pie?.dataLabels?.enabled === true,
                        format: template?.plotOptions?.pie?.dataLabels?.format || '<b>{point.name}</b><br/>{point.percentage:.1f}% ({point.y})'
                    }
                }
            },

            series: seriesData
        }

        // console.log("PIE template: ", JSON.stringify(template));
        // console.log("PIE DATA: ", JSON.stringify(data));

        return data;
    }
}