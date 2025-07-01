import React, { memo, useEffect, useRef, useState } from 'react';
import { UncontrolledTooltip, Button } from 'reactstrap';
import { Upload as KendoUpload } from "@progress/kendo-react-upload";
import { ComboBox, DropDownList } from "@progress/kendo-react-dropdowns";
import { TextBox } from "@progress/kendo-react-inputs";
import { hidePleaseWait, showAlert, showPleaseWait } from '../controls/Alert';
import { getSiblings, isJson } from '../../site';
import _ from 'lodash';
import { useNavigate } from "react-router-dom";
import useFetchWithMsal from '../hooks/useFetchWithMsal';
import { LoadingSpinner } from '../controls/LoadingSpinner';
import { useMatpadContext } from '../context/applicationContext';

function Upload(props) {
    const navigate = useNavigate();
    const { execute, getToken } = useFetchWithMsal();
    const [idPrefix] = React.useState(_.uniqueId('dds-'));
    const { setLocation } = useMatpadContext();

    React.useEffect(() => setLocation(window.location.pathname), [setLocation]);

    const [pageData, setPageData] = useState({ loading: true, config: null });

    useEffect(() => {
        if (!pageData || pageData.loading) {
            execute("GET", '/api/upload/upload-configuration')
                .then((response) => {
                    if (response) {
                        setPageData({
                            ...pageData,
                            loading: false,
                            data: response
                        });
                    }
                });
        }
    }, [execute, pageData]);

    const [renderPage, setRenderPage] = useState(false);
    const templateName = useRef(null);
    const templateGlobal = useRef(false);
    const importConfiguration = useRef({
        category: null,
        filename: null,
        filereference: null,
        sampleData: null,
        templates: null,
        templateSelected: null,
        filter: 'All',
        mappingData: [],
        mappingComplete: false,
        importType: 'Both',
        importKey: null
    });

    let offset = -10;

    // Draw the spinner control until the initial configuration has loaded
    if (pageData.loading)
        return <LoadingSpinner />

    // the uploader control block
    const renderUploader = importConfiguration.current.filename
        ? <h2
            key={idPrefix + "ul"}
            className="click-me sticky-top"
            style={{ top: offset }}
            onClick={uploadFileClicked}>
            Filename: {importConfiguration.current.filename}
        </h2>
        : <>
            <h2 key="renderFilenameHeader">Upload file</h2>
            <KendoUpload
                key={idPrefix + "ul"}
                accept={".xlsx,.csv"}
                autoUpload={true}
                batch={false}
                multiple={false}
                defaultFiles={[]}
                withCredentials={true}
                saveUrl={"/api/upload/sample"}
                restrictions={{
                    allowedExtensions: [".csv", ".xlsx", ".xls"],
                    maxFileSize: 1024 * 1024 * 50
                }}
                showActionButtons={false}
                showFileList={false}
                onStatusChange={updateFileProgress}
                onBeforeUpload={onBeforeUpload}
            />
        </>;

    offset += 28;
    const renderTemplateList = !importConfiguration.current.templates || importConfiguration.current.templates.length === 0
        ? <></>
        : importConfiguration.current.templates.length > 0 && importConfiguration.current.templateSelected
            ? <h2
                key="renderTemplateHeader"
                className="click-me sticky-top"
                style={{ top: offset }}
                onClick={templateclicked}>
                Template: {importConfiguration.current.templateSelected.name}
            </h2>
            : <>
                <h2 key="renderTemplateHeader">Template</h2>
                <DropDownList key="templateList"
                    style={{ maxWidth: 300 }}
                    defaultItem="Select Template ..."
                    textField="name"
                    dataItemKey="ref"
                    data={
                        [
                            { name: "No Template", ref: "-" },
                            ..._.sortBy(importConfiguration.current.templates, (i) => i.name.toLowerCase())
                        ]
                    }
                    onChange={(e) => {
                        importConfiguration.current = {
                            ...importConfiguration.current,
                            templateSelected: e.value,
                            mappingComplete: e.value.ref !== "-"
                        };
                        setRenderPage(!renderPage);
                    }} />
            </>

    offset += 28;
    // the data category block
    const renderCategory = !importConfiguration.current.filename ||
        (importConfiguration.current.templates && importConfiguration.current.templates.length > 0 && importConfiguration.current.templateSelected?.ref !== "-")
        ? <></>
        : importConfiguration.current.category
            ? <h2 key="renderCategoryHeader" className="click-me sticky-top" style={{ top: offset }} onClick={uploadCategoryClicked}>Data Cargory: {importConfiguration.current.category}</h2>
            : <>
                <h2 key="renderCategoryHeader">Select Data Category</h2>
                <ul className="horizontal-selector">
                    {
                        (pageData.data.uploadTypes || []).map((t, idx) =>
                            <li id={"dc_" + idx}
                                key={"dc_" + t.name}
                                onClick={(e) => {
                                    e.preventDefault();
                                    importConfiguration.current.category = t.name;
                                    setRenderPage(!renderPage);
                                }}>{t.name}
                                {(t.help && t.help.trim().length > 0) ? <UncontrolledTooltip target={"dc_" + idx} autohide placement="bottom">{t.help}</UncontrolledTooltip> : null}</li>
                        )
                    }
                </ul>
            </>;

    offset += 28;
    // the mapping block
    const renderMapping = !importConfiguration.current.category || !importConfiguration.current.filename
        ? <></>
        : importConfiguration.current.mappingComplete
            ? <h2 key="renderMappingHeader" className="click-me sticky-top" style={{ top: offset }} onClick={mappingClicked}>Mapped : {_.compact(importConfiguration.current.mappingData).length} of {importConfiguration.current.sampleData.sheets[0].header.length} columns</h2>
            : <>
                <ul className="horizontal-selector">
                    <li data-filter="All" className={importConfiguration.current.filter === "All" ? "selected" : ""} onClick={setFilter}>All</li>
                    <li data-filter="Mapped" className={importConfiguration.current.filter === "Mapped" ? "selected" : ""} onClick={setFilter}>Mapped</li>
                    <li data-filter="Unmapped" className={importConfiguration.current.filter === "Unmapped" ? "selected" : ""} onClick={setFilter}> Unmapped</li >
                </ul>
                <table id="mappingTable">
                    <thead>
                        <tr>
                            <th>FIELDS IN FILE</th>
                            <th>FIELDS IN MATPAD</th>
                            <th colSpan="2">SAMPLE DATA FROM FILE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            importConfiguration.current.sampleData.sheets[0].header.map((hdr, idx) => renderMappingRow(hdr, idx))
                        }
                    </tbody>
                </table>
                <section className="sticky-bottom bottom-commands">
                    <div className="mapping-controls">
                        <Button color="primary" outline={true} className="minimal-button" onClick={resetFieldMapping}>Reset Field Mapping</Button>
                        <Button color="primary" outline={true} className="minimal-button" onClick={applyDefaultFieldMapping}>Apply Auto Mapping</Button>
                    </div>
                    <div>
                        <Button color="primary" onClick={mappingComplete}>Next</Button>
                    </div>
                </section>
            </>;

    const renderImportConfig =
        !importConfiguration.current.mappingComplete
            ? <></>
            : <>
                {!importConfiguration.current.templateSelected || importConfiguration.current.templateSelected.ref === "-"
                    ? <>
                        <h2 key="renderImportConfigHeader">What do you want to do with the records in the file?</h2>
                        <ul className="horizontal-selector">
                            <li key="it_add" data-importtype="Add" className={importConfiguration.current.importType === "Add" ? "selected" : null} onClick={setImportType}>Add new records only</li>
                            <li key="it_upd" data-importtype="Update" className={importConfiguration.current.importType === "Update" ? "selected" : null} onClick={setImportType}>Update existing records only</li>
                            <li key="it_noth" data-importtype="Both" className={importConfiguration.current.importType === "Both" ? "selected" : null} onClick={setImportType}>Both</li>
                        </ul>
                        <section className="inline-field">
                            <label className="inline-label" htmlFor="importKey">Skip existing records based on &nbsp;</label>
                            <DropDownList
                                style={{ maxWidth: 300 }}
                                defaultItem="Select Key ..."
                                data={_.sortBy(_.uniq(_.compact(importConfiguration.current.mappingData)), (i) => i.toString().toLowerCase())}
                                onChange={(e) => importConfiguration.current = { ...importConfiguration.current, importKey: e.value }}
                            />
                        </section>
                    </>
                    : <></>
                }
                <section className="sticky-bottom d-flex justify-content-end">
                    <Button color="primary" onClick={uploadData}>Upload Data</Button>
                </section>
            </>

    return importConfiguration.current.uploadComplete
        ? <section className="upload-complete">
            <h2>Upload Complete</h2>
            {importConfiguration.current.templateSelected && importConfiguration.current.templateSelected.ref !== "-"
                ? <></>
                : <>
                    <label htmlFor="templateName">Template Name</label>
                    <TextBox id="templateName" ref={templateName} maxLength={50} placeholder="Enter template name..." />
                    <label className="checkbox"><input type="checkbox" ref={templateGlobal} /><span></span> Global Template?</label>
                </>
            }
            <div className="controls">
                {importConfiguration.current.templateSelected && importConfiguration.current.templateSelected.ref !== "-"
                    ? <></>
                    : <Button color="secondary" onClick={saveTemplateClicked}>Save Template</Button>
                }
                <Button color="secondary" onClick={(e) => {
                    e.preventDefault();
                    importConfiguration.current = {
                        category: null,
                        filename: null,
                        filereference: null,
                        sampleData: null,
                        templates: null,
                        templateSelected: null,
                        filter: 'All',
                        mappingData: [],
                        mappingComplete: false,
                        importType: 'Both',
                        importKey: null
                    };
                    setRenderPage(!renderPage);
                }}>Import more data</Button>
                <Button color="primary" onClick={(e) => { e.preventDefault(); navigate("/") }}>Return To Dashboard</Button>
            </div>
        </section>
        : <div className="upload-pg">
            {renderUploader}
            {renderTemplateList}
            {renderCategory}
            {renderMapping}
            {renderImportConfig}
        </div>

    function saveTemplateClicked(e) {
        e.preventDefault();

        if ((templateName.current.value || "").trim().length === 0) {
            showAlert({
                title: 'Template',
                body: <>Enter the name for the template</>
            });
            return;
        }

        showAlert({
            title: 'Template',
            body: <>Are you sure you want to save this defintion as a {templateGlobal.current.checked ? "global" : "personal"} template?</>,
            buttons: [
                {
                    text: "Cancel",
                },
                {
                    text: "Save Template",
                    class: "primary",
                    click: saveTemplate
                }
            ]
        });
    }
    async function saveTemplate() {
        showPleaseWait("Saving Template");

        const token = getToken();
        fetch('/api/upload/template',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || null
                },
                body: JSON.stringify({
                    ref: importConfiguration.current.filereference,
                    name: templateName.current.value,
                    global: templateGlobal.current.checked
                })
            })
            .then(response => {
                // check for error response
                if (!response.ok) {
                    return Promise.reject(response.status);
                }

                if (!isJson(response)) {
                    hidePleaseWait();
                    importConfiguration.current = {
                        category: null,
                        filename: null,
                        filereference: null,
                        sampleData: null,
                        templates: null,
                        templateSelected: null,
                        filter: 'All',
                        mappingData: [],
                        mappingComplete: false,
                        importType: 'Both',
                        importKey: null
                    };
                    setRenderPage(!renderPage);
                    showAlert({
                        title: 'Template',
                        body: <>Template saved</>
                    });
                    return
                }
                response.json()
                    .then(
                        json => {
                            hidePleaseWait();
                            showAlert({
                                title: "Template",
                                body: json.error
                            });
                        }
                    )
                    .catch(error => {
                        debugger
                        console.log('There was an error getting JSON!', error);

                        showAlert({
                            title: 'MATpad Report Error',
                            body: <>Unable to save data</>
                        });
                    });
            })
            .catch(error => {
                console.log('There was an error!', error);
                debugger;
                showAlert({
                    title: 'MATpad Report Error',
                    body: <>Unable to save data</>
                });
            });
    }
    function mappingComplete(e) {
        e.preventDefault();

        if (_.compact(importConfiguration.current.mappingData || []).length === 0) {
            showAlert({
                title: 'Mapping',
                body: <>You have not mapped any fields!</>
            });
            return;
        }

        importConfiguration.current = {
            ...importConfiguration.current,
            mappingComplete: true
        };

        setRenderPage(!renderPage);
    }
    function mappingClicked(e) {
        e.preventDefault();
        importConfiguration.current = {
            ...importConfiguration.current,
            mappingComplete: false
        }
        setRenderPage(!renderPage);
    }

    function onBeforeUpload(e) {
        e.headers.Authorization = getToken();
    }

    function uploadData(e) {
        e.preventDefault();

        if ((!importConfiguration.current.templateSelected || (importConfiguration.current.templateSelected && importConfiguration.current.templateSelected.ref === "-")) && !importConfiguration.current.importKey) {
            showAlert({
                title: 'Upload',
                body: <>Select a key field for the data</>
            });
            return;
        }
        showAlert({
            title: 'Upload',
            body: <>Are you sure you want to upload the data into the system?</>,
            buttons: [
                {
                    text: "Cancel",
                },
                {
                    text: "Upload",
                    class: "primary",
                    click: uploadToServer
                }
            ]
        });

    }
    async function uploadToServer() {
        let data = {
            ...importConfiguration.current
        }
        delete (data.sampleData);
        delete (data.templates);

        showPleaseWait();

        execute('POST', '/api/upload/confirm', data)
            .then(response => {
                hidePleaseWait();

                // check for error response
                if (!response || response.error) {
                    showAlert({
                        title: "Upload",
                        body: response?.error || 'Unable to upload file'
                    });
                }
                else {
                    importConfiguration.current.uploadComplete = true;
                    setRenderPage(!renderPage);
                }
            })
            .catch(e => {
                console.log('There was an error!', e);
                debugger;
                showAlert({
                    title: 'MATpad Report Error',
                    body: <>Unable to upload data</>
                });
            });
    }

    /**
     * Apply Auto Map clicked - replace the mapping with the header name in camel case
     * @param {any} e
     */
    function applyDefaultFieldMapping(e) {
        e.preventDefault();
        showAlert({
            title: 'Mapping',
            body: <>This will clear any mapping you have entered and set a default mapping to match the column names</>,
            buttons: [
                {
                    text: "Cancel",
                },
                {
                    text: "Proceed",
                    class: "primary",
                    click: function () {
                        importConfiguration.current.mappingData = [];
                        _.each(importConfiguration.current.sampleData.sheets[0].header, (h) => {
                            let name = h.toLowerCase();
                            name = name.replace(/\s\s+/g, ' ').replace(/\s[a-z]/g, (m) => { return m.toUpperCase().trim() });
                            importConfiguration.current.mappingData.push(name);
                        });
                        setRenderPage(!renderPage);
                    }
                }
            ]
        });
    }

    /**
     * Reset Field Mapping clicked - clear the mapping
     * @param {any} e
     */
    function resetFieldMapping(e) {
        e.preventDefault();
        showAlert({
            title: 'Mapping',
            body: <>This will clear any mapping you have entered</>,
            buttons: [
                {
                    text: "Cancel",
                },
                {
                    text: "Proceed",
                    class: "primary",
                    click: function () {
                        importConfiguration.current.mappingData = [];
                        setRenderPage(!renderPage);
                    }
                }
            ]
        });
    }

    /**
     * Render a row in the mapping table
     * @param {string} hdr Header value from file
     * @param {number} idx Column index
     * @returns
     */
    function renderMappingRow(hdr, idx) {
        if (!importConfiguration.current.mappingData)
            importConfiguration.current = {
                ...importConfiguration.current,
                mappingData: []
            };

        //importConfiguration.current.mappingData[idx] = null;

        return <tr key={`mapping-hdr-${idx}`} className={`visibility-${checkMapFilter(idx)}`}>
            <td>{hdr}</td>
            <td>
                <ComboBox
                    data={[]}
                    id={`mapping-${idx}`}
                    suggest={true}
                    placeholder="Select mapped column..."
                    onChange={onMappingChange}
                    allowCustom={true}
                    value={importConfiguration.current.mappingData ? importConfiguration.current.mappingData[idx] : ""}
                />
            </td>
            <td>{importConfiguration.current.sampleData.sheets[0].rows && importConfiguration.current.sampleData.sheets[0].rows.length > 0 && importConfiguration.current.sampleData.sheets[0].rows[0].values
                ? importConfiguration.current.sampleData.sheets[0].rows[0].values[idx] || ""
                : ""}</td>
            <td>{importConfiguration.current.sampleData.sheets[0].rows && importConfiguration.current.sampleData.sheets[0].rows.length > 1 && importConfiguration.current.sampleData.sheets[0].rows[1].values
                ? importConfiguration.current.sampleData.sheets[0].rows[1].values[idx] || ""
                : ""}</td>
        </tr>;
    }

    /**
     * Check if the current header is mapped
     * @param {number} idx
     * @returns
     */
    function checkMapFilter(idx) {
        let isMapped = (importConfiguration.current.mappingData && importConfiguration.current.mappingData[idx] && importConfiguration.current.mappingData[idx].length > 0) ? true : false;

        return ((isMapped && (importConfiguration.current.filter === "All" || importConfiguration.current.filter === "Mapped")) ||
            (!isMapped && (importConfiguration.current.filter === "All" || importConfiguration.current.filter === "Unmapped"))) ? true : false;
    }

    /**
     * One of the Mapping combo's has been changed - update the mapping table
     * @param {any} e
     */
    function onMappingChange(e) {
        importConfiguration.current.mappingData[parseInt(e.target.props.id.substring(8))] = e.target.value;
        return true;
    }

    /**
     * The header for the data category has been clicked - clear the data that repesents pages after this to go back on redraw
     * @param {any} e
     */
    function uploadCategoryClicked(e) {
        e.preventDefault();
        importConfiguration.current = {
            ...importConfiguration.current,
            category: null,
            filter: 'All',
            mappingData: [],
            mappingComplete: false
        }
        setRenderPage(!renderPage);
    }

    /**
     * The header for the file has been clicked - clear the data to go back to the start on redraw
     * @param {any} e
     */
    function uploadFileClicked(e) {
        e.preventDefault();
        importConfiguration.current = {
            ...importConfiguration.current,
            category: null,
            filename: null,
            filereference: null,
            sampleData: null,
            templates: null,
            templateSelected: null,
            filter: 'All',
            mappingData: [],
            mappingComplete: false
        };
        setRenderPage(!renderPage);
    }
    function templateclicked(e) {
        e.preventDefault();
        importConfiguration.current = {
            ...importConfiguration.current,
            category: null,
            templateSelected: null,
            filter: 'All',
            mappingData: [],
            mappingComplete: false
        };
        setRenderPage(!renderPage);
    }

    /**
     * One of the mapping filters has been clicked - set the page config accordingly and redraw
     * @param {any} e
     * @returns
     */
    function setFilter(e) {
        e.preventDefault();

        // Already selected - nothing to change
        if (e.target.classList.contains('selected'))
            return;

        e.target.classList.add('selected');
        _.each(getSiblings(e.target), (i) => i.classList.remove('selected'));
        importConfiguration.current = {
            ...importConfiguration.current,
            filter: e.target.dataset.filter
        };

        setRenderPage(!renderPage);
    }

    /**
     * One of the mapping filters has been clicked - set the page config accordingly and redraw
     * @param {any} e
     * @returns
     */
    function setImportType(e) {
        e.preventDefault();

        // Already selected - nothing to change
        if (e.target.classList.contains('selected'))
            return;

        e.target.classList.add('selected');
        _.each(getSiblings(e.target), (i) => i.classList.remove('selected'));
        importConfiguration.current = {
            ...importConfiguration.current,
            importType: e.target.dataset.importtype
        };

        setRenderPage(!renderPage);
    }

    /**
     * File progress has changed - check the new status
     * @param {any} e
     * @returns
     */
    function updateFileProgress(e) {
        const file = e.affectedFiles[0];

        if (file.status === 0) {
            showAlert({
                title: 'Upload File',
                body: <>Unable to upload file</>
            });
            return;
        }
        if (file.status !== 4) {
            console.log("File Status: ${file.status}", e);
            return;
        }
        console.log("LOADED", e);

        if (!e.response || !e.response.response || !e.response.response.fileRef || !e.response.response.data) {
            showAlert({
                title: 'Upload File',
                body: <>No preview information available</>
            });
        }

        importConfiguration.current = {
            ...importConfiguration.current,
            filereference: e.response.response.fileRef,
            sampleData: e.response.response.data,
            templates: e.response.response.templates || [],
            templateSelected: null,
            filename: e.response.response.fileName,
            mappingComplete: false
        }
        setRenderPage(!renderPage);
    }
}

export default memo(Upload);