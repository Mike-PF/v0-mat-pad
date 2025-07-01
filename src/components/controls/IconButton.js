import * as React from "react";

const IconButton = ({ onClick, children }) => {
    return (
        <button
            className="min-w-10 rounded-m border-none bg-gray-200 hover:opacity-60 h-10"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default IconButton;