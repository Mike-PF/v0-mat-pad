import * as React from "react";
import { DatePicker, Calendar } from "@progress/kendo-react-dateinputs";
import { HelpIcon, formatDate, stopKeyPressPropogation } from "../../../site";
import { getAnswer, getControlLabel, getWrapperClass, setAnswer } from "./ControlCommon";

export default function DateInput({
    school,
    formID,
    detail,
    section,
    question,
    execute
}) {
    const value = getAnswer(detail, question, section);

    const [controlData, setControlData] = React.useState(value);
    const lastValue = React.useRef(value || null);
    const editorRef = React.useRef();
    const type = question?.type?.toLowerCase();

    React.useEffect(() => stopKeyPressPropogation(editorRef), [editorRef])

    const onChange = React.useCallback((e) => {
        setControlData(e.value);
        const val = e.value ? formatDate(e.value) : null;

        if (val !== lastValue.current) {
            setAnswer(formID, detail, question, section, school, execute, val);
            lastValue.current = val;
        }
    }, [formID, detail, question, section, school, execute]);

    if (!question || !type || type.trim().length === 0) return <>UNKNOWN DATE</>;

    const label = getControlLabel(question);
    let field = <>DATE ?</>;

    if (question.readonly === true)
        field = <div className={"k-input k-datepicker k-input-md k-rounded-md k-input-solid question readonly"}>
            <div
                key={"control-" + question.id}
                className={"k-dateinput k-input"}>
                <div className={"k-input-inner"} >
                    {
                        formatDate(controlData)
                    }
                </div>
            </div>
        </div >
    else if (type === 'calendar')
        field = <Calendar
            ref={editorRef}
            format="dd-MMM-yyyy"
            onChange={onChange}
            className={"question " + (question?.css?.q ?? "")}
            key={"control-" + question.id}
            id={"control-" + question.id}
            value={controlData || null}
        />;
    else if (type === 'datepicker')
        field = <DatePicker
            ref={editorRef}
            format="dd-MMM-yyyy"
            onChange={onChange}
            className={"question " + (question?.css?.q ?? "")}
            key={"control-" + question.id}
            id={"control-" + question.id}
            value={controlData || null}
        />;
    else
        field = <DatePicker
            ref={editorRef}
            format="dd-MMM-yyyy"
            onChange={onChange}
            className={"question " + (question?.css?.q ?? "")}
            key={"control-" + question.id}
            id={"control-" + question.id}
            value={controlData || null}
        />;

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper date " + getWrapperClass('q', question.css?.q) + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        {field}
    </div>;


}
