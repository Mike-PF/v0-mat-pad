import React from "react";
import _ from "lodash";
import { DropDownSelect } from "./DropDownSelect";
import Button from "./Button";
import DialogOverlay from "./Dialog";

/**
 *
 * @param {{
 * organisations: Array<any>
 * onChange: function(any)
 * }} props
 */
const OrganisationSelector = ({ organisations, onChange, setOpen }) => {
    const selected = React.useRef(_.find(organisations, { home: true }));

    const contractOrganisations = organisations.filter(
        (item) => item?.contract === true
    );
    const nonContractOrganisations = organisations.filter(
        (item) => item?.contract !== true
    );
    const nameSortedContractOrgs = contractOrganisations.sort((a, b) =>
        a?.name?.localeCompare(b?.name)
    );
    const nameSortedNonContractOrgs = nonContractOrganisations.sort((a, b) =>
        a?.name?.localeCompare(b?.name)
    );

    const sortedOrganisations = nameSortedContractOrgs.concat(
        nameSortedNonContractOrgs
    );

    return (
        <DialogOverlay
            key={"org-selector"}
            open={true}
            setOpen={setOpen}
            title="Select Organisation"
        >
            <div>
                <div className="mb-2">
                    <DropDownSelect
                        key={"org-sel"}
                        multiSelect={false}
                        valueField={"id"}
                        textField={"name"}
                        selectedField={"home"}
                        items={sortedOrganisations}
                        onChange={(e) => {
                            selected.current = e.value;
                        }}
                        customWidth={true}
                    />
                </div>
                <div className="p-2 flex items-center justify-end w-full">
                    <Button
                        onClick={(e) =>
                            (onChange || function () {})(selected.current)
                        }
                        key={"org-sel-btn"}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </DialogOverlay>
    );
};

export default OrganisationSelector;
