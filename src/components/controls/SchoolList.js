import React from "react";
import _ from "lodash";
import { DropDownSelect } from "../controls/DropDownSelect";
import { LoadingSpinner } from "./LoadingSpinner";

const SchoolList = ({ schools, selectedUrn, setSelectedUrn }) => {
    if (typeof schools === "undefined" || schools == null)
        return <LoadingSpinner />;

    if (!_.isArray(schools) || schools.length === 0)
        return null;

    if (schools.length === 1) {
        setSelectedUrn({ value: schools[0] });
        return <h3 className="schoolName">{schools[0].name}</h3>;
    }

    return (
        <div key={"schoolList-wrap"} className="schoolSelector">
            <DropDownSelect
                key={"schoolList"}
                onChange={setSelectedUrn}
                items={_.sortBy(schools, ["name"])}
                textField={"name"}
                valueField={"urn"}
                value={selectedUrn}
                placeholder={"Select School"}
                maxWidth={"200px"}
            />
        </div>
    );
};

export default SchoolList;
