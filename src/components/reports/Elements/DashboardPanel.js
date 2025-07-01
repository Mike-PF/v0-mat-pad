import React from "react";
import _ from "lodash";
import PanelElement from "./PanelElement";

const DashboardPanel = ({ panel, panelData }) => {
	const [IdPrefix] = React.useState(_.uniqueId("dpnl-"));

	return (
		<article
			id={"dashboard-panel-" + panel.id}
			key={IdPrefix + "-wrap"}
			className="p-4 w-full mb-4 rounded-lg"
		>
			{panel.hdr && (
				<div className="flex justify-between">
					<h3
						className="text-2xl mb-3 text-slate-900 font-semibold"
						key={IdPrefix + "-wrap-hdr"}
					>
						{panel.hdr}
					</h3>
				</div>
			)}
			<section
				key={IdPrefix + "panel-wrap-" + panel.id}
				className="dashboard-panel"
			>
				{_.isArray(panel.elements) &&
					panel.elements.length > 0 &&
					_.sortBy(panel.elements, ["seq"]).map((e) => {
						const elementData = _.find(panelData, { id: e.id });

						return (
							<PanelElement
								key={IdPrefix + "dashboard-element-" + e.id}
								element={e}
								data={elementData}
							/>
						);
					})}
			</section>
		</article>
	);
};

export default DashboardPanel;
