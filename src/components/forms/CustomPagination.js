import { faEllipsis } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CustomPagination = ({ setCurrentPage, currentPage, pages }) => {
    return (
        <div className="flex items-center justify-center w-full gap-2 my-3">
            {currentPage - 3 > 0 && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(1)}
                        className="border-none hover:bg-gray-200"
                    >
                        {pages[0]?.name}
                    </button>
                </div>
            )}
            {currentPage - 4 > 0 && (
                <div className="flex items-center justify-center">
                    <button
                        className="border-none"
                        type="button"
                        onClick={() => setCurrentPage(currentPage - 3)}
                    >
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </div>
            )}
            {currentPage - 1 > 0 && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage - 2)}
                        className="border-none hover:bg-gray-200"
                    >
                        {currentPage - 2 > 0
                            ? pages[currentPage - 3]?.name
                            : " "}
                    </button>
                </div>
            )}
            {currentPage > 0 && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="border-none hover:bg-gray-200"
                    >
                        {currentPage - 1 > 0
                            ? pages[currentPage - 2]?.name
                            : " "}
                    </button>
                </div>
            )}
            <div className="min- p-1 text-[#64a0f5] rounded-lg flex items-center justify-center">
                {pages[currentPage - 1]?.name}
            </div>
            {currentPage < pages?.length && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="border-none  hover:bg-gray-200"
                    >
                        {currentPage < pages?.length
                            ? pages[currentPage]?.name
                            : " "}
                    </button>
                </div>
            )}
            {currentPage + 1 < pages?.length && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage + 2)}
                        className="border-none  hover:bg-gray-200"
                    >
                        {currentPage + 1 < pages?.length
                            ? pages[currentPage + 1]?.name
                            : " "}
                    </button>
                </div>
            )}
            {currentPage + 3 < pages?.length && (
                <div className=" flex items-center justify-center">
                    <button
                        type="button"
                        className="border-none "
                        onClick={() => setCurrentPage(currentPage + 3)}
                    >
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </div>
            )}
            {currentPage + 2 < pages?.length && (
                <div className=" flex items-center justify-center">
                    <button
                        onClick={() => setCurrentPage(pages?.length)}
                        className="border-none  hover:bg-gray-200"
                    >
                        {pages[pages?.length - 1]?.name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomPagination;
