import React from "react";

const WizardStepper = ({ currentStep, setCurrentStep }) => {
  const wzGoto = (step) => {
    setCurrentStep(step);
  };

  const STEPS = [
    { num: 1, label: "Cliente" },
    { num: 2, label: "Serviços" },
    { num: 3, label: "Detalhes" },
    { num: 4, label: "Pagamento" },
    { num: 5, label: "Resumo" },
  ];

  return (
    <div className="wz-bar">
      {STEPS.map((element, index) => (
        <React.Fragment key={index}>
          <button
            className={`wz-step ${currentStep === element.num - 1 ? "active" : ""}`}
            key={index}
            onClick={() => wzGoto(index)}
          >
            <div className="wz-step-num">{element.num}</div>
            <div className="wz-step-label">{element.label}</div>
          </button>
          {STEPS.length != index + 1 ? (
            <div className="wz-connector"></div>
          ) : (
            ""
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WizardStepper;
