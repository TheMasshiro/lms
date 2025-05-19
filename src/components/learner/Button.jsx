import "../css/Button.css";

const Button = () => {
  return (
    <div className="styled-wrapper">
      <a className="fancy" href="#">
        <span className="top-key" />
        <span className="text">Buy Tickets</span>
        <span className="bottom-key-1" />
        <span className="bottom-key-2" />
      </a>
    </div>
  );
};

export default Button;
