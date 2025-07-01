import * as React from "react";
import _ from "lodash";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { formatNumber } from '@progress/kendo-intl';
import { HelpIcon, stopKeyPressPropogation } from "../../../site";
import { getAnswer, getControlLabel, getWrapperClass, setAnswer } from "./ControlCommon";

function NumberInput({
    school,
    formID,
    detail,
    section,
    question,
    execute
}) {
    const value = getAnswer(detail, question, section);
    const [controlData, setControlData] = React.useState(value);
    const type = question?.type?.toLowerCase();
    const lastValue = React.useRef(value || null);
    const editorRef = React.useRef();

    const onBlur = React.useCallback((e) => {
        let val = parseFloat(controlData),
            update = false;

        if (_.isNumber(question.num?.min) && val < question.num.min) {
            update = true;
            val = question.num.min
        }
        if (_.isNumber(question.num?.max) && val > question.num.max) {
            update = true;
            val = question.num.max;
        }
        if (update) {
            setControlData(val);
        }

        if (val !== lastValue.current) {
            lastValue.current = val;
            setAnswer(formID, detail, question, section, school, execute, val);
        }

    }, [question, controlData, detail, execute, school, section, formID]);

    React.useEffect(() => stopKeyPressPropogation(editorRef), [editorRef])

    if (!question || !type || type.trim().length === 0)
        return <>UNKNOWN NUMBER</>;

    const label = getControlLabel(question);

    let format = {};
    if (type === "percent") {
        format.style = "percent";
        format.maximumFractionDigits = format.minimumFractionDigits = ((question.num?.dp || 0) <= 0) ? 2 : question.num.dp;
    }
    else {
        format.style = "decimal";

        if (type === "int" || type === "integer") {
            format.maximumFractionDigits = 0;
        }
        else {
            format.maximumFractionDigits = format.minimumFractionDigits = ((question.num?.dp || 0) <= 0) ? 2 : question.num.dp;
        }
    }

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper number " + getWrapperClass('q', question.css?.q) + " " + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        {
            question.readonly === true &&
            <div
                key={"control-" + question.id}
                className={"k-input k-numerictextbox k-input-md k-input-solid k-rounded-md question readonly"}>
                <div
                    className={"k-input-inner "}>
                    {
                        formatNumber(controlData, format) || ' '
                    }
                </div>
            </div>
        }
        {
            question.readonly !== true &&
            <NumericTextBox
                onBlur={onBlur}
                ref={editorRef}
                onChange={(e) => setControlData(e.target.value)}
                value={controlData}
                className={"question " + (question?.css?.q ?? "")}
                key={"control-" + question.id}
                name={"control-" + question.id}
                id={"control-" + question.id}
                min={question.num?.min || undefined}
                max={question.num?.max || undefined}
                format={format} />
        }
    </div>
}

export default React.memo(NumberInput);