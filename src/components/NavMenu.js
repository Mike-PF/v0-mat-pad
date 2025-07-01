import React from "react";
import { Link } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";

// import reportConfigIcon from "../images/report-config.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUpFromBracket,
    faClipboardList,
    faFileChartPie,
    faGear,
    faSidebar,
} from "@fortawesome/pro-light-svg-icons";
import MATpadLogoSVG from "../images/matpadSVG";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function NavMenu(props) {
    const [collapsed, toggleNavbar] = React.useState(true);

    return (
        <ul
            className={classNames(
                collapsed ? "w-16" : "w-60",
                "bg-secondary-500 transition-[width] row-span-2 m-0 p-0 list-none white-space-nowrap h-screen overflow-hidden"
            )}
        >
            <li
                onClick={() => {
                    toggleNavbar(!collapsed);
                }}
                id={"side-menu-toggle"}
                className="h-16 w-full flex flex-row-reverse justify-between items-center group"
            >
                <FontAwesomeIcon
                    icon={faSidebar}
                    className="text-slate-50 w-5 h-5 mr-6"
                />
                {collapsed ? null : (
                    <div className="ml-4">
                        <MATpadLogoSVG height={56} width={100} />
                    </div>
                )}
                <UncontrolledTooltip
                    target={"side-menu-toggle"}
                    autohide={true}
                    placement={"right"}
                >
                    {collapsed ? "Expand" : "Collapse"}
                </UncontrolledTooltip>
            </li>
            {/* <li
                id={"left-menu-report-config"}>
                <Link to={"/report-template"} className="flex items-center">
                    <img alt={"Report Templates"}
                        src={reportConfigIcon} />
                    <span>
                        Report Templates
                    </span>
                </Link>
                <UncontrolledTooltip
                    target={"left-menu-report-config"}
                    autohide={true}
                    placement={"right"}>
                    Report Templates
                </UncontrolledTooltip>
            </li> */}
            <li
                id={"left-menu-upload"}
                className="flex justify-center items-centerw-full group my-2"
            >
                <Link
                    to={"/upload"}
                    className={classNames(
                        collapsed ? "w-10 justify-center" : "w-11/12 px-2",
                        "flex items-center rounded-lg h-9 group-hover:bg-slate-400"
                    )}
                >
                    <div className="flex items-center justify-center">
                        <div className="bg-slate-200 flex items-center justify-center rounded-lg min-h-6 w-6 border-1 border-slate-400 group-hover:bg-white">
                            <FontAwesomeIcon
                                className="text-slate-700"
                                alt={"Upload"}
                                icon={faArrowUpFromBracket}
                            />
                        </div>
                    </div>
                    <span
                        className={classNames(
                            collapsed ? "hidden" : "",
                            "ml-2 text-white"
                        )}
                    >
                        Upload
                    </span>
                </Link>
                <UncontrolledTooltip
                    target={"left-menu-upload"}
                    autohide={true}
                    placement={"right"}
                >
                    Upload
                </UncontrolledTooltip>
            </li>
            <li
                id={"left-menu-settings"}
                className={classNames(
                    collapsed
                        ? "flex justify-center items-center"
                        : "flex items-center justify-center",
                    "w-full group my-2"
                )}
            >
                <Link
                    to={"/settings"}
                    className={classNames(
                        collapsed ? "w-10 justify-center" : "w-11/12 px-2",
                        "flex items-center rounded-lg h-9 group-hover:bg-slate-400"
                    )}
                >
                    <div className="flex items-center justify-center">
                        <div className="bg-slate-200 flex items-center justify-center rounded-lg min-h-6 w-6 border-1 border-slate-400 group-hover:bg-white">
                            <FontAwesomeIcon
                                className="text-slate-700"
                                alt={"Settings"}
                                icon={faGear}
                            />
                        </div>
                    </div>
                    <span
                        className={classNames(
                            collapsed ? "hidden" : "",
                            "ml-2 text-white"
                        )}
                    >
                        Settings
                    </span>
                </Link>
                <UncontrolledTooltip
                    target={"left-menu-settings"}
                    autohide={true}
                    placement={"right"}
                >
                    Settings
                </UncontrolledTooltip>
            </li>

            <li
                id={"left-menu-forms"}
                className={classNames(
                    collapsed
                        ? "flex justify-center items-center"
                        : "flex items-center justify-center",
                    "w-full group my-2"
                )}
            >
                <Link
                    to={"/forms"}
                    className={classNames(
                        collapsed ? "w-10 justify-center" : "w-11/12 px-2",
                        "flex items-center rounded-lg h-9 group-hover:bg-slate-400"
                    )}
                >
                    <div className="flex items-center justify-center">
                        <div className="bg-slate-200 flex items-center justify-center rounded-lg min-h-6 w-6 border-1 border-slate-400 group-hover:bg-white">
                            <FontAwesomeIcon
                                className="text-slate-700"
                                alt={"Forms"}
                                icon={faClipboardList}
                            />
                        </div>
                    </div>
                    <span
                        className={classNames(
                            collapsed ? "hidden" : "",
                            "ml-2 text-white"
                        )}
                    >
                        Forms
                    </span>
                </Link>
                <UncontrolledTooltip
                    target={"left-menu-forms"}
                    autohide={true}
                    placement={"right"}
                >
                    Forms
                </UncontrolledTooltip>
            </li>

            <li
                id={"left-menu-reports"}
                className={classNames(
                    collapsed
                        ? "flex justify-center items-center"
                        : "flex items-center justify-center",
                    "w-full group my-2"
                )}
            >
                <Link
                    to={"/reports"}
                    className={classNames(
                        collapsed ? "w-10 justify-center" : "w-11/12 px-2",
                        "flex items-center rounded-lg h-9 group-hover:bg-slate-400"
                    )}
                >
                    <div className="flex items-center justify-center">
                        <div className="bg-slate-200 flex items-center justify-center rounded-lg min-h-6 w-6 border-1 border-slate-400 group-hover:bg-white">
                            <FontAwesomeIcon
                                className="text-slate-700"
                                alt={"Reports"}
                                icon={faFileChartPie}
                            />
                        </div>
                    </div>
                    <span
                        className={classNames(
                            collapsed ? "hidden" : "",
                            "ml-2 text-white"
                        )}
                    >
                        Reports
                    </span>
                </Link>
                <UncontrolledTooltip
                    target={"left-menu-reports"}
                    autohide={true}
                    placement={"right"}
                >
                    Reports
                </UncontrolledTooltip>
            </li>
        </ul>
    );
}

export default NavMenu;
