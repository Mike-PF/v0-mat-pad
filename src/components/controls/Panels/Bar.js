import React from 'react';
import Highcharts from 'highcharts'
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from 'lodash';

export default function Bar(options) {
    let panel = options.panel,
        dataSource = options.dataSource,
        dsName = panel?.ds?.name || panel?.id,
        selection = options.selection,
        chartCategories = [];

    if (!panel || (!panel.ds && !panel.ds?.params && !panel.chart && !panel.chart?.dsItem)) {
        return <>No Parameters set for LINE</>
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
        style={{ height: "100%" }}
        key={panel.id + "-" + urn}
        highcharts={Highcharts}
        options={config} />

    function loadConfig() {
        let template = JSON.parse(panel.chart?.template || "{}"),
            series = null,
            seriesData = [],
            dsItems = [];

        try {
            // this could be an array of items for multiple lines
            dsItems = JSON.parse(panel.ds.params ?? panel.chart.dsItem);
        }
        catch {
            dsItems = [{ name: '', dataset: panel.ds.params ?? panel.chart.dsItem }]
        }

        _.each(dsItems, (dsItem) => {
            var x = loadSeries(dsItem);
            if (x) seriesData.push(x);
        });

        if (!seriesData || seriesData.length === 0) {
            return <>Invalid BAR configuration</>;
        }

        var data = {
            title: null,
            credits: {
                enabled: false
            },
            tooltip: {
                //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            ...template,

            chart: {
                type: template?.chart?.type||  'column'
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                },
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    //pointStart: 0
                }
            },

            xAxis: {
                name: template?.xAxis?.name ||null,
                categories: template?.xAxis?.categories || chartCategories
            },

            yAxis: {
                name: template?.yAxis?.name || null,
                categories: template?.yAxis?.categories || null,
                title: {
                    text: template?.yAxis?.name || null,
                }

            },

            series: seriesData
        }

        return data;
    }

    function loadSeries(item) {
        var series = null;

        _.each(ds, (dsItem) => {
            let i = dsItem[item.dataset];
            if (!i || !_.isArray(i)) return;

            series = { name: i.name || item.name, data: [] };

            _.each(i, (datapoint, idx) => {
                if (_.isNumber(datapoint)) {
                    chartCategories[idx] = datapoint;
                    series.data.push(datapoint);
                    return;
                }
                if (_.isNumber(datapoint.y)) {
                    chartCategories[idx] = chartCategories[idx] || datapoint.name || datapoint.category;
                    series.data.push(datapoint.y);
                    return;
                }
                if (_.isNumber(datapoint.val)) {
                    chartCategories[idx] = chartCategories[idx] || datapoint.name || datapoint.category;
                    series.data.push(datapoint.val);
                    return;
                }
                if (_.isNumber(datapoint.value)) {
                    chartCategories[idx] = chartCategories[idx] || datapoint.name || datapoint.category;
                    series.data.push(datapoint.value);
                    return;
                }
                chartCategories[idx] = chartCategories[idx] || null;
                series.data.push(null);
            })
        });

        return series;
    }
}