import React from 'react';

export const PageError = (props) => {
    return <>
        <h3 className="font-medium text-2xl mb-3">There is an issue with the {
            props.area
                ? <>{props.area}</>
                : <>page</>
        }</h3>
        {props.error &&
            <em>{props.error}</em>
        }
        {props.children}
        <a
            href={"/"}>
            Click here to return to the main dashboard
        </a>
    </>
}