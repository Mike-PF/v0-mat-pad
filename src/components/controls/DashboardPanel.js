import React from "react";
import { each, filter, find, isArray, isNumber } from "lodash";
import parse from "html-react-parser";
import WordCloud from "./Panels/WordCloud";
import ImagePanel from "./Panels/Image";
import Arc from "./Panels/Arc";
import Pie from "./Panels/Pie";
import Line from "./Panels/Line";
import Bar from "./Panels/Bar";
import { getDataItem } from "../../site";
import { LoadingSpinner } from "./LoadingSpinner";

const singlePanel = {
	width: 300,
	height: 300,
	innerHeight: 250,
	rowGap: 10,
	colGap: 10,
};
const colors = ["#42b1ce", "#f4a362", "#289f90", "#eac36f", "#b24dc0"];

export default function DashboardPanel(
	execute,
	panel,
	index,
	dataSource,
	reRenderPage,
	selection,
	handlePanelMenu
) {
	if (!panel || !panel.type) return null;

	let headerText = panel.hdr?.txt || null,
		panelClass =
			"ctl-" +
			panel.type.replace(":", "-") +
			(panel?.hdr?.class ? " hdr-" + panel.hdr.class : "") +
			(panel?.tile?.class ? " tile-" + panel.tile.class : ""),
		body = <div>CHECK CONFIGURATION - {panel.type}</div>,
		hdr = getHeader(headerText);

	// Show the loading panel
	if (dataSource?.loading === true) {
		return {
			resizable: handlePanelMenu ? true : false,
			reorderable: handlePanelMenu ? true : false,
			key: panel.id,
			header: hdr,
			className: panelClass + " loading",
			body: <LoadingSpinner />,
		};
	}

	// Show the error panel
	if (dataSource?.error) {
		return {
			resizable: handlePanelMenu ? true : false,
			reorderable: handlePanelMenu ? true : false,
			key: panel.id,
			header: hdr,
			body: <>{dataSource.error}</>,
			className: panelClass + "error",
		};
	}

	// render a text panel
	if (panel.type === "text") body = parse(panelTemplateBody());

	// render a table panel
	if (panel.type === "table") body = panelTableBody();

	// render a chart panel
	if (panel.type.startsWith("chart")) body = panelChartBody();

	// render an image panel
	if (panel.type === "image") body = panelImageBody();

	return {
		resizable: handlePanelMenu ? true : false,
		reorderable: handlePanelMenu ? true : false,
		defaultPosition: panel.pos || null,
		key: panel.id,
		header: hdr,
		className: panelClass,
		body: body,
	};

	function getHeader(header) {
		//if (handlePanelMenu)
		//    return <><span className="headerElement">{header}</span><span onClick={(e) => handlePanelMenu(e, panel.id)} className="menuItem"><i className="fa-regular fa-bars"></i></span></>
		return (
			<>
				<span className="headerElement">{header}</span>
			</>
		);
	}

	/**
	 * Return the body assuming it is templated (string based)
	 * @returns
	 */
	function panelTemplateBody() {
		let ds = dataSource?.data;
		if (panel.urn === true) {
			ds = find(ds, { urn: parseInt(selection.current.urn.urn) });
		}

		if (
			!panel.ds.params &&
			!(panel.template && panel.template.trim().length > 0)
		) {
			debugger;
			return "No Templated - TODO";
		}

		/**@type{string} */
		let body =
			(panel.ds.params
				? getDataItem(ds, panel.ds.params, null)
				: panel.template) || "{}";
		let reg = /{([^}]*)}/gm;

		if (!reg.test(body)) return body;

		each(body.match(reg), (field) => {
			if (field === "") {
				body = body.replace("{}", "");
				return;
			}

			let newValue = field.substring(1, field.length - 1);

			if (newValue === "content") {
				body = body.replace(field, panel.content || "");
				return;
			}

			if (!newValue.startsWith("ds.")) {
				body = body.replace(field, newValue);
				return;
			}
			let fieldName = newValue.substring(3);
			newValue = "";

			each(ds, (dsItem) => {
				if (!dsItem[fieldName]) return;

				if (newValue.length > 0) newValue += "<br/>";

				newValue += dsItem[fieldName]
					.replace("<", "&lt;")
					.replace(">", "&gt;");
			});
			body = body.replace(field, newValue);
		});

		return body;
	}

	/**
	 * Return the body based on a highcharts element
	 * @returns
	 */
	function panelChartBody() {
		if (panel.type === "chart:wordcloud")
			return (
				<WordCloud
					panel={panel}
					dataSource={dataSource}
					selection={selection}
					singlePanel={singlePanel}
					colors={colors}
				/>
			);
		if (panel.type === "chart:arc")
			return (
				<Arc
					panel={panel}
					dataSource={dataSource}
					selection={selection}
					singlePanel={singlePanel}
					colors={colors}
				/>
			);
		if (panel.type === "chart:pie")
			return (
				<Pie
					panel={panel}
					dataSource={dataSource}
					selection={selection}
					singlePanel={singlePanel}
					colors={colors}
				/>
			);
		if (panel.type === "chart:line")
			return (
				<Line
					panel={panel}
					dataSource={dataSource}
					selection={selection}
					singlePanel={singlePanel}
					colors={colors}
				/>
			);
		if (panel.type === "chart:bar")
			return (
				<Bar
					panel={panel}
					dataSource={dataSource}
					selection={selection}
					singlePanel={singlePanel}
					colors={colors}
				/>
			);

		debugger;
		return <>PANEL: {panel.type}</>;
	}

	function panelImageBody() {
		return (
			<ImagePanel
				panel={panel}
				dataSource={dataSource}
				selection={selection}
				singlePanel={singlePanel}
				colors={colors}
			/>
		);
	}

	/**
	 * Return a Table element
	 * Tables can have other nested elements, so replace them if required
	 * @returns
	 */
	function panelTableBody() {
		if (!panel.template) {
			return <p>INVALID TEMPLATE</p>;
		}

		let ds = dataSource?.data;
		if (panel.urn === true) {
			ds = find(ds, { urn: parseInt(selection.current.urn.urn) });
		}

		const options = {
			replace: (domNode) => {
				if (domNode.type !== "text") return;
				if (
					!/^\{ds.[a-zA-Z0-9:.]*\}$/.test(domNode.data) &&
					!/^\[.*\]$/.test(domNode.data) &&
					!/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/.test(
						domNode.data
					)
				) {
					return;
				}

				// Datasource item: ds.item.name
				if (/^\{ds.[a-zA-Z0-9:.]*\}$/.test(domNode.data)) {
					let dsItem = domNode.data.substring(
							4,
							domNode.data.length - 1
						),
						dp = 0,
						value = null;

					if (
						dsItem.indexOf("#") > 0 ||
						(dsItem.indexOf("?") <= 0 && dsItem.indexOf(":") > 0)
					) {
						let elements = dsItem.split(
							dsItem.indexOf("#") > 0 ? "#" : ":"
						);
						dsItem = elements[0];
						dp = parseInt(elements[1]);

						if (isNaN(dp)) dp = 0;
					}

					value = getDataItem(ds, dsItem, null);

					// Number and decimal places formatting - apply formatting
					if (isNumber(value)) value = value?.toFixed(dp || 0);

					// convert text to HTML if it is <...>
					if (
						typeof value === "string" &&
						value.length > 0 &&
						value.startsWith("<") &&
						value.endsWith(">")
					)
						value = (
							<span dangerouslySetInnerHTML={{ __html: value }} />
						);

					return <>{value || ""}</>;
				}

				// Datasource item: ds.item.name
				if (/^\[.*\]$/.test(domNode.data)) {
					let dsItem = domNode.data.substring(
							1,
							domNode.data.length - 1
						),
						dp = 0,
						value = null,
						proc = null;

					if (
						dsItem.indexOf("#") > 0 ||
						(dsItem.indexOf("?") <= 0 && dsItem.indexOf(":") > 0)
					) {
						let elements = dsItem.split(
							dsItem.indexOf("#") > 0 ? "#" : ":"
						);
						dsItem = elements[0];
						dp = parseInt(elements[1]);

						if (isNaN(dp)) dp = 0;
					}

					if (dsItem.indexOf(";") > 0) {
						let elements = dsItem.split(";");
						dsItem = elements[0];
						proc = elements[1];
					}

					value = getDataItem(ds, dsItem, null);

					if (value && proc) value = value[proc];

					// Number and decimal places formatting - apply formatting
					if (isNumber(value)) value = value?.toFixed(dp || 0);

					// convert text to HTML if it is <...>
					if (
						typeof value === "string" &&
						value.length > 0 &&
						value.startsWith("<") &&
						value.endsWith(">")
					)
						value = (
							<span dangerouslySetInnerHTML={{ __html: value }} />
						);

					return <>{value || ""}</>;
				}

				// sub panel: GUID
				else {
					let id = domNode.data
						.substring(1, domNode.data.length - 1)
						.toLowerCase();
					let newPanel = find(
						selection.current.dashboard.panels,
						(p) => id === p.id.toLowerCase()
					);

					if (!newPanel) return;

					let newDashboardPanel = DashboardPanel(
						execute,
						newPanel,
						index,
						dataSource,
						reRenderPage,
						selection
					);

					return <>{newDashboardPanel.body}</>;
				}
			},
		};
		let table = parse(panel.template.trim(), options);

		return table;
	}
}
