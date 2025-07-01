import React, { useState } from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const FormTextArea = (props) => {
    const [error, setError] = useState();

    return (
        <div className="py-2">
            {props.label && (
                <label htmlFor={props.name} className="flex flex-no-wrap mb-2">
                    {props.label}
                    {props.required && "*"}
                </label>
            )}
            <textarea
                valid={!error}
                className={classNames(
                    error ? "border-red-600" : "",
                    "w-full border-1 border-gray-300 text-start z-1 rounded-md flex flex-1-1 px-3 py-2",
                    props.inputClassNames
                )}
                id={props.name}
                name={props.name}
                type={props.type}
                validator={props.validator ? props.validator : null}
                maxLength={props.maxLength}
                onBlur={(event) =>
                    props.validator &&
                    setError(props.validator(event.target.value))
                }
                {...props}
            />
            {error ? (
                <div className="text-red-600 flex flex-start mt-1 align-start text-sm">
                    {error}
                </div>
            ) : null}
        </div>
    );
};

export default FormTextArea;
