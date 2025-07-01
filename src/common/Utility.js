import _ from "lodash";

export const boolContent = (value, positive, negative, nan) => {
    if (_.isNaN(value) || _.isUndefined(value) || _.isNaN(_.toNumber(value)))
        return nan || "";

    if (!isNaN(value) && value > 0)
        return positive;
    if (!isNaN(value) && value < 0)
        return negative;
    return nan || "";
}

export const numericContent = (value, precision, nan) => {
    if (_.isNaN(value) || _.isUndefined(value))
        return nan || "";

    if (precision >= 0 && !_.isNaN(_.toNumber(value)))
        return _.toNumber(value).toFixed(precision);

    return value;
}