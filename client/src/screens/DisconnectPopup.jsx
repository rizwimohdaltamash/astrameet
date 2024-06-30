import React from "react";

const DisconnectPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Leave the room</h1>

        <h2>Are you sure you want to leave the room?</h2>
        <div className="mt-4">
          <button
            onClick={onCancel}
            className="m-2 px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="m-2 px-4 py-2 bg-blue-700 text-white rounded cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisconnectPopup;
