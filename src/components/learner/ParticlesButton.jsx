import React from "react";
// Correct path to the CSS file
import "../css/ParticlesButton.scss"; // Adjust the path if necessary

const ParticlesButton = ({ children }) => {
  return (
    <button className="particles example-button-styling">
      <span className="particles__content">{children}</span>
      <span className="particles__parts">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index}></span>
          // Render 20 particle spans
        ))}
      </span>
    </button>
  );
};

export default ParticlesButton;
