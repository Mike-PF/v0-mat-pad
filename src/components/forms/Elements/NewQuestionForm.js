import React, { useState } from "react";
import _ from "lodash";
import { requiredValidator } from "../../../site";
import FormInput from "../FormInput";
import Button from "../../controls/Button";
import FormTextArea from "../FormTextArea";
import { DropDownSelect } from "../../controls/DropDownSelect";

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

const NewQuestionForm = ({ sectionState, setSectionState, currentSection }) => {
	const [selectedQuestionType, setSelectedQuestionType] = useState();
	const [questionTitle, setQuestionTitle] = useState();
	const [questionDescription, setQuestionDescription] = useState();

	const addQuestion = (s) => {
		const sectionStateDupe = structuredClone(sectionState ?? []);
		const repeatedSection = sectionStateDupe.find(
			(section) => section?.id === s?.id
		);
		const repeatedSectionIndex = sectionStateDupe.indexOf(repeatedSection);

		sectionStateDupe[repeatedSectionIndex].questions.push({
			id: _.uniqueId("question-"),
			questionType: selectedQuestionType,
			title: questionTitle,
			description: questionDescription,
		});

		setSectionState(sectionStateDupe);

		setSelectedQuestionType(null);
		setQuestionTitle(null);
		setQuestionDescription(null);
	};

	return (
		<div style={{ width: 400 }}>
			<FormInput
				name="title"
				type="text"
				onChange={(event) => setQuestionTitle(event.target.value)}
				required
				validator={requiredValidator}
				label="Title"
				maxLength={30}
			/>
			<FormTextArea
				name="description"
				type="text"
				onChange={(event) => setQuestionDescription(event.target.value)}
				required
				validator={requiredValidator}
				textArea
				label="Description text"
				maxLength={200}
			/>
			<div className="py-2">
				<label className="flex flex-no-wrap mb-2">Type*</label>
				<DropDownSelect
					key={"questionTypeSelect"}
					onChange={(e) => setSelectedQuestionType(e.value.id)}
					items={questionTypes}
					textField={"name"}
					valueField={"id"}
					value={selectedQuestionType}
					placeholder={"Select question type"}
				/>
			</div>
			<div className="p-2 flex items-center justify-end w-full">
				<Button
					form="addQuestionForm"
					type="button"
					onClick={() => addQuestion(currentSection)}
					// disabled={true}
				>
					Save
				</Button>
			</div>
		</div>
	);
};

export default NewQuestionForm;
