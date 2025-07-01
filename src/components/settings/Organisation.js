﻿import React from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { showAlert } from "../controls/Alert";
import {
    formatDate,
    requiredValidator,
    addDays,
    hasPermission,
} from "../../site";
import { DropDownSelect } from "../controls/DropDownSelect";
import { NoPermission } from "../controls/NoPermission";
import { PageError } from "../controls/PageError";
import FormInput from "../forms/FormInput";
import IconButton from "../controls/IconButton";
import DialogOverlay from "../controls/Dialog";
import Button from "../controls/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

const txtInput = (fieldRenderProps) => {
    const {
        validationMessage,
        visited,
        label,
        name,
        IdPrefix,
        reverseHorizontal,
        ...others
    } = fieldRenderProps;

    if (!reverseHorizontal)
        return (
            <div className="k-form-field-wrap">
                <FormInput
                    {...others}
                    key={IdPrefix + name}
                    id={IdPrefix + name}
                    label={label}
                    name={IdPrefix + name}
                />
            </div>
        );

    return (
        <div className="k-form-field-wrap reverse-horizontal">
            <div className={"wrapper"}>
                {others.type !== "number" && (
                    <FormInput
                        {...others}
                        type="text"
                        key={IdPrefix + name}
                        id={IdPrefix + name}
                    />
                )}
                {others.type === "number" && (
                    <FormInput
                        {...others}
                        type="number"
                        key={IdPrefix + name}
                        id={IdPrefix + name}
                    />
                )}
                <label htmlFor={IdPrefix + name} className={"k-form-label"}>
                    {label}
                </label>
            </div>
        </div>
    );
};

// const EditContact = ({
//     contact,
//     organisation,
//     primary,
//     finance,
//     IdPrefix,
//     updateContact,
//     execute,
//     editOpen,
//     setEditOpen }) => {

//     const save = (item) => {
//         var data = {
//             ...item,
//             organisation: organisation,
//             primary: primary === true,
//             finance: finance === true
//         }

//         showAlert({
//             body: <p>Are you sure you want to update the {primary ? "primary" : "finance"} contact for the organisation?</p>,
//             buttons: [
//                 {
//                     text: "OK",
//                     click: (e) => {
//                         execute("POST", "/api/settings/organisation/contact", data)
//                             .then(response => {
//                                 if (!response || response.error) {
//                                     showAlert({ body: <p>{response ? response.error : "Unable to save details"}</p> })
//                                     return;
//                                 }

//                                 updateContact({ primary: primary, contact: response });
//                             })
//                             .catch(e => {
//                                 debugger
//                                 console.log("ERROR", e)
//                                 showAlert({ body: <p>Unable to save details</p> });
//                             });
//                     }
//                 },
//                 { text: "Cancel" }
//             ]
//         });
//     };

//     return <DialogOverlay
//         open={editOpen}
//         setOpen={setEditOpen}
//         style={{ maxHeight: "95%", maxWidth: "95%" }}
//         key={IdPrefix + "contact-dlg"}
//         onClose={() => updateContact(null)}
//         title={"Edit " + (primary ? "Primary" : "Finance") + " Contact"}>
//         <Form
//             initialValues={contact}
//             onSubmit={save}
//             render={(formRenderProps) => (
//                 <FormElement
//                     style={{ width: 400 }}>
//                     <fieldset className={"k-form-fieldset"}>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"title"}
//                                     label={"Title"}
//                                     component={txtInput}
//                                     maxLength={20}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"firstName"}
//                                     label={"First name"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     validator={requiredValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"lastName"}
//                                     label={"Last name"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     validator={requiredValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"email"}
//                                     label={"Email"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     maxLength={250}
//                                     type={"email"}
//                                     validator={requiredEmailValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"officePhone"}
//                                     label={"Office Phone"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     maxLength={30}
//                                     type={"tel"}
//                                     validator={phoneValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <div className="k-actions k-actions-horizontal k-window-actions k-dialog-actions k-actions-end" style={{ border: "none" }}>
//                             <Button
//                                 type={"submit"}
//                                 disabled={!formRenderProps.allowSubmit}
//                             >
//                                 Save
//                             </Button>
//                         </div>
//                     </fieldset>
//                 </FormElement>
//             )}
//         />
//     </DialogOverlay>

// }

// const EditAddress = ({
//     address,
//     organisation,
//     IdPrefix,
//     updateAddress,
//     execute,
//     editOpen,
//     setEditOpen }) => {

//     const save = (item) => {
//         var data = {
//             ...item,
//             organisation: organisation
//         }

//         showAlert({
//             body: <p>Are you sure you want to update the primary address for the organisation?</p>,
//             buttons: [
//                 {
//                     text: "OK",
//                     click: (e) => {
//                         execute("POST", "/api/settings/organisation/address", data)
//                             .then(response => {
//                                 if (!response || response.error) {
//                                     showAlert({ body: <p>{response ? response.error : "Unable to save details"}</p> })
//                                     return;
//                                 }

//                                 updateAddress({ address: response });
//                             })
//                             .catch(e => {
//                                 debugger
//                                 console.log("ERROR", e)
//                                 showAlert({ body: <p>Unable to save details</p> });
//                             });
//                     }
//                 },
//                 { text: "Cancel" }
//             ]
//         });
//     };

//     return <DialogOverlay
//         open={editOpen}
//         setOpen={setEditOpen}
//         key={IdPrefix + "address-dlg"}
//         onClose={() => updateAddress(null)}
//         title={"Edit Primary Address"}>
//         <Form
//             initialValues={address}
//             onSubmit={save}
//             render={(formRenderProps) => (
//                 <FormElement
//                     style={{ width: 400 }}>
//                     <fieldset className={"k-form-fieldset"}>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"address1"}
//                                     label={"Address"}
//                                     component={txtInput}
//                                     maxLength={100}
//                                     validator={requiredValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"address2"}
//                                     label={""}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     maxLength={100}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"town"}
//                                     label={"Town"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     validator={requiredValidator}
//                                     maxLength={100}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>
//                         <FieldWrapper>
//                             <div className="k-form-field-wrap">
//                                 <Field
//                                     name={"postcode"}
//                                     label={"Postcode"}
//                                     component={txtInput}
//                                     labelClassName={"k-form-label"}
//                                     maxLength={8}
//                                     validator={requiredPostcodeValidator}
//                                     IdPrefix={IdPrefix}
//                                 />
//                             </div>
//                         </FieldWrapper>

//                         <div className="k-actions k-actions-horizontal k-window-actions k-dialog-actions k-actions-end" style={{ border: "none" }}>
//                             <Button
//                                 type={"submit"}
//                                 disabled={!formRenderProps.allowSubmit}
//                             >
//                                 Save
//                             </Button>
//                         </div>
//                     </fieldset>
//                 </FormElement>
//             )}
//         />
//     </DialogOverlay>

// }

const EditSchools = ({
    schools,
    organisation,
    IdPrefix,
    updateSchools,
    execute,
    editOpen,
    setEditOpen,
}) => {
    const [schoolList, setSchools] = React.useState(_.clone(schools, true));
    const [urnValue, setUrnValue] = React.useState(null);

    const removeUrn = (urn) => {
        setSchools(_.filter(schoolList, (s) => s.urn !== urn));
    };

    const addUrn = () => {
        const newUrn = parseInt(urnValue);

        if (isNaN(newUrn)) return;

        if (_.find(schoolList, { urn: newUrn })) {
            showAlert({ body: <p>This URN is already in the list</p> });
            return;
        }

        execute("GET", "/api/settings/urnlookup?urn=" + newUrn)
            .then((response) => {
                if (!response || response.error) {
                    removeUrn(newUrn);
                    showAlert({
                        body: (
                            <p>
                                {response
                                    ? response.error
                                    : "Unable to save details"}
                            </p>
                        ),
                    });
                    return;
                }

                const sl = _.clone(schoolList, true);
                const school = _.find(sl, { urn: newUrn });
                school.name = response.name;

                setSchools(sl);
            })
            .catch((e) => {
                debugger;
                console.log("ERROR", e);
                showAlert({ body: <p>Unable to lookup school name</p> });
            });

        schoolList.push({ urn: newUrn, name: "..." });
        setSchools(schoolList);
        setUrnValue("");
    };

    const save = () => {
        const data = {
            organisation: organisation,
            urns: schoolList.map((s) => s.urn),
        };

        showAlert({
            body: (
                <p>
                    Are you sure you want to update the school list
                    organisation?
                </p>
            ),
            buttons: [
                {
                    text: "OK",
                    click: (e) => {
                        execute(
                            "POST",
                            "/api/settings/organisation/schools",
                            data
                        )
                            .then((response) => {
                                if (!response || response.error) {
                                    showAlert({
                                        body: (
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: response
                                                        ? response.error
                                                        : "Unable to save details",
                                                }}
                                            />
                                        ),
                                    });
                                    return;
                                }

                                updateSchools({ schools: response });
                            })
                            .catch((e) => {
                                debugger;
                                console.log("ERROR", e);
                                showAlert({
                                    body: <p>Unable to save details</p>,
                                });
                            });
                    },
                },
                { text: "Cancel" },
            ],
        });
    };

    return (
        <DialogOverlay
            open={editOpen}
            setOpen={setEditOpen}
            key={IdPrefix + "schools-dlg"}
            onClose={() => updateSchools(null)}
            title={"Edit Schools"}
        >
            <table className={"padded"}>
                <tbody>
                    {_.orderBy(schoolList, ["name"]).map((s, i) => (
                        <tr key={"s" + i}>
                            <td>{s.urn}</td>
                            <td className="text-left">{s.name}</td>
                            <td>
                                <IconButton onClick={() => removeUrn(s.urn)}>
                                    <i className={"fa-regular fa-trash"}></i>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <FormInput
                                type="number"
                                value={urnValue}
                                onChange={(e) => setUrnValue(e.target.value)}
                                min={0}
                                max={9999999999}
                                style={{ width: 100 }}
                            />
                        </td>
                        <td></td>
                        <td>
                            <IconButton onClick={addUrn}>
                                <i className={"fa-regular fa-plus"}></i>
                            </IconButton>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="p-2 flex items-center justify-end w-full">
                <Button onClick={save}>Save</Button>
            </div>
        </DialogOverlay>
    );
};

const NewOrganisation = ({
    IdPrefix,
    updateOrganisation,
    execute,
    editOpen,
    setEditOpen,
    setAddOrganisationFormOpen,
}) => {
    const save = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            expires: addDays(new Date(formData.get("expires")), 365),
            name: formData.get("name")?.toString() ?? "",
            accountcode: formData.get("accountcode")?.toString() ?? "",
        };

        showAlert({
            body: <p>Are you sure you want to create the organisation?</p>,
            buttons: [
                {
                    text: "OK",
                    click: (e) => {
                        execute("POST", "/api/settings/organisation", data)
                            .then((response) => {
                                if (!response || response.error) {
                                    showAlert({
                                        body: (
                                            <p>
                                                {response
                                                    ? response.error
                                                    : "Unable to save details"}
                                            </p>
                                        ),
                                    });
                                    return;
                                }

                                updateOrganisation(response);
                                setAddOrganisationFormOpen(false);
                            })
                            .catch((e) => {
                                debugger;
                                console.log("ERROR", e);
                                showAlert({
                                    body: <p>Unable to save details</p>,
                                });
                            });
                    },
                },
                { text: "Cancel" },
            ],
        });
    };

    const onClose = () => {
        updateOrganisation(null);
        setAddOrganisationFormOpen(false);
    };

    return (
        <DialogOverlay
            open={editOpen}
            setOpen={setEditOpen}
            key={IdPrefix + "org-dlg"}
            onClose={onClose}
            title={"New Organisation"}
        >
            <form id="addUserForm" onSubmit={save}>
                <div style={{ width: 400 }}>
                    <fieldset>
                        <FormInput
                            name={"name"}
                            label={"Name"}
                            required={true}
                            component={txtInput}
                            type="text"
                            maxLength={50}
                            validator={requiredValidator}
                            IdPrefix={IdPrefix}
                        />
                        <FormInput
                            name={"expires"}
                            label={"Expiry"}
                            type="date"
                        />
                        {/*<FormInput*/}
                        {/*    name={"accountcode"}*/}
                        {/*    label={"Account code"}*/}
                        {/*    component={txtInput}*/}
                        {/*    maxLength={20}*/}
                        {/*    IdPrefix={IdPrefix}*/}
                        {/*/>*/}
                        <div className="p-2 flex items-center justify-end w-full">
                            <Button form="addUserForm" type="submit">
                                Save
                            </Button>
                        </div>
                    </fieldset>
                </div>
            </form>
        </DialogOverlay>
    );
};

const OrganisationSettings = (props) => {
    const { execute } = useFetchWithMsal();
    const [IdPrefix, updatePrefix] = React.useState(_.uniqueId("org-"));
    const [settings, setSettings] = React.useState({ loading: true });
    // const [contact, editContact] = React.useState(null);
    // const [address, editAddress] = React.useState(null);s
    const [schools, editSchools] = React.useState(null);
    const [addOrganisationFormOpen, setAddOrganisationFormOpen] =
        React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const { setLocation, userDetail } = useMatpadContext();
    const [permissions, setPermissions] = React.useState({
        viewSettings: false,
        schoolsMaintenance: false,
    });
    const refOrganisation = React.useRef(userDetail?.organisation?.id || null);
    const [selectedOrganisation, setSelectedOrganisation] = React.useState(
        userDetail?.organisation?.id || null
    );

    /**
     * Get the page setup information on initial load
     */
    React.useEffect(() => {
        setLocation(window.location.pathname);

        //if (userDetail.organisationRole !== "Admin") {
        //    setSettings({ organisationRole: "User" });
        //} else
        if (!settings || settings.loading) {
            execute("GET", "/api/settings/organisation")
                .then((response) => {
                    if (response) {
                        if (response.error) {
                            showAlert({
                                body: (
                                    <>
                                        <p>Unable to load settings</p>
                                        <p>{response.error}</p>
                                    </>
                                ),
                            });
                            setSettings({ error: true });
                        }

                        setSettings(response);
                    }
                })
                .catch((err) => {
                    showAlert({ body: <p>Unable to load settings</p> });
                    setSettings({ error: true });
                });
        }
    }, [execute, settings, setLocation, userDetail]);

    React.useEffect(() => {
        if (!userDetail || userDetail.notLoaded === true) return;

        if (refOrganisation.current !== userDetail?.organisation?.id) {
            refOrganisation.current = userDetail?.organisation?.id;
            setSettings({ loading: true });
        }

        setPermissions({
            viewSettings: hasPermission(userDetail, "viewsettings"),
            schoolsMaintenance: hasPermission(userDetail, "changeurns"),
            globalAdmin: userDetail.isAdmin === true,
        });
    }, [userDetail, setPermissions]);

    if (!settings || settings.loading) return <LoadingSpinner />;

    if (!settings || settings.error)
        return (
            <PageError
                area={"organisation settings"}
                error={settings.error || ""}
            />
        );

    // no rights here
    if (!hasPermission(userDetail, "viewsettings")) {
        return <NoPermission area={"the organisation settings"} />;
    }

    let orgSelect = (
            <h3 className="font-medium text-2xl mb-3">
                {userDetail.organisation.name}
            </h3>
        ),
        organisation = _.find(settings.organisations, {
            id: selectedOrganisation,
        });

    //if (userDetail.organisationRole === "Admin" && settings?.user?.isAdmin === true && settings?.organisations?.length > 0) {
    if (permissions.globalAdmin === true) {
        const contractOrganisations = settings?.organisations.filter(
            (item) => item?.contract === true
        );
        const nonContractOrganisations = settings?.organisations.filter(
            (item) => item?.contract !== true
        );
        const nameSortedContractOrgs = contractOrganisations.sort((a, b) =>
            a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
        );
        const nameSortedNonContractOrgs = nonContractOrganisations.sort(
            (a, b) =>
                a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
        );

        const orgList = nameSortedContractOrgs
            .concat(nameSortedNonContractOrgs)
            .map((o) => {
                return {
                    id: o.id,
                    name: o.name,
                    selected: o.id === selectedOrganisation,
                };
            });

        orgSelect = (
            <div className="max-w-64">
                <DropDownSelect
                    key={IdPrefix + "sel"}
                    id={IdPrefix + "org"}
                    items={orgList}
                    textField={"name"}
                    valueField={"id"}
                    placeholder={"Organisation"}
                    value={selectedOrganisation}
                    onChange={(e) => setSelectedOrganisation(e.value.id)}
                />
            </div>
        );
    }

    return (
        <>
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="text-slate-900 text-lg font-semibold">
                        Organisation{permissions.globalAdmin === true && "s"}
                    </div>
                    {permissions.globalAdmin === true && (
                        <Button
                            onClick={() => setAddOrganisationFormOpen(true)}
                        >
                            <div className="flex mx-2 items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="mr-2"
                                />
                                <div>Add organisation</div>
                            </div>
                        </Button>
                    )}
                </div>
                <div className="flex mt-2">
                    {orgSelect}
                    <div className="flex items-center ml-4">
                        <div className="text-slate-500 ">Created at</div>
                        <div className="ml-1 text-slate-900">
                            {formatDate(new Date(organisation?.created))}
                        </div>
                    </div>
                    <div className="flex items-center ml-4">
                        <div className="text-slate-500 ">Expires at</div>
                        <div className="ml-1 text-slate-900">
                            {formatDate(new Date(organisation?.expires))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrganisation && selectedOrganisation !== "--NEW--" && (
                <div className="w-full bg-white border border-slate-200 rounded-lg mt-3 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-slate-900 text-lg font-semibold">
                            Schools
                        </div>
                        {permissions.schoolsMaintenance.available === true && (
                            <Button
                                onClick={() => {
                                    setEditOpen(true);
                                    editSchools({
                                        organisation: selectedOrganisation,
                                        schools: organisation.schools || [],
                                        execute: execute,
                                    });
                                }}
                            >
                                <div className="flex mx-2 items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2"
                                    />
                                    <div>Add schools</div>
                                </div>
                            </Button>
                        )}
                    </div>
                    <table className="w-full padded">
                        <tbody className="w-full max-h-[600px] overflow-auto flex flex-col">
                            <tr className="w-full">
                                <td colSpan={2}>
                                    {_.isArray(organisation?.schools) &&
                                        organisation.schools.length > 0 && (
                                            <table className="w-full max-h-80 overflow-auto">
                                                <thead>
                                                    <tr>
                                                        <td>URN</td>
                                                        <td>Name</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {organisation.schools.map(
                                                        (s, i) => {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        "S-" + i
                                                                    }
                                                                >
                                                                    <td>
                                                                        {s.urn}
                                                                    </td>
                                                                    <td>
                                                                        {s.name}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {addOrganisationFormOpen && (
                <NewOrganisation
                    setAddOrganisationFormOpen={setAddOrganisationFormOpen}
                    IdPrefix={IdPrefix}
                    editOpen={true}
                    setEditOpen={setEditOpen}
                    execute={execute}
                    updateOrganisation={(c) => {
                        if (!c) {
                            setSelectedOrganisation(
                                userDetail?.organisation?.id || null
                            );
                        } else {
                            debugger;
                            settings.organisations.push(c);
                            setSelectedOrganisation(c.id);
                            setSettings(settings);
                            updatePrefix(IdPrefix + "_");
                        }
                    }}
                />
            )}
            {/* Things below don't seem to be used but saved in case
            to be deleted later

            {contact !== null &&
            <EditContact
                contact={contact.contact}
                organisation={selectedOrganisation}
                primary={contact.primary === true}
                finance={contact.finance === true}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                IdPrefix={IdPrefix}
                execute={execute}
                updateContact={(c) => {
                    if (!c)
                        editContact(null);
                    else {
                        const org = _.find(settings.organisations, { id: selectedOrganisation })
                        org[c.primary === true ? "primaryContact" : "financeContact"] = c.contact;

                        setSettings(settings);
                        editContact(null);
                    }
                }}
            />
        }
        {address !== null &&
            <EditAddress
                address={address.address}
                organisation={selectedOrganisation}
                IdPrefix={IdPrefix}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                execute={execute}
                updateAddress={(c) => {
                    if (!c)
                        editAddress(null);
                    else {
                        const org = _.find(settings.organisations, { id: selectedOrganisation })
                        org.primaryAddress = c.address;

                        setSettings(settings);
                        editAddress(null);
                    }
                }}
            />
                }
        */}
            {schools !== null && (
                <EditSchools
                    schools={schools.schools}
                    organisation={selectedOrganisation}
                    IdPrefix={IdPrefix}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    execute={execute}
                    updateSchools={(c) => {
                        if (!c) editSchools(null);
                        else {
                            const org = _.find(settings.organisations, {
                                id: selectedOrganisation,
                            });
                            org.schools = c.schools;

                            setSettings(settings);
                            editSchools(null);
                        }
                    }}
                />
            )}
        </>
    );
};

export default OrganisationSettings;
