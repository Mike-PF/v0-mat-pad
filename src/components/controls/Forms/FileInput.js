import * as React from "react";
import _ from "lodash";
import { Upload } from "@progress/kendo-react-upload";
import { HelpIcon } from "../../../site";
import { getWrapperClass } from "./ControlCommon";

function FileInput({ question, change, value, formID, urn }) {
    const [controlData, setControlData] = React.useState([]);
    const type = question?.type?.toLowerCase();

    if (!question || !type || type.trim().length === 0) return <>UNKNOWN FILE</>;

    const label = (question?.text?.trim() ?? "").length > 0 ? <label
        className={"lbl " + (question?.css?.lbl ?? "")}
        htmlFor={"control-" + question.id}
        key={"label-" + question.id}
        dangerouslySetInnerHTML={{ __html: question.text }} /> : <></>;
    debugger

    return <div
        key={"question-wrapper-" + question.id}
        className={"matpad-question-wrapper textbox " + getWrapperClass('q', question.css?.q) + " " + getWrapperClass('l', question.css?.lbl)}>
        {label}
        <HelpIcon help={question?.help?.trim()} />
        <Upload
            className={"question " + (question?.css?.q ?? "")}
            key={"control-" + question.id}
            name={"control-" + question.id}
            id={"control-" + question.id}
            accept={"image/png, image/jpeg"}
            batch={true}
            restrictions={{
                maxFileSize: 1024 * 1024 * 15, // 15MB
                allowExtensions: [".jpg", ".png", ".jpeg"]
            }}
            withCredentials={false}
            saveUrl={"/api/form/" + question.id + '/' + formID + '/upload?urn=' + (parseInt(urn) > 0 ? urn : '')}
            removeUrl={"/api/form/" + question.id + '/' + formID + '/remove?urn=' + (parseInt(urn) > 0 ? urn : '')}
            multiple={question.num.max !== 1}
            autoUpload={true}
            actionsLayout={"end"}
            defaultFiles={[]}
        /></div>
}

export default React.memo(FileInput);