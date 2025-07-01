import React from "react";
import { useMsal } from "@azure/msal-react";
import MATpadLogoSVG from "../images/matpadSVG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import { useCookies } from "react-cookie";

export function LoggedOut(props) {
    const { instance, accounts, inProgress } = useMsal();
    const [, , removeCookie] = useCookies(["org"]);

    if (accounts.length > 0) {
        window.location = "/";
        return (
            <span>There are currently {accounts.length} users signed in!</span>
        );
    }

    if (inProgress !== "login") {
        removeCookie("org");
    }

    return (
        <>
            {inProgress === "login" && (
                <div
                    className="k-dialog-wrapper system-alert"
                    style={{ zIndex: 10002 }}
                >
                    <div className="k-overlay"></div>
                    <div className="k-window k-dialog" role="dialog">
                        <div className="k-window-content k-dialog-content">
                            <div className="please-wait">
                                <span>Login is currently in progress</span>
                                <i className="fa-solid fa-loader fa-spin"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {inProgress !== "login" && (
                <div
                    className="w-full h-full flex items-center justify-center bg-login-bg bg-cover"
                    key={"loggedOut"}
                >
                    <div className="flex flex-col justify-center items-center">
                        <div className="mb-3">
                            <MATpadLogoSVG
                                height={100}
                                width={200}
                                darkText={true}
                            />
                        </div>
                        <div className="bg-white w-[300px] h-64 flex justify-center items-center flex-col rounded-lg border-1 border-slate-200 shadow-slate-300 p-4 mb-4">
                            <h2 className="font-semibold text-3xl text-black mb-4">
                                Welcome to MATpad!
                            </h2>
                            <p className="mb-3 text-base font-normal text-black overflow-visible text-center">
                                In order to use the system, you must login using
                                your business account.
                            </p>
                            <button
                                className="w-full rounded-m border-none bg-primary-500 text-white hover:opacity-60 h-10"
                                onClick={() => instance.loginPopup()}
                            >
                                Login
                            </button>
                        </div>
                        <div className="bg-white w-[300px] h-20 flex justify-between rounded-lg border border-slate-200">
                            <div className="w-8 h-8 rounded-lg border-1 border-blue-500 ml-6 mt-3 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCircleInfo} className="text-blue-500" />
                            </div>
                            <div className="flex items-center">
                                <p className="w-64 font-normal text-sm text-black">
                                    If you're here after logging in, your email
                                    isn't registered. Please contact your
                                    administrator.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
