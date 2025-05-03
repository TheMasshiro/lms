import React from "react";
import "../../components/css/tictactoe.css";

const Cell = ({ value, onClick }) => {
  return (
    <div className="cell" onClick={onClick}>
      {value}
    </div>
  );
};

export default Cell;
