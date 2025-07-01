import { useState, useCallback, useEffect, useRef } from "react";
import {
    InteractionType,
    InteractionRequiredAuthError,
    BrowserAuthError,
} from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { useMatpadContext } from "../context/applicationContext";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest
 * @returns
 */
const useFetchWithMsal = (msalRequest) => {
    const { instance } = useMsal();
    const [error, setError] = useState(null);
    const msalState = useRef({ loading: false, token: null });

    const {
        login,
        result,
        error: msalError,
    } = useMsalAuthentication(InteractionType.Popup, {
        ...msalRequest,
        scopes: [
            "https://matpad.onmicrosoft.com/2421f27e-623a-4622-8ad7-5ba3926da6c6/system_access",
        ],
        account: instance.getActiveAccount(),
        redirectUri: "/redirect",
    });

    useEffect(() => {
        if (msalError instanceof BrowserAuthError) {
            try {
                //if (instance && instance.getActiveAccount()) {
                //    const logoutRequest = {
                //        account: instance.getActiveAccount(),
                //        postLogoutRedirectUri: window.location.protocol + "//" + window.location.host + "/loggedout?loggedout",
                //    };

                //    instance.logout(logoutRequest);
                //}
                //else
                localStorage.clear();
                window.location = "/loggedout?loggedout"
            }
            catch (e) {
                window.location = "/loggedout?loggedout"
            }
            return
        }
        if (msalError instanceof InteractionRequiredAuthError) {
            setError(null);
            login(InteractionType.Popup, {
                ...msalRequest,
                scopes: [
                    "https://matpad.onmicrosoft.com/2421f27e-623a-4622-8ad7-5ba3926da6c6/system_access",
                ],
                account: instance.getActiveAccount(),
                redirectUri: "/redirect",
            })
                .catch((ex) => {
                    //debugger
                });
        }
    }, [msalError, login, msalRequest, instance]);

    /**
     * Execute a fetch request with the given options
     * @param {string} method: GET, POST, PUT, DELETE
     * @param {string} endpoint: The endpoint to call
     * @param {object} data: The data to send to the endpoint, if any
     * @param {boolean} rawResponse Return the raw response with no JSON processing
     * @returns JSON or raw response
     */
    const execute = async (
        method,
        endpoint,
        data = null,
        rawResponse = false,
        contentType = "application/json",
        controller
    ) => {
        if (msalError) {
            console.log("MSAL ERROR", msalError);
            debugger;
            setError(msalError);
            return;
        }

        if (result) {
            try {
                let responseMsg = null;
                let response = null;

                const headers = new Headers();

                // call aquire token to get the token from the cache or to make a call to the refresh token
                let tokenResult = null;
                try {
                    tokenResult = await instance.acquireTokenSilent({
                        ...msalRequest,
                        scopes: [
                            "https://matpad.onmicrosoft.com/2421f27e-623a-4622-8ad7-5ba3926da6c6/system_access",
                        ],
                        account: instance.getActiveAccount(),
                        redirectUri: "/redirect",
                    });
                } catch (e) {
                    debugger
                    // need to call popup option as interaction required
                    if (e instanceof InteractionRequiredAuthError) {
                        try {
                            tokenResult = await instance.acquireTokenPopup({
                                ...msalRequest,
                                scopes: [
                                    "https://matpad.onmicrosoft.com/2421f27e-623a-4622-8ad7-5ba3926da6c6/system_access",
                                ],
                                account: instance.getActiveAccount(),
                                redirectUri: "/redirect",
                            });
                        } catch (e) {
                            console.log("POPUP TOKEN FAILURE", e);
                            setError(e);
                            msalState.current.loading = false;
                            throw e;
                        }
                    }
                    // some other error
                    else {
                        console.log("SILENT TOKEN FAILURE", e);
                        setError(e);
                        msalState.current.loading = false;
                        throw e;
                    }
                }

                const bearer = `Bearer ${tokenResult.accessToken}`;
                headers.append("Authorization", bearer);

                msalState.current.token = bearer;

                if (data && contentType !== "")
                    headers.append(
                        "Content-Type",
                        contentType || "application/json"
                    );

                let options = {
                    method: method,
                    headers: headers,
                    body:
                        data && contentType?.endsWith("json") === true
                            ? JSON.stringify(data)
                            : data,
                };

                if (typeof controller !== "undefined") {
                    options = {
                        method: method,
                        signal: controller.signal,
                        headers: headers,
                        body:
                            data && contentType?.endsWith("json") === true
                                ? JSON.stringify(data)
                                : data,
                    };
                }

                msalState.current.loading = true;

                responseMsg = await fetch(endpoint, options);
                if (rawResponse !== true) {
                    response = responseMsg.json();
                } else {
                    response = responseMsg;
                }

                msalState.current.loading = false;
                return response;
            } catch (e) {
                debugger
                setError(e);
                msalState.current.loading = false;
                throw e;
            }
        }
    };

    return {
        getIsLoading: () => msalState.current.loading,
        error,
        getToken: () => msalState.current.token,
        instance,
        execute: useCallback(execute, [result, msalError]), // to avoid infinite calls when inside a `useEffect`
    };
};

export default useFetchWithMsal;
