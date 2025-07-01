import React from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { hidePleaseWait, showAlert, showPleaseWait } from "../controls/Alert";
import Form from "./Elements/Form";
import SchoolList from "../controls/SchoolList";
import TermList from "../controls/TermList";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { Dialog } from "@progress/kendo-react-dialogs";
import {
    Form as KendoForm,
    Field,
    FormElement,
    FieldWrapper,
} from "@progress/kendo-react-form";
import { RadioGroup, TextArea } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import { useMatpadContext } from "../context/applicationContext";
import { DropDownSelect } from "../controls/DropDownSelect";
import Button from "../controls/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/pro-light-svg-icons";
import { hasPermission } from "../../site";

const FormWrapper = (props) => {
    const {
        forms,
        selectedForm,
        schools,
        selectForm,
        selectedTerm,
        selectedUrn,
    } = props;
    const { execute } = useFetchWithMsal();
    const [loadedForm, setLoadedForm] = React.useState(null);
    const [archiving, setArchiving] = React.useState(false);
    const { userDetail } = useMatpadContext();

    const ArchiveReason = (fieldRenderProps) => {
        const { validationMessage, label, isAdmin, ...others } =
            fieldRenderProps;

        const reasons = [
            {
                label: "Archive Only",
                value: "archive",
            },
        ];

        if (isAdmin === true)
            reasons.push({
                label: "Archive & Blank",
                value: "archiveblank",
            });

        return (
            <FieldWrapper>
                <div className="k-form-field-wrap">
                    <label htmlFor={"arch-reason"} className={"k-form-label"}>
                        Archive option
                    </label>
                    <RadioGroup
                        {...others}
                        layout={"horizontal"}
                        data={reasons}
                    />
                    {/*<span*/}
                    {/*    className={"k-form-label"}>*/}
                    {/*    {*/}
                    {/*        value === "archive" ? "Create an archive for the document, but do not reset the answers" :*/}
                    {/*            (value === "archiveblank" ? "Create an archive for the document and reset the answers" : "Reset all answers but do not create an archive")*/}
                    {/*    }*/}
                    {/*</span>*/}
                    {validationMessage && <Error>{validationMessage}</Error>}
                </div>
            </FieldWrapper>
        );
    };
    const ArchiveComment = (fieldRenderProps) => {
        const { validationMessage, label, ...others } = fieldRenderProps;

        return (
            <FieldWrapper>
                <div className="k-form-field-wrap">
                    <label htmlFor={"arch-comment"} className={"k-form-label"}>
                        Comments
                    </label>
                    <TextArea {...others} autoSize autoFocus autosize />
                </div>
            </FieldWrapper>
        );
    };

    React.useEffect(() => {
        if (
            loadedForm?.loading ||
            !selectedForm ||
            !forms ||
            forms.length === 0
        )
            return;

        const form = _.find(forms, { id: selectedForm });

        if (!form) return;
        if (form.perSchool && (!schools || !(selectedUrn?.urn > 0))) return;
        if (form.formVersions && !selectedTerm?.id) return;
        //) {
        //    return;
        //}

        const url =
            "/api/form/" +
            (selectedTerm?.id || "---") +
            "/" +
            (selectedUrn?.urn > 0 ? selectedUrn.urn : 0) +
            "/form";

        if (!loadedForm?.loaded || loadedForm.url !== url) {
            console.log("SENDING REQUEST TO " + url);

            setLoadedForm({ loading: true });

            execute("GET", url)
                .then((response, a, b) => {
                    if (response) {
                        setLoadedForm({
                            loaded: true,
                            url: url,
                            detail: response,
                        });
                    }
                })
                .catch((e) => {
                    debugger;
                    showAlert({ body: <p>Unable to load form details!</p> });
                });
        }
    }, [
        execute,
        selectedForm,
        selectedUrn,
        selectedTerm,
        forms,
        loadedForm,
        schools,
    ]);

    if (!selectForm) return <>Select a form</>;

    if (forms.length === 0) {
        return (
            <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                    <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                        <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                            <FontAwesomeIcon
                                icon={faClipboardList}
                                className="w-8 h-8 text-slate-600"
                            />
                        </div>
                        <p className="text-slate-600 font-bold text-sm text-center">
                            There are no open forms available!
                        </p>
                        <p className="text-slate-600 font-bold text-sm text-center">
                            If you expect to see an open form check with an
                            administrator
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const formInfo = _.find(forms, { id: selectedForm });
    if (!formInfo)
        return (
            <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                    <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                        <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                            <FontAwesomeIcon
                                icon={faClipboardList}
                                className="w-8 h-8 text-slate-600"
                            />
                        </div>
                        <div className="text-slate-600 font-medium text-sm">
                            Please select form parameters
                        </div>
                    </div>
                </div>
            </div>
        );

    const archiveClicked = () => setArchiving(true);
    const saveArchive = (data, event) => {
        const postArchive = (data) => {
            const url =
                "/api/form/" +
                selectedForm +
                "/" +
                (selectedUrn?.urn > 0 ? selectedUrn.urn : 0) +
                "/archive";
            execute("POST", url, data)
                .then((response) => {
                    hidePleaseWait();

                    if (!response || response.error) {
                        showAlert({
                            body: (
                                <p>
                                    {response
                                        ? response.error
                                        : "Unable to archive details"}
                                </p>
                            ),
                        });
                        return;
                    }

                    setLoadedForm(null);
                    setArchiving(false);
                })
                .catch((e) => {
                    debugger;
                    console.log("ERROR", e);
                    showAlert({ body: <p>Unable to archive details</p> });
                });

            showPleaseWait("Generating archive...");
        };

        if (data?.reason === "archive") {
            postArchive(data);
            return;
        }

        if (!data || userDetail.isAdmin !== true) {
            event.preventDefault();
            showAlert({
                body: <p>Invalid request - unable to archive data</p>,
            });
            return false;
        }

        event.preventDefault();

        if (!data.comment)
            showAlert({
                body: (
                    <>
                        <p>This will clear the current form!</p>
                        <p>Please provide a comment before proceeding.</p>
                    </>
                ),
            });
        else
            showAlert({
                body: (
                    <>
                        <p>This will clear the current form!</p>
                        <p>Are you sure you want to proceed?</p>
                    </>
                ),
                buttons: [
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        class: "primary",
                        click: () => {
                            setTimeout(() => postArchive(data), 100);
                        },
                    },
                ],
            });

        return false;
    };

    return (
        <>
            <div className="stick-top">
                {loadedForm?.loaded === true && archiving && (
                    <Dialog
                        key={"archive"}
                        onClose={() => setArchiving(false)}
                        title={"Archive form"}
                        initialValues={{
                            reason: null,
                            comment: null,
                        }}
                    >
                        <KendoForm
                            onSubmit={saveArchive}
                            ignoreModified={true}
                            initialValues={{
                                comment: null,
                                reason: "archive",
                            }}
                            render={(formRenderProps) => (
                                <FormElement style={{ width: 400 }}>
                                    <fieldset className={"k-form-fieldset"}>
                                        <Field
                                            label={"Archive option"}
                                            component={ArchiveReason}
                                            id={"reason"}
                                            name={"reason"}
                                            isAdmin={
                                                userDetail.isAdmin === true
                                            }
                                        />
                                        <Field
                                            optional={true}
                                            id={"comment"}
                                            name={"comment"}
                                            label={"Comment"}
                                            component={ArchiveComment}
                                        />

                                        <div
                                            className="k-actions k-actions-horizontal k-window-actions k-dialog-actions k-actions-end"
                                            style={{ border: "none" }}
                                        >
                                            <Button
                                                type={"submit"}
                                                disabled={
                                                    !formRenderProps.allowSubmit
                                                }
                                            >
                                                Archive
                                            </Button>
                                        </div>
                                    </fieldset>
                                </FormElement>
                            )}
                        />
                    </Dialog>
                )}
            </div>
            {loadedForm?.loaded === true ? (
                <Form
                    key={"form-" + (selectedUrn?.urn || "---") + selectedForm}
                    school={selectedUrn}
                    formID={selectedTerm?.id}
                    detail={loadedForm.detail}
                    execute={execute}
                />
            ) : (
                <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                        {loadedForm?.loading ? (
                            <div className="w-80 h-44 flex flex-col items-center justify-center">
                                <LoadingSpinner />
                                <div className="text-slate-600 font-medium text-sm">
                                    Loading form
                                </div>
                            </div>
                        ) : (
                            <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                                <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                                    <FontAwesomeIcon
                                        icon={faClipboardList}
                                        className="w-8 h-8 text-slate-600"
                                    />
                                </div>
                                <div className="text-slate-600 font-medium text-sm">
                                    Please select form parameters
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const FormDashboard = (props) => {
    const { execute } = useFetchWithMsal();
    const { setLocation, userDetail } = useMatpadContext();
    const [canView, setCanView] = React.useState();

    const [selectedForm, setSelectForm] = React.useState(null);
    const [forms, setForms] = React.useState();
    const [schools, setSchools] = React.useState();

    const [selectedUrn, setSelectUrn] = React.useState(null);
    const [selectedTerm, setSelectedTerm] = React.useState(null);

    /**
     * Get the page setup information on initial load
     */
    React.useEffect(() => {
        const permission =
            hasPermission(userDetail, "viewqa")?.available === true;
        if (canView !== permission) {
            setCanView(permission);
            if (!permission) return;
        }

        if (!forms && !schools) {
            setLocation(window.location.pathname);

            execute("GET", "/api/form/formlist").then((response) => {
                if (!response) return;
                setForms(response?.forms || []);
            });

            setTimeout(() => {
                execute("GET", "/api/form/schoollist").then((response) =>
                    setSchools(response)
                );
            });
        }
    }, [execute, forms, schools, setLocation, userDetail]);

    if (!canView) {
        return (
            <div className="h-full w-full">
                <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                    <div className="w-80 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                        <div className="border border-slate-200 w-12 h-12 flex items-center justify-center rounded-lg mb-3">
                            <FontAwesomeIcon
                                icon={faClipboardList}
                                className="w-8 h-8 text-slate-600"
                            />
                        </div>
                        <div className="text-slate-600 font-medium text-sm">
                            You don't have permission to work on forms
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form selected
    const selectForm = (f) => {
        setSelectForm(f.id);
        setSelectUrn("***Refresh***");
        setSelectedTerm("***Refresh***");
    };
    const urnSelected = (e) => {
        setSelectUrn(e.value);
        setSelectedTerm("***Refresh***");
    };
    const termSelected = (e) => setSelectedTerm(e.value);

    const formInfo = _.find(forms, { id: selectedForm });

    // Page Loading
    if (typeof forms === "undefined" || forms === null)
        return <LoadingSpinner />;

    //// No Forms configured
    //if (!_.isArray(forms) || forms.length === 0)
    //    return <h5 className="text-center text-primary">No dashboard configured</h5>

    return (
        <div
            className="flex flex-col h-full xl:grid xl:grid-cols-formPage"
            key={"pageOuter"}
        >
            <section
                className="h-fit bg-white border border-slate-200 rounded-lg mb-2 max-w-full w-full xl:w-80"
                key="pageLeftPanel"
            >
                <div className="p-4">
                    <h3 className="font-medium text-2xl mb-3">Forms</h3>
                    <ul className="flex flex-wrap justify-start overflow-y-auto h-full xl:flex-col">
                        {forms && forms.length === 0 && (
                            <div className="flex my-2 items-center mr-2 xl:mx-0">
                                <p className="text-slate-600 font-bold text-sm text-center">
                                    There are no open forms available!
                                </p>
                            </div>
                        )}
                        {forms && forms.length > 0 && (
                            <div className="flex my-2 items-center mr-2 xl:mx-0">
                                <DropDownSelect
                                    key={"dashboardSelect"}
                                    onChange={(f) => selectForm(f.value)}
                                    items={forms}
                                    textField={"name"}
                                    valueField={"id"}
                                    value={selectedForm}
                                    placeholder={"Select Dashboard"}
                                    maxWidth={"200px"}
                                />
                            </div>
                        )}
                        {formInfo && (
                            <>
                                <div className="flex my-2 mr-2 items-center xl:mx-0">
                                    {_.isArray(schools) &&
                                        formInfo.perSchool && (
                                            <SchoolList
                                                key={"schools"}
                                                schools={
                                                    formInfo.formVersions
                                                        ? schools.filter(
                                                              (school) =>
                                                                  formInfo.formVersions
                                                                      .map(
                                                                          (
                                                                              value
                                                                          ) =>
                                                                              value.urn
                                                                      )
                                                                      .includes(
                                                                          school.urn
                                                                      )
                                                          )
                                                        : schools
                                                }
                                                selectedUrn={selectedUrn}
                                                setSelectedUrn={urnSelected}
                                            />
                                        )}
                                </div>
                                <div className="flex my-2 mr-2 items-center xl:mx-0">
                                    {formInfo.formVersions &&
                                        (formInfo.perSchool !== true ||
                                            (formInfo.perSchool === true &&
                                                selectedUrn?.urn > 0)) && (
                                            <TermList
                                                key={"term"}
                                                terms={formInfo.formVersions.filter(
                                                    (version) =>
                                                        formInfo.perSchool !==
                                                            true ||
                                                        (formInfo.perSchool ===
                                                            true &&
                                                            version.urn ===
                                                                selectedUrn.urn)
                                                )}
                                                selectedTerm={selectedTerm}
                                                setSelectedTerm={termSelected}
                                            />
                                        )}
                                </div>
                            </>
                        )}
                    </ul>
                </div>
            </section>
            <section
                className="h-full overflow-y-auto panel2 xl:ml-3"
                key={"pageCenterPanel"}
            >
                <FormWrapper
                    key={"selectedForm-" + selectedForm}
                    schools={schools}
                    selectForm={selectForm}
                    selectedForm={selectedForm}
                    forms={forms}
                    selectedTerm={selectedTerm}
                    selectedUrn={selectedUrn}
                />
            </section>
        </div>
    );
};

export default FormDashboard;
