import React from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { hidePleaseWait, showAlert, showPleaseWait } from "../controls/Alert";
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
import SelectInput from "../controls/Forms/SelectInput";
import { hasPermission } from "../../site";

const ListInput = (fieldRenderProps) => {
    const {
        validationMessage,
        visited,
        IdPrefix,
        data,
        text,
        label,
        onChange,
        ...others
    } = fieldRenderProps;

    return (
        <div className="k-form-field-wrap">
            <label htmlFor={IdPrefix + "lbl"} className={"k-form-label"}>
                {label}
            </label>
            <DropDownSelect
                placeholder={"Select Form..."}
                {...others}
                onChange={onChange || function () { }}
                items={data}
                textField={text || "name"}
                valueField={"id"}
            />
        </div>
    );
};

const FormStart = (props) => {
    const { data, idPrefix, onClose, execute } = props;
    const [selectedSchool, setSelectedSchool] = React.useState(null);
    const [tasks, setTasks] = React.useState(null);
    const [selectedPeriod, setSelectedPeriod] = React.useState(null);
    const [selectedForm, setSelectedForm] = React.useState(null);

    let periods = [];

    const onSubmit = (e) => {
        if (!e || !e.task) {
            showAlert({ body: <p>Select a Form to open!</p> });
            return;
        }
        const form = e.task;

        if (
            ((_.isArray(form.periods) && form.periods.length > 0) ||
                (_.isArray(form.periods?.terms) &&
                    form.periods.terms.length > 0)) &&
            !e.period
        ) {
            showAlert({ body: <p>Select a Period for the form</p> });
            return;
        }

        const data = {
            task: e.task.id,
            schools: e.schools?.map((s) => s.urn) || null,
            period: e.period?.id,
            tasks: e.tasks?.map((t) => t.id) || null,
        };

        execute("POST", "/api/form/open", data)
            .then((response) => {
                if (!response || response.error) {
                    showAlert({
                        body: (
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: response
                                        ? response.error
                                        : "Unable to open form",
                                }}
                            />
                        ),
                    });
                    return;
                }
                hidePleaseWait();
                onClose(true);
            })
            .catch((e) => {
                debugger;
                console.log("ERROR", e);
                showAlert({ body: <p>Unable to open form!</p> });
            });

        showPleaseWait();
    };

    if (_.isArray(selectedForm?.periods) && selectedForm.periods.length > 0) {
        periods = selectedForm.periods.map((p) => {
            return { name: p, id: p };
        });
    } else if (
        _.isArray(selectedForm?.periods?.terms) &&
        selectedForm.periods.terms.length > 0 &&
        (_.isInteger(selectedForm?.periods?.acyear?.back) ||
            _.isInteger(selectedForm?.periods?.acyear))
    ) {
        let year =
            new Date().getFullYear() -
            Math.abs(
                _.isInteger(selectedForm?.periods?.acyear?.back)
                    ? selectedForm.periods.acyear.back
                    : selectedForm.periods.acyear
            ),
            maxYear =
                year +
                Math.abs(
                    _.isInteger(selectedForm?.periods?.acyear?.back)
                        ? selectedForm.periods.acyear.back
                        : selectedForm.periods.acyear
                ) +
                (_.isInteger(selectedForm?.periods?.acyear?.forward)
                    ? selectedForm.periods.acyear.forward
                    : 0);

        while (maxYear >= year) {
            _.forEachRight(selectedForm.periods.terms, function (p) {
                const period = p + " " + maxYear + "/" + ((1 + maxYear) % 100);
                periods.push({ name: period, id: period });
            });
            maxYear--;
        }
    }

    return (
        <Dialog
            id={idPrefix + "-start"}
            onClose={onClose}
            title={"Open Form..."}
            className={"auto-width"}
        >
            <KendoForm
                onSubmit={onSubmit}
                initialValues={{
                    task: null,
                    schools: null,
                    period: null,
                    tasks: null,
                }}
                render={(formRenderProps) => (
                    <FormElement
                        style={{
                            width: 400,
                        }}
                    >
                        <fieldset className={"k-form-fieldset"}>
                            <FieldWrapper>
                                <div className="k-form-field-wrap">
                                    <Field
                                        required
                                        name={"task"}
                                        component={ListInput}
                                        data={data}
                                        text={"prompt"}
                                        labelClassName={"k-form-label"}
                                        label={"Form"}
                                        onChange={(e) =>
                                            setSelectedForm(e.value)
                                        }
                                    />
                                </div>
                            </FieldWrapper>
                            {selectedForm &&
                                selectedForm.schools?.length > 0 && (
                                    <FieldWrapper>
                                        <div className="k-form-field-wrap">
                                            <Field
                                                name={"schools"}
                                                component={ListInput}
                                                data={_.orderBy(
                                                    selectedForm.schools,
                                                    ["name"]
                                                )}
                                                text={"name"}
                                                labelClassName={"k-form-label"}
                                                label={"Schools"}
                                                placeholder={"All Schools"}
                                                onChange={(e) =>
                                                    setSelectedSchool(e.value)
                                                }
                                                multiSelect
                                            />
                                        </div>
                                    </FieldWrapper>
                                )}
                            {_.isArray(periods) && periods.length > 0 && (
                                <FieldWrapper>
                                    <div className="k-form-field-wrap">
                                        <Field
                                            required
                                            name={"period"}
                                            component={ListInput}
                                            data={periods}
                                            text={"name"}
                                            labelClassName={"k-form-label"}
                                            label={"Period"}
                                            placeholder={"Select Period"}
                                            onChange={(e) =>
                                                setSelectedPeriod(e.value)
                                            }
                                        />
                                    </div>
                                </FieldWrapper>
                            )}
                            {1 === 0 &&
                                selectedForm &&
                                selectedForm.tasks?.length > 0 && (
                                    <FieldWrapper>
                                        <div className="k-form-field-wrap">
                                            <Field
                                                name={"tasks"}
                                                component={ListInput}
                                                data={selectedForm.tasks}
                                                text={"name"}
                                                labelClassName={"k-form-label"}
                                                label={"Tasks"}
                                                placeholder={"All Tasks"}
                                                onChange={(e) =>
                                                    setTasks(e.value)
                                                }
                                                multiSelect
                                            />
                                        </div>
                                    </FieldWrapper>
                                )}
                        </fieldset>
                        {selectedForm && (
                            <div
                                className="k-form-buttons"
                                style={{ flexDirection: "row-reverse" }}
                            >
                                <Button disabled={!formRenderProps.allowSubmit}>
                                    Open Form
                                </Button>
                            </div>
                        )}
                    </FormElement>
                )}
            />
        </Dialog>
    );
};

const FormArchive = ({ setArchiving, execute, userDetail, forms, schools, ...props }) => {
    const ArchiveReason = (fieldRenderProps) => {
        const { validationMessage, label, isAdmin, ...others } =
            fieldRenderProps;
        const [value, setValue] = React.useState("archive");

        const reasons = [
            {
                label: "Archive Only",
                value: "archive",
            },
        ];

        if (isAdmin === true) {
            reasons.push({
                label: "Archive & Blank",
                value: "archiveblank",
            });

            reasons.push({
                label: "Archive & Close",
                value: "archiveclose",
            });
        }

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

    const ArchiveForm = (fieldRenderProps) => {
        const { validationMessage, label, forms, schools, ...others } = fieldRenderProps;

        if (!_.isArray(forms) || forms.length === 0) {
            setArchiving(false);
            showAlert({ body: <p>No open forms</p> });
            return;
        }

        const data = [];

        _.each(forms, (f) => {
            const report = {
                value: f.name,
                id: f.id,
                items: []
            };

            _.each(f.formVersions, (fv) => {
                console.log(fv, schools);
                const schoolName = fv.urn > 0 ? _.find(schools, { urn: fv.urn })?.name : null;
                report.items.push({
                    value: fv.periodName + (schoolName ? (" " + schoolName) : ""),
                    id: fv.id
                });
            });

            data.push(report);
        });

        return (
            <FieldWrapper>
                <div className="k-form-field-wrap">
                    <label htmlFor={"arch-comment"} className={"k-form-label"}>
                        Comments
                    </label>
                    <DropDownSelect
                        multiSelect={false}
                        placeholder={"Select Form"}
                        items={data}
                        {...others}
                    />
                </div>
            </FieldWrapper>
        );
    };

    const saveArchive = (data, event) => {
        const postArchive = (data) => {
            const url = `api/form/${data.form.id}/archive`
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

                    setArchiving(false)
                })
                .catch((e) => {
                    debugger;
                    console.log("ERROR", e);
                    showAlert({ body: <p>Unable to archive details</p> });
                });

            showPleaseWait("Generating archive...");
        };

        if (!data?.form) {
            event.preventDefault();
            showAlert({
                body: <p>Select a form to archive</p>,
            });
            return false;
        }

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
                        <p>{(data?.reason === "archiveblank") ? "This will clear the current form!" : "This will close the current form!"}</p>
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

    return <Dialog
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
                form: null
            }}
            render={(formRenderProps) => (
                <FormElement style={{ width: 400 }}>
                    <fieldset className={"k-form-fieldset"}>
                        <Field
                            label={"Form"}
                            component={ArchiveForm}
                            id={"form"}
                            name={"form"}
                            forms={forms}
                            schools={schools}
                            isAdmin={
                                userDetail.isAdmin === true
                            }
                        />
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
}

const Maintenance = (props) => {
    const { execute } = useFetchWithMsal();
    const { setLocation, userDetail } = useMatpadContext();
    const [forms, setForms] = React.useState();
    const [startOptions, setStartOptions] = React.useState();
    const [schools, setSchools] = React.useState();
    const [showformStart, setShowFormStart] = React.useState(false);
    const [showformArchive, setShowFormArchive] = React.useState(false);
    const [idPrefix] = React.useState(_.uniqueId("forms-"));


    /**
     * Get the page setup information on initial load
     */
    React.useEffect(() => {
        if (!forms && !schools) {
            setLocation(window.location.pathname);
            execute("GET", "/api/form/formlist").then((response) => {
                if (!response) return;
                setForms(response?.forms || []);
                setStartOptions(response?.start || []);
            });

            setTimeout(() => {
                execute("GET", "/api/form/schoollist").then((response) =>
                    setSchools(response)
                );
            });
        }
    }, [execute, forms, schools, setLocation, userDetail]);

    const startClicked = (e) => {
        setShowFormStart(!showformStart);
    };

    const archiveClicked = (e) => {
        setShowFormArchive(!showformArchive);
    }

    // Page Loading
    if (typeof forms === "undefined" || forms === null)
        return <LoadingSpinner />;

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
                    <h3 className="font-medium text-2xl mb-3">
                        Maintenance
                    </h3>
                    {
                        hasPermission(userDetail, "startqa")?.available === true && _.isArray(startOptions) && startOptions.length > 0 && (
                            <Button
                                className="block my-1"
                                type={"button"}
                                onClick={startClicked}
                            >
                                Create Form...
                            </Button>
                        )}
                    {
                        hasPermission(userDetail, "archiveform")?.available === true && _.isArray(forms) && forms.length > 0 && (
                            <Button
                                className="block my-1"
                                type={"button"}
                                onClick={archiveClicked}
                            >
                                Archive Form...
                            </Button>
                        )}
                </div>
            </section>
            {showformStart === true && (
                <FormStart
                    execute={execute}
                    data={startOptions}
                    idPrefix={idPrefix}
                    onClose={(reload) => {
                        //if (reload === true) {
                        //    setForms(null);
                        //    setSchools(null);
                        //}
                        setShowFormStart(false);
                    }}
                />
            )}
            {showformArchive === true &&
                <FormArchive
                    execute={execute}
                    userDetail={userDetail}
                    setArchiving={setShowFormArchive}
                    forms={forms}
                    schools={schools}
                />
            }
        </div>
    );
};

export default Maintenance;
