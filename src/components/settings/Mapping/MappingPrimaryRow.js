import {
    faChevronDown,
    faChevronUp,
    faX,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uniqueId } from "lodash";
import { useEffect } from "react";

const MappingPrimaryRow = ({
    dataSets,
    category,
    mapCategories,
    setMapTo,
    setValuesToMap,
    collapsed,
    setCollapsed,
}) => {
    const newMapCategories = structuredClone(
        mapCategories ? mapCategories : []
    );
    const newCategory = structuredClone(category ? category : []);
    const newDataSets = structuredClone(dataSets ? dataSets : []);
    const newCollapsed = structuredClone(collapsed ? collapsed : []);

    useEffect(() => {
        newDataSets?.sort(function (a, b) {
            if (a?.field1 ?? "" < b?.field1 ?? "") {
                return -1;
            }
            if (a?.field1 ?? "" > b?.field1 ?? "") {
                return 1;
            }
            return 0;
        });
    }, [dataSets]);

    const unlinkClick = (value) => {
        const foundCategory = newMapCategories.find(
            (m) =>
                m?.field1 === newCategory?.field1 &&
                m?.field2 === newCategory?.field2
        );
        const foundCategoryIndex = newMapCategories?.indexOf(foundCategory);
        const selectedCategory = newMapCategories[foundCategoryIndex];
        const categoryMapping = selectedCategory?.mapping;
        const valueFieldFiltered = categoryMapping?.filter(
            (n) => n?.field1 !== value?.field1 || n?.field2 !== value?.field2
        );
        selectedCategory.mapping = valueFieldFiltered;
        newMapCategories.splice(foundCategoryIndex, 1, selectedCategory);

        const dataSetsForState = newDataSets.concat(value);

        setMapTo(newMapCategories);
        setValuesToMap(dataSetsForState);
    };

    const collapseClick = () => {
        let collapsedForState = newCollapsed;
        if (!collapsed.includes(newCategory?.field1)) {
            collapsedForState.push(newCategory?.field1);
        } else {
            collapsedForState = newCollapsed.filter(
                (c) => c !== newCategory?.field1
            );
        }

        setCollapsed(collapsedForState);
    };

    const stripOutSpecialCharacters = (string) => {
        const replaced = string?.replace("&amp;", "&");

        return replaced;
    };

    return (
        <div
            key={newCategory.id}
            className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg p-2"
        >
            <button
                type="button"
                onClick={collapseClick}
                className="flex w-full border-none opacity-100 overflow-hidden justify-between"
            >
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1 font-semibold items-center">
                        <div>
                            {stripOutSpecialCharacters(newCategory?.field1)}
                        </div>
                        <div>
                            {category?.mapping?.length > 0 &&
                                ` (${category?.mapping?.length})`}{" "}
                            -{" "}
                        </div>
                        <div>
                            {stripOutSpecialCharacters(newCategory?.field2)}
                        </div>
                    </div>
                </div>
                <div className="border-none flex items-center justify-center text-center">
                    {collapsed.includes(newCategory?.field1) ? (
                        <FontAwesomeIcon
                            icon={faChevronUp}
                            className="w-5 h-5"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className="w-5 h-5"
                        />
                    )}
                </div>
            </button>
            {collapsed.includes(newCategory?.field1) && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {category?.mapping?.length > 0 && (
                        <>
                            {category?.mapping?.map((c) => {
                                return (
                                    <div
                                        key={uniqueId(c?.field1)}
                                        className="flex border border-slate-200 bg-white rounded-lg p-1"
                                    >
                                        <div className="flex">
                                            <div>
                                                {stripOutSpecialCharacters(
                                                    c?.field1
                                                )}
                                            </div>
                                            {c?.field1 && c.field2 && (
                                                <div className="mx-1">-</div>
                                            )}
                                            <div>
                                                {stripOutSpecialCharacters(
                                                    c?.field2
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => unlinkClick(c)}
                                            className="border-none h-6 w-6 flex items-center text-center justify-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faX}
                                                className="w-4 h-4"
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MappingPrimaryRow;
