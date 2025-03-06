import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  padding: 20px;
  text-align: left;
  border-radius: 10px;
  width: 80%;
  margin: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProgressContainer = styled.div`
  position: relative;
  width: 100%;
  height: 15px;
  background: #e0e0e0;
  border-radius: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: #76BA1B;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
`;

const CalorieTracker = () => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [goalCalories, setGoalCalories] = useState(2000); // Default in case no setting

  useEffect(() => {
    // Fetch today's meals from localStorage
    const storedMeals = JSON.parse(localStorage.getItem("todaysMeals")) || [];
    const total = storedMeals.reduce((acc, meal) => acc + parseInt(meal.calories), 0);
    setTotalCalories(total);

    // Fetch user's calorie goal from localStorage (set by Profile Settings page)
    const storedGoal = localStorage.getItem("userCalorieGoal");
    if (storedGoal) {
      setGoalCalories(parseInt(storedGoal));
    }
  }, []);

  const progressPercentage = Math.min((totalCalories / goalCalories) * 100, 100); // Ensure max 100%

  return (
    <Container>
      <TopSection>
        <span>Total Calories</span>
        <span>{totalCalories} / {goalCalories}</span>
      </TopSection>
      <ProgressContainer>
        <ProgressBar percentage={progressPercentage} />
      </ProgressContainer>
    </Container>
  );
};

export default CalorieTracker;
