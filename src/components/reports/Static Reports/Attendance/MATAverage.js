import React, { useState } from "react";
import { uniqueId } from "lodash";

const MATAverageChart = ({ chartData, title, type, name }) => {
    const [showAllSchools, setShowAllSchools] = useState(false);

    if (!chartData?.schools) return;

    let largestValue = 0;
    if (chartData?.schools) {
        if (type === "pa") {
            largestValue = Math.max(...chartData?.schools?.map((o) => o.pa));
        } else {
            largestValue = Math.max(
                ...chartData?.schools?.map((o) => o.absent)
            );
        }
    }

    const getWidth = (value) => {
        const percentage = ((value / largestValue) * 100)?.toFixed();

        return typeof percentage !== NaN ? `${percentage}%` : "0%";
    };

    chartData?.schools?.sort((a, b) => b?.absent - a?.absent);
    chartData?.schools?.sort((a, b) => b?.pa - a?.pa);

    if (type === "pa") {
        return (
            <div className="w-full h-full max-h-96 overflow-auto">
                <div className="flex items-center flex-col justify-center">
                    <div className="mb-2 flex justify-between items-center  w-full px-4">
                        <div className="font-semibold ">{title}</div>
                        <button
                            className="px-2 border-none hover:underline text-primary-500"
                            onClick={() => setShowAllSchools(!showAllSchools)}
                        >
                            {showAllSchools
                                ? "Hide schools"
                                : "Show all schools"}
                        </button>
                    </div>
                    {chartData?.schools.map((e) => {
                        const widthValue = e?.pa;
                        if (
                            e?.phase?.toLowerCase() === "primary" &&
                            e?.pa < chartData?.mat?.primary
                        )
                            return;
                        if (e?.phase?.toLowerCase() === "secondary") return;
                        return (
                            <div
                                className="w-full flex flex-col items-start grid-cols-5 px-6"
                                key={uniqueId(e?.urn)}
                            >
                                <div className="my-1 flex  justify-end mr-2">
                                    {e?.name}
                                </div>
                                <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                    <div
                                        style={{
                                            width: `${getWidth(widthValue)}`,
                                        }}
                                        className={"h-4 bg-[#f7555a]"}
                                    />
                                    <div className="">{e?.pa?.toFixed(1)}</div>
                                </div>
                            </div>
                        );
                    })}
                    {chartData?.mat?.primary && (
                        <div className="w-full flex flex-col items-start grid-cols-5 px-6">
                            <div className="my-1 flex  justify-end mr-2">
                                {name}{" "}
                                {chartData?.mat?.secondary && `- Primary`}
                            </div>
                            <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                <div
                                    style={{
                                        width: `${getWidth(
                                            chartData?.mat?.primary?.toFixed(1)
                                        )}`,
                                    }}
                                    className={"h-4 bg-[#2395a4]"}
                                />
                                <div className="">
                                    {chartData?.mat?.primary?.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    )}
                    {showAllSchools &&
                        chartData?.schools.map((e) => {
                            const widthValue = e?.pa;
                            if (e?.pa > chartData?.mat?.pa) return;
                            if (
                                e?.phase?.toLowerCase() === "primary" &&
                                e?.pa > chartData?.mat?.primary
                            )
                                return;
                            if (e?.phase?.toLowerCase() === "secondary") return;
                            return (
                                <div
                                    className="w-full flex flex-col items-start grid-cols-5 px-6"
                                    key={uniqueId(e?.urn)}
                                >
                                    <div className="my-1 flex  justify-end mr-2">
                                        {e?.name}
                                    </div>
                                    <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                        <div
                                            style={{
                                                width: `${getWidth(
                                                    widthValue
                                                )}`,
                                            }}
                                            className={"h-4 bg-[#74b4ff]"}
                                        />
                                        <div className="">
                                            {e?.pa?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {chartData?.schools.map((e) => {
                        const widthValue = e?.pa;
                        if (e?.phase?.toLowerCase() === "primary") return;
                        if (
                            e?.phase?.toLowerCase() === "secondary" &&
                            e?.pa < chartData?.mat?.secondary
                        )
                            return;
                        return (
                            <div
                                className="w-full flex flex-col items-start grid-cols-5 px-6"
                                key={uniqueId(e?.urn)}
                            >
                                <div className="my-1 flex  justify-end mr-2">
                                    {e?.name}
                                </div>
                                <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                    <div
                                        style={{
                                            width: `${getWidth(widthValue)}`,
                                        }}
                                        className={"h-4 bg-[#f7555a]"}
                                    />
                                    <div className="">{e?.pa?.toFixed(1)}</div>
                                </div>
                            </div>
                        );
                    })}
                    {chartData?.mat?.secondary && (
                        <div className="w-full flex flex-col items-start grid-cols-5 px-6">
                            <div className="my-1 flex  justify-end mr-2">
                                {name}{" "}
                                {chartData?.mat?.primary && `- Secondary`}
                            </div>
                            <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                <div
                                    style={{
                                        width: `${getWidth(
                                            chartData?.mat?.secondary?.toFixed(
                                                1
                                            )
                                        )}`,
                                    }}
                                    className={"h-4 bg-[#2395a4]"}
                                />
                                <div className="">
                                    {chartData?.mat?.secondary?.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    )}
                    {showAllSchools &&
                        chartData?.schools.map((e) => {
                            const widthValue = e?.pa;
                            if (e?.pa > chartData?.mat?.pa) return;
                            if (e?.phase?.toLowerCase() === "primary") return;
                            if (
                                e?.phase?.toLowerCase() === "secondary" &&
                                e?.pa > chartData?.mat?.secondary
                            )
                                return;
                            return (
                                <div
                                    className="w-full flex flex-col items-start grid-cols-5 px-6"
                                    key={uniqueId(e?.urn)}
                                >
                                    <div className="my-1 flex  justify-end mr-2">
                                        {e?.name}
                                    </div>
                                    <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                        <div
                                            style={{
                                                width: `${getWidth(
                                                    widthValue
                                                )}`,
                                            }}
                                            className={"h-4 bg-[#74b4ff]"}
                                        />
                                        <div className="">
                                            {e?.pa?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full max-h-96 overflow-auto">
            <div className="flex items-center flex-col justify-center">
                <div className="mb-2 flex justify-between items-center  w-full px-4">
                    <div className="font-semibold ">{title}</div>
                    <button
                        className="px-2 border-none hover:underline text-primary-500"
                        onClick={() => setShowAllSchools(!showAllSchools)}
                    >
                        {showAllSchools ? "Hide schools" : "Show all schools"}
                    </button>
                </div>
                {chartData?.schools.map((e) => {
                    const widthValue = e?.absent;
                    if (e?.phase?.toLowerCase() === "secondary") return;
                    if (
                        e?.phase?.toLowerCase() === "primary" &&
                        e?.present > chartData?.mat?.primary
                    )
                        return;

                    return (
                        <div
                            className="w-full flex flex-col items-start grid-cols-5 px-6"
                            key={uniqueId(e?.urn)}
                        >
                            <div className="my-1 flex  justify-end mr-2">
                                {e?.name}
                            </div>
                            <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                <div
                                    style={{
                                        width: `${getWidth(widthValue)}`,
                                    }}
                                    className={"h-4 bg-[#f7555a]"}
                                />
                                <div className="">{e?.absent?.toFixed(1)}</div>
                            </div>
                        </div>
                    );
                })}
                {chartData?.mat?.primary && (
                    <div className="w-full flex flex-col items-start grid-cols-5 px-6">
                        <div className="my-1 flex  justify-end mr-2">
                            {name} {chartData?.mat?.secondary && `- Primary`}
                        </div>
                        <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                            <div
                                style={{
                                    width: `${getWidth(
                                        (
                                            100 - chartData?.mat?.primary
                                        )?.toFixed(1)
                                    )}`,
                                }}
                                className={"h-4 bg-[#2395a4]"}
                            />
                            <div className="">
                                {(100 - chartData?.mat?.primary)?.toFixed(1)}
                            </div>
                        </div>
                    </div>
                )}
                {showAllSchools &&
                    chartData?.schools.map((e) => {
                        const widthValue = e?.absent;
                        if (e?.phase?.toLowerCase() === "secondary") return;
                        if (
                            e?.phase?.toLowerCase() === "primary" &&
                            e?.present < chartData?.mat?.primary
                        )
                            return;

                        return (
                            <div
                                className="w-full flex flex-col items-start grid-cols-5 px-6"
                                key={uniqueId(e?.urn)}
                            >
                                <div className="my-1 flex  justify-end mr-2">
                                    {e?.name}
                                </div>
                                <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                    <div
                                        style={{
                                            width: `${getWidth(widthValue)}`,
                                        }}
                                        className={"h-4 bg-[#74b4ff]"}
                                    />
                                    <div className="">
                                        {e?.absent?.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                {chartData?.schools.map((e) => {
                    const widthValue = e?.absent;
                    if (e?.phase?.toLowerCase() === "primary") return;
                    if (
                        e?.phase?.toLowerCase() === "secondary" &&
                        e?.present > chartData?.mat?.secondary
                    )
                        return;

                    return (
                        <div
                            className="w-full flex flex-col items-start grid-cols-5 px-6"
                            key={uniqueId(e?.urn)}
                        >
                            <div className="my-1 flex  justify-end mr-2">
                                {e?.name}
                            </div>
                            <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                <div
                                    style={{
                                        width: `${getWidth(widthValue)}`,
                                    }}
                                    className={"h-4 bg-[#f7555a]"}
                                />
                                <div className="">{e?.absent?.toFixed(1)}</div>
                            </div>
                        </div>
                    );
                })}
                {chartData?.mat?.secondary && (
                    <div className="w-full flex flex-col items-start grid-cols-5 px-6">
                        <div className="my-1 flex  justify-end mr-2">
                            {name} {chartData?.mat?.primary && `- Secondary`}
                        </div>
                        <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                            <div
                                style={{
                                    width: `${getWidth(
                                        (
                                            100 - chartData?.mat?.secondary
                                        )?.toFixed(1)
                                    )}`,
                                }}
                                className={"h-4 bg-[#2395a4]"}
                            />
                            <div className="">
                                {(100 - chartData?.mat?.secondary)?.toFixed(1)}
                            </div>
                        </div>
                    </div>
                )}
                {showAllSchools &&
                    chartData?.schools.map((e) => {
                        const widthValue = e?.absent;
                        if (e?.phase?.toLowerCase() === "primary") return;
                        if (
                            e?.phase?.toLowerCase() === "secondary" &&
                            e?.present < chartData?.mat?.secondary
                        )
                            return;

                        return (
                            <div
                                className="w-full flex flex-col items-start grid-cols-5 px-6"
                                key={uniqueId(e?.urn)}
                            >
                                <div className="my-1 flex  justify-end mr-2">
                                    {e?.name}
                                </div>
                                <div className="w-full my-1 pr-10 flex items-center gap-x-2">
                                    <div
                                        style={{
                                            width: `${getWidth(widthValue)}`,
                                        }}
                                        className={"h-4 bg-[#74b4ff]"}
                                    />
                                    <div className="">
                                        {e?.absent?.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default MATAverageChart;
