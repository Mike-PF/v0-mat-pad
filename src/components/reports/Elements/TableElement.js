import React from "react";
import _ from "lodash";
import { UncontrolledTooltip } from "reactstrap";
import { LoadingSpinner } from "../../controls/LoadingSpinner";

const Cell = (props) => {
    const { cell, idPrefix, tableDef, parentCell, dropped, nested } = props;
    const cellRef = React.useRef();

    React.useEffect(() => {
        if (
            cell.style &&
            cellRef &&
            cellRef.current &&
            cellRef.current.parentNode
        ) {
            cellRef.current.parentNode.setAttribute(
                "style",
                cellRef.current.parentNode.getAttribute("style") +
                ";" +
                cell.style
            );
        }
    }, [nested, cellRef, cell.style]);

    return (
        <div
            id={
                idPrefix +
                "c" +
                cell.r +
                "-" +
                cell.c +
                (parentCell ? "_" + parentCell.r + "-" + parentCell.c : "")
            }
            key={
                idPrefix +
                "c" +
                cell.r +
                "-" +
                cell.c +
                (parentCell ? "_" + parentCell.r + "-" + parentCell.c : "")
            }
            ref={cellRef}
            colSpan={cell.cs || null}
            rowSpan={cell.rs || null}
        >
            <div
                className={
                    "cell-content" +
                    (nested ? (dropped ? " expanded" : " collapsed") : "")
                }
            >
                {nested && (
                    <span className="drop-arrow">
                        <i className="fa-regular fa-chevron-right"></i>
                    </span>
                )}
                {cell.html ? (
                    <span
                        dangerouslySetInnerHTML={{ __html: cell.txt || "" }}
                    />
                ) : (
                    cell.txt
                )}
            </div>
            {cell.additional && cell.additional.tooltip && (
                <UncontrolledTooltip
                    target={
                        idPrefix +
                        "c" +
                        cell.r +
                        "-" +
                        cell.c +
                        (parentCell
                            ? "_" + parentCell.r + "-" + parentCell.c
                            : "")
                    }
                    placement="right"
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: cell.additional.tooltip,
                        }}
                    />
                </UncontrolledTooltip>
            )}
        </div>
    );
};
const Row = (props) => {
    const {
        row,
        isHeader,
        isFooter,
        isBody,
        idPrefix,
        rowIndex,
        tableDef,
        className,
    } = props;
    const nestedRef = React.useRef();
    const nestedCell = _.find(row, (cell) => _.isArray(cell.nested));
    const nested = _.isArray(nestedCell?.nested)
        ? _.groupBy(nestedCell.nested || null, (c) => c.r)
        : null;
    const [dropped, setDropped] = React.useState(
        tableDef?.startCollapsed !== false
    );

    React.useEffect(() => {
        if (!nestedCell) return;

        if (
            nestedRef &&
            nestedRef.current &&
            nestedRef.current.style &&
            nestedCell.nested &&
            tableDef.style
        ) {
            const regex = /grid-template-columns:\s([^;]*)/gm;
            const match = regex.exec(tableDef.style);
            const style = match && match[1];

            if (style)
                nestedRef.current.style.setProperty(
                    "grid-template-columns",
                    style
                );

            if (!nestedRef.current.style.getPropertyValue("--content-height"))
                nestedRef.current.style.setProperty(
                    "--content-height",
                    nestedRef.current.scrollHeight + "px"
                );
        }

        setDropped(!tableDef?.startCollapsed || false);
    }, [nestedRef, nestedCell, tableDef, setDropped]);

    if (!_.isArray(row) || row.length === 0) return;

    const CellWrapper = (props) => {
        const { cell, dropped, toggleDrop, firstCell, lastCell } = props;

        return (
            <div
                onClick={(e) => {
                    if (typeof toggleDrop === "function") toggleDrop();
                }}
                className={(
                    (cell.className || "") +
                    " cell" +
                    (firstCell ? " first-in-row " : "") +
                    (lastCell ? " last-in-row " : "") +
                    (isHeader ? " header" : "") +
                    (isFooter ? " footer" : "") +
                    (isBody ? " body" : "") +
                    (cell.nested ? " nesting" : "") +
                    " " +
                    (className || "")
                ).trim()}
                style={{
                    "--grid-def": cell.nested ? tableDef.style : null,
                    gridColumnStart: cell.c,
                    gridColumnEnd:
                        cell.cs > 1
                            ? "span " + cell.cs
                            : cell.cs === -1
                                ? -1
                                : null,
                    gridRowStart: rowIndex,
                    gridRowEnd:
                        cell.rs > 1
                            ? "span " + cell.rs
                            : cell.rs === -1
                                ? -1
                                : null,
                }}
                title={cell.tooltip || null}
            >
                <Cell
                    dropped={dropped}
                    tableDef={tableDef}
                    idPrefix={idPrefix}
                    nested={firstCell && _.isArray(cell.nested)}
                    cell={cell}
                />
            </div>
        );
    };

    return (
        <>
            {_.sortBy(row, ["c"]).map((cell, idx, cells) => (
                <CellWrapper
                    firstCell={idx === 0}
                    lastCell={idx === cells.length - 1}
                    dropped={dropped}
                    key={idPrefix + cell.r + "-" + cell.c}
                    cell={cell}
                    toggleDrop={
                        nested
                            ? () => {
                                setDropped(!dropped);
                            }
                            : null
                    }
                />
            ))}
            {nestedCell && (
                <div
                    ref={nestedRef}
                    style={{
                        "--grid-def": nestedCell.nested ? tableDef.style : null,
                        gridColumnStart: nestedCell.c,
                        gridColumnEnd:
                            nestedCell.cs > 1
                                ? "span " + nestedCell.cs
                                : nestedCell.cs === -1
                                    ? -1
                                    : null,
                        gridRowStart: rowIndex,
                        gridRowEnd:
                            nestedCell.rs > 1
                                ? "span " + nestedCell.rs
                                : nestedCell.rs === -1
                                    ? -1
                                    : null,
                    }}
                    className={
                        (tableDef?.className || null) +
                        " grid-table nested " +
                        (dropped ? "expanded" : "collapsed")
                    }
                >
                    {Object.keys(nested).map((row) => {
                        return (
                            <Row
                                idPrefix={idPrefix}
                                parentCell={nestedCell}
                                key={idPrefix + "hr" + row}
                                row={nested[row]}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};
const Rows = (props) => {
    const { idPrefix, rows, tableDef, isHeader, isBody, isFooter, altLines } =
        props;

    if (!_.isArray(rows)) return <></>;

    const rowGroups = _.groupBy(rows, (c) => c.r);

    return (
        <>
            {Object.keys(rowGroups).map((row, idx) => (
                <Row
                    isHeader={isHeader}
                    isBody={isBody}
                    isFooter={isFooter}
                    idPrefix={idPrefix}
                    tableDef={tableDef}
                    key={idPrefix + "hr" + row}
                    className={
                        altLines
                            ? (idx % 2 === 0 ? "odd" : "even") + "-row"
                            : null
                    }
                    row={rowGroups[row]}
                />
            ))}
        </>
    );
};

export const TableElement = (props) => {
    const { element, data } = props;
    const [idPrefix] = React.useState(_.uniqueId("te"));
    const tableRef = React.useRef();
    const tables = [];

    React.useEffect(() => {
        if (
            tableRef &&
            tableRef.current &&
            data.content &&
            data.content?.table?.style
        )
            tableRef.current.setAttribute("style", data.content.table.style);
    }, [tableRef, data]);

    if (!element || !data) return <LoadingSpinner idPrefix={idPrefix} />;

    if (_.isArray(data.content)) {
        _.each(data.content, (tbl) => tables.push(tbl));
    } else {
        tables.push(data.content);
    }

    return (
        <>
            {tables.map((tbl, idx) => {
                return (
                    <div
                        ref={tableRef}
                        className={
                            (tbl?.table?.className || null) + " grid-table"
                        }
                        key={idPrefix + "c" + idx}
                    >
                        {_.isArray(tbl?.header) && tbl?.header.length > 0 && (
                            <Rows
                                tableDef={tbl.table}
                                isHeader
                                idPrefix={idPrefix}
                                rows={tbl.header}
                            />
                        )}
                        {_.isArray(tbl?.body) && tbl.body.length > 0 && (
                            <Rows
                                tableDef={tbl.table}
                                isBody
                                idPrefix={idPrefix}
                                rows={tbl.body}
                                altLines
                            />
                        )}
                        {_.isArray(tbl?.footer) && tbl.footer.length > 0 && (
                            <Rows
                                tableDef={tbl.table}
                                isFooter
                                idPrefix={idPrefix}
                                rows={tbl.footer}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};
