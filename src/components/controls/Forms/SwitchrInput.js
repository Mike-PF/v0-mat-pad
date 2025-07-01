import * as React from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { HelpIcon, getBool } from "../../../site";
import { getAnswer, getControlLabel, getWrapperClass, setAnswer } from "./ControlCommon";

function SwitchInput({
    school,
    formID,
    detail,
    section,
    question,
    execute
}) {
    const value = getAnswer(detail, question, section);
    const [checked, setChecked] = React.useState(value === true);
    const lastValue = React.useRef(value === true);
    const editorRef = React.useRef();
    const type = question?.type?.toLowerCase();

    const onChange = React.useCallback((e) => {
        const val = e.value === true;
        setChecked(val);

        if (val !== lastValue.current) {
            setAnswer(formID, detail, question, section, school, execute, val);
            lastValue.current = val;
        }
    }, [question, detail, execute, school, section, formID]);

    if (!question)
        return <>UNKNOWN SWITCH</>;

    const label = getControlLabel(question);

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper switch " + getWrapperClass('q', question.css?.q) + " " + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        <Switch
            disabled={question.readonly === true}
            className={"question " + (question?.css?.q ?? "")}
            key={"control-" + question.id}
            id={"control-" + question.id}
            onChange={onChange}
            checked={checked}
            ref={editorRef}
            onLabel={type === "yesno" ? "Yes" : "True"}
            offLabel={type === "yesno" ? "No" : "False"} />
    </div>

}

export default React.memo(SwitchInput);