import * as React from "react";
import _ from "lodash";
import { HelpIcon, stopKeyPressPropogation } from "../../../site";
import {
    getAnswer,
    getControlLabel,
    getWrapperClass,
    setAnswer,
} from "./ControlCommon";
import { DropDownSelect } from "../DropDownSelect";

function SelectInput({
    school,
    formID,
    detail,
    section,
    question,
    execute,
    placeholder,
}) {
    const value = getAnswer(detail, question, section);
    const editorRef = React.useRef();
    const type = question?.type?.toLowerCase();
    const lastValue = React.useRef(value || null);
    const items = _.sortBy(question?.opts?.data || [], ["seq"]);

    _.each(items, (i) => {
        i.selected = false;
        if (question.type !== "multi-select" && value === i.value)
            i.selected = true;
        if (
            question.type === "multi-select" &&
            (value || "")
                .split(";")
                .map((i) => i.trim())
                .indexOf(i.value) >= 0
        )
            i.selected = true;
    });

    const onChange = React.useCallback(
        (e) => {
            let value = null;

            if (_.isArray(e.value)) {
                value = "";
                _.each(e.value, (v) => {
                    if (value.length > 0) value += "; ";
                    value += v.value;
                });
            } else {
                value = e.value.value;
            }

            if (value !== lastValue.current) {
                setAnswer(
                    formID,
                    detail,
                    question,
                    section,
                    school,
                    execute,
                    value
                );
                lastValue.current = value;
            }
        },
        [formID, detail, question, section, school, execute]
    );

    const label = getControlLabel(question);

    return (
        <div
            key={"question-wrapper-" + question.id}
            className={
                "matpad-question-wrapper select " +
                getWrapperClass("q", question.css?.q) +
                " " +
                getWrapperClass("l", question.css?.lbl)
            }
        >
            {label}
            <HelpIcon help={question?.help?.trim()} />
            <DropDownSelect
                readonly={question.readonly === true}
                ref={editorRef}
                onChange={onChange}
                multiSelect={question.type === "multi-select"}
                items={items}
                textField={"text"}
                valueField={"value"}
                placeholder={placeholder || "Select..."}
                className={"question " + (question?.css?.q ?? "")}
                key={"control-" + question.id}
                name={"control-" + question.id}
                id={"control-" + question.id}
                customWidth={true}
            />
        </div>
    );
}

export default React.memo(SelectInput);
