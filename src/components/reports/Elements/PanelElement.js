import React from "react";
import _ from "lodash";
import ChartElement from "./ChartElement";
import { TableElement } from "./TableElement";
import { LoadingSpinner } from "../../controls/LoadingSpinner";

const PanelElement = ({ element, data }) => {
	const isChart =
		element && (element.type || "").toLowerCase().endsWith("chart");
	const isTable =
		element && (element.type || "").toLowerCase().endsWith("table");
	const [IdPrefix] = React.useState(_.uniqueId("pe-"));

	const ElementBody = () => {
		if (!data) return <LoadingSpinner idPrefix={IdPrefix} />;

		if (isChart)
			return (
				<ChartElement
					element={element}
					data={data}
				/>
			);

		if (isTable)
			return (
				<TableElement
					element={element}
					data={data}
				/>
			);

		return <>Unknown Element {element.type}</>;
	};

	return (
		<article key={IdPrefix + element.id}>
			{element.desc && (
				<h3 className="font-medium text-2xl mb-3">{element.desc}</h3>
			)}
			<ElementBody key={"element-body" + element.id} />
		</article>
	);
};

export default PanelElement;
