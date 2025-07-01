import React, { useCallback } from 'react';
import _ from "lodash";

export const GetDashboardFilterList = (filters, isCustomDashboard, panelHeader) => {
    const visibleFilters = [];

    _.forEach(filters, (filter) => {
        let showDashboard = filter.defaultOn !== false;

        if (filter.dashboardSpecific) {
            const dashPanelName = _.isString(isCustomDashboard) && isCustomDashboard !== "***Refresh***" ? isCustomDashboard : panelHeader;
            const foundDashSpecific = filter?.dashboardSpecific.find((d) => d.dashboardName === dashPanelName);

            if (foundDashSpecific && !foundDashSpecific?.on) {
                return;
            }
            if (foundDashSpecific && foundDashSpecific?.on === true)
                showDashboard = true;
        }

        if (!showDashboard) {
            return null;
        }
        visibleFilters.push(filter);
    });

    return visibleFilters;
}

export const FindSchoolFilter = (filterValues, filters) => {
    if (!_.isArray(filters) || filters.length === 0)
        return null;

    return _.find(filters,
        (f) => {
            return (
                _.has(f, ["options", "showMAT"]) ||
                _.has(f, ["options", "showPhase"]) ||
                _.has(f, ["options", "showSchools"]) ||
                _.has(f, ["options", "showPhaseNesting"])
            );
        }
    );
}

export const GetSchoolFilterPhase = (schoolFilter, filterValues) => {
    let phaseName = "Whole MAT";
    const phases = [];
    const schoolList = [];

    if (!schoolFilter || !filterValues)
        return { phaseName, phaseList: phases };

    const filterOption = _.find(filterValues, { filterID: schoolFilter?.id });
    if (!filterOption)
        return { phaseName, phaseList: phases };

    if (_.isArray(filterOption?.value)) {
        _.forEach(filterOption.value, (v) => {
            if (v?.value?.phase?.length > 0 && !_.find(phases, (x) => x.toLowerCase() === v.value.phase.toLowerCase()))
                phases.push(v.value.phase.toLowerCase());
        });

        if (phases.length === 1)
            switch (phases[0]) {
                case "primary":
                    phaseName = "Primary";
                    break;
                case "secondary":
                    phaseName = "Secondary";
                    break;
                default:
                    phaseName = "Whole MAT";
            }
        else {
            phaseName = "Whole MAT";
        }
    }

    return { phaseName, phaseList: phases };
}