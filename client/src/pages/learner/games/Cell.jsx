import React from "react";
import "../../../components/css/tictactoe.css";

const Cell = ({ value, onClick, renderIcon, isWinningCell }) => {
  return (
    <div
      className={`cell ${isWinningCell ? "winning-cell" : ""}`}
      onClick={onClick}
    >
      {renderIcon(value)}
    </div>
  );
};

export default Cell;
