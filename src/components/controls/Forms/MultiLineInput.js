import * as React from "react";
import { TextArea } from "@progress/kendo-react-inputs";
import { HelpIcon } from "../../../site";
import {
	getAnswer,
	getControlLabel,
	getWrapperClass,
	setAnswer,
} from "./ControlCommon";
import { stopKeyPressPropogation } from "../../../site";
import DialogOverlay from "../Dialog";
import { noop } from "jquery";
import { LoadingSpinner } from "../LoadingSpinner";
import { useState } from "react";
import { faStars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showAlert } from "../Alert";

function MultiLineInput({
	school,
	formID,
	detail,
	section,
	question,
	execute,
}) {
	const value = getAnswer(detail, question, section);
	const [loading, setLoading] = useState(false);

	const generateAi = async () => {
		setLoading(true);
		const aiQuestion1 = "Purpose";
		const aiQuestion2 = "Outcome (findings and/or actions)";

		let questionText;

		switch (question.text) {
			case "MAT Summary for Lesson Observation & Subject Reviews":
				questionText = "";
				break;
			case "MAT Summary for Lesson Observation & Subject Reviews -> Purpose":
				questionText = "&question_text=" + aiQuestion1;
				break;
			case "MAT Summary for Lesson Observation & Subject Reviews -> Outcome (findings and/or actions)":
				questionText = "&question_text=" + aiQuestion2;
				break;
			case "Question 1":
				questionText = "";
				break;
			case "Question 2":
				questionText = "&question_text=" + aiQuestion1;
				break;
			case "Question 3":
				questionText = "&question_text=" + aiQuestion2;
				break;
		}

		const aiMat = "St Clare Catholic Multi Academy Trust";
		const aiForm = "Head Report - Summer 2023/24";
		const aiSection = "Quality Assurance";
		const aiSubSection = "E. Lesson Observations/Subject Reviews";

		try {
			var response = await fetch(
				"http://20.68.128.49:8000/qa_summary_filtered?mat=" +
					aiMat +
					"&form=" +
					aiForm +
					"&section=" +
					aiSection +
					"&subSection=" +
					aiSubSection +
					questionText,
				{
					mode: "cors",
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
			var body = await response.json();
			const answerText = body.summaries.map((e) => {
				return (
					"<h1><b>" +
					e.question +
					"</b></h1>" +
					"<p>" +
					e.summary +
					"</p>"
				);
			});

			setLoading(false);
			setControlData(answerText.join(" "));
			// setAnswer(
			// 	formID,
			// 	detail,
			// 	question,
			// 	section,
			// 	school,
			// 	execute,
			// 	answerText.join(" ")
			// );
		} catch (error) {
			setLoading(false);
			console.log("ANSWER ERROR", error);
			debugger;
			showAlert({ body: <p>Unable to generate answer!</p> });
		}
		setLoading(false);
	};

	const [controlData, setControlData] = React.useState(value);
	const type = question?.type?.toLowerCase();
	const editorRef = React.useRef();
	const lastValue = React.useRef(value || null);

	React.useEffect(() => stopKeyPressPropogation(editorRef), [editorRef]);

	const onBlur = React.useCallback(() => {
		const val = controlData || null;

		if (val !== lastValue.current) {
			setAnswer(formID, detail, question, section, school, execute, val);
			lastValue.current = val;
		}
	}, [formID, detail, question, section, school, execute, controlData]);

	if (!question || !type || type.trim().length === 0)
		return <>UNKNOWN TEXTAREA</>;

	return (
		<div
			key={"question-wrapper-" + question.id}
			className={
				"matpad-question-wrapper multiline " +
				getWrapperClass("q", question.css?.q) +
				" " +
				getWrapperClass("l", question.css?.lbl)
			}
		>
			{getControlLabel(question)}
			{section?.name === "AI Test" && (
				<div className="w-full flex justify-end">
					<button
						onClick={generateAi}
						type="button"
						className="border-none mb-2 bg-primary-500 text-white p-2 flex items-center"
					>
						<FontAwesomeIcon
							icon={faStars}
							className="mr-2"
						/>
						Generate
					</button>
				</div>
			)}
			<HelpIcon help={question?.help?.trim()} />
			{question.readonly === true && (
				<div
					key={"control-" + question.id}
					className={
						"k-input k-textarea k-input-md k-input-solid k-rounded-md question readonly"
					}
				>
					<div className={"k-input-inner !k-overflow-auto"}>
						{controlData}
					</div>
				</div>
			)}
			{question.readonly !== true && (
				<TextArea
					onBlur={onBlur}
					ref={editorRef}
					onChange={(e) => setControlData(e.target.value)}
					value={controlData}
					className={"question " + (question?.css?.q ?? "")}
					key={"control-" + question.id}
					name={"control-" + question.id}
					id={"control-" + question.id}
					autoSize={true}
				/>
			)}
			{loading && (
				<DialogOverlay
					open={true}
					setOpen={() => {}}
					key={"loading AI"}
					onClose={noop}
				>
					<div className="flex items-center justify-center gap-x-2">
						<LoadingSpinner />
						Generating answer
					</div>
				</DialogOverlay>
			)}
		</div>
	);
}

export default React.memo(MultiLineInput);
