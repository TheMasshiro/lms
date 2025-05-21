const ActionButtons = (props) => {
  const handleBack = () => {
    if (props.currentStep > 1) {
      props.previousStep();
    }
  };

  const handleNext = () => {
    if (props.currentStep < props.totalSteps) {
      props.nextStep();
    }
  };

  const handleFinish = () => {
    props.onFinish();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-10">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between gap-4">
          {props.currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}
          <div className="ml-auto">
            {props.currentStep < props.totalSteps && (
              <button
                onClick={handleNext}
                disabled={!props.isStepValid}
                className={`px-6 py-2.5 font-medium rounded-md transition-colors ${
                  props.isStepValid
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                Next
              </button>
            )}
            {props.currentStep === props.totalSteps && (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
              >
                Submit Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;