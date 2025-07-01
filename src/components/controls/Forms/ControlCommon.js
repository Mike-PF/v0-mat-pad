import * as React from "react";
import _ from "lodash";
import { getBool } from "../../../site";
import { showAlert } from "../Alert";

/**
 * Get the answer from the cache
 * @param {any} detail
 * @param {any} question
 * @param {any} section
 * @returns
 */
export const getAnswer = (detail, question, section) => {
	let answers = _.orderBy(_.filter(detail.answers, { id: question.id }), [
			"seq",
		]),
		value = null;

	if (!answers || answers.length === 0) return null;

	if (answers && answers.length > 0 && section.rep >= 0) {
		const questions = _.filter(detail.details.questions, {
			sec: section.id,
		});
		const seqs = _.sortedUniq(
			_.reduce(
				_.filter(detail.answers, (a) => {
					return _.find(questions, { id: a.id }) ? true : false;
				}),
				(r, v, k) => {
					if (typeof v.seq === "undefined" || v.seq === null)
						v.seq = 0;

					if (r.indexOf(v.seq) < 0) r.push(v.seq);
					return r;
				},
				[]
			)
		);

		//console.log('getAnswer--------------------------------------------------START')

		//console.log('getAnswer - questions', _.clone(questions, true));
		//console.log('getAnswer - answers', _.clone(_.filter(detail.answers, (a) => { return _.find(questions, { id: a.id }) ? true : false }), true));
		//console.log('getAnswer - seqs', _.clone(seqs, true));
		//console.log('getAnswer - section', _.clone(section, true));

		//console.log('getAnswer--------------------------------------------------END\r\n\r\n\r\n')

		answers = _.filter(answers, { seq: seqs[section.idx - 1] });

		if (!answers || answers.length === 0) return null;
	}

	if (answers && answers.length > 0) {
		value = answers[0].answer;
	}

	if (value === null || typeof value === "undefined") return null;

	switch ((question.type ?? "text").toLowerCase()) {
		case "int":
		case "integer":
			return isNaN(parseInt(value)) ? null : parseInt(value);

		case "double":
		case "float":
		case "number":
		case "percent":
			return isNaN(parseFloat(value)) ? null : parseFloat(value);

		case "yesno":
		case "truefalse":
			return getBool(value);

		case "date":
		case "calendar":
		case "datepicker":
			return new Date(value);

		default:
			return value;
	}
};

/**
 * Save the anser to the cache as well as post to the API if required
 * @param {any} formID
 * @param {any} detail
 * @param {any} question
 * @param {any} section
 * @param {any} school
 * @param {any} execute
 * @param {any} value
 */
export const setAnswer = (
	formID,
	detail,
	question,
	section,
	school,
	execute,
	value
) => {
	let seq = null;
	const sectionDetail = _.find(detail.details.sections, { id: section.id });

	if (sectionDetail.rep >= 0) {
		const questions = _.filter(detail.details.questions, {
			sec: section.id,
		});
		const seqs = _.sortedUniq(
			_.reduce(
				_.filter(detail.answers, (a) => {
					return _.find(questions, { id: a.id }) ? true : false;
				}),
				(r, v, k) => {
					if (r.indexOf(v.seq) < 0) r.push(v.seq);
					return r;
				},
				[]
			)
		);
		seq = seqs[(section.idx > 0 ? section.idx : 1) - 1];
	}

	let answer = _.find(detail.answers, {
		id: question.id,
		urn: school?.urn || null,
		seq: seq,
	});

	let toPush = false;

	if (answer) {
		if (answer.answer !== value) {
			toPush = true;
			answer.answer = value;
		}
	} else {
		toPush = true;

		if (!_.isArray(detail.answers)) detail.answers = [];

		answer = {
			id: question.id,
			urn: school?.urn || null,
			seq: seq,
			answer: value,
		};

		detail.answers.push(answer);
	}

	if (toPush) {
		execute("POST", "/api/form/answer", {
			...answer,
			formID: formID,
		}).catch((error) => {
			console.log("ANSWER ERROR", error);
			debugger;
			showAlert({ body: <p>Unable to save answer!</p> });
		});
	}
};

/**
 * Get a standard label for the question
 * @param {any} question
 * @returns
 */
export const getControlLabel = (question) => {
	return (
		(question?.text?.trim() ?? "").length > 0 && (
			<label
				className={"lbl " + (question?.css?.lbl ?? "")}
				htmlFor={"control-" + question.id}
				key={"label-" + question.id}
				dangerouslySetInnerHTML={{ __html: question.text }}
			/>
		)
	);
};

/**
 * Get a broken down list of classes in the provided string and add the prefix
 * @param {string} prefix
 * @param {string} value
 * @returns {string}
 */
export const getWrapperClass = (prefix, value) => {
	if (!prefix || !value || value.trim().length === 0) return "";
	if (prefix.trim().length === 0) return value.trim();

	return value
		.trim()
		.split(" ")
		.map((x) => prefix + "-" + x)
		.join(" ");
};
