import { useEffect } from "react";
import { DropDownSelect } from "../../controls/DropDownSelect";
import { uniqueId } from "lodash";

const MappingSecondaryRow = ({
    mapCategories,
    valuesToMap,
    setMapTo,
    setValuesToMap,
    dataSets,
}) => {
    const newDataSets = structuredClone(dataSets ? dataSets : []);
    const newMapCategories = structuredClone(
        mapCategories ? mapCategories : []
    );
    const newValuesToMap = structuredClone(valuesToMap ? valuesToMap : []);

    useEffect(() => {
        newMapCategories?.sort(function (a, b) {
            if (a?.field1 ?? "" < b?.field1 ?? "") {
                return -1;
            }
            if (a?.field1 ?? "" > b?.field1 ?? "") {
                return 1;
            }
            return 0;
        });
    }, [mapCategories]);

    const dropdownClick = (value) => {
        if (value?.mapping) {
            value?.mapping?.push(newValuesToMap);
        } else {
            value.mapping = [newValuesToMap];
        }
        const chosenCategory = mapCategories.find((c) => {
            return c?.field1 === value?.field1;
        });

        const indexOfChosenCategory = mapCategories?.indexOf(chosenCategory);
        newMapCategories.splice(indexOfChosenCategory, 1, value);

        const dataSetsForState = newDataSets.filter((d) => {
            return JSON.stringify(valuesToMap) !== JSON.stringify(d);
        });

        setMapTo(newMapCategories);
        setValuesToMap(dataSetsForState);
    };

    const stripOutSpecialCharacters = (string) => {
        const replaced = string?.replace("&amp;", "&");

        return replaced;
    };

    return (
        <div
            key={uniqueId(newValuesToMap?.field1)}
            className="flex flex-col items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2"
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap font-semibold">
                    <div className="mr-1">
                        {stripOutSpecialCharacters(newValuesToMap?.field1)} -{" "}
                    </div>
                    <div>
                        {stripOutSpecialCharacters(newValuesToMap?.field2)}
                    </div>
                </div>
                {newMapCategories?.length > 0 && (
                    <DropDownSelect
                        key={uniqueId(newValuesToMap?.field1)}
                        id={uniqueId(newValuesToMap?.field1)}
                        stopWidthLimit={false}
                        multiSelect={false}
                        valueField={"id"}
                        textField={"field1"}
                        items={newMapCategories}
                        customWidth={true}
                        onChange={(e) => {
                            dropdownClick(e.value);
                        }}
                        placeholder={"Select Mapped Value..."}
                    />
                )}
            </div>
        </div>
    );
};

export default MappingSecondaryRow;
