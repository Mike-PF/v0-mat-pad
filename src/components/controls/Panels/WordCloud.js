import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import wordCloud from "highcharts/modules/wordcloud.js";
import { each, filter, find, isArray } from 'lodash';

export default function WordCloud(options) {
    let panel = options.panel,
        dataSource = options.dataSource,
        dsName = panel?.ds?.name || panel?.id,
        selection = options.selection,
        colors = options.colors;

    if (!panel || !panel.ds || !panel.ds.params) {
        return <>No Parameters set for word cloud</>
    }

    let ds = dataSource.current[dsName].data,
        urn = "NONE";
    if (panel.urn === true) {
        ds = filter(ds, { urn: parseInt(selection.current.urn.urn) });
        urn = selection.current.urn.urn;
    }

    let words = [];
    each(ds, (dsItem) => {
        if (!isArray(dsItem[panel.ds.params]))
            return;

        each(dsItem[panel.ds.params], (word) => {
            let w = find(words, (x) => {
                return x.name.toLowerCase() === word.word.toLowerCase()
            });
            if (w) {
                w.weight += word.count;
            }
            else {
                words.push({
                    name: word.word,
                    weight: word.count
                })
            }
        });
    });

    wordCloud(Highcharts);
    return <HighchartsReact
        key={panel.id + "-" + urn}
        highcharts={Highcharts}
        options={{
            chart: {
                //height: singlePanel.innerHeight + ((singlePanel.height * ((panel.pos?.rowSpan || 1) - 1)) + (singlePanel.rowGap * ((panel.pos?.rowSpan || 1) - 1))),
                //width: singlePanel.width * (panel.pos?.colSpan || 1) + (singlePanel.colGap * ((panel.pos?.colSpan || 1) - 1)),
                ...(panel.chartOptions?.chart ?? {})
            },
            title: {
                text: null,
                ...(panel.chartOptions?.title ?? {})
            },
            subtitle: {
                text: null,
                ...(panel.chartOptions?.subtitle ?? {})
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: "wordcloud",
                    data: words,
                    name: panel.name,
                    colors: panel.chartOptions?.seriescolors || colors,
                    style: {
                        fontFamily: "Source Sans Pro",
                        fontWeight: 400,
                        ...(panel.chartOptions?.seriesstyle || {})
                    }
                }
            ]
        }} />
}