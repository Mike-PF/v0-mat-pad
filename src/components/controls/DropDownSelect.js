import React, {
    forwardRef,
    useRef,
    useState,
    useEffect,
    useMemo,
    useImperativeHandle,
    useCallback,
} from "react";
import _ from "lodash";
import { CSSTransition } from "react-transition-group";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const DropDownSelect = forwardRef((props, ref) => {
    const [dropped, setDropped] = useState(false);
    const [IdPrefix] = useState(_.uniqueId("dds-"));

    const multiSelect = props.multiSelect === true;
    const valueField = props.valueField || "id";
    const textField = props.textField || "value";
    const itemsField = props.itemsField || "items";
    const selectedField = props.selectedField || "selected";
    const selectableField = props.selectableField || "selectable";
    const expandedField = props.expandedField || "expanded";
    const readOnly = props.readonly === true;
    const autoCapitalise = props.autoCapitalise;
    const stopWidthLimit = props.stopWidthLimit;
    const [dropdownPosition, setDropdownPosition] = useState(0);
    const [dropdownStyles, setDropdownStyles] = useState({});
    const [loadingRef, setLoadingRef] = useState(false);

    const [selectedValue, setSelectedValueInternal] = useState(
        _.filter(props.items, (i) => {
            return i[selectedField] === true;
        }).map((item) => {
            return {
                id: item[valueField],
                onlyValue: item?.onlyValue ?? false,
                text: item[textField] || "<<undefined>>",
                selected: item[selectedField] === true,
                selectable: item[selectableField] !== false,
                original: item,
                items:
                    _.isArray(item[itemsField]) && item[itemsField].length > 0
                        ? []
                        : null,
            };
        })
    );

    const panelRef = useRef();
    const dropRef = useRef();
    const listState = useRef();
    const wrapRef = useRef();

    const setSelectedValue = (value) => setSelectedValueInternal(value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                dropRef.current &&
                !dropRef.current.contains(event.target) &&
                dropped
            )
                setDropped(false);
        };

        const handleScroll = (event) => {
            if (!dropped) return;

            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                dropRef.current &&
                !dropRef.current.contains(event.target) &&
                dropped
            )
                setDropped(false);
        };
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        const contentWrapper = document.getElementsByClassName("panel2");
        if (contentWrapper?.length > 0)
            contentWrapper[0].addEventListener("scroll", handleScroll);
        return () => {
            const contentWrapper = document.getElementsByClassName("panel2");
            if (contentWrapper?.length > 0)
                contentWrapper[0].removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [panelRef, dropped]);

    useEffect(() => {
        if (wrapRef.current && wrapRef.current.parentNode) {
            wrapRef.current.parentNode.classList[dropped ? "add" : "remove"](
                "ddl-expanded"
            );

            if (dropped) {
                const btm =
                    wrapRef.current.parentNode.getBoundingClientRect().bottom;
                wrapRef.current.parentNode.style.setProperty(
                    "--top",
                    btm + "px"
                );
            }
        }
    }, [wrapRef, dropped]);

    let liClickTimer = null;

    useImperativeHandle(ref, () => {
        let v = null;

        if (_.isArray(selectedValue) && selectedValue.length > 0) {
            if (multiSelect) {
                v = selectedValue ? selectedValue.map((v) => v.original) : null;
            } else {
                v = selectedValue ? selectedValue[0].original : null;
            }
        }
        return { value: v };
    });

    const updateValue = (value, selectAll = false, selectSiblings = false) => {
        setSelectedValue(value);
        let v = null;
        if (multiSelect) {
            v = value ? value.map((v) => v.original) : null;
        }
        else {
            v = value ? value[0].original : null;
        }
        ref = { value: v };

        if (typeof props.onChange === "function")
            props.onChange({
                value: v,
            });
    };

    const renderValue = () => {
        if (!selectedValue || selectedValue.length === 0) {
            return props.placeholder || "Empty";
        }

        if (!multiSelect) {
            if (selectedValue && selectedValue.length > 0) {
                if (
                    selectedValue[0].text?.startsWith("&") &&
                    selectedValue[0].text?.endsWith(";")
                )
                    return (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: selectedValue[0].text,
                            }}
                        />
                    );

                return selectedValue[0].text;
            }
            return "";
        }

        const value = [];

        _.sortBy(selectedValue, [valueField]).forEach((v, idx) => {
            value.push(
                <span
                    key={IdPrefix + "keyvalue-" + idx}
                    data-l={v.listID}
                    className="value-item"
                >
                    {v.text}
                </span>
            );
        });
        return (
            <>
                {selectedValue.length > 1 && (
                    <span key={IdPrefix + "keyvalue"} className="item-count">
                        {selectedValue.length}
                    </span>
                )}
                {value}
            </>
        );
    };
    const topPanelClick = (event) => setDropped(!dropped);

    const liClicked = (event, item) => {
        event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();

        // expandable item
        if (_.isArray(item.items)) {
            item.expanded = !item.expanded;
            try {
                if (liClickTimer) clearTimeout(liClickTimer);

                // get the UL for the sub items
                let ul = event.currentTarget.getElementsByTagName("UL")[0];
                let h = item.expanded ? ul.scrollHeight + "px" : 0;

                // set the style variable
                ul.style.setProperty("--height", h);

                // in 250ms, set the variable to fit-content, this covers the user clicking another sub item
                if (item.expanded) {
                    liClickTimer = setTimeout(() => {
                        ul.style.setProperty("--height", "fit-content");
                    }, 250);
                }
            } catch {
                debugger;
            }

            event.currentTarget.classList[item.expanded ? "add" : "remove"](
                "expanded"
            );

            return false;
        }

        if (!item.selectable) return false;

        // single select - set single item
        if (!multiSelect) {
            if (item.selected) {
                if (props.toggleClick) {
                    item.selected = false;
                    event.currentTarget.classList.remove("selected");
                    updateValue(null);
                } else {
                    return false;
                }
            }
            else {
                clearSelected(listItems);
                item.selected = true;
                event.currentTarget.classList.add("selected");
                updateValue([item]);
            }

            setDropped(false);
            return false;
        }

        // multiple items - toggle the selected item
        if (item.selected) {
            const siblings = item.original?.value?.selectSiblings === true;
            let newValues = []

            // SIBLING toggle - remove all children from selection
            if (siblings && item.parent) {
                _.forEach(selectedValue, (v) => {
                    if (v.parent !== item.parent) {
                        newValues.push(v);
                    }
                    else {
                        v.selected = false;
                    }
                })
            }
            else {
                // check for siblings in the same branch
                _.forEach(listItems, (i) => {
                    if (item.parent === i.id) {
                        _.forEach(i.items, (x) => {
                            if (x.selectSiblings === true) {
                                x.ref.current.getElementsByTagName("INPUT")[0].checked = false;
                                x.selected = false;
                            }
                        })
                    }
                });
                newValues = _.filter(selectedValue, (x) => x.id !== item.id);
            }

            item.selected = false;
            event.currentTarget.classList.remove("selected");

            item.ref.current.getElementsByTagName("INPUT")[0].checked = false;
            updateValue(newValues);
        }
        else {
            const siblings = item.selectSiblings === true;
            const only = item.onlyValue === true;
            let values = [...selectedValue];

            if (only === true) {
                // Only option to be selected
                clearSelected(listItems);
                values = [];
            }
            else {
                // look for an only option that needs turning off
                _.forEach(listItems, (i) => {
                    if (i.onlyValue === true) {
                        i.ref.current.getElementsByTagName("INPUT")[0].checked = false;
                        i.selected = false;
                        values = _.filter(values, (x) => x.id !== i.id);
                    }
                });
            }

            if (siblings && item.parent) {
                // Siblings need turning on
                _.forEach(_.find(listItems, (i) => i.id === item.parent)?.items || [],
                    (i) => {
                        if (item.parent === i.parent && i.selectable && i.selected !== true && i.id !== item.id) {
                            i.ref.current.getElementsByTagName("INPUT")[0].checked = true;
                            i.selected = true;
                            values.push(i);
                        }
                    }
                );
            }

            // Don't add Siblings to selected values
            if (!siblings)
                values.push(item);

            item.selected = true;
            event.currentTarget.classList.add("selected");
            item.ref.current.getElementsByTagName("INPUT")[0].checked = true;

            updateValue(values);
        }
        return false;
    };

    const clearSelected = (list) => {
        _.each(list, (i) => {
            if (i.selected) {
                i.ref.current.classList.remove("selected");
                i.selected = false;
            }
            if (_.isArray(i.items)) clearSelected(i.items);
        });
    };

    const listItems = useMemo(() => {
        if (!_.isArray(props.items) || props.items.length === 0) {
            return [
                {
                    id: null,
                    text: "No data loaded",
                    selected: false,
                    selectable: false,
                    items: null,
                },
            ];
        }

        if (_.isArray(listState.current) && listState.current.length > 0)
            return listState.current;

        let listID = 0;
        listState.current = [];
        const addItems = (list, itemList, parentItem) => {
            _.each(list, (item) => {
                const i = {
                    listID: listID,
                    id: item[valueField],
                    text: item[textField] || "<<undefined>>",
                    selected:
                        item[selectedField] === true ||
                        (_.find(selectedValue, { listID: listID })
                            ? true
                            : false),
                    selectable: item[selectableField] !== false,
                    original: item,
                    parent: parentItem?.id || null,
                    onlyValue: item.value?.onlyValue === true,
                    selectSiblings: item.value?.selectSiblings === true,
                    items:
                        _.isArray(item[itemsField]) &&
                            item[itemsField].length > 0
                            ? []
                            : null,
                };

                listID++;
                itemList.push(i);

                if (
                    _.isArray(item[itemsField]) &&
                    item[itemsField].length > 0
                ) {
                    i.expanded = item[expandedField] === true;
                    addItems(item[itemsField], i.items, i);
                }
            });
        };

        addItems(props.items, listState.current);

        return listState.current;
    }, [
        textField,
        valueField,
        itemsField,
        expandedField,
        selectedField,
        selectableField,
        props.items,
        listState,
        selectedValue,
    ]);

    useEffect(() => {
        if (
            typeof props.value === "undefined" ||
            !listItems ||
            selectedValue != null
        )
            return;

        if (!props.value) {
            if (!_.isArray(selectedValue) || selectedValue.length > 0)
                setSelectedValue([]);
            return;
        }
        const items = [];

        function findRecurs(array, key, value) {
            var o;
            array.some(function iter(a) {
                if (a[key] === value) {
                    o = a;
                    return true;
                }
                return Array.isArray(a[itemsField]) && a[itemsField].some(iter);
            });
            return o;
        }

        if (_.isArray(props.value)) {
            _.each(props.value, (v) => {
                const item = findRecurs(listItems, "id", v[valueField]);
                if (item) items.push(item);
            });

            listState.current = null;
        } else if (_.isObject(props.value)) {
            const item = findRecurs(listItems, "id", props.value[valueField]);

            if (item) items.push(item);

            listState.current = null;
        } else {
            const item = findRecurs(listItems, "id", props.value);

            if (item) items.push(item);

            listState.current = null;
        }

        setSelectedValue(items);
    }, [props, selectedValue, listItems, valueField, listState, itemsField]);

    useEffect(() => {
        if (props.value === "***Refresh***") {
            const clearItemsInList = (list) => {
                _.each(list, (item) => {
                    if (item.selected) item.selected = false;
                    if (_.isArray(item.items)) clearItemsInList(item.items);
                });
            };

            clearItemsInList(listItems);
            setSelectedValue([]);
        }
    }, [props]);

    const DropDownPanel = () => {
        const ListItem = ({ item }) => {
            const listClassName = () => {
                let className =
                    (item.selectable !== true || _.isArray(item.items)
                        ? "non-sel "
                        : "") +
                    (_.isArray(item.items) ? "expandable " : "") +
                    (item.selected ? "selected " : "") +
                    (item.expanded === true ? "expanded " : "") +
                    "item";

                return className;
            };

            item.ref = useRef();

            return (
                <li
                    key={IdPrefix + item.listID + "-li"}
                    ref={item.ref}
                    onClick={(e) => liClicked(e, item)}
                    data-id={item.listID}
                    className={classNames(listClassName())}
                >
                    {_.isArray(item.items) && (
                        <span className="drop-arrow">
                            <i className={"fa-regular fa-chevron-right"} />
                        </span>
                    )}
                    <span className="checkbox-wrap">
                        <input
                            type="checkbox"
                            key={IdPrefix + item.listID + "-li-chk"}
                            checked={item.selected}
                            readOnly
                        />
                        <span></span>
                    </span>
                    <span
                        className={classNames(
                            autoCapitalise === false ? "" : "capitalize",
                            "flex truncate"
                        )}
                    >
                        {item.text?.startsWith("&") &&
                            item.text?.endsWith(";") && (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: item.text,
                                    }}
                                />
                            )}
                        {!(
                            item.text?.startsWith("&") &&
                            item.text?.endsWith(";")
                        ) && item.text}
                    </span>
                    {_.isArray(item.items) && (
                        <ul
                            style={{
                                "--height":
                                    item.expanded === true ? "fit-content" : 0,
                            }}
                            key={IdPrefix + item.listID + "-ul"}
                        >
                            {item.items.map((subItem) => (
                                <ListItem
                                    key={
                                        IdPrefix + subItem.listID + "-listitem"
                                    }
                                    item={subItem}
                                />
                            ))}
                        </ul>
                    )}
                </li>
            );
        };

        return (
            <ul
                className="max-h-48 w-full"
                key={IdPrefix + "-master-li"}
                id={IdPrefix + "-master-li"}
            >
                {props.children && <div className="px-1">{props.children}</div>}
                {listItems.map((item) => (
                    <ListItem
                        key={IdPrefix + item.listID + "-li"}
                        item={item}
                    />
                ))}
            </ul>
        );
    };

    const clearSelection = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove("visible");

        if (dropRef && dropRef.current) {
            _.each(
                _.filter(dropRef.current.getElementsByTagName("input"), {
                    type: "checkbox",
                    checked: true,
                }),
                (element) => {
                    element.checked = false;
                }
            );
            _.each(
                _.filter(dropRef.current.getElementsByClassName("selected"), {
                    tagName: "LI",
                }),
                (element) => {
                    element.classList.remove("selected");
                }
            );
        }

        const clearItemsInList = (list) => {
            _.each(list, (item) => {
                if (item.selected) item.selected = false;
                if (_.isArray(item.items)) clearItemsInList(item.items);
            });
        };

        clearItemsInList(listItems);

        updateValue([]);
        setDropped(false);
    };

    const panelPosition = document
        .getElementById(props.name || IdPrefix + "dropdown-input")
        ?.getBoundingClientRect();

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    useEffect(() => {
        if (dropped === true && dropRef) {
            setTimeout(() => {
                setLoadingRef(true);
            }, 300);
        }
        if (dropped === false) {
            setLoadingRef(false);
        }
    }, [dropped]);

    const memoFunction = () => {
        const rightPosition = `${(
            dropdownPosition?.left -
            dropdownPosition?.width +
            panelPosition?.width
        )?.toFixed()}px`;
        const topPosition = `${(
            dropdownPosition?.top -
            dropdownPosition?.height -
            panelPosition?.height -
            20
        )?.toFixed()}px`;

        if (rightPosition && topPosition) {
            if (
                dropdownPosition?.right > screenW &&
                dropdownPosition?.bottom > screenH
            ) {
                setDropdownStyles({
                    top: `${topPosition}`,
                    left: `${rightPosition}`,
                });
                return;
            }
            if (dropdownPosition?.bottom > screenH) {
                setDropdownStyles({ top: `${topPosition}` });
                return;
            }
            if (dropdownPosition?.right > screenW) {
                setDropdownStyles({ left: `${rightPosition}` });
                return;
            }
            if (panelPosition) {
                setDropdownStyles({
                    top: `${panelPosition?.top}`,
                    left: `${panelPosition?.left}`,
                });
                return;
            } else {
                setDropdownStyles({ display: "none" });
                return;
            }
        }
    };

    useMemo(() => memoFunction(), [dropdownPosition, dropped]);

    const getTitle = () => {
        let newTitle = "";

        selectedValue?.map((s, index) => {
            if (index === 0) {
                newTitle = s?.text;
            } else {
                newTitle = newTitle?.concat(`, ${s?.text}`);
            }
        });

        return newTitle;
    };

    return (
        <div
            key={IdPrefix + "wrap"}
            ref={wrapRef}
            className={classNames(
                props.customWidth ? "" : "w-60",
                "drop-select-wrap" + (dropped ? " dropped" : "")
            )}
        >
            <span
                ref={panelRef}
                className={classNames(
                    multiSelect ? "multi" : "",
                    "k-dropdownlist k-picker k-picker-md k-rounded-md drop-select-input k-picker-solid k-input-solid"
                )}
                style={{ maxWidth: props?.maxWidth }}
                role={"combobox"}
                aria-required={props.required === true}
                name={props.name || IdPrefix + "dropdown-input"}
                id={props.name || IdPrefix + "dropdown-input"}
                title={getTitle()}
            >
                <span onClick={topPanelClick} className={"k-input-inner"}>
                    <span
                        key={IdPrefix + "dropdownselect-value-" + props.name}
                        className={classNames(
                            multiSelect ? "multi" : "",
                            autoCapitalise === false ? "" : "capitalize",
                            "k-input-value-text"
                        )}
                    >
                        {renderValue()}
                    </span>
                    {multiSelect && (
                        <button
                            onClick={clearSelection}
                            tabIndex={"-1"}
                            type={"button"}
                            aria-label={"clear"}
                            aria-hidden={"true"}
                            className={
                                "k-button k-button-md k-button-solid k-button-solid-base k-icon-button k-input-button clear-icon" +
                                (selectedValue?.length > 0 ? " visible" : "")
                            }
                        >
                            <span className="clear-icon">
                                <i className={"fa-sharp fa-solid fa-times"} />
                            </span>
                        </button>
                    )}
                    <button
                        tabIndex={"-1"}
                        type={"button"}
                        aria-label={"select"}
                        aria-hidden={"true"}
                        className={
                            "k-button k-button-md k-button-solid k-button-solid-base k-icon-button k-input-button items-center"
                        }
                    >
                        <span className="drop-arrow">
                            <i
                                className={
                                    "fa-regular fa-chevron-down" +
                                    (dropped ? " fa-rotate-180" : "")
                                }
                            />
                        </span>
                    </button>
                </span>
            </span>
            <CSSTransition
                onEntered={(event) => {
                    const rect = dropRef?.current?.getBoundingClientRect();
                    setDropdownPosition(rect);
                }}
                mountOnEnter
                unmountOnExit
                in={dropped}
                timeout={250}
                classNames="collapsed"
            >
                <div
                    style={dropdownStyles}
                    className={classNames(
                        stopWidthLimit === true ? "w-max" : "max-w-[300px]",
                        loadingRef ? "" : "opacity-0",
                        "drop-select mt-2 flex items-center"
                    )}
                    id={IdPrefix + "drop select"}
                    ref={dropRef}
                >
                    <DropDownPanel key={IdPrefix + "-drop-panel"} />
                </div>
            </CSSTransition>
        </div>
    );
});
