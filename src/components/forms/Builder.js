import React, { useEffect, useState } from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { showAlert } from "../controls/Alert";
import SchoolList from "../controls/SchoolList";
import TermList from "../controls/TermList";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { useMatpadContext } from "../context/applicationContext";
import { DropDownSelect } from "../controls/DropDownSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faPlus } from "@fortawesome/pro-light-svg-icons";
import { faGripDotsVertical } from "@fortawesome/pro-solid-svg-icons";
import { hasPermission } from "../../site";
import FormBuilderForm from "./Elements/FormBuilderForm";
import NewFormBuilder from "./Elements/NewFormBuilder";

const FormWrapper = (props) => {
    const { forms, selectedForm, schools, selectedTerm, selectedUrn } = props;
    const { execute } = useFetchWithMsal();
    const [loadedForm, setLoadedForm] = useState(null);

    useEffect(() => {
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

    return (
        <>
            {loadedForm?.loaded === true ? (
                <FormBuilderForm
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

const FormBuilder = (props) => {
    const { execute } = useFetchWithMsal();
    const { setLocation, userDetail } = useMatpadContext();
    const [canView, setCanView] = useState();

    const [selectedForm, setSelectForm] = useState(null);
    const [forms, setForms] = useState();
    const [schools, setSchools] = useState();

    const [selectedUrn, setSelectUrn] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);

    const [addingForm, setAddingForm] = useState(false);

    /**
     * Get the page setup information on initial load
     */
    useEffect(() => {
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
    }, [execute, forms, schools, setLocation, canView, setCanView, userDetail]);

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

    const addNewForm = () => {
        setAddingForm(true);
        setSelectForm("***Refresh***");
        setSelectUrn("***Refresh***");
        setSelectedTerm("***Refresh***");
    };
    const selectForm = (f) => {
        setAddingForm(false);
        setSelectForm(f.id);
        setSelectUrn("***Refresh***");
        setSelectedTerm("***Refresh***");
    };
    const urnSelected = (e) => {
        setAddingForm(false);
        setSelectUrn(e.value);
        setSelectedTerm("***Refresh***");
    };
    const termSelected = (e) => {
        setAddingForm(false);
        setSelectedTerm(e.value);
    };

    const formInfo = _.find(forms, { id: selectedForm });

    // Page Loading
    if (typeof forms === "undefined" || forms === null)
        return <LoadingSpinner />;

    return (
        <div className="h-full grid grid-cols-formPage" key={"pageOuter"}>
            <div className="h-full">
                <section
                    className="h-max bg-white border border-slate-200 rounded-lg max-w-full w-80 mb-3"
                    key="pageLeftPanel"
                >
                    <div className="p-4">
                        <h3 className="font-medium text-2xl mb-3">Forms</h3>
                        <ul className="flex flex-wrap justify-start overflow-y-auto h-full">
                            {forms && forms.length > 0 ? (
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
                                    >
                                        <div className="px-2 py-1">
                                            <button
                                                className="w-full rounded-m border-none bg-primary-500 text-white hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
                                                onClick={addNewForm}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="mr-2"
                                                />
                                                Add form
                                            </button>
                                        </div>
                                    </DropDownSelect>
                                </div>
                            ) : (
                                <button
                                    className="w-full rounded-m border-none bg-primary-500 text-white hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed"
                                    onClick={addNewForm}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2"
                                    />
                                    Add form
                                </button>
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
                                                    setSelectedTerm={
                                                        termSelected
                                                    }
                                                />
                                            )}
                                    </div>
                                </>
                            )}
                        </ul>
                    </div>
                </section>
                <section
                    className="h-max bg-white border border-slate-200 rounded-lg mb-2 max-w-full w-80"
                    key="pageLeftPanel2"
                >
                    <div className="p-4">
                        <h3 className="font-medium text-2xl mb-3">
                            Form builder
                        </h3>
                        <ul className="flex flex-wrap justify-start overflow-y-auto h-full flex-col gap-y-4">
                            <div
                                draggable={true}
                                // onDrop={() => console.log("whey")}
                                className="flex items-center w-full bg-white border border-slate-200 rounded-lg py-1 px-2 justify-between"
                            >
                                <div>Section</div>
                                <FontAwesomeIcon
                                    icon={faGripDotsVertical}
                                    className="mr-2"
                                />
                            </div>
                            <div
                                draggable={true}
                                className="flex items-center w-full bg-white border border-slate-200 rounded-lg py-1 px-2 justify-between"
                            >
                                <div>Question</div>
                                <FontAwesomeIcon
                                    icon={faGripDotsVertical}
                                    className="mr-2"
                                />
                            </div>
                        </ul>
                    </div>
                </section>
            </div>
            <section
                className="p-4 h-full overflow-y-auto panel2 ml-3 bg-white border border-slate-200 rounded-lg"
                key={"pageCenterPanel"}
            >
                {addingForm ? (
                    <NewFormBuilder />
                ) : (
                    <FormWrapper
                        key={"selectedForm-" + selectedForm}
                        schools={schools}
                        selectForm={selectForm}
                        selectedForm={selectedForm}
                        forms={forms}
                        selectedTerm={selectedTerm}
                        selectedUrn={selectedUrn}
                    />
                )}
            </section>
        </div>
    );
};

export default FormBuilder;
