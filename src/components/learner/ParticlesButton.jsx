import "../css/ParticlesButton.scss";

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
