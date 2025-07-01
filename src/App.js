import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./scss/site.scss";
import { EventType } from "@azure/msal-browser";
import { compareIssuingPolicy } from "./site";
import { b2cPolicies } from "./config/msalConfig";
import {
    MsalProvider,
    useMsal,
    UnauthenticatedTemplate,
    AuthenticatedTemplate,
} from "@azure/msal-react";
import { ReportsDashboard } from "./components/reports/Dashboard";
import ReportViewer from "./components/reports/ReportViewer";
import PdfViewer from "./components/reports/PdfViewer";
import Upload from "./components/uploads/upload";
import NotFound from "./components/NotFound";
import FormDashboard from "./components/forms/FormDashboard";
import { LoggedOut } from "./components/LoggedOut";
import { ReportWizard } from "./components/reports/Wizard";
import {
    MatpadProvider,
    useMatpadContext,
} from "./components/context/applicationContext";
import OrganisationSettings from "./components/settings/Organisation";
import UserSettings from "./components/settings/User";
import RoleSettings from "./components/settings/Roles";
import FormInput from "./components/forms/FormInput";
import Maintenance from "./components/forms/Maintenance";
import ManageRole from "./components/settings/Roles/ManageRole";
import ReportsArchive from "./components/reports/Elements/ReportsArchive";
import MailerSettings from "./components/settings/Mailer";
import ConnectionsSettings from "./components/settings/Connections";
import MappingSettings from "./components/settings/Mapping";
// import FormBuilder from "./components/forms/Builder";

const Pages = () => {
    const { instance } = useMsal();
    const { userDetail } = useMatpadContext();

    useEffect(() => {
        const callbackId = instance.addEventCallback((event) => {
            //console.log("EVENT", event.eventType, event);

            if (
                (event.eventType === EventType.LOGIN_SUCCESS ||
                    event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
                event.payload.account
            ) {
                if (event.eventType === EventType.LOGIN_SUCCESS) {
                    debugger;
                }
                /**
                 * For the purpose of setting an active account for UI update, we want to consider only the auth
                 * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
                 * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
                 * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                 */
                if (
                    compareIssuingPolicy(
                        event.payload.idTokenClaims,
                        b2cPolicies.names.editProfile
                    )
                ) {
                    // retrieve the account from initial sing-in to the app
                    const originalSignInAccount = instance
                        .getAllAccounts()
                        .find(
                            (account) =>
                                account.idTokenClaims.oid ===
                                    event.payload.idTokenClaims.oid &&
                                account.idTokenClaims.sub ===
                                    event.payload.idTokenClaims.sub &&
                                compareIssuingPolicy(
                                    account.idTokenClaims,
                                    b2cPolicies.names.signUpSignIn
                                )
                        );

                    let signUpSignInFlowRequest = {
                        authority:
                            b2cPolicies.authorities.signUpSignIn.authority,
                        account: originalSignInAccount,
                    };

                    // silently login again with the signUpSignIn policy
                    instance.ssoSilent(signUpSignInFlowRequest);
                }

                /**
                 * Below we are checking if the user is returning from the reset password flow.
                 * If so, we will ask the user to reauthenticate with their new password.
                 * If you do not want this behavior and prefer your users to stay signed in instead,
                 * you can replace the code below with the same pattern used for handling the return from
                 * profile edit flow
                 */
                //if (compareIssuingPolicy(event.payload.idTokenClaims, b2cPolicies.names.forgotPassword)) {
                //    let signUpSignInFlowRequest = {
                //        authority: b2cPolicies.authorities.signUpSignIn.authority,
                //        scopes: [
                //            ...protectedResources.apiTodoList.scopes.read,
                //            ...protectedResources.apiTodoList.scopes.write,
                //        ],
                //    };
                //    instance.loginRedirect(signUpSignInFlowRequest);
                //}
            }

            if (event.eventType === EventType.LOGIN_FAILURE) {
                // Check for forgot password error
                // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
                if (
                    event.error &&
                    event.error.errorMessage.includes("AADB2C90118")
                ) {
                    const resetPasswordRequest = {
                        authority:
                            b2cPolicies.authorities.forgotPassword.authority,
                        scopes: [],
                    };
                    instance.loginRedirect(resetPasswordRequest);
                } else {
                    debugger;
                }
            }

            if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
    }, [instance]);

    return !userDetail?.organisation ? (
        <Routes>
            <Route path="*" element={<p>Select Organisation</p>} />
        </Routes>
    ) : (
        <Routes>
            <Route path="/settings">
                <Route index={true} element={<OrganisationSettings />} />
                <Route path="organisation" element={<OrganisationSettings />} />
                <Route path="user" element={<UserSettings />} />
                <Route path="role" element={<RoleSettings />} />
                <Route path="role/:id" element={<RoleSettings />} />
                <Route path="role/:id/add" element={<ManageRole />} />
                <Route path="role/:id/:id" element={<ManageRole />} />
                <Route path="connections" element={<ConnectionsSettings />} />
                <Route path="mapping" element={<MappingSettings />} />
                {userDetail?.email?.includes("@pixel-fusion.com") && (
                    <Route path="mailer" element={<MailerSettings />} />
                )}
            </Route>
            <Route path="/reports">
                <Route index={true} element={<ReportsDashboard />} />
                <Route path="predefined" element={<ReportViewer />} />
                <Route path="wizard" element={<ReportWizard />} />
                <Route path="/reports/archive" element={<ReportsArchive />} />
            </Route>
            <Route path="/forms">
                <Route
                    index={true}
                    element={<FormDashboard key="form-dashboard" />}
                />
                <Route
                    index={true}
                    path="maintenance"
                    element={<Maintenance key="form-maintenance" />}
                />
                {/* <Route path="builder" element={<FormBuilder />} /> */}
                <Route path="input" element={<FormInput />} />
            </Route>
            <Route path="/">
                <Route index={true} element={<ReportViewer />} />
                <Route path="test" element={<PdfViewer />} />
                <Route path="upload" element={<Upload />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default function App({ instance }) {
    return (
        <MsalProvider instance={instance}>
            <UnauthenticatedTemplate>
                <LoggedOut />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <MatpadProvider>
                    <Layout>
                        <Pages />
                    </Layout>
                </MatpadProvider>
            </AuthenticatedTemplate>
        </MsalProvider>
    );
}
