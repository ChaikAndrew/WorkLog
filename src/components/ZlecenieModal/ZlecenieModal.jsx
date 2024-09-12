import React from "react";

const ZlecenieModal = ({
  zlecenieNameInput,
  setZlecenieNameInput,
  handleZlecenieSave,
  closeModal,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Zlecenie Name</h2>
        <input
          type="text"
          value={zlecenieNameInput}
          onChange={(e) => setZlecenieNameInput(e.target.value)}
        />
        <button onClick={handleZlecenieSave}>OK</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default ZlecenieModal;
