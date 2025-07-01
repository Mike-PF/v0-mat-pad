import React, { useEffect, useState } from "react";
import _, { uniqueId } from "lodash";
import { useMatpadContext } from "../../context/applicationContext";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-light-svg-icons";
import { DropDownSelect } from "../../controls/DropDownSelect";
import { PDFViewer } from "@progress/kendo-react-pdf-viewer";
import { hidePleaseWait, showAlert, showPleaseWait } from "../../controls/Alert";
import { faClipboardList } from "@fortawesome/pro-solid-svg-icons";
import Button from "../../controls/Button";
import SearchInput from "../../forms/SearchInput";

const ReportsArchive = () => {
	const { execute } = useFetchWithMsal();
	const [settings, setSettings] = React.useState({ loading: true });
	const [selectedUrn, setSelectedUrn] = useState(null);
	const [reportData, setReportData] = useState({ loading: true });
	const [selectedReportName, setSelectedReportName] = useState(null);
	const [schools, setSchools] = useState(null);
	const { setLocation, userDetail } = useMatpadContext();
	const [reportsToShow, setReportsToShow] = useState([]);
	const [uniqueFormNames, setUniqueFormNames] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!reportsToShow || !reportsToShow.length) {
			setUniqueFormNames([]);
			return;
		}
		const names = reportsToShow.map((item) => item.name).filter((value, index, current_value) => current_value.indexOf(value) === index);

		let namesArray = [];

		for (let i = 0; i < names.length; i++) {
			namesArray.push({
				name: names[i],
				id: uniqueId(),
			});
		}

		setUniqueFormNames(namesArray);
	}, [reportsToShow]);

	useEffect(() => {
		if (settings?.loading) {
			setLocation(window.location.pathname);

			execute("GET", "/api/form/archive").then((response) => {
				if (response) {
					setSettings(response || {});
					setReportsToShow(response || {});
				}
			});
		}

		if (reportData?.loading) {
			execute("GET", "/api/report").then((data) => {
				if (data) {
					if (data.error) {
						showAlert({ body: <p>{data.error}</p> });
					}

					setReportData({ loading: false, data: data });
				}
			});
		}
	}, [execute, settings, setLocation, reportData]);

	useEffect(() => {
		if (!settings || settings.loading) return;

		if (!selectedUrn || selectedUrn === "***Refresh***") {
			setReportsToShow(settings);

			return;
		}

		setReportsToShow(settings.filter((s) => s?.school?.urn === selectedUrn?.urn));
	}, [selectedUrn]);

	useEffect(() => {
		if (!schools) {
			setLocation(window.location.pathname);

			setTimeout(() => {
				execute("GET", "/api/form/schoollist").then((response) => setSchools(response));
			});
		}
	}, [execute, schools, userDetail]);

	const schoolRefreshClick = () => {
		setSelectedReportName("***Refresh***");
		setSelectedUrn("***Refresh***");
	};

	const schoolChange = (value) => {
		setSelectedReportName("***Refresh***");
		setSelectedUrn(value.value);
	};

	return (
		<div
			className="flex flex-col h-full xl:grid xl:grid-cols-formPage"
			key={"pageOuter"}>
			<section
				className="h-fit bg-white border border-slate-200 rounded-lg mb-2 max-w-full w-full xl:w-80"
				key="pageLeftPanel">
				<div className="p-4">
					<h3 className="font-medium text-2xl mb-3">Archive</h3>
					<ul className="flex flex-wrap justify-start overflow-y-auto h-full xl:flex-col">
						<div className="flex my-2 mr-2 items-center xl:flex-col xl:gap-y-2 xl:mx-0">
							<div className="max-w-64 mr-3">
								<label
									htmlFor={"schoolSelect"}
									className="mb-2">
									Filter school
								</label>
								<div className="flex items-center">
									<DropDownSelect
										key={"schoolSelect"}
										id="SchoolSelect"
										onChange={(value) => schoolChange(value)}
										items={_.sortBy(schools, ["name"])}
										textField={"name"}
										valueField={"urn"}
										value={selectedUrn}
										placeholder={"All Schools"}
										maxWidth={"200px"}
									/>
									<div className="w-3">
										{selectedUrn && selectedUrn !== "***Refresh***" && (
											<button
												onClick={schoolRefreshClick}
												type="button"
												className="border-none">
												<FontAwesomeIcon icon={faX} />
											</button>
										)}
									</div>
								</div>
							</div>
							<div className="max-w-64 mr-3">
								<label
									htmlFor={"reportSelect"}
									className="mb-2">
									Filter report
								</label>
								<div className="flex items-center">
									<DropDownSelect
										key={"reportSelect"}
										id="reportSelect"
										onChange={(value) => setSelectedReportName(value.value)}
										items={_.sortBy(uniqueFormNames, ["name"])}
										textField={"name"}
										valueField={"name"}
										value={selectedReportName}
										placeholder={"All reports"}
										maxWidth={"200px"}
									/>
									<div className="w-3">
										{selectedReportName && selectedReportName !== "***Refresh***" && (
											<button
												onClick={() => setSelectedReportName("***Refresh***")}
												type="button"
												className="border-none">
												<FontAwesomeIcon icon={faX} />
											</button>
										)}
									</div>
								</div>
							</div>
							<div className="w-full max-w-64 mr-2">
								<label
									htmlFor={"search"}
									className="mb-2">
									Search
								</label>
								<div className="flex items-center">
									<SearchInput
										setSearch={setSearchTerm}
										searchTerm={searchTerm}
										name="searchReports"
									/>
								</div>
							</div>
						</div>
					</ul>
				</div>
			</section>
			<section
				className="h-full overflow-y-auto panel2 xl:ml-3"
				key={"pageCenterPanel"}>
				<div className="flex w-full h-full bg-white border border-slate-200 rounded-lg p-4">
					{reportsToShow.length ? (
						<table className="w-full max-h-full flex flex-col">
							<colgroup>
								<col />
								<col />
								<col />
								<col />
								<col />
							</colgroup>
							<thead className="w-full flex border border-slate-200 rounded-t-lg">
								<tr className="flex w-full gap-x-2">
									<td className="w-2/6 px-2 py-2 font-bold">Form</td>
									<td className="w-2/6 px-2 py-2 font-bold">School</td>
									<td className="w-1/6 px-2 py-2 font-bold">Created</td>
									<td className="w-1/6 px-2 py-2 font-bold"></td>
								</tr>
							</thead>
							<tbody className="overflow-auto h-full">
								{_.orderBy(settings, (s) => new Date(s.created), ["desc"]).map(
									// add in filtering by selected report name
									(s) =>
										(s?.school?.urn === selectedUrn?.urn || selectedUrn === "***Refresh***" || selectedUrn === null) &&
										(s?.name === selectedReportName?.name ||
											selectedReportName === "***Refresh***" ||
											selectedReportName === null) &&
										s.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
											<tr
												key={_.uniqueId(s.id)}
												className="flex h-14 w-full gap-x-2 border-b border-x border-slate-200 items-center last:rounded-b-lg">
												<td className="w-2/6 px-2 py-2 text-ellipsis line-clamp-2">{s.name}</td>
												<td className="w-2/6 px-2 py-2 line-clamp-2">{s.school?.name || ""}</td>
												<td className="w-1/6 px-2 py-2 line-clamp-2">{s.created}</td>
												<td className="w-1/6 flex items-center justify-center gap-x-2 px-2 py-2">
													{s.pdf && (
														<div className="m-1">
															<Button onClick={() => showPdf(s)}>View PDF</Button>
														</div>
													)}
												</td>
											</tr>
										),
								)}
							</tbody>
						</table>
					) : (
						<div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
							<div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
								<div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
									<FontAwesomeIcon
										icon={faClipboardList}
										className="w-8 h-8 text-slate-600"
									/>
								</div>
								<div className="text-slate-600 font-medium text-sm">Please select parameters</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);

	async function showPdf(report) {
		if ((report.urn < 0 || report.urn > 0) && selectedUrn.length === 0) {
			showAlert({
				title: "MATpad Report Viewer",
				body: <p>Select a school to generate the report for!</p>,
			});
			return;
		}

		execute("POST", `/api/form/${report?.id}/${report.name.replace("/", "_")}/getarchive`, null, true)
			// Get the response
			.then((response) => {
				if (!response || response.status !== 200) {
					response
						.json()
						.then((json) => {
							try {
								if (typeof json === "string") json = JSON?.parse(json);
							} catch (e) {}

							hidePleaseWait();
							return;
						})
						.catch(() => {
							hidePleaseWait();
							showAlert({
								title: report.name,
								body: <p>Unable to load pdf!</p>,
							});
							return;
						});

					return null;
				}
				return response.arrayBuffer();
			})
			// Get the buffer for the PDF viewer
			.then((buffer) => {
				hidePleaseWait();

				if (!buffer) return;
				showAlert({
					width: "95%",
					className: "large-dialog",
					noOverflow: true,
					title: report.name,
					body: (
						<PDFViewer
							arrayBuffer={buffer}
							saveFileName={(report.section ? report.section + " - " : "") + report.name + ".pdf"}
							defaultZoom={1}
							tools={["pager", "spacer", "zoomInOut", "zoom", "selection", "spacer", "search", "download", "print"]}
							style={{
								width: "100%",
								height: "100%",
							}}
						/>
					),
					buttons: [],
				});
			})
			.catch((error) => {
				debugger;
				console.log("There was an error!", error);

				showAlert({
					title: "MATpad Report Error",
					body: <p>Unable to load report</p>,
				});
			});

		showPleaseWait();
	}
};

export default ReportsArchive;
