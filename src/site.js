import { create, all } from "mathjs";
import _ from "lodash";
import { showAlert } from "./components/controls/Alert";
import * as React from "react";

export let getSiblings = function (e) {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if (!e.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling = e.parentNode.firstChild;

    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

/**
 * Checks if the response contains JSON data
 * @param {any} response
 * @returns {boolean}
 */
export const isJson = (response) => {
    return (
        response.headers.get("content-type")?.includes("application/json") &&
        parseInt(response.headers.get("content-length")) > 0
    );
};

/**
 * Populate claims table with appropriate description
 * @param {Object} claims ID token claims
 * @returns claimsObject
 */
export const createClaimsTable = (claims) => {
    let claimsObj = {};
    let index = 0;

    Object.keys(claims).forEach((key) => {
        if (typeof claims[key] !== "string" && typeof claims[key] !== "number")
            return;
        switch (key) {
            case "aud":
                populateClaim(
                    key,
                    claims[key],
                    "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "iss":
                populateClaim(
                    key,
                    claims[key],
                    "Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in /v2.0. The GUID that indicates that the user is a consumer user from a Microsoft account is 9188040d-6c67-4c5b-b112-36a304b66dad.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "iat":
                populateClaim(
                    key,
                    changeDateFormat(claims[key]),
                    "Issued At indicates when the authentication for this token occurred.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "nbf":
                populateClaim(
                    key,
                    changeDateFormat(claims[key]),
                    "The nbf (not before) claim identifies the time (as UNIX timestamp) before which the JWT must not be accepted for processing.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "exp":
                populateClaim(
                    key,
                    changeDateFormat(claims[key]),
                    "The exp (expiration time) claim identifies the expiration time (as UNIX timestamp) on or after which the JWT must not be accepted for processing. It's important to note that in certain circumstances, a resource may reject the token before this time. For example, if a change in authentication is required or a token revocation has been detected.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "name":
                populateClaim(
                    key,
                    claims[key],
                    "The principal about which the token asserts information, such as the user of an application. This value is immutable and can't be reassigned or reused. It can be used to perform authorization checks safely, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "preferred_username":
                populateClaim(
                    key,
                    claims[key],
                    "The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. It can be used for username hints, however, and in human-readable UI as a username. The profile scope is required in order to receive this claim.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "nonce":
                populateClaim(
                    key,
                    claims[key],
                    "The nonce matches the parameter included in the original /authorize request to the IDP. If it does not match, your application should reject the token.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "oid":
                populateClaim(
                    key,
                    claims[key],
                    "The oid (user�s object id) is the only claim that should be used to uniquely identify a user in an Azure AD tenant. The token might have one or more of the following claim, that might seem like a unique identifier, but is not and should not be used as such.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "tid":
                populateClaim(
                    key,
                    claims[key],
                    "The tenant ID. You will use this claim to ensure that only users from the current Azure AD tenant can access this app.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "upn":
                populateClaim(
                    key,
                    claims[key],
                    "(user principal name) � might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place or might change to reflect a personal change like marriage.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "email":
                populateClaim(
                    key,
                    claims[key],
                    "Email might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "acct":
                populateClaim(
                    key,
                    claims[key],
                    "Available as an optional claim, it lets you know what the type of user (homed, guest) is. For example, for an individual�s access to their data you might not care for this claim, but you would use this along with tenant id (tid) to control access to say a company-wide dashboard to just employees (homed users) and not contractors (guest users).",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "sid":
                populateClaim(
                    key,
                    claims[key],
                    "Session ID, used for per-session user sign-out.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "sub":
                populateClaim(
                    key,
                    claims[key],
                    "The sub claim is a pairwise identifier - it is unique to a particular application ID. If a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "ver":
                populateClaim(
                    key,
                    claims[key],
                    "Version of the token issued by the Microsoft identity platform",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "auth_time":
                populateClaim(
                    key,
                    claims[key],
                    "The time at which a user last entered credentials, represented in epoch time. There is no discrimination between that authentication being a fresh sign-in, a single sign-on (SSO) session, or another sign-in type.",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "at_hash":
                populateClaim(
                    key,
                    claims[key],
                    "An access token hash included in an ID token only when the token is issued together with an OAuth 2.0 access token. An access token hash can be used to validate the authenticity of an access token",
                    index,
                    claimsObj
                );
                index++;
                break;
            case "uti":
            case "rh":
                index++;
                break;
            default:
                populateClaim(key, claims[key], "", index, claimsObj);
                index++;
        }
    });

    return claimsObj;
};

/**
 * Populates claim, description, and value into an claimsObject
 * @param {String} claim
 * @param {String} value
 * @param {String} description
 * @param {Number} index
 * @param {Object} claimsObject
 */
const populateClaim = (claim, value, description, index, claimsObject) => {
    let claimsArray = [];
    claimsArray[0] = claim;
    claimsArray[1] = value;
    claimsArray[2] = description;
    claimsObject[index] = claimsArray;
};

/**
 * Transforms Unix timestamp to date and returns a string value of that date
 * @param {String} date Unix timestamp
 * @returns
 */
const changeDateFormat = (date) => {
    let dateObj = new Date(date * 1000);
    return `${date} - [${dateObj.toString()}]`;
};

/**
 * Compare the token issuing policy with a specific policy name
 * @param {object} idTokenClaims - Object containing the claims from the parsed token
 * @param {string} policyToCompare - ID/Name of the policy as expressed in the Azure portal
 * @returns {boolean}
 */
export function compareIssuingPolicy(idTokenClaims, policyToCompare) {
    let tfpMatches =
        idTokenClaims.hasOwnProperty("tfp") &&
        idTokenClaims["tfp"].toLowerCase() === policyToCompare.toLowerCase();
    let acrMatches =
        idTokenClaims.hasOwnProperty("acr") &&
        idTokenClaims["acr"].toLowerCase() === policyToCompare.toLowerCase();
    return tfpMatches || acrMatches;
}

/**
 * Extract the data for the given patter from the data element, return the default value if not possible
 * @param {any} data
 * @param {string} pattern
 * @param {any} defaultValue
 */
export const getDataItem = (data, pattern, defaultValue) => {
    if (typeof data === "undefined" || data === null) return defaultValue;
    if (typeof pattern === "undefined" || pattern === null) return defaultValue;
    if (pattern.trim().length === 0) return data;

    if (data[pattern]) return data[pattern];

    if (!window._math) {
        window._math = create(all, {});

        window._math.import({
            check: (value, defaultValue) =>
                !_.isNil(value) ? value : defaultValue,
            checkArray: (value, defaultValue) =>
                _.isArray(value) ? value : defaultValue ?? [],
            length: (value) => (_.isArray(value) ? value.length : 0),
            join: (array1, array2) => _.concat(array1 || [], array2 || []),
        });
    }

    try {
        let x = window._math.compile(pattern);
        let res = x.evaluate(data);

        return res;
    } catch (e) {
        debugger;
        console.log("E", e, pattern);
        return defaultValue;
    }
};

export const formatDate = (date) => {
    if (date === null || typeof date === "undefined" || isNaN(date))
        return null;

    if (!(date instanceof Date)) {
        throw new Error(
            'Invalid "date" argument. You must pass a date instance'
        );
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const phoneRegex = new RegExp(
    /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
);
const postcodeRegex = new RegExp(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i);

export const requiredValidator = (value) =>
    (value || "").trim().length > 0 ? "" : "Error: This field is required.";
export const emailValidator = (value) =>
    (value || "").trim().length === 0 || emailRegex.test(value)
        ? ""
        : "Please enter a valid email.";
export const phoneValidator = (value, required) =>
    (value || (required ? "--" : "")).trim().length === 0 ||
    phoneRegex.test(value)
        ? ""
        : "Please enter a valid phone number.";
export const postcodeValidator = (value, required) =>
    (value || (required ? "##" : "")).trim().length === 0 ||
    postcodeRegex.test(value)
        ? ""
        : "Please enter a valid postcode.";

export const requiredEmailValidator = (value) =>
    (value || "--").trim().length > 0 && emailRegex.test(value)
        ? ""
        : "Please enter a valid email.";
export const requiredPhoneValidator = (value) =>
    (value || "--").trim().length > 0 && phoneRegex.test(value)
        ? ""
        : "Please enter a valid phone number.";
export const requiredPostcodeValidator = (value) =>
    (value || "##").trim().length > 0 && postcodeRegex.test(value)
        ? ""
        : "Please enter a valid postcode.";

export const HelpIcon = ({ help }) => {
    return help?.trim()?.length > 0 ? (
        <label
            className="help"
            onClick={() =>
                showAlert({
                    body: (
                        <p
                            dangerouslySetInnerHTML={{ __html: help.trim() }}
                        ></p>
                    ),
                })
            }
        >
            <i className="fa-light fa-circle-info"></i>
        </label>
    ) : (
        <></>
    );
};

export const getBool = (value) => {
    if (
        typeof value === "undefined" ||
        value === null ||
        ("" + value).trim().toLowerCase() === "null"
    )
        return null;
    if (typeof value === "boolean") return value === true;
    if (typeof value === "number") return value === 1;

    value = (value || "n").trim().toLowerCase();
    return value.startsWith("y") ||
        value.startsWith("t") ||
        value.startsWith("1")
        ? true
        : false;
};

export const findFirstFocusableElement = (container) => {
    return Array.from(container.getElementsByTagName("*")).find(isFocusable);
};

export const isFocusable = (item) => {
    //if (item.tabIndex < 0) {
    //    return false;
    //}
    switch (item.tagName) {
        case "A":
            return !!item.href;
        case "INPUT":
            return item.type !== "hidden" && !item.disabled;
        case "SELECT":
        case "TEXTAREA":
            //case "BUTTON":
            return !item.disabled;
        case "DIV":
            return item.role === "textbox";
        default:
            return false;
    }
};

/**
 * Stop the key press events propogating - collapsible panels can change state if it is alloed
 * @param {any} editorRef
 */
export const stopKeyPressPropogation = (editorRef) => {
    if (!editorRef || !editorRef.current) return;

    let ctl =
        editorRef.current.view?.dom ||
        editorRef.current.element?.current ||
        editorRef.current.element;

    if (ctl)
        ctl.addEventListener("keydown", (e) => {
            if (typeof e.stopPropogation === "function") e.stopPropogation();
            e.cancelBubble = true;
        });
};

/**
 * Scroll to a control with the ID in the TAG of the current control
 * If the previous control is a header, then it will scroll to that
 * @param {Event} e
 * @returns
 */
export const scrollTo = (e) => {
    const tag = e.target.dataset?.tag || e.currentTarget.dataset?.tag;

    if (!tag) return;

    e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();

    let ctl = document.getElementById(tag);

    if (
        ctl &&
        ctl.previousSibling &&
        ctl.previousSibling.tagName?.match(/^H[1-9]$/)
    )
        ctl = ctl.previousSibling;

    if (ctl)
        ctl.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
        });
};

export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
};

/**
 * @typedef PermissionAvailability
 * @property {boolean} available if the permission is available
 * @property {boolean} global Global permission
 * @property {Array<number>} [urns] list of URNs if tghe permission is restricted to schools
 */

/**
 * Check the permission block to see if the required permission is available
 * @param {any} userDetails
 * @param {string} permission Code for the permission
 * @param {any} [urn] URN if required
 * @returns {PermissionAvailability}
 */
export const hasPermission = (userDetails, permission, urn) => {
    /** @type {PermissionAvailability} */
    const a = { available: false, urns: [], global: false };

    if (!userDetails || (!userDetails.isAdmin && !userDetails.permissions))
        return a;

    if (
        userDetails.isAdmin === true ||
        (_.isArray(userDetails.permissions.global) &&
            _.indexOf(userDetails.permissions.global, permission) >= 0)
    ) {
        a.available = true;
        a.global = true;
    } else {
        _.each(userDetails.permissions, (v, k) => {
            if (
                _.isInteger(k) &&
                _.isArray(v) &&
                _.indexOf(v, permission) >= 0
            ) {
                a.available = true;
                a.urns.push(k);
            }
        });
    }

    return a;
};

export const rgba2hex = (rgba) => {
    var a,
        rgb = rgba
            .replace(/\s/g, "")
            .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && (rgb[4] || "")).trim(),
        hex = rgb
            ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
              (rgb[2] | (1 << 8)).toString(16).slice(1) +
              (rgb[3] | (1 << 8)).toString(16).slice(1)
            : rgba;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 1;
    }
    a = ((a * 255) | (1 << 8)).toString(16).slice(1);
    hex = hex + a;

    return hex;
};

window.getDataItem = getDataItem;
window.formatDate = formatDate;
window.findFirstFocusableElement = findFirstFocusableElement;
