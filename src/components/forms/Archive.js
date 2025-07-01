import React from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";

const FormArchive = () => {
	const { setLocation } = useMatpadContext();

	const { execute } = useFetchWithMsal();
	const [idPrefix] = React.useState(_.uniqueId("arch-"));
	const [settings, setSettings] = React.useState(null);

	React.useEffect(() => {
		if (!settings) {
			setLocation(window.location.pathname);

			execute("GET", "/api/form/archive").then((response) => {
				if (response) {
					setSettings(response || {});
				}
			});
		}
	}, [execute, settings, setLocation]);

	if (!settings) {
		return <LoadingSpinner idPrefix={idPrefix} />;
	}

	return (
		<table className="archive-list">
			<thead>
				<tr>
					<td>Form</td>
					<td>School</td>
					<td>Created</td>
					<td colSpan={2}></td>
				</tr>
			</thead>
			<tbody>
				{_.orderBy(settings, (s) => new Date(s.created), ["desc"]).map(
					(s) => (
						<tr>
							<td>{s.name}</td>
							<td>{s.school?.name || ""}</td>
							<td>{s.created}</td>
							<td>{s.reason}</td>
							<td className={"download" + (s.pdf ? " dl" : "")}>
								{s.pdf && (
									<>
										PDF{" "}
										<i class="fa-solid fa-cloud-arrow-down"></i>
									</>
								)}
							</td>
						</tr>
					)
				)}
			</tbody>
		</table>
	);
};

export default FormArchive;
