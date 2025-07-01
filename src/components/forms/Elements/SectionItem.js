import React from "react";
import _ from "lodash";
import {
    ExpansionPanel,
    ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import { Reveal } from "@progress/kendo-react-animation";
import { findFirstFocusableElement, getDataItem } from "../../../site";
import { showAlert, showPleaseWait } from "../../controls/Alert";
import MultiLineInput from "../../controls/Forms/MultiLineInput";
import TextBoxInput from "../../controls/Forms/TextBoxInput";
import NumberInput from "../../controls/Forms/NumberInput";
import DateInput from "../../controls/Forms/DateInput";
import EditorInput from "../../controls/Forms/EditorInput";
import SwitchrInput from "../../controls/Forms/SwitchrInput";
import SelectInput from "../../controls/Forms/SelectInput";
import ColourPickerInput from "../../controls/Forms/ColourPickerInput";
import { getWrapperClass, getAnswer } from "../../controls/Forms/ControlCommon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";

const SectionItem = (props) => {
    const { school, formID, detail, section, expanded, expand, execute } =
        props;
    const [subSectionExpanded, setSubSectionExpanded] = React.useState({
        id: null,
        subSeq: null,
    });
    const setSubSectionExpandedID = React.useCallback(
        (id) => setSubSectionExpanded(id),
        [setSubSectionExpanded]
    );
    const ctlRef = React.useRef(null);
    const addButtonRef = React.useRef(null);
    const deleteButtonRef = React.useRef(null);

    /**
     * Add a duplicate section to the form - create a NULL answer in the new block
     * @param {any} e
     * @returns
     */
    const addSection = (e) => {
        if (typeof e.stopPropagation === "function") e.stopPropagation();
        e.cancelBubble = true;
        e.preventDefault();

        const questions = _.filter(detail.details.questions, {
            sec: section.id,
        });
        const seqs = _.sortedUniq(
            _.reduce(
                _.filter(detail.answers, (a) => {
                    return _.find(questions, { id: a.id }) ? true : false;
                }),
                (r, v, k) => {
                    if (v.seq === null || typeof v.seq === "undefined")
                        v.seq = 0;

                    if (r.indexOf(v.seq) < 0) r.push(v.seq);
                    return r;
                },
                []
            )
        );

        //console.log('addSection', seqs);

        let lastSeq = _.max(seqs) + 1;
        if (isNaN(lastSeq)) lastSeq = 1;

        //console.log('addSection - BEFORE', _.clone(detail.answers, true));

        detail.answers.push({
            id: questions[0].id,
            urn: school?.urn,
            seq: lastSeq,
            answer: null,
        });
        //console.log('addSection - AFTER', _.clone(detail.answers, true));

        expand({
            id: section.id,
            subSeq: lastSeq,
            scrollIntoView: true,
        });

        return false;
    };

    /**
     * Remove the current section if the user is sure
     */
    const removeSection = () => {
        showPleaseWait("Removing section");

        execute("POST", "/api/form/section", {
            delete: section.id,
            seq: section.subSeq,
            formID: formID,
            urn: school?.urn,
        })
            .then((i) => {
                _.remove(detail.answers, (a) => {
                    if (a.seq !== section.subSeq) return false;

                    let remove = false;
                    _.each(detail.details.questions, (q) => {
                        if (a.id === q.id && section.id === q.sec) {
                            remove = true;
                            return false;
                        }
                    });
                    return remove;
                });
                expand({
                    id: null,
                    scrollIntoView: false,
                });

                showAlert({ body: "Answers removed" });
            })
            .catch((e) => {
                showAlert({ body: "Unable to remove section" });
                debugger;
            });
    };

    let required = true;

    if (section.requires?.length > 0) {
        _.forEach(section.requires.split(";"), (i) => {
            if (!getDataItem(school, i)) {
                required = false;
                return false;
            }
        });
    }

    if (!required) return <></>;

    let items = _.filter(detail.details.questions, { sec: section.id });
    _.forEach(detail.details.sections, (s) => {
        // not linked to this section via parent
        if (s.parent !== section.id) return;

        // check for conditional requirements
        required = true;
        if (s.requires?.length > 0) {
            _.forEach(s.requires.split(";"), (i) => {
                if (!getDataItem(school, i)) {
                    required = false;
                    return false;
                }
            });
        }
        if (!required) return;

        let subSeq = [];

        // check for repeatable section and work out how many are present
        if (s.rep >= 0) {
            var questions = _.filter(detail?.details?.questions, { sec: s.id });
            _.forEach(questions, (q) => {
                _.forEach(detail.answers, (a) => {
                    if (a.id === q.id && subSeq.indexOf(a.seq || 0) < 0)
                        subSeq.push(a.seq || 0);
                });
            });
        }

        //if (s.name === 'E. Lesson Observations/Subject Reviews') debugger

        if (subSeq.length === 0) {
            items.push({ ..._.clone(s), idx: 1, section: true });
        } else {
            _.forEach(_.sortBy(subSeq), (ss, idx) => {
                items.push({
                    ..._.clone(s),
                    subSeq: ss,
                    idx: idx + 1,
                    section: true,
                });
            });
        }
    });

    items = _.orderBy(items, ["seq", "text", "name", "subSeq", "idx"]);

    let scrollCount = 0;
    const scrollTo = () => {
        if (typeof ctlRef?.current?.scrollIntoView === "function") {
            try {
                ctlRef.current.scrollIntoView();
                findFirstFocusableElement(ctlRef.current).focus();
            } catch {}
            expand({
                ...expanded,
                scrollIntoView: false,
            });
        } else if (scrollCount++ < 25) setTimeout(scrollTo, 50);
    };

    if (
        expanded.id === section.id &&
        (section.subSeq || 0) === (expanded.subSeq || 0) &&
        expanded.scrollIntoView
    )
        scrollTo();

    const titleElements = (section.name || "").split("|"),
        title = titleElements[0],
        subTitle = titleElements.length > 1 ? titleElements[1] : null;

    /**
     * Ask the user if they are sure gthey want to remove the current section
     * @param {any} e
     * @returns
     */
    const deleteSection = (e) => {
        if (typeof e.stopPropagation === "function") e.stopPropagation();
        e.cancelBubble = true;
        e.preventDefault();

        showAlert({
            title: "Delete Section",
            body: (
                <div className="max-w-[320px] md:max-w-[384px] lg:max-w-[512px] xl:max-w-[640px] 2xl:max-w-[768px]">
                    <p className="text-red-500">
                        Are you sure you want to delete this section?
                    </p>
                    <p>Doing so will remove the answers and can't be undone!</p>
                    {items.map((i, index) => {
                        const value = getAnswer(detail, i, section);
                        const imageRemovedAnswer =
                            typeof value === "string"
                                ? value?.replace(/<\s*img[^>]*>/g, "")
                                : "";
                        const tagsTrimmedAnswer = imageRemovedAnswer?.replace(
                            /<(.|\n)*?>/g,
                            " "
                        );
                        const cappedAnswer = tagsTrimmedAnswer?.substring(
                            0,
                            300
                        );

                        const tagsTrimmedQuestion = i?.text?.replace(
                            /<(.|\n)*?>/g,
                            " "
                        );
                        const cappedQuestion = tagsTrimmedQuestion?.substring(
                            0,
                            300
                        );

                        const imageTag =
                            typeof value === "string"
                                ? value?.match(/<\s*img[^>]*>/g)
                                : "";
                        const imageDataWithClosing =
                            imageTag && imageTag[0]?.split(`<img src="`)[1];
                        const imageData =
                            imageDataWithClosing &&
                            imageDataWithClosing?.split(`">`)[0];

                        if (index >= 3) {
                            return;
                        }

                        return (
                            <div className="w-full font-medium bg-slate-50 border border-slate-200 rounded-lg my-2">
                                <div className="w-full flex font-semibold justify-start items-start line-clamp-2 px-2">
                                    <div className="pr-1 text-start">Q:</div>
                                    <p className="line-clamp-2 text-start">
                                        {cappedQuestion
                                            ? cappedQuestion
                                            : i?.text}
                                    </p>
                                </div>
                                <div className="w-full flex justify-start items-start line-clamp-2 px-2">
                                    <div className="pr-1 text-start">A:</div>
                                    {imageData && (
                                        <img
                                            className="max-w-52 max-h-52 m-1 rounded-lg border border-slate-200"
                                            src={imageData}
                                        />
                                    )}
                                    <div className="text-start">
                                        {cappedAnswer ? cappedAnswer : ""}
                                        {tagsTrimmedAnswer?.length > 300 &&
                                            "..."}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ),
            buttons: [
                {
                    text: "No",
                },
                {
                    text: "Yes",
                    class: "primary",
                    click: removeSection,
                },
            ],
        });
        return false;
    };

    return (
        <ExpansionPanel
            id={"pnl-" + section.id + "-" + (section.subSeq || 0)}
            key={"pnl-" + section.id + "-" + (section.subSeq || 0)}
            title={title}
            expanded={
                expanded.id === section.id &&
                (section.subSeq || 0) === (expanded.subSeq || 0)
            }
            onAction={(e) => {
                expand(
                    e.expanded
                        ? {}
                        : { id: section.id, subSeq: section.subSeq || 0 }
                );
            }}
            subtitle={
                <>
                    {subTitle && <span>{subTitle}</span>}
                    {section.rep >= 0 && (
                        <>
                            <button
                                className="min-w-10 rounded-m text-white border-none bg-secondary-500 hover:opacity-60 h-10 mr-2"
                                ref={addButtonRef}
                                title={"Add"}
                                onClick={addSection}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button
                                className="min-w-10 rounded-m text-white border-none bg-secondary-500 hover:opacity-60 h-10"
                                ref={deleteButtonRef}
                                title={"Remove answers"}
                                onClick={deleteSection}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    )}
                </>
            }
        >
            <Reveal key={"pnl-rev-" + section.id + "-" + (section.subSeq || 0)}>
                {expanded.id === section.id &&
                    (section.subSeq || 0) === (expanded.subSeq || 0) && (
                        <ExpansionPanelContent
                            className={
                                " overflow-auto form-section " +
                                (section?.panelclass || "")
                            }
                            ref={ctlRef}
                        >
                            {items.map((i, idx) => {
                                if (i.section === true) {
                                    return (
                                        <SectionItem
                                            school={school}
                                            formID={formID}
                                            execute={execute}
                                            detail={detail}
                                            section={i}
                                            key={
                                                i.id +
                                                "-" +
                                                (i.subSeq || "#") +
                                                "-" +
                                                (i.idx || 0)
                                            }
                                            expanded={subSectionExpanded}
                                            expand={setSubSectionExpandedID}
                                        />
                                    );
                                }

                                switch ((i.type ?? "text").toLowerCase()) {
                                    case "hidden":
                                        return null;

                                    case "label":
                                        return (
                                            <div
                                                key={"question-wrapper-" + i.id}
                                                className={
                                                    "matpad-question-wrapper label " +
                                                    getWrapperClass(
                                                        "q",
                                                        i.css?.q
                                                    ) +
                                                    " " +
                                                    getWrapperClass(
                                                        "l",
                                                        i.css?.lbl
                                                    )
                                                }
                                            >
                                                <label
                                                    key={"question-" + i.id}
                                                    className={
                                                        "lbl " +
                                                        (i.css?.lbl ?? "")
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: i.text,
                                                    }}
                                                ></label>
                                            </div>
                                        );

                                    case "multiline":
                                        return (
                                            <MultiLineInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "textbox":
                                        return (
                                            <TextBoxInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "select":
                                    case "single-select":
                                    case "multi-select":
                                        return (
                                            <SelectInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                placeholder={" "}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "colour-picker":
                                    case "colour-select":
                                        return (
                                            <ColourPickerInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    //case "file":
                                    //    return <FileInput
                                    //        school={school}
                                    //        formID={formID}
                                    //        detail={detail}
                                    //        section={section}
                                    //        question={i}
                                    //        execute={execute}
                                    //        key={"question-" + i.id} />

                                    case "int":
                                    case "integer":
                                    case "double":
                                    case "float":
                                    case "number":
                                    case "percent":
                                        return (
                                            <NumberInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "yesno":
                                    case "truefalse":
                                        return (
                                            <SwitchrInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "date":
                                    case "calendar":
                                    case "datepicker":
                                        return (
                                            <DateInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    case "basic-editor":
                                    case "fulleditor":
                                    case "editor":
                                        return (
                                            <EditorInput
                                                school={school}
                                                formID={formID}
                                                detail={detail}
                                                section={section}
                                                question={i}
                                                execute={execute}
                                                key={"question-" + i.id}
                                            />
                                        );

                                    default:
                                        return <p>{"TODO: " + i.type}</p>;
                                }
                            })}
                        </ExpansionPanelContent>
                    )}
            </Reveal>
        </ExpansionPanel>
    );
};
export default SectionItem;
