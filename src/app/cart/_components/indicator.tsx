import Image from "next/image";
import React from "react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const stepsImg = [
    "images/icons/cart.png",
    "images/icons/address.png",
    "images/icons/credit-card.png",
    "images/icons/done.png",
  ];
  const stepsImg2 = [
    "images/icons/cart-2.png",
    "images/icons/address-2.png",
    "images/icons/credit-card-2.png",
    "images/icons/done-2.png",
  ];

  return (
    <div className="flex justify-center items-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {index !== 0 && (
            <div
              className={`border-t ${
                index <= currentStep ? "border-neutral" : "border-gray-400"
              } flex-1`}
            ></div>
          )}
          <div
            className={`h-9 w-16 rounded-xl flex items-center justify-center cursor-pointer ${
              index === currentStep ? "bg-neutral" : "bg-gray-200"
            }`}
            onClick={() => onStepClick(index)}
          >
            <Image
              src={index === currentStep ? stepsImg[index] : stepsImg2[index]}
              alt={step}
              className={`w-5 ${index !== currentStep ? "opacity-50" : ""}`}
              width={20}
              height={20}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
