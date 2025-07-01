import React, { useEffect, useState } from 'react';
//import { Document, Page } from 'react-pdf';
//import * as PDFJS from "pdfjs-dist/build/pdf";
//import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

//window.PDFJS = PDFJS;

//PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfViewer() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const file = "/api/report/load?name=3c771e7b-c798-4aaf-8897-d13e0119868d_00000000-0000-0000-0000-000000000000_17-Jul-2023-21-56";

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div>
            {/*<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>*/}
            {/*    <Page pageNumber={pageNumber} />*/}
            {/*</Document>*/}
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    );
}