import React from 'react';
import _ from 'lodash';

export default function ImagePanel(options) {
    let panel = options.panel,
        dataSource = options.dataSource,
        selection = options.selection;

    if (!panel || !panel.ds || !panel.ds.params) return <>No Parameters set for word cloud</>;

    let ds = dataSource?.data;
    if (panel.urn === true) ds = _.find(ds, { urn: parseInt(selection.current.urn.urn) });

    if (_.isNil(ds)) return null;

    if (ds && ds[panel.ds.params])
        return <img src={ds[panel.ds.params] + "?panelID=" + panel.id} alt="" />

    return null;
}