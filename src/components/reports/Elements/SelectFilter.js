import React from "react";
import _, { values } from "lodash";
import { DropDownSelect } from "../../controls/DropDownSelect";
import { typeOf } from "mathjs";

/**
 * Build a standard selector
 * @param {any} param0
 * @returns
 */
const SelectFilter = ({
    panelToShow,
    isCustomDashboard,
    filter,
    tree,
    onChange,
    value,
    schools,
    IdPrefix,
    dashPanelName
}) => {
    const [selectedValue, setSelectedValue] = React.useState([]);
    const updateValue = React.useCallback(
        (event) => {
            setSelectedValue(event.value);

            if (typeof onChange === "function")
                onChange({
                    value: event.value,
                    filter: filter,
                });
        },
        [setSelectedValue, onChange, filter]
    );

    React.useEffect(() => setSelectedValue(value || []), [value]);

    const datasource = React.useMemo(() => {
        const dashPanelName =
            typeOf(isCustomDashboard) === "string" &&
            isCustomDashboard !== "***Refresh***"
                ? isCustomDashboard
                : panelToShow?.hdr;
        const foundDashSpecific = filter?.dashboardSpecific?.find(
            (d) => d.dashboardName === dashPanelName
        );

        let valuesToUse = foundDashSpecific?.values ?? filter?.values ?? [];

        let datasource = [];

        const buildSimpleDS = () => {
            _.each(valuesToUse, (o) => {
                if (_.isArray(o))
                    datasource = _.concat(
                        datasource,
                        o.map((i) => {
                            return {
                                id: i.text,
                                value: i.value,
                                text: i.text,
                                selected: _.find(selectedValue, i)
                                    ? true
                                    : false,
                            };
                        })
                    );
                else
                    datasource.push({
                        id: o.text,
                        value: o.value,
                        text: o.text,
                        selected: _.find(selectedValue, o) ? true : false,
                    });
            });
        };
        const getTreeDataItem = (item, parentValue) => {
            // just value - just return the value
            if (
                !item.value ||
                _.isNull(item.value) ||
                typeOf(item.value) === "Object"
            ) {
                const newID = (parentValue || "") + "|" + item.text;

                return {
                    text: item.text,
                    value: item.value,
                    id: newID,
                    selected: _.indexOf(selectedValue, { id: newID }) >= 0,
                };
            }

            // array - work through the array getting the sub items
            if (typeOf(item.value) === "Array") {
                // if (_.isArray(item) && item.length > 0) {

                let items = [];

                item.value.forEach(
                    (i) =>
                        (items = _.concat(
                            items,
                            getTreeDataItem(i, parentValue)
                        ))
                );
                let data = {
                    id: item.text,
                    selected: false,
                    text: item.text,
                    items: items,
                };

                return data;
            }

            return { text: "???" };
        };

        if (tree) {
            valuesToUse?.forEach((val) => {
                datasource.push(getTreeDataItem(val));
            });
        } else if (filter.name === "Whole Mat") {
            _.each(_.sortBy(valuesToUse, ["name"]), (school) => {
                datasource.push({
                    id: school?.sequence,
                    text: school?.text ?? "",
                    value: school?.value ?? [],
                    selected: _.find(selectedValue, { id: school.sequence })
                        ? true
                        : false,
                });
            });

            if (
                datasource.length > 0 &&
                !_.find(datasource, { selected: true })
            )
                datasource[0].selected = true;
        } else {
            buildSimpleDS();
        }

        return _.orderBy(datasource, ["sequence"]);
    }, [filter, selectedValue, tree, schools, isCustomDashboard, panelToShow]);
    let showDashboard = filter.defaultOn !== false;

    if (filter.dashboardSpecific) {
        const dashPanelName =
            typeOf(isCustomDashboard) === "string" &&
            isCustomDashboard !== "***Refresh***"
                ? isCustomDashboard
                : panelToShow?.hdr;
        const foundDashSpecific = filter?.dashboardSpecific.find(
            (d) => d.dashboardName === dashPanelName
        );
        if (foundDashSpecific && !foundDashSpecific?.on) {
            return null;
        }
        if (foundDashSpecific && foundDashSpecific?.on === true)
            showDashboard = true;
    }

    if (!showDashboard) {
        return null;
    }

    return (
        <div key={IdPrefix + filter.name + dashPanelName} className="max-w-52">
        <div className="mx-1">
            <DropDownSelect
                multiSelect={filter.multi === true}
                key={"filter-" + filter.name}
                textField={"text"}
                valueField={"id"}
                items={datasource}
                value={value}
                onChange={updateValue}
                placeholder={filter.name}
                customWidth={true}
            />
        </div>
    </div>
    )
};

export default SelectFilter;
