import React, { useState } from "react";
import _ from "lodash";
import { requiredValidator } from "../../../site";
import FormInput from "../../forms/FormInput";
import {
	faChevronDown,
	faChevronUp,
	faPlus,
	faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import { faGripDotsVertical } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../controls/Button";
import DialogOverlay from "../../controls/Dialog";
import FormTextArea from "../FormTextArea";
import { DropDownSelect } from "../../controls/DropDownSelect";
import NewQuestionForm from "./NewQuestionForm";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const questionTypes = [
	{
		id: _.uniqueId("short text - "),
		name: "Short text",
	},
	{
		id: _.uniqueId("long text - "),
		name: "Long text",
	},
	{
		id: _.uniqueId("colour picker - "),
		name: "Colour picker",
	},
	{
		id: _.uniqueId("date picker - "),
		name: "Date picker",
	},
	{
		id: _.uniqueId("mmultiple choice - "),
		name: "Multiple choice",
	},
];

const NewFormBuilder = (props) => {
	const [formState, setFormState] = useState({
		name: "",
	});
	const [sectionState, setSectionState] = useState([]);
	const [expanded, setExpanded] = useState();
	const [addingQuestion, setAddingQuestion] = useState(false);
	const [currentSection, setCurrentSection] = useState(null);
	const [bulkImporting, setBulkImporting] = useState(false);

	const addSection = () => {
		const sectionId = _.uniqueId("section-");

		setSectionState((prevState) => [
			...prevState,
			{
				id: sectionId,
				questions: [],
			},
		]);

		setExpanded(sectionId);
	};

	const changeFormName = (event) => {
		setFormState({
			...formState,
			name: event.target.value,
		});
	};

	const changeSectionName = (event, s) => {
		const repeatedSection = sectionState.find(
			(section) => section?.id === s?.id
		);
		const repeatedSectionIndex = sectionState.indexOf(repeatedSection);

		sectionState[repeatedSectionIndex].name = event.target.value;
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex items-center max-w-96 h-28 mb-4">
				<FormInput
					name="formName"
					type="text"
					required
					onChange={(event) => changeFormName(event)}
					defaultValue={formState.name}
					validator={requiredValidator}
					label="Form Title"
					maxLength={30}
				/>
			</div>
			<div className="w-full max-h-full overflow-auto">
				{sectionState.map((s) => (
					<>
						<div
							key={s.id}
							className="flex items-center mb-2"
						>
							<FontAwesomeIcon
								className="mr-3"
								icon={faGripDotsVertical}
							/>
							<div
								className={classNames(
									expanded === s.id ? "h-max" : "h-14",
									"w-full overflow-hidden bg-white border border-slate-200 rounded-lg max-w-full p-2"
								)}
							>
								<div
									className={classNames(
										expanded === s.id
											? "h-max items-start"
											: "h-10 items-center mb-4",
										"flex justify-between"
									)}
								>
									{expanded === s.id ? (
										<FormInput
											name={`${s.id} - title`}
											type="text"
											required
											onChange={(event) =>
												changeSectionName(event, s)
											}
											defaultValue={s?.name}
											validator={requiredValidator}
											label="Section Title"
											maxLength={30}
										/>
									) : (
										<div>
											{s?.name ? s.name : "New section"}
										</div>
									)}
									<div
										className={classNames(
											expanded === s.id ? "mt-1" : "",
											"flex items-center"
										)}
									>
										<button
											type="button"
											// onClick={() => deleteSection(s)}
											onClick={() => {
												console.log(s.id);
												console.log(expanded?.id);
											}}
											className="w-8 h-8 rounded-lg border bg-white border-slate-300 mr-2"
										>
											<FontAwesomeIcon
												icon={faTrashCan}
											/>
										</button>
										<button
											type="button"
											onClick={() =>
												expanded === s.id
													? setExpanded()
													: setExpanded(s.id)
											}
											className="w-8 h-8 rounded-lg border bg-white border-slate-300 mr-2  flex flex-col justify-center items-center"
										>
											<FontAwesomeIcon
												className="size-3"
												icon={
													expanded === s.id
														? faChevronDown
														: faChevronUp
												}
											/>
											<FontAwesomeIcon
												className="size-3"
												icon={
													expanded === s.id
														? faChevronUp
														: faChevronDown
												}
											/>
										</button>
									</div>
								</div>
								<div>
									<button
										type="button"
										onClick={() => {
											setAddingQuestion(true);
											setCurrentSection(s);
										}}
										className="bg-white px-2 border-none text-primary-500 mt-2"
									>
										<FontAwesomeIcon
											icon={faPlus}
											className="mr-2"
										/>
										Add question
									</button>
									<button
										type="button"
										onClick={() => setBulkImporting(true)}
										className="bg-white px-2 border-none text-primary-500 mt-2"
									>
										<FontAwesomeIcon
											icon={faPlus}
											className="mr-2"
										/>
										Bulk import
									</button>
								</div>
							</div>
						</div>
					</>
				))}
			</div>
			<div className="w-full flex justify-center items-center mt-6">
				<div className="w-full h-0 border border-primary-500" />
				<button
					type="button"
					onClick={addSection}
					className="bg-white px-2 absolute border-none text-primary-500"
				>
					<FontAwesomeIcon
						icon={faPlus}
						className="mr-2"
					/>
					Add section
				</button>
			</div>

			<DialogOverlay
				key={_.uniqueId("add-question")}
				open={addingQuestion}
				setOpen={setAddingQuestion}
				title="Add question"
			>
				<NewQuestionForm
					currentSection={currentSection}
					sectionState={sectionState}
					setSectionState={setSectionState}
				/>
			</DialogOverlay>
		</div>
	);
};

export default NewFormBuilder;
