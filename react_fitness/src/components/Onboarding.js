import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './onboardingtour.css';

const OnboardingTour = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const newUser = localStorage.getItem('newUser');
    if (newUser === 'true') {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (step === steps.length - 1) {
      setShowTour(false);
      localStorage.setItem('newUser', 'false');
    } else {
      setStep(step + 1);
    }
  };

  const handleExit = () => {
    setShowTour(false);
    localStorage.setItem('newUser', 'false');
  };

  const steps = [
    {
      message: "Welcome to Our Burger! We'll show you how to set up your account and use our app.",
      button1: "I am ready!",
      action: () => setStep(step + 1),
    },
    {
      message: "Click here! First, you need to set up your profile here. We will calculate your target calorie according to your goal.",
      target: "sidebar-profile",
      button1: "Next",
      button2: "Exit Tour",
      action: () => navigate('/setting'),
    },
    {
      message: "You can check your calories consumed together with Fats, Carbs, and Proteins here.",
      target: "calories-tab",
      button1: "Next",
      button2: "Exit Tour",
      action: () => navigate('/calories'),
    },
    {
      message: "You can calculate your BMI here.",
      target: "bmi-tab",
      button1: "Next",
      button2: "Exit Tour",
      action: () => navigate('/bmi'),
    },
    {
      message: "Here, we will suggest you some exercises that might help your fitness journey.",
      target: "fitness-tab",
      button1: "Ready!",
      action: handleExit,
    }
  ];

  if (!showTour) return null;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-tooltip" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <p>{steps[step].message}</p>
        <div className="onboarding-buttons">
          <button className="onboarding-button" onClick={steps[step].action}>{steps[step].button1}</button>
          {steps[step].button2 && <button className="onboarding-skip" onClick={handleExit}>{steps[step].button2}</button>}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
