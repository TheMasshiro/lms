import { Stepper } from "react-form-stepper";

const MyStepper = ({ currentStep }) => {
  return (
    <Stepper
      steps={[
        { label: "Basic Info" },
        { label: "Thumbnail" },
        { label: "Chapters" },
        { label: "Activities" },
        { label: "Review" },
      ]}
      activeStep={currentStep - 1}
      styleConfig={{
        activeBgColor: "#3b82f6",
        completedBgColor: "#10b981",
        inactiveBgColor: "#e5e7eb",
        activeTextColor: "#ffffff",
        completedTextColor: "#ffffff",
        inactiveTextColor: "#4b5563",
        size: "2rem",
        circleFontSize: "0.875rem",
        labelFontSize: "0.875rem",
        borderRadius: "50%",
      }}
      className="py-2"
    />
  );
};

export default MyStepper;
