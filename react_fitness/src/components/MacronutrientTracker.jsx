import React, { useState, useEffect } from "react";
import styled from "styled-components";

const MacroContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

const RingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  min-width: 100px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  font-family: "Poppins", sans-serif;
  color: ${(props) => props.color};
`;

const SVGCircle = styled.svg`
  transform: rotate(-90deg);
`;

const InnerText = styled.div`
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #006400;
`;

const CompletedText = styled.div`
  font-size: 12px;
  font-weight: normal;
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #006400;
`;

const ProgressRing = ({ percentage, color, label }) => {
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <RingContainer>
      <Label color={color}>{label}</Label>
      <SVGCircle width="90" height="90">
        <circle cx="45" cy="45" r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="transparent" />
        <circle
          cx="45"
          cy="45"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </SVGCircle>
      <InnerText>{Math.round(percentage)}%</InnerText> {/* Round percentage */}
      <CompletedText>Completed</CompletedText>
    </RingContainer>
  );
};

const MacronutrientTracker = () => {
  const [totals, setTotals] = useState({ fats: 0, carbs: 0, proteins: 0 });

  const defaultGoals = {
    fats: 70, // Default fat goal
    carbs: 200, // Default carb goal
    proteins: 100, // Default protein goal
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const storedMeals = JSON.parse(localStorage.getItem("mealsByDate")) || {};
    const todayMeals = storedMeals[today] || [];

    const totalFats = todayMeals.reduce((acc, meal) => acc + parseInt(meal.fat), 0);
    const totalCarbs = todayMeals.reduce((acc, meal) => acc + parseInt(meal.carbs), 0);
    const totalProteins = todayMeals.reduce((acc, meal) => acc + parseInt(meal.protein), 0);

    // Fetch user macro goals (set in profile settings)
    const storedGoals = JSON.parse(localStorage.getItem("userMacroGoals")) || defaultGoals;

    setTotals({
      fats: Math.round((totalFats / storedGoals.fats) * 100),
      carbs: Math.round((totalCarbs / storedGoals.carbs) * 100),
      proteins: Math.round((totalProteins / storedGoals.proteins) * 100),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MacroContainer>
      <ProgressRing percentage={totals.fats} color="#FFD700" label="Fats" />
      <ProgressRing percentage={totals.carbs} color="#FFA500" label="Carbs" />
      <ProgressRing percentage={totals.proteins} color="#FF0000" label="Proteins" />
    </MacroContainer>
  );
};

export default MacronutrientTracker;
