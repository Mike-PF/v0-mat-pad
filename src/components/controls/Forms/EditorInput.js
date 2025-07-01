import * as React from "react";
import _, { noop } from "lodash";
import {
	Editor,
	EditorTools,
	EditorToolsSettings,
	EditorUtils,
	ProseMirror,
} from "@progress/kendo-react-editor";
import { HelpIcon, stopKeyPressPropogation } from "../../../site";
import { editorInsertImagePlugin } from "./EditorInsertImagePlugin";
import { InsertImage } from "./EditorInsertIMageTool";
import { cleanStyles, insertImageFiles } from "./EditorUtils";
import {
	getAnswer,
	getControlLabel,
	getWrapperClass,
	setAnswer,
} from "./ControlCommon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showAlert } from "../Alert";
import { faStars } from "@fortawesome/pro-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import DialogOverlay from "../Dialog";
import { LoadingSpinner } from "../LoadingSpinner";
const {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Subscript,
	Superscript,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	ForeColor,
	BackColor,
	CleanFormatting,
	Indent,
	Outdent,
	OrderedList,
	UnorderedList,
	Undo,
	Redo,
	FontSize,
	FontName,
	FormatBlock,
	Link,
	Unlink,
	ViewHtml,
	InsertTable,
	AddRowBefore,
	AddRowAfter,
	AddColumnBefore,
	AddColumnAfter,
	DeleteRow,
	DeleteColumn,
	DeleteTable,
	MergeCells,
	SplitCell,
} = EditorTools;
const {
	pasteCleanup,
	sanitize,
	sanitizeClassAttr,
	removeAttribute,
	replaceImageSourcesFromRtf,
	imageResizing,
} = EditorUtils;

export default function EditorInput({
	school,
	formID,
	detail,
	section,
	question,
	execute,
}) {
	const value = getAnswer(detail, question, section);
	const [controlData, setControlData] = useState(value || "");
	const [loading, setLoading] = useState(false);
	const lastValue = useRef(value || "");
	const editorRef = useRef();
	const type = question?.type?.toLowerCase();
	useEffect(() => stopKeyPressPropogation(editorRef), [editorRef]);

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

	const onBlur = React.useCallback(
		(e) => {
			const val =
				EditorUtils.getHtml(e.target.state?.view?.state) || null;

			if (val !== lastValue.current) {
				setAnswer(
					formID,
					detail,
					question,
					section,
					school,
					execute,
					val
				);
				lastValue.current = val;
			}
		},
		[question, detail, execute, school, section, formID]
	);

	if (!question || !type || type.trim().length === 0)
		return <>UNKNOWN EDITOR</>;

	let tools = [[Undo, Redo]];

	const pasteSettings = {
		convertMsLists: true,
		// stripTags: 'span|font'
		stripTags: "img|style",
		attributes: {
			class: sanitizeClassAttr,
			style: (attr) => cleanStyles(attr, type),
			// keep `width`, `height` and `src` attributes
			width: () => {},
			height: () => {},
			src: () => {},

			// removes other (unspecified above) attributes
			"*": removeAttribute,
		},
	};

	/*
	 * Inserting Images
	 */
	const onImageInsert = (args) => {
		const { files, view, event } = args;
		const nodeType = view.state.schema.nodes.image;
		const position =
			event.type === "drop"
				? view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
				  })
				: null;
		insertImageFiles({
			view,
			files,
			nodeType,
			position,
		});
		return files.length > 0;
	};
	const onMount = (event) => {
		const state = event.viewProps.state;
		const plugins = [
			...state.plugins,
			editorInsertImagePlugin(onImageInsert),
			imageResizing(),
		];
		return new ProseMirror.EditorView(
			{
				mount: event.dom,
			},
			{
				...event.viewProps,
				state: ProseMirror.EditorState.create({
					doc: state.doc,
					plugins,
				}),
			}
		);
	};

	const CustomForeColour = (props) => {
		if (
			!question ||
			!question.opts ||
			!question.opts.data ||
			question.opts.data.length === 0
		)
			return <ForeColor {...props} />;

		if (
			_.find(question.opts.data, { text: "gradient" }) ||
			_.find(question.opts.data, { text: "fg:gradient" })
		)
			return (
				<ForeColor
					{...props}
					colorPickerProps={{
						svgIcon:
							EditorToolsSettings.foreColor.colorPickerProps
								.svgIcon,
						view: "gradient",
					}}
				/>
			);

		const palette = _.filter(question.opts.data, (i) => {
			return !i.text?.startsWith("bg:");
		}).map((o) => o.value);
		if (!_.find(question.opts.data, { value: "#000000" }))
			palette.splice(0, 0, "#000000");

		const paletteSettings = { palette: palette };

		return (
			<ForeColor
				{...props}
				colorPickerProps={{
					svgIcon:
						EditorToolsSettings.foreColor.colorPickerProps.svgIcon,
					paletteSettings: paletteSettings,
					defaultValue: palette[0],
				}}
			/>
		);
	};

	const CustomBackColour = (props) => {
		// console.log(EditorToolsSettings)

		if (
			!question ||
			!question.opts ||
			!question.opts.data ||
			question.opts.data.length === 0
		)
			return <BackColor {...props} />;

		if (
			_.find(question.opts.data, { text: "gradient" }) ||
			_.find(question.opts.data, { text: "bg:gradient" })
		)
			return (
				<BackColor
					{...props}
					colorPickerProps={{
						svgIcon:
							EditorToolsSettings.backColor.colorPickerProps
								.svgIcon,
						view: "gradient",
					}}
				/>
			);

		const palette = _.filter(question.opts.data, (i) => {
			return !i.text?.startsWith("fg:");
		}).map((o) => o.value);
		if (!_.find(question.opts.data, (i) => i.value.length === 9))
			palette.splice(0, 0, "#00000000");

		const paletteSettings = { palette: palette };

		return (
			<BackColor
				{...props}
				svgIcon={EditorToolsSettings.bold.props.svgIcon}
				colorPickerProps={{
					svgIcon:
						EditorToolsSettings.backColor.colorPickerProps.svgIcon,
					paletteSettings: paletteSettings,
					defaultValue: palette[0],
				}}
			/>
		);
	};

	/*
	 * End - Inserting Images
	 */

	if (type === "full-editor") {
		tools = [
			[Bold, Italic, Underline, Strikethrough],
			[CustomForeColour, CustomBackColour, CleanFormatting],
			[Subscript, Superscript],
			[AlignLeft, AlignCenter, AlignRight, AlignJustify],
			[Indent, Outdent],
			[OrderedList, UnorderedList],
			[InsertImage],
			FontSize,
			FontName,
			FormatBlock,
			[Undo, Redo],
			[Link, Unlink, InsertImage, ViewHtml],
			[InsertTable],
			[AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
			[DeleteRow, DeleteColumn, DeleteTable],
			[MergeCells, SplitCell],
		];
	} else if (type === "basic-editor") {
		tools = [
			[Bold, Italic, Underline, Strikethrough],
			[CustomForeColour, CustomBackColour, CleanFormatting],
			[OrderedList, UnorderedList],
			[InsertImage],
			[InsertTable],
			[AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
			[DeleteRow, DeleteColumn, DeleteTable],
			[MergeCells, SplitCell],
			[Undo, Redo],
		];
	}

	return (
		<div
			key={"question-wrapper-" + question.id}
			className={
				"matpad-question-wrapper editor " +
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
			<>
				<HelpIcon help={question?.help?.trim()} />
				{question.readonly === true && (
					<div
						key={"control-" + question.id}
						className={"k-editor question readonly"}
					>
						<div className={"k-editor-content"}>
							<div
								className={"ProseMirror"}
								dangerouslySetInnerHTML={{
									__html: controlData,
								}}
							/>
						</div>
					</div>
				)}
				{question.readonly !== true && (
					<Editor
						className={"question " + (question?.css?.q ?? "")}
						key={"control-" + question.id}
						id={"control-" + question.id}
						defaultEditMode={"div"}
						tools={tools}
						onBlur={onBlur}
						value={controlData}
						preserveWhitespace={false}
						ref={editorRef}
						onChange={(e) => {
							try {
								setControlData(e.value);
							} catch (ex) {
								debugger;
							}
						}}
						onPasteHtml={(event) => {
							try {
								let html = pasteCleanup(
									sanitize(event.pastedHtml),
									pasteSettings
								);

								// If the pasted HTML contains images with sources pointing to the local file system,
								// `replaceImageSourcesFromRtf` will extract the sources from the RTF and place them to images 'src' attribute in base64 format.
								if (event.nativeEvent.clipboardData) {
									html = replaceImageSourcesFromRtf(
										html,
										event.nativeEvent.clipboardData
									);
								}
								return html;
							} catch (ex) {
								debugger;
								return event.pastedHtml;
							}
						}}
						onMount={onMount}
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
			</>
		</div>
	);
}
