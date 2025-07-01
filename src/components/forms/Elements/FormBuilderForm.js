import React, { useCallback, useState } from "react";
import _ from "lodash";
import SectionItem from "./SectionItem";
import { LoadingSpinner } from "../../controls/LoadingSpinner";

const FormBuilderForm = (props) => {
    const { school, formID, detail, execute } = props;
    const [expanded, setExpanded] = useState({ id: null, subSeq: null });
    const setExpandedID = useCallback((id) => setExpanded(id), [setExpanded]);

    if (!detail) return <LoadingSpinner />;

    let sectionList = [];

    // get the sections that are top level and have questions, or where questions are linked to sub sections
    _.forEach(detail?.details?.sections, (s) => {
        var add = false,
            subSeq = [];

        if (!s.parent && _.find(detail?.details?.questions, { sec: s.id }))
            // top level and has questions
            add = true;
        else if (
            !s.parent &&
            _.find(detail?.details?.sections, (ss) => {
                return (
                    ss.parent === s.id &&
                    _.find(detail?.details?.questions, { sec: ss.id })
                );
            })
        )
            add = true;

        if (s.rep >= 0) {
            var questions = _.filter(detail?.details?.questions, { sec: s.id });
            _.forEach(questions, (q) => {
                _.forEach(detail.answers, (a) => {
                    if (a.id === q.id && subSeq.indexOf(a.seq || 0) < 0)
                        subSeq.push(a.seq || 0);
                });
            });
        }

        if (add && !_.find(sectionList, { id: s.id })) {
            if (subSeq.length === 0)
                sectionList.push({ ..._.clone(s), idx: 1 });
            else
                _.forEach(_.sortBy(subSeq), (ss, idx) => {
                    sectionList.push({
                        ..._.clone(s),
                        subSeq: ss,
                        idx: idx + 1,
                    });
                });
        }
    });

    //console.log("FORM RENDER SECTION (BEFORE)", _.clone(sectionList, true));
    sectionList = _.orderBy(sectionList, ["idx", "seq", "subSeq", "name"]);
    //console.log("FORM RENDER SECTION (AFTER)", _.clone(sectionList, true));

    if (!sectionList || sectionList.length === 0) {
        return <>Configuration Error - No Sections</>;
    }

    return (
        <>
            <div>Whey</div>
            <div>
                {sectionList.map((s) => {
                    return (
                        <SectionItem
                            school={school}
                            formID={formID}
                            detail={detail}
                            execute={execute}
                            section={s}
                            key={
                                s.id +
                                "-" +
                                (s.subSeq || "#") +
                                "-" +
                                (s.idx || 0)
                            }
                            expanded={expanded}
                            expand={setExpandedID}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default FormBuilderForm;
