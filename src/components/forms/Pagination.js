import { faEllipsis } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownSelect } from "../controls/DropDownSelect";

const Pagination = ({
    setCurrentPage,
    currentPage,
    maxPages,
    pageOptions,
    filterChange,
    perPage = true,
}) => {
    return (
        <div className="flex items-center justify-center w-full gap-2 my-3">
            {currentPage - 3 > 0 && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(1)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        1
                    </button>
                </div>
            )}
            {currentPage - 4 > 0 && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        className="border-none w-4 h-4"
                        type="button"
                        onClick={() => setCurrentPage(currentPage - 3)}
                    >
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </div>
            )}
            {currentPage - 1 > 0 && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage - 2)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        {currentPage - 2 > 0 ? currentPage - 2 : " "}
                    </button>
                </div>
            )}
            {currentPage > 0 && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        {currentPage - 1 > 0 ? currentPage - 1 : " "}
                    </button>
                </div>
            )}
            <div className="min-w-6 h-6 p-1 text-[#64a0f5] rounded-lg flex items-center justify-center">
                {currentPage}
            </div>
            {currentPage < maxPages && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        {currentPage < maxPages ? currentPage + 1 : " "}
                    </button>
                </div>
            )}
            {currentPage + 1 < maxPages && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage + 2)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        {currentPage + 1 < maxPages ? currentPage + 2 : " "}
                    </button>
                </div>
            )}
            {currentPage + 3 < maxPages && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        type="button"
                        className="border-none w-4 h-4"
                        onClick={() => setCurrentPage(currentPage + 3)}
                    >
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </div>
            )}
            {currentPage + 2 < maxPages && (
                <div className="w-6 h-6 flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(maxPages)}
                        className="border-none w-6 hover:bg-gray-200"
                    >
                        {maxPages}
                    </button>
                </div>
            )}
            {perPage && (
                <DropDownSelect
                    valueField={"value"}
                    textField={"name"}
                    selectedField={"start"}
                    customWidth={true}
                    key={"perPage"}
                    onChange={(e) => filterChange(e?.value?.value)}
                    items={pageOptions}
                    placeholder={""}
                    maxWidth={"160px"}
                />
            )}
        </div>
    );
};

export default Pagination;
