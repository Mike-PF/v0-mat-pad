import React, { useEffect, useState } from "react";
import { isArray, isNumber } from "lodash";
import { PDFViewer } from "@progress/kendo-react-pdf-viewer";
import { hidePleaseWait, showAlert, showPleaseWait } from "../controls/Alert";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { getControlLabel } from "../controls/Forms/ControlCommon";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { DropDownSelect } from "../controls/DropDownSelect";
import FormInput from "../forms/FormInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSquareCheck, faFileChartPie, faImage, faSquare } from "@fortawesome/pro-light-svg-icons";
import Button from "../controls/Button";
import { hasPermission } from "../../site";
import PupilFilter from "./Static Reports/Attendance/PupilFilter";
import DialogOverlay from "../controls/Dialog";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

function ReportViewer(props) {
	const { execute } = useFetchWithMsal();
	const { setLocation, userDetail } = useMatpadContext();

	const [reportData, setReportData] = useState({ loading: true, data: null });
	const [filterData, setFilterData] = useState("");
	const [selectedReport, setSelectedReport] = useState({});
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedForms, setSelectedForms] = useState(null);
	const [selectedURN, setSelectedURN] = useState([]);
	const [pdfBuffer, setBuffer] = useState(null);
	const [canView, setCanView] = React.useState();
	const [pupilFilterOpen, setPupilFilterOpen] = useState(false);
	const [pupils, setPupils] = useState([]);
	const [filters, setFilters] = useState([]);

	//Get the data set from the server for the report list
	useEffect(() => {
		setLocation(window.location.pathname);

		const permission = hasPermission(userDetail, "viewreports")?.available === true;
		if (canView !== permission) {
			setCanView(permission);
		}
		if (!permission) return;

		execute("GET", "/api/report").then((data) => {
			if (data) {
				if (data.error) {
					showAlert({ body: <p>{data.error}</p> });
				}

				setReportData({ loading: false, data: data });
			}
		});
		return () => {};
	}, [execute, setLocation, setCanView, userDetail, canView]);

	if (!canView) {
		return (
			<div className="h-full w-full">
				<div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
					<div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
						<div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
							<FontAwesomeIcon
								icon={faFileChartPie}
								className="w-8 h-8 text-slate-600"
							/>
						</div>
						<div className="text-slate-600 font-medium text-sm">You don't have permission to view reports</div>
					</div>
				</div>
			</div>
		);
	}

	function selectReport(report) {
		setBuffer(null);
		setSelectedURN([]);
		setSelectedReport(report);
	}

	function applyFilters(e) {
		setFilterData(e.target.value?.toLowerCase());
	}

	function updateUrns(e) {
		setBuffer(null);
		setSelectedURN([parseInt(e.value?.id)]);
	}

	function updateForms(e) {
		setBuffer(null);
		setSelectedForms(e.value?.id);
	}

	const pupilFilterClick = () => {
		setPupils(null);
		setPupilFilterOpen(true);

		execute("POST", "/api/dashboard/PupilDetailConfiguration").then((response) => {
			if (response) {
				setPupils(response?.data);
			} else {
				setPupils([]);
			}
		});
	};

	const filterPupils = () => {
		const pupilsncyFiltered = pupils?.sort((a, b) => a?.inYear - b?.inYear);

		return pupilsncyFiltered?.sort((a, b) =>
			a?.class?.toLowerCase() > b?.class?.toLowerCase() ? 1 : b?.class?.toLowerCase() > a?.class?.toLowerCase() ? -1 : 0,
		);
	};

	const URNs = () => {
		if (selectedReport.urn < 0 || selectedReport.urn > 0) {
			if (reportData?.data?.urns?.length === 1 && reportData.data.urns[0].urn !== selectedURN[0]) {
				setSelectedURN([reportData.data.urns[0].urn]);
			}
			return reportData.loading || (!reportData.loading && (!isArray(reportData.data.urns) || reportData.data.urns.length === 0)) ? (
				<></>
			) : (
				<div className="flex items-center justify-center">
					<div className="min-w-64">
						<div className="text-slate-900 font-medium text-sm mb-1">School</div>
						<div style={{ maxWidth: 300 }}>
							<DropDownSelect
								key={"org-sel"}
								multiSelect={false}
								valueField={"id"}
								textField={"name"}
								placeholder={"Select School"}
								items={reportData.data.urns.map((u) => {
									return {
										id: u.urn,
										name: u.name,
										selected: selectedURN.indexOf(u.urn) >= 0,
									};
								})}
								onChange={updateUrns}
							/>
						</div>
					</div>
					{selectedReport?.pupilFilter && (
						<div className="max-w-52 mx-1">
							<div className="text-slate-900 font-medium text-sm mb-1">Select pupils to exclude</div>
							<button
								className={classNames(
									"min-w-32 rounded-m border border-[#ced4da] bg-[#f5f5f5] text-[#36454f] hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed",
								)}
								onClick={pupilFilterClick}>
								Select pupils
							</button>
							{pupilFilterOpen && (
								<DialogOverlay
									key={"pupil-filter-dlg"}
									open={true}
									setOpen={setPupilFilterOpen}
									title={"Pupil filter"}
									fullScreenWidth={true}>
									<PupilFilter
										setPupilFilterOpen={setPupilFilterOpen}
										setCustomDashFilters={setFilters}
										customDashFilters={filters}
										pupils={filterPupils()}
										schoolsFilter={{
											name: "Schools",
											values: reportData.data.urns.map((u) => {
												return {
													urn: u?.urn,
													text: u.name,
													value: {
														text: u?.text,
														urn: u?.urn,
													},
												};
											}),
										}}
									/>
								</DialogOverlay>
							)}
						</div>
					)}
				</div>
			);
		}

		return <></>;
	};

	const DatePrompt = () => {
		if (!selectedReport.prompt || selectedReport.prompt.trim().length === 0) return <></>;

		return (
			<div className="matpad-question-wrapper date">
				{getControlLabel({
					text: selectedReport.prompt,
					css: {
						lbl: "noq",
					},
				})}
				<FormInput
					type="date"
					onChange={(e) => setSelectedDate(e.value || new Date())}
					key={"control-" + selectedReport.id}
					id={"control-" + selectedReport.id}
					value={selectedDate}
				/>
			</div>
		);
	};

	const Forms = (props) => {
		return <></>;

		// if (
		//     !selectedReport ||
		//     !(selectedReport.urn < 0 || selectedReport.urn > 0)
		// )
		//     return <></>;

		// if (!isArray(selectedReport.forms) || selectedReport.length === 0)
		//     return <>NO FORMS</>;

		// if (selectedURN.length === 0) return <p->Select School</p->;

		// const ds = [];

		// forEach(selectedReport.forms, (f) => {
		//     if (f && f?.school?.urn === selectedURN[0])
		//         ds.push({
		//             ...f,
		//             selected: selectedForms?.indexOf(f.id) >= 0,
		//         });
		// });

		// if (ds.length === 0) {
		//     return <>No matching forms</>;
		// }

		// if (ds.length === 2) {
		//     return <>{ds[0].name}</>;
		// }

		// return (
		//     <div>
		//         <h4>Forms</h4>
		//         <div style={{ maxWidth: 300 }}>
		//             <DropDownSelect
		//                 key={"form-sel"}
		//                 multiSelect={false}
		//                 valueField={"id"}
		//                 textField={"name"}
		//                 selected={"selected"}
		//                 placeholder={"Select Form"}
		//                 items={ds}
		//                 onChange={updateForms}
		//             />
		//         </div>
		//     </div>
		// );
	};

	let reportPreview =
		!selectedReport || !selectedReport.id ? (
			<></>
		) : (
			<div className="w-full h-full flex flex-col rounded-lg border border-slate-200 p-3 overflow-hidden">
				<div className="w-full flex items-center justify-between">
					<h2>{selectedReport.name}</h2>
					<div className="controls">
						<Button onClick={showPdf}>{pdfBuffer ? "Update" : "View"} PDF</Button>
					</div>
				</div>
				<div className="flex justify-center items-center mt-2 h-full bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-hidden">
					{selectedReport.id && pdfBuffer ? (
						<PDFViewer
							defaultZoom={1}
							saveFileName={(selectedReport.section ? selectedReport.section + " - " : "") + selectedReport.name + ".pdf"}
							arrayBuffer={pdfBuffer}
							tools={["pager", "spacer", "zoomInOut", "zoom", "selection", "spacer", "search", "download", "print"]}
							style={{
								width: "100%",
								height: "100%",
							}}
						/>
					) : selectedReport.id ? (
						<img
							className="max-w-full max-h-full rounded-lg"
							src={"/api/report/" + selectedReport.id + "/image"}
							alt=""
						/>
					) : (
						<FontAwesomeIcon
							icon={faImage}
							className="h-8 w-8 text-slate-600"
						/>
					)}
				</div>
			</div>
		);

	let contents = reportData.loading ? (
		<LoadingSpinner />
	) : (
		<ul className="">
			{reportData.data?.sections?.map((s) => (
				<li key={s.section}>
					{s.section}
					<ul className="m-0">
						{s.reports.map((r) => {
							if (filterData.length === 0 || r.name.toLowerCase().indexOf(filterData) >= 0)
								return (
									<button
										key={r.id}
										className={classNames(
											selectedReport && r.id === selectedReport.id
												? "bg-slate-300 border-slate-500"
												: "bg-slate-50 border-slate-200",
											"h-9 my-1 border w-full flex items-center justify-between px-2",
										)}
										onClick={() => selectReport(r)}>
										<div className="text-slate-950 h-8 text-sm font-medium flex items-center overflow-hidden">
											{selectedReport && r.id === selectedReport.id ? (
												<FontAwesomeIcon
													className="mr-2 text-slate-600"
													icon={faSquareCheck}
												/>
											) : (
												<FontAwesomeIcon
													className="mr-2 text-slate-600"
													icon={faSquare}
												/>
											)}
											<div className="flex justify-center items-center overflow-hidden">
												<div className="w-full truncate">{r.name}</div>
											</div>
										</div>
										<FontAwesomeIcon
											icon={faEye}
											className="text-slate-600"
										/>
									</button>
								);
							return null;
						})}
					</ul>
				</li>
			))}
		</ul>
	);

	return (
		<div className="panel-view-3 report-page min-w-full flex">
			<section className="panel1 flex min-w-full">
				<div className="dashboardControls sticky w-full m-0 mb-2 min-h-[664px] z-0 flex">
					<div className="w-1/5 min-w-48 px-3">
						<input
							className="bg-white border border-slate-300 rounded-md p-2 mb-2 w-full"
							id="floatingInput"
							placeholder="Search report"
							onChange={applyFilters}
						/>
						{contents}
					</div>
					{selectedReport.id ? (
						<div className="w-full flex flex-col overflow-hidden">
							{isNumber(selectedReport?.urn) && (
								<div className="w-full h-40 flex items-center rounded-lg border border-slate-200 p-3">
									<div className="flex flex-col">
										<h1 className="mb-2 text-slate-900 font-semibold text-lg">Report parameters</h1>
										<URNs />
									</div>
								</div>
							)}
							<div className="h-full flex w-full mt-3 overflow-hidden">
								{/*{selectedReport.urn && (*/}
								{/*    selectedURN.length < 1 &&*/}
								{/*    <div className="bg-slate-50 w-full h-full flex items-center justify-center rounded-lg border border-slate-200 mt-4">*/}
								{/*        <div className="w-80 h-40 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200">*/}
								{/*            <div className="flex items-center justify-center border border-slate-200 w-12 h-12 bg-white rounded-lg">*/}
								{/*                <FontAwesomeIcon*/}
								{/*                    icon={faFileChartPie}*/}
								{/*                    className="h-8 w-8 text-slate-600"*/}
								{/*                />*/}
								{/*            </div>*/}
								{/*            <div className="mt-2">*/}
								{/*                Please select school*/}
								{/*            </div>*/}
								{/*        </div>*/}
								{/*    </div>*/}
								{/*)}*/}
								<div className="w-full h-full">{reportPreview}</div>
							</div>
						</div>
					) : (
						<div className="bg-slate-50 w-full min-h-full flex items-center justify-center rounded-lg border border-slate-200">
							<div className="w-80 h-40 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200">
								<div className="flex items-center justify-center border border-slate-200 w-12 h-12 bg-white rounded-lg">
									<FontAwesomeIcon
										icon={faFileChartPie}
										className="h-8 w-8 text-slate-600"
									/>
								</div>
								<div className="mt-2">Please select report</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);

	async function showPdf(e) {
		var firstRender = true;
		var data = {
			urns: selectedURN,
			reportID: selectedReport.id,
			date: selectedReport.prompt && selectedReport.prompt.trim().length > 0 ? selectedDate : null,
		};

		if ((selectedReport.urn < 0 || selectedReport.urn > 0) && selectedURN.length === 0) {
			showAlert({
				title: "MATpad Report Viewer",
				body: <p>Select a school to generate the report for!</p>,
			});
			return;
		}

		execute("POST", "/api/report/generate", data, true)
			// Get the response
			.then((response) => {
				if (!response || response.status !== 200) {
					response
						.json()
						.then((json) => {
							try {
								if (typeof json === "string") json = JSON.parse(json);
							} catch (e) {}

							hidePleaseWait();
							showAlert({
								title: selectedReport.name,
								body: <p>{json?.error ? json.error : "Unable to generate report!"}</p>,
							});
							return;
						})
						.catch(() => {
							hidePleaseWait();
							showAlert({
								title: selectedReport.name,
								body: <p>Unable to generate report!</p>,
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

				// setBuffer(buffer || null);
				// return;

				if (!buffer) return;
				showAlert({
					width: "95%",
					render: function (e) {
						console.log(e);
						
						if (firstRender) {
							const zoomElement = e.sender.toolbar.element.find("[data-command=ZoomCommand][data-role=combobox]");
							const comboBox = zoomElement.data("kendoComboBox");
							comboBox.value("100%");
							comboBox.trigger("change");
							firstRender = false;
						}
					},
					fullScreenWidth: true,
					fullScreenHeight: true,
					className: "large-dialog",
					noOverflow: true,
					title: selectedReport.name,
					body: (
						<PDFViewer
							arrayBuffer={buffer}
							defaultZoom={1}
							saveFileName={(selectedReport.section ? selectedReport.section + " - " : "") + selectedReport.name + ".pdf"}
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
					body: <p>Unable to generate report</p>,
				});
			});

		showPleaseWait();
	}
}

export default ReportViewer;
