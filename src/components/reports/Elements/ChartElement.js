import React from "react";
import _ from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ChartElement = (props) => {
	const { element, data } = props;

	const [idPrefix] = React.useState(_.uniqueId("ce"));

	if (!_.isArray(data?.content))
		return (
			<HighchartsReact
				key={idPrefix + element.id}
				highcharts={Highcharts}
				options={data?.content}
			/>
		);

	return data?.content?.map((options, idx) => (
		<HighchartsReact
			key={idPrefix + element.id + idx}
			highcharts={Highcharts}
			options={options}
		/>
	));
};

export default ChartElement;
