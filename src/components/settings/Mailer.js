import React, { useState } from "react";
import _, { noop, uniqueId } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/pro-light-svg-icons";
import { useMatpadContext } from "../context/applicationContext";
import { Upload as KendoUpload } from "@progress/kendo-react-upload";
import { showAlert } from "../controls/Alert";
import FormInput from "../forms/FormInput";
import { DropDownSelect } from "../controls/DropDownSelect";
import { TextArea } from "@progress/kendo-react-inputs";
import Button from "../controls/Button";
import DialogOverlay from "../controls/Dialog";
import { LoadingSpinner } from "../controls/LoadingSpinner";
import useFetchWithMsal from "../hooks/useFetchWithMsal";

const MailerSettings = () => {
    const { execute } = useFetchWithMsal();

    const { setLocation } = useMatpadContext();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState();
    const [displayName, setDisplayName] = useState();
    const [templateID, setTemplateID] = useState();
    const [emailsTo, setEmailsTo] = useState();
    const [emailPrimary, setEmailPrimary] = useState();
    const [subject, setSubject] = useState();
    const [emailSecondaryItems, setEmailSecondaryItems] = useState([
        {
            id: 1,
            name: "pixel-fusion.com",
        },
        {
            id: 2,
            name: "matpad.online",
        },
    ]);
    const [emailSecondary, setEmailSecondary] = useState({
        id: 1,
        name: "pixel-fusion.com",
    });

    React.useEffect(() => {
        setLocation(window.location.pathname);
    }, [setLocation]);

    function getFile(e) {
        debugger;
        setFiles(
            e?.newState
                ?.map((f) => f.getRawFile && f.getRawFile())
                .filter((f) => f)
        );
    }

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
    }

    const sendEmails = (e) => {
        setLoading(true);
        e.preventDefault();


        if ((emailsTo?.split(/\r?\n/)?.length || 0) === 0 && (files?.length || 0) === 0) {
            showAlert({
                body: <p>You need to provide email addresses eith by the file upload (CSV) or in <strong>To</strong> field (One email address per line</p>,
                buttons: [{
                    text: 'OK'
                }]
            });
            setLoading(false);

            return false;
        }

        debugger
        const emails = emailsTo?.split(/\r?\n/) || null;

        const data = new FormData();
        data.append("emailFrom", emailPrimary + "@" + emailSecondary?.name);
        data.append("displayName", displayName);
        if (emails) data.append("emailsTo", emails);
        data.append("templateID", templateID);
        data.append("subject", subject);
        if (files?.length > 0)
            data.append("file", files[files.length - 1]);

        execute("POST", "/api/email", data, false, "")
            .then(
                (e) => {
                    debugger
                    if (!e || e.error) {
                        showAlert({
                            body: <p>An error occurred sending messages<br />{e?.error || "Unknown Error"}</p>,
                            buttons: [{
                                text: 'OK'
                            }]
                        })
                    }
                    else if (e.feedback) {
                        showAlert({
                            body: <p dangerouslySetInnerHTML={{ __html: e.feedback }} />,
                            buttons: [{
                                text: 'OK'
                            }]
                        })
                    }

                    setLoading(false);
                }
            )
            .catch((e) => {
                debugger
                showAlert({
                    body: <p>An error occurred sending messages</p>,
                    buttons: [{
                        text: 'OK'
                    }]
                })

                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col h-full gap-y-4">
            <form
                className="w-full"
                onSubmit={sendEmails}
                id="mailer-form"
            >
                <div className="w-full h-full bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-slate-900 text-xl font-semibold mb-2">
                        Mailer
                    </div>
                    <div className="mb-2 w-4/6 flex flex-col gap-y-2">
                        <div>
                            <div className="text-slate-900 text-md font-semibold">
                                File:
                            </div>
                            <KendoUpload
                                key={"mailer upload"}
                                accept={".csv"}
                                autoUpload={false}
                                batch={false}
                                multiple={false}
                                defaultFiles={[]}
                                restrictions={{
                                    allowedExtensions: [".csv"],
                                    maxFileSize: 1024 * 1024 * 50,
                                }}
                                showActionButtons={false}
                                showFileList={false}
                                onStatusChange={updateFileProgress}
                                onAdd={(file) => getFile(file)}
                            />
                            <div className="w-full mt-2 flex flex-wrap gap-x-2">
                                {files?.map((file) => {
                                    return (
                                        <div
                                            className="p-1"
                                            key={uniqueId(file.ID)}
                                        >
                                            <FontAwesomeIcon icon={faFileCsv} />
                                            {file.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-slate-900 text-md font-semibold">
                                From:
                                <div className="w-full flex gap-x-4">
                                    <div className="w-6/12 flex flex-col text-slate-900 text-md font-medium">
                                        <div>Email address:</div>
                                        <div className="w-full flex items-center">
                                            <div className="w-full">
                                                <FormInput
                                                    required={true}
                                                    onChange={(e) =>
                                                        setEmailPrimary(
                                                            e.target.value
                                                        )
                                                    }
                                                    key={"emailPrimary"}
                                                    id={"emailPrimary"}
                                                    name={"emailPrimary"}
                                                />
                                            </div>
                                            <div className="text-slate-900 text-2xl font-medium p-1 flex items-center justify-center h-full">
                                                @
                                            </div>
                                            <div className="w-full">
                                                <DropDownSelect
                                                    autoCapitalise={false}
                                                    key={"emailSecondary"}
                                                    id={"emailSecondary"}
                                                    items={emailSecondaryItems}
                                                    textField={"name"}
                                                    valueField={"id"}
                                                    placeholder={"Select"}
                                                    value={emailSecondary}
                                                    onChange={(e) =>
                                                        setEmailSecondary(
                                                            e.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-3/12 flex flex-col text-slate-900 text-md font-medium">
                                        <div>Display name:</div>
                                        <div className="w-full">
                                            <FormInput
                                                required={true}
                                                onChange={(e) =>
                                                    setDisplayName(
                                                        e.target.value
                                                    )
                                                }
                                                key={"displayName"}
                                                id={"displayName"}
                                                name={"displayName"}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-3/12 flex flex-col text-slate-900 text-md font-medium">
                                        <div>Template ID:</div>
                                        <div className="w-full">
                                            <FormInput
                                                required={true}
                                                onChange={(e) =>
                                                    setTemplateID(
                                                        e.target.value
                                                    )
                                                }
                                                key={"templateID"}
                                                id={"templateID"}
                                                name={"templateID"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-900 text-md font-semibold">
                                Subject:
                            </div>
                            <FormInput
                                required={true}
                                onChange={(e) => setSubject(e.target.value)}
                                key={"templateID"}
                                id={"subject"}
                                name={"subject"}
                            />
                        </div>
                        <div>
                            <div className="text-slate-900 text-md font-semibold">
                                To:
                            </div>
                            <TextArea
                                required={false}
                                onChange={(e) => setEmailsTo(e.target.value)}
                                key={"emailsTo"}
                                id={"emailsTo"}
                                name={"emailsTo"}
                                autoSize={true}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Button
                            type="submit"
                            key={"send-emails-btn"}
                            onClick={() => { }}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
            {loading && (
                <DialogOverlay
                    open={true}
                    setOpen={() => { }}
                    key="loading"
                    onClose={noop}
                >
                    <div className="flex items-center justify-center gap-x-2">
                        <LoadingSpinner />
                        Uploading file
                    </div>
                </DialogOverlay>
            )}
        </div>
    );
};

export default MailerSettings;
