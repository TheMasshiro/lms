
const GameInfoCard = ({ title, description, steps }) => {
  return (
    <div className="p-4 m-2 rounded-xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-2">{description}</p>
      <ul className="list-disc list-inside">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameInfoCard;
