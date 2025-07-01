import React, { useState } from "react";
import { hideAlert, showAlert } from "../../controls/Alert";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import Button from "../../controls/Button";

function ModalEditRow({
    data,
    index,
    setReloadDatasets,
    connection,
    setRefresh,
    searchTerm,
}) {
    const { execute } = useFetchWithMsal();

    if (
        !data?.datasetName
            ?.toString()
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase())
    ) {
        return;
    }

    const toggleClick = (e) => {
        const type = e ? "select" : "deselect";
        // setLoading(true);
        execute("POST", `/api/sisra/datasets/${type}/${data?.id}`).catch(
            (err) => {
                showAlert({ body: <p>{`Unable to ${type} dataset`}</p> });
            }
        );
        // setLoading(false);
    };

    const deleteClick = (e) => {
        execute("DELETE", `/api/sisra/datasets/${data?.id}`)
            .then(() => {
                setReloadDatasets(true);
                hideAlert();
            })
            .catch((err) => {
                showAlert({ body: <p>{`Unable to delete dataset`}</p> });
            });
    };

    return (
        <tr key={index} className="max-h-20">
            <td className="p-2 border-r border-t border-slate-200">
                <div className="lineclamp-2">
                    {data?.academicYear} - {data?.eapYear}
                </div>
            </td>
            <td className="p-2 capitalize border-r border-t border-slate-200">
                <div className="lineclamp-2">{data?.datasetName}</div>
            </td>
            <td className="p-2 capitalize border-r border-t border-slate-200">
                <div className="lineclamp-2">{data?.schoolName}</div>
            </td>
            <td className="p-2 border-r border-t border-slate-200 items-center justify-center">
                <input
                    type="checkbox"
                    onClick={(e) => toggleClick(e.target.checked)}
                    defaultChecked={data?.selectedForData}
                    className="h-5 w-5 text-blue-200 border-slate-200 rounded-lg cursor-pointer"
                />
            </td>
            <td className="p-2 border-t items-center justify-center">
                {data?.selectedForData && (
                    <Button
                        onClick={() => {
                            showAlert({
                                body: (
                                    <div className="flex flex-col items-center justify-center gap-2 flex-wrap">
                                        <p>
                                            Are you sure you want to delete
                                            {data?.datasetName}?
                                        </p>
                                        <Button onClick={deleteClick}>
                                            Delete
                                        </Button>
                                    </div>
                                ),
                                buttons: [],
                            });
                        }}
                    >
                        Delete
                    </Button>
                )}
            </td>
        </tr>
    );
}

export default ModalEditRow;
