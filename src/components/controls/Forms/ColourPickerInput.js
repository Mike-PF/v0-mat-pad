import * as React from "react";
import { ColorPicker, ColorPalette } from "@progress/kendo-react-inputs";
import { HelpIcon, rgba2hex, stopKeyPressPropogation } from "../../../site";
import { getAnswer, getControlLabel, getWrapperClass, setAnswer } from "./ControlCommon";

function ColourPickerInput({
    school,
    formID,
    detail,
    section,
    question,
    execute
}) {
    const palette = (question?.opts?.data || []).map(o => o.value);
    const paletteSettings = { palette: palette };
    const value = getAnswer(detail, question, section);
    const [controlData, setControlData] = React.useState(value || palette[0]);
    const type = question?.type?.toLowerCase();
    const lastValue = React.useRef(null);

    const onChange = React.useCallback((e) => {
        let val = e.value || null;

        if (val?.startsWith("rgba") === true)
            val = '#' + rgba2hex(val).substring(0, 6);

        if (val !== lastValue.current) {
            setAnswer(formID, detail, question, section, school, execute, val);
            lastValue.current = val;
        }

        setControlData(e.value);
    }, [formID, detail, question, section, school, execute]);

    if (!question || !type || type.trim().length === 0)
        return <>UNKNOWN PICKER</>;

    const label = getControlLabel(question);
    let field = <></>;

    if (question.readonly !== true) {
        if (type === "colour-select") {
            field = <ColorPicker
                key={"ctl-" + question.id}
                className={question.css?.q || null}
                paletteSettings={paletteSettings}
                value={controlData}
                onChange={onChange}
            />
        }
        else {
            field = <ColorPalette
                key={"ctl-" + question.id}
                className={question.css?.q || null}
                palette={palette}
                value={controlData}
                onChange={onChange}
                open={true}
            />
        }
    }

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper colour-picker " + getWrapperClass('q', question.css?.q) + " " + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        {
            question.readonly === true &&
            <div
                key={"ctl-" + question.id}
                className={"k-colorpalette " + (question.css?.q || "")}>
                <table className={"k-colorpalette-table"}>
                    <tbody >
                        <tr >
                            <td class="k-colorpalette-tile k-selected"
                                style={{ backgroundColor: controlData }}>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
        {
            field
        }
    </div>
}

export default React.memo(ColourPickerInput);