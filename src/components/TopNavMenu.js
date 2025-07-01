import React, { useCallback, Fragment } from "react";
import {
    Menu,
    Transition,
    MenuButton,
    MenuItems,
    MenuItem,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation, router } from "react-router";
import { useMatpadContext } from "./context/applicationContext";
import OrganisationSelector from "./controls/OrganisationSelector";
import { CookiesProvider, useCookies } from "react-cookie";
import { hasPermission } from "../site";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRightFromBracket,
    faBuildingUser,
} from "@fortawesome/pro-light-svg-icons";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const TopNavMenu = (page) => {
    //const [collapsed, setCollapsed] = useState(true);
    const [showOrgSelector, setShowOrgSelector] = React.useState(false);
    const [permissions, setPermissions] = React.useState({
        userMaintenance: false,
        schoolsMaintenance: false,
        roleMaintenance: false,
        startqa: false,
        archiveform: false,
    });
    const { userDetail, pageLocation, logout, setOrganisation } =useMatpadContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [cookies, setCookie, removeCookie] = useCookies(["org"]);
    const setOrganisationCookie = React.useCallback(
        (id) => {
            if (id) {
                setCookie("org", id, { path: "/" });
                setShowOrgSelector(false);
            } else {
                removeCookie("org");
            }
        },
        [setCookie, removeCookie]
    );

    React.useEffect(() => {
        if (!userDetail || userDetail.notLoaded === true) return;

        setPermissions({
            userMaintenance: hasPermission(userDetail, "usermanagement"),
            schoolsMaintenance: hasPermission(userDetail, "changeurns"),
            roleMaintenance: hasPermission(userDetail, "rolemanagement"),
            startqa: hasPermission(userDetail, "startqa"),
            archiveform: hasPermission(userDetail, "archiveform"),
            editconnections: hasPermission(userDetail, "editconnections"),
            editmapping: hasPermission(userDetail, "editmapping"),
        });
    }, [userDetail, setPermissions]);

    const signOutClickHandler = useCallback(() => logout(), [logout]);

    const RenderPageMenu = () => {
        if (pageLocation?.startsWith("/reports")) {
            return (
                <div className="h-14 flex">
                    <Link
                        className={classNames(
                            pageLocation === "/reports"
                                ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                : "font-normal text-slate-700",
                            "ml-4 flex items-center justify-center"
                        )}
                        to={"/reports"}
                    >
                        Dashboard
                    </Link>
                    <Link
                        className={classNames(
                            pageLocation === "/reports/predefined"
                                ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                : "font-normal text-slate-700",
                            "ml-4 flex items-center justify-center"
                        )}
                        to={"/reports/predefined"}
                    >
                        Predefined reports
                    </Link>
                    <Link
                        className={classNames(
                            pageLocation === "/reports/archive"
                                ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                : "font-normal text-slate-700",
                            "ml-4 flex items-center justify-center"
                        )}
                        to={"/reports/archive"}
                    >
                        Archive
                    </Link>
                </div>
            );
        }

        if (pageLocation?.startsWith("/forms")) {
            return (
                <div className="h-14 flex">
                    <Link
                        className={classNames(
                            pageLocation === "/forms"
                                ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                : "font-normal text-slate-700",
                            "ml-4 flex items-center justify-center"
                        )}
                        to={"/forms"}
                    >
                        Dashboard
                    </Link>
                    {(permissions?.startqa?.available === true ||
                        permissions?.archiveform?.available === true) && (
                        <Link
                            className={classNames(
                                pageLocation === "/forms/maintenance"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/forms/maintenance"}
                        >
                            Maintenance
                        </Link>
                    )}
                    {/* {permissions?.startqa?.available === true && (
                        <Link
                            className={classNames(
                                pageLocation === "/forms/builder"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/forms/builder"}
                        >
                            Builder
                        </Link>
                    )} */}
                </div>
            );
        }

        if (pageLocation?.startsWith("/settings")) {
            return (
                <div className="h-14 flex">
                    <Link
                        className={classNames(
                            pageLocation === "/settings" ||
                                pageLocation === "/settings/organisation"
                                ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                : "font-normal text-slate-700",
                            "ml-4 flex items-center justify-center"
                        )}
                        to={"/settings/organisation"}
                    >
                        Organisation
                    </Link>
                    {permissions?.userMaintenance?.available === true && (
                        <Link
                            className={classNames(
                                pageLocation === "/settings/user"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/settings/user"}
                        >
                            Users
                        </Link>
                    )}
                    {permissions?.roleMaintenance?.available === true && (
                        <Link
                            className={classNames(
                                pageLocation === "/settings/role"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/settings/role"}
                        >
                            Roles
                        </Link>
                    )}
                    {permissions?.editconnections?.available === true && (
                        <Link
                            className={classNames(
                                pageLocation === "/settings/connections"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/settings/connections"}
                        >
                            System Connections
                        </Link>
                    )}
                    {permissions?.editmapping?.available === true && (
                        <Link
                            className={classNames(
                                pageLocation === "/settings/mapping"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/settings/mapping"}
                        >
                            Data Mapping
                        </Link>
                    )}
                    {userDetail?.email?.includes("@pixel-fusion.com") && (
                        <Link
                            className={classNames(
                                pageLocation === "/settings/mailer"
                                    ? "font-semibold text-slate-900 border-b-2 border-primary-500"
                                    : "font-normal text-slate-700",
                                "ml-4 flex items-center justify-center"
                            )}
                            to={"/settings/mailer"}
                        >
                            Mailer
                        </Link>
                    )}
                </div>
            );
        }

        return <></>;
    };

    const showOrganisations = () => {
        setShowOrgSelector(true);
    };

    if (!userDetail.notLoaded && !userDetail.organisation && !showOrgSelector) {
        setShowOrgSelector(true);
    }

    const initials =
        userDetail?.firstName?.substring(0, 1) +
        userDetail?.surname?.substring(0, 1);

    return (
        <CookiesProvider>
            <div className="p-4">
                <ul className="w-full rounded-lg mr-8 h-14 bg-white border border-slate-200 flex items-center justify-between flex-row-reverse">
                    <li
                        id={"top-menu-profile"}
                        className="flex items-center justify-center"
                    >
                        <Menu as="div" className="relative">
                            <MenuButton className="-m-1.5 flex items-center p-1.5 border-none mr-2">
                                <span className="sr-only">Open menu</span>
                                <div className="bg-slate-100 rounded-full h-9 w-9 flex items-center justify-center">
                                    {initials ? initials : ""}
                                </div>
                            </MenuButton>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-50 mt-2.5 w-28 px-2 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <MenuItem>
                                        <button
                                            onClick={showOrganisations}
                                            className="border-none my-1 w-24"
                                            title={
                                                userDetail?.organisation
                                                    ?.name || ""
                                            }
                                        >
                                            <div className="truncate">
                                                <FontAwesomeIcon
                                                    icon={faBuildingUser}
                                                    className="pr-2"
                                                />
                                                {userDetail?.organisation
                                                    ?.name || ""}
                                            </div>
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            className="flex items-center my-1"
                                            onClick={() =>
                                                signOutClickHandler()
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faArrowRightFromBracket}
                                                className="pr-2"
                                            />
                                            <div>Logout</div>
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </li>
                    <li className="h-full">
                        <RenderPageMenu />
                    </li>
                </ul>
            </div>
            {userDetail.organisations &&
                (!userDetail?.organisation || showOrgSelector) && (
                    <OrganisationSelector
                        setOpen={setShowOrgSelector}
                        organisations={userDetail.organisations}
                        onChange={(e) => {
                            const value = cookies?.org;
                            if (e && e.id) {
                                setOrganisationCookie(e.id);
                                setOrganisation(e);
                                if (window.location.href.includes("loggedout"))
                                    navigate("/reports/predefined");
                                else if (value !== e.id) {
                                    window.location = window.location.pathname;
                                }
                            } else {
                                setOrganisationCookie(null);
                                setOrganisation(null);
                            }
                        }}
                    />
                )}
        </CookiesProvider>
    );
};

export default TopNavMenu;
