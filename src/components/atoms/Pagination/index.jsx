import React from "react";
import Button from "../Button";
import Icon from "../Icon";

const Pagination = ({
  count,
  limit,
  currentPage,
  totalPage,
  onPageChange,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div className="flex justify-between items-center text-sm p-2 bg-white">
      <div className="flex gap-2">
        <Icon
          onClick={onFirstPage}
          className="p-1 text-[#878787]"
          disabled={currentPage === 1}
        >
          <img
            src="/images/icons/first.png"
            alt="Export to Excel"
            className="w-6 h-6"
          />
        </Icon>
        <Icon
          onClick={onPreviousPage}
          className="p-1 text-[#878787]"
          disabled={currentPage === 1}
        >
          <img
            src="/images/icons/back.png"
            alt="Export to Excel"
            className="w-6 h-6"
          />
        </Icon>
        {Array.from({ length: totalPage }, (_, index) => (
          <Icon
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-4 py-0 rounded-md ${
              currentPage === index + 1
                ? "bg-[#FBDCDB] text-[#FB9093]"
                : "text-[#FB9093]"
            }`}
          >
            {index + 1}
          </Icon>
        ))}
        <Icon
          onClick={onNextPage}
          className="p-1 text-[#878787]"
          disabled={currentPage === totalPage}
        >
          <img
            src="/images/icons/next.png"
            alt="Export to Excel"
            className="w-6 h-6"
          />
        </Icon>
        <Icon
          onClick={onLastPage}
          className="p-1 text-[#878787]"
          disabled={currentPage === totalPage}
        >
          <img
            src="/images/icons/last.png"
            alt="Export to Excel"
            className="w-6 h-6"
          />
        </Icon>
      </div>
      <span className="text-gray-500">
        {currentPage * limit - (limit - 1)} - {currentPage * limit} of {count}{" "}
        items
      </span>
    </div>
  );
};

export default Pagination;
