import React, { useEffect, useState } from "react";
import _ from "lodash";

const Estates = ({ panelData }) => {
    const [estates, setEstates] = useState(false);

    useEffect(() => {
        if (!panelData) return;

        setEstates(panelData?.estates ?? "");
    }, [panelData]);

    const estatesDiv = document.getElementById("estatesDiv");

    if (estatesDiv) {
        estatesDiv.innerHTML = estates;
    }

    return (
        <div className="w-full h-full bg-white px-4 rounded-xl pb-2">
            <div className="font-semibold text-lg w-full flex items-center text-center justify-center">
                Estates
            </div>
            <div
                key="estatesDiv"
                id="estatesDiv"
                className="list-disc w-full overflow-auto max-h-80 lg:max-h-32"
            />
        </div>
    );
};

export default Estates;
