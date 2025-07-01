import * as React from "react";

const Button = ({ onClick, children, ...others }) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <button
            {...others}
            className={classNames(
                "min-w-32 rounded-m border-none bg-primary-500 text-white hover:opacity-60 h-10 disabled:bg-slate-300 disabled:hover:opacity-100 disabled:hover:cursor-not-allowed",
                others.className
            )}
            onClick={onClick}
        >
            {children ?? "Save"}
        </button>
    );
};

export default Button;
