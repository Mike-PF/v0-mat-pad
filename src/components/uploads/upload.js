import React from "react";
import _ from "lodash";
import useFetchWithMsal from "../hooks/useFetchWithMsal";
import { Upload as KendoUpload } from "@progress/kendo-react-upload";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import { DropDownSelect } from "../controls/DropDownSelect";
import { hidePleaseWait, showAlert, showPleaseWait } from "../controls/Alert";
import { Switch } from "@progress/kendo-react-inputs";
import { useMatpadContext } from "../context/applicationContext";

const ShowPrompts = ({ prompts, IdPrefix, onChange }) => {
    return (
        <section
            className=""
            key={IdPrefix + "prompts"}
        >
            <hr
                className="my-4 mr-4"
                key={"hr1"}
            />
            <div
                key={IdPrefix + "container"}
                className="flex gap-5"
            >
                {prompts.map((p, idx) => {
                    if (p.type === "select") {
                        let data = [];

                        // debugger;

                        if (p.options?.startsWith("years")) {
                            let years = parseInt(p.options.substring(5));
                            if (isNaN(years)) years = -4;

                            if (new Date().getMonth() < 8) years++;

                            for (var y = 0; y >= years; y--) {
                                const yr =
                                    new Date().getFullYear() +
                                    y +
                                    (new Date().getMonth() < 8 ? 0 : 1);
                                data.push({
                                    value: yr,
                                    text: yr - 1 + "/" + (yr % 100),
                                });
                            }
                        } else if (typeof p.options === "string")
                            data = JSON.parse(p.options);
                        else data = p.options;

                        data[0].selected = true;
                        onChange(p.id, data[0].value);

                        return (
                            <div key={IdPrefix + "qrap" + idx}>
                                {p.label && (
                                    <label key={IdPrefix + "lbl" + idx}>
                                        {p.label}
                                    </label>
                                )}
                                <div
                                    className={"question"}
                                    key={IdPrefix + "prompt-wrap" + idx}
                                >
                                    <DropDownSelect
                                        items={data}
                                        textField={"text"}
                                        valueField={"value"}
                                        placeholder={"Select"}
                                        onChange={(e) =>
                                            onChange(p.id, e?.value?.value)
                                        }
                                        key={IdPrefix + "prompt" + idx}
                                    />
                                </div>
                            </div>
                        );
                    }

                    if (p.type === "switch") {
                        const options = (p.options || "Yes|No").split("|");
                        onChange(p.id, true);

                        return (
                            <div key={IdPrefix + "prompt" + idx}>
                                {p.label && (
                                    <label key={IdPrefix + "lbl" + idx}>
                                        {p.label}
                                    </label>
                                )}
                                <div
                                    className={"question"}
                                    key={IdPrefix + "prompt-wrap" + idx}
                                >
                                    <Switch
                                        key={IdPrefix + "switch" + idx}
                                        defaultChecked={true}
                                        className={"question"}
                                        onChange={(e) =>
                                            onChange(p.id, e?.value === true)
                                        }
                                        onLabel={options[0]}
                                        offLabel={options[1]}
                                    />
                                </div>
                            </div>
                        );
                    }

                    return <>Unknown Prompt</>;
                })}
            </div>
            <hr
                key={"hr2"}
                className="my-4 mr-4"
            />
        </section>
    );
};

const Upload = (props) => {
    const { execute, getToken } = useFetchWithMsal();
    const { setLocation } = useMatpadContext();

    const [selectedUpload, setSelectedUpload] = React.useState(null);
    const [selectedUrn, setSelectedUrn] = React.useState(null);
    const [uploadedResponse, setUploadedResponse] = React.useState(null);
    const [configurationData, setConfigurationData] = React.useState({
        loading: true,
        data: null,
    });
    const [IdPrefix] = React.useState(_.uniqueId("ul-"));
    const promptData = React.useRef({});

    const uploadSelected = (e) => {
        setSelectedUpload(e.value);
        setSelectedUrn("***Refresh***");
        promptData.current = {};

        // if (e.value.prompts) {
        // 	promptData.current = {};
        // }
    };
    const urnSelected = (e) => setSelectedUrn(e.value);

    React.useEffect(() => {
        setLocation(window.location.pathname);
        execute("GET", "/api/upload").then((data) => {
            if (data) {
                setConfigurationData({
                    ...data,
                    loading: false,
                });
            }
        });
        return () => { };
    }, [execute, setLocation]);

    const promptChange = React.useCallback(
        (id, e) => {
            promptData.current["prompt_" + id] = e;
        },
        [promptData]
    );

    /**
     * File progress has changed - check the new status
     * @param {any} e
     * @returns
     */
    function updateFileProgress(e) {
        const file = e.affectedFiles[0];

        if (file.status === 0) {
            // debugger;
            showAlert({ body: <p>Unable to upload file</p> });
            return;
        }
        if (file.status !== 4) {
            console.log(`File Status: ${file.status}`, e);
            return;
        }

        console.log("HERE", file);

        if (
            !e.response ||
            !e.response.response ||
            !e.response.response.fileRef ||
            !e.response.response
        ) {
            showAlert({ body: <p>Unable to process file!</p> });
        }

        const data = e.response.response;

        if (data.uploaded && data.rows >= 0) {
            showAlert({
                body: (
                    <>
                        <p>
                            Your file has been uploaded and seems to contain{" "}
                            {data.rows} rows of data
                        </p>
                        <p>Are you sure you want to import the data?</p>
                    </>
                ),
                buttons: [
                    {
                        text: "Import",
                        click: (e) => {
                            execute("POST", "/api/upload/templateconfirm", data)
                                .then((response) => {
                                    hidePleaseWait();
                                    if (!response) {
                                        showAlert({
                                            body: <p>Unable to save details</p>,
                                        });
                                    } else if (response.error) {
                                        showAlert({
                                            body: (
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: response.error,
                                                    }}
                                                />
                                            ),
                                        });
                                    } else if (response.feedback) {
                                        showAlert({
                                            body: (
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: response.feedback,
                                                    }}
                                                />
                                            ),
                                        });
                                    }
                                })
                                .catch((e) => {
                                    debugger;
                                    console.log("ERROR", e);
                                    showAlert({
                                        body: <p>Unable to save details</p>,
                                    });
                                });

                            setTimeout(() => showPleaseWait());
                        },
                    },
                    { text: "Cancel" },
                ],
            });
        } else if (data.error)
            showAlert({
                body: <p dangerouslySetInnerHTML={{ __html: data.error }} />,
            });
    }

    /**
     * Add auth header token for upload
     * @param {any} e
     */
    function onBeforeUpload(e) {
        if (promptData && promptData.current) {
            e.headers = { ...promptData.current };
        }

        e.headers.Authorization = getToken();
        e.headers.templateid = selectedUpload.id;
        e.headers.urn = selectedUrn?.urn;
        showPleaseWait();
    }

    if (
        typeof configurationData === "undefined" ||
        typeof configurationData.uploads === "undefined"
    )
        return <LoadingSpinner idPrefix={IdPrefix} />;

    // No Forms configured
    if (
        !_.isArray(configurationData?.uploads) ||
        configurationData.uploads.length === 0
    )
        return (
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4 mb-2">
                <h5 className="text-center text-primary">
                    No uploads configured
                </h5>
            </div>
        );

    return (
        <>
            <div className="w-full bg-white border border-slate-200 rounded-lg p-4 mb-2">
                <div className="flex items-center">
                    <div
                        key={IdPrefix + "temps"}
                        className="mw300 mr-4"
                    >
                        <label
                            htmlFor={IdPrefix + "uploads"}
                            className="font-medium text-slate-900 mb-1"
                        >
                            Upload type
                        </label>
                        <DropDownSelect
                            key={IdPrefix + "uploads"}
                            name={IdPrefix + "uploads"}
                            onChange={uploadSelected}
                            value={selectedUpload}
                            items={configurationData.uploads}
                            textField={"name"}
                            valueField={"id"}
                            placeholder={"Select Upload"}
                        />
                    </div>
                    {selectedUpload && selectedUpload.perUrn === true && (
                        <div
                            key={IdPrefix + "schools"}
                            className="mw300"
                        >
                            <label
                                htmlFor={IdPrefix + "uploads"}
                                className="mb-1"
                            >
                                School
                            </label>
                            <DropDownSelect
                                key={IdPrefix + "sl"}
                                onChange={urnSelected}
                                items={_.orderBy(
                                    configurationData.schools,
                                    "name"
                                )}
                                textField={"name"}
                                valueField={"urn"}
                                value={selectedUrn}
                                placeholder={"Select School"}
                            />
                        </div>
                    )}
                </div>
            </div>
            {(selectedUpload &&
                (!selectedUpload?.perUrn ||
                    (selectedUpload.perUrn === true &&
                        selectedUrn?.urn > 0))) ||
                (_.isArray(selectedUpload?.prompts) &&
                    selectedUpload.prompts.length > 0) ||
                (selectedUpload &&
                    ("" + selectedUpload?.description).trim().length > 0) ? (
                <section
                    key={IdPrefix + "area"}
                    className={"uploadControls container m-0 p-3"}
                >
                    {_.isArray(selectedUpload?.prompts) &&
                        selectedUpload.prompts.length > 0 && (
                            <ShowPrompts
                                IdPrefix={IdPrefix}
                                prompts={selectedUpload.prompts}
                                onChange={promptChange}
                            />
                        )}
                    {selectedUpload &&
                        (!selectedUpload?.perUrn ||
                            (selectedUpload.perUrn === true &&
                                selectedUrn?.urn > 0)) && (
                            <KendoUpload
                                key={IdPrefix + "upload"}
                                accept={".xlsx,.csv,.txt,.xml"}
                                autoUpload={true}
                                batch={false}
                                multiple={false}
                                defaultFiles={[]}
                                withCredentials={true}
                                saveUrl={"/api/upload/templateupload"}
                                restrictions={{
                                    allowedExtensions: [
                                        ".csv",
                                        ".xlsx",
                                        ".xls",
                                        ".txt",
                                        ".xml"
                                    ],
                                    maxFileSize: 1024 * 1024 * 50,
                                }}
                                showActionButtons={false}
                                showFileList={false}
                                onStatusChange={updateFileProgress}
                                onBeforeUpload={onBeforeUpload}
                            />
                        )}
                    {selectedUpload &&
                        ("" + selectedUpload?.description).trim().length >
                        0 && (
                            <div
                                className={"description"}
                                key={IdPrefix + "desc"}
                                dangerouslySetInnerHTML={{
                                    __html: selectedUpload.description,
                                }}
                            />
                        )}
                </section>
            ) : null}
        </>
    );
};

{
    /* <div className="content">
   {selectedUpload && selectedUpload.id &&
       <DashboardContent
           key={IdPrefix + "dashboard-content-" + selectedUpload.id}
           dashboard={selectedUpload}
           schools={schools}
       />}
</div> */
}

export default Upload;
