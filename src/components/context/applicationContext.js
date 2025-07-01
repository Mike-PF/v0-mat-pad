import React from 'react';
import useFetchWithMsal from '../hooks/useFetchWithMsal';
import { showAlert } from '../controls/Alert';
import { useCookies } from "react-cookie";
import _ from "lodash";

/**
 * @typedef Organisation
 * @property {string} id
 * @property {string} name
 */
/**
 * @typedef UserDetail
 * @property {boolean} notLoaded Set when the user is not loaded/logged in
 * @property {string} firstName First name
 * @property {string} surname Surname
 * @property {string} email email address (login) for the user
 * @property {string} role role user has in home organisation
 * @property {Array<Organisation>} organisations list of organisations available to user
 * @property {Organisation} organisation Selected organisation
 * @property {string} [error] Error message if the system generated an error
 */

const MatpadContext = React.createContext();

const MatpadProvider = ({ children }) => {
    /**
     * @type {[UserDetail, React.Dispatch<UserDetail>]} state
     */
    const [userDetail, setUserDetail] = React.useState({ notLoaded: true });
    /**
     * @type {[string, React.Dispatch<string>]} state
     */
    const [pageLocation, setPageLocation] = React.useState("/");
    const { execute, instance } = useFetchWithMsal();
    const [cookies] = useCookies(["org"]);


    const logout = React.useCallback(() => {
        if (instance && instance.getActiveAccount()) {
            const logoutRequest = {
                account: instance.getActiveAccount(),
                postLogoutRedirectUri: window.location.protocol + "//" + window.location.host + "/loggedout?loggedout",
            };

            instance.logout(logoutRequest);
        }

    }, [instance]);

    const setLocation = React.useCallback(() => setPageLocation(window.location.pathname), [setPageLocation]);
    const setOrganisation = React.useCallback((e) => {
        setUserDetail({
            ...userDetail,
            organisation: e
        })
    }, [userDetail]);

    React.useEffect(() => {

        if (!instance || instance.getAllAccounts().length === 0) {
            if (!userDetail.notLoaded)
                setUserDetail({ notLoaded: true })
            return
        }

        if (userDetail.notLoaded) {
            execute('GET', '/api/settings')
                .then((response) => {
                    if (!response) return;

                    if (response) {
                        if (response.error) {
                            if (response.error === "Invalid Configuration") {
                                userDetail.error = response.error;
                                logout();
                            }
                            else {
                                userDetail.error = response.error;
                                showAlert({
                                    body: <p>Unable to validate account: {response.error}</p>,
                                    onClosed: () => logout,
                                    buttons: [{
                                        text: 'OK',
                                        click: () => logout()
                                    }]
                                });
                            }
                        }
                        else {
                            let selectedOrg = null;
                            if (cookies?.org?.length > 0) {
                                selectedOrg = _.find(response.organisations, { id: cookies.org });
                            }

                            if (selectedOrg == null) {
                                if (response?.organisations?.length === 1) {
                                    selectedOrg = response.organisations[0];
                                }
                            }

                            setUserDetail({
                                ...response,
                                notLoaded: false,
                                organisation: selectedOrg
                            });
                        }
                    }
                })
                .catch((e) => {
                    debugger
                    logout();
                });

        }

    }, [setUserDetail, userDetail, execute, logout, instance]);

    return (
        <MatpadContext.Provider value={{ userDetail, logout, setLocation, pageLocation, setOrganisation }}>
            {
                //!userDetail.notLoaded && !userDetail.error &&
                children
            }

            {/*{*/}
            {/*    userDetail.notLoaded && <div*/}
            {/*        className="k-dialog-wrapper system-alert"*/}
            {/*        style={{ zIndex: 10002 }}>*/}
            {/*        <div className="k-overlay"></div>*/}
            {/*        <div className="k-window k-dialog"*/}
            {/*            role="dialog">*/}
            {/*            <div className="k-window-content k-dialog-content">*/}
            {/*                <div className="please-wait">*/}
            {/*                    <span>Please wait</span>*/}
            {/*                    <i className="fa-solid fa-loader fa-spin"></i>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}
        </MatpadContext.Provider>
    )
}

const useMatpadContext = () => React.useContext(MatpadContext);

export default MatpadContext;
export { MatpadProvider, useMatpadContext };