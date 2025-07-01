import React from 'react';

export const NoPermission = (props) => {
    return <>
        <h3 className="font-medium text-2xl mb-3">You do not have permission{props.area && <> to {props.area}</>}</h3>
        <p>If you need to make changes to the organisation, please contact your administrator or <a href="mailto:enquiries@learnsheffield.co.uk?subject=Permissions%20query" target="_top">Learn Sheffield</a> if you believe this is incorrect.</p>
    </>
}