import * as React from "react";
import { InputSuffix } from "@progress/kendo-react-inputs";
import { HelpIcon, stopKeyPressPropogation } from "../../../site";
import { getAnswer, getControlLabel, getWrapperClass, setAnswer } from "./ControlCommon";
import { TextBox } from "@progress/kendo-react-inputs";

function TextBoxInput({
    school,
    formID,
    detail,
    section,
    question,
    execute
}) {
    const value = getAnswer(detail, question, section);
    const [controlData, setControlData] = React.useState(value);
    const editorRef = React.useRef();
    const type = question?.type?.toLowerCase();
    const lastValue = React.useRef(value || null);

    React.useEffect(() => stopKeyPressPropogation(editorRef), [editorRef])

    const onBlur = React.useCallback(() => {
        const val = controlData || null;

        if (val !== lastValue.current) {
            setAnswer(formID, detail, question, section, school, execute, val);
            lastValue.current = val;
        }
    }, [formID, detail, question, section, school, execute, controlData]);

    if (!question || !type || type.trim().length === 0)
        return <>UNKNOWN TEXTAREA</>;

    const getSuffix = () => "" + (controlData?.length || 0) + "/" + question.txt.max;
    const label = getControlLabel(question);

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper textbox " + getWrapperClass('q', question.css?.q) + " " + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        {
            question.readonly === true &&
            <div
                key={"control-" + question.id}
                className={"k-input k-input k-input-md k-input-solid k-rounded-md question readonly"}>
                <div
                    className={"k-input-inner !k-overflow-auto"}>
                    {
                        controlData
                    }
                </div>
            </div>
        }
        {
            question.readonly !== true &&
            <div style={{ maxWidth: 300, paddingLeft: 20 }}>
                <TextBox
                    onBlur={onBlur}
                    ref={editorRef}
                    onChange={(e) => setControlData(e.value || null)}
                    value={controlData}
                    className={"question " + (question?.css?.q ?? "")}
                    key={"control-" + question.id}
                    name={"control-" + question.id}
                    id={"control-" + question.id}
                    maxLength={question.txt?.max > 0 ? question.txt?.max : null}
                    suffix={() => question.txt?.max > 0 && <InputSuffix>{getSuffix()}&nbsp;</InputSuffix>} />
            </div>
        }
    </div>
}

export default React.memo(TextBoxInput);