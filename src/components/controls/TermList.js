import React from "react";
import _ from "lodash";
import { DropDownSelect } from "../controls/DropDownSelect";
import { LoadingSpinner } from "./LoadingSpinner";

const TermList = ({ terms, selectedTerm, setSelectedTerm }) => {
    if (typeof terms === "undefined" || terms == null)
        return <LoadingSpinner />;

    if (!_.isArray(terms) || terms.length === 0)
        return null;

    if (terms.length === 1) {
        setSelectedTerm({ value: terms[0] });
        return <h3 className="schoolName">{terms[0].periodName}</h3>;
    }

    return (
        <div key={"termList-wrap"} className="schoolSelector">
            <DropDownSelect
                key={"termList"}
                onChange={setSelectedTerm}
                items={_.sortBy(terms, ["r", "periodName"])}
                textField={"periodName"}
                valueField={"id"}
                value={selectedTerm}
                placeholder={"Select Term"}
                maxWidth={"200px"}
            />
        </div>
    );
};

export default TermList;
