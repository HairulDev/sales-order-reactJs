import React from "react";

const Modal = ({ show, onClose, text, img, onConfirm, isButton }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-[#D9D9D9] py-10 px-6 rounded-lg shadow-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-300"
          onClick={onClose}
        >
          &times;
        </span>
        <img src={img} alt="modal" className="w-20 h-20 mx-auto mb-5" />
        <p className="text-center text-xl mt-2">{text}</p>
        {isButton && (
          <div className="flex justify-center mt-7">
            <button
              onClick={onConfirm}
              className="bg-[#084165] text-white px-7 py-1 rounded-md mr-8"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="bg-[#CA9B01] text-white px-7 py-1 rounded-md"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
