import React from 'react';
import NavMenu from './NavMenu';
import TopNavMenu from './TopNavMenu';
import Alert, { AlertContextProvider } from './controls/Alert';
import { PageLoadContextProvider } from "./hooks/usePageLoad";
export default function Layout(props) {
    PageLoadContextProvider();
    AlertContextProvider();

    return <>
        <div className="pg-container new-build bg-slate-50">
            <NavMenu key="nav-menu" />
            <TopNavMenu key="top-nav-menu" />
            <div className="px-4 py-6 overflow-auto" key="content">
                {props.children}
            </div>
        </div>
        <Alert />
    </>;
}
