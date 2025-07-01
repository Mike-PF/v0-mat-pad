import { faX } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SearchInput = ({ name, setSearch, searchTerm }) => {
    return (
        <div className="flex items-center gap-2 ">
            <input
                name={name}
                type="text"
                id={name}
                className="w-60 rounded-md pl-2 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearch(event.target.value)}
            />
            {searchTerm && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="border-none w-6 h-6"
                >
                    <FontAwesomeIcon icon={faX} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
