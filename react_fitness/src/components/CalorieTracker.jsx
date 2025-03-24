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
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  background: ${({ percentage }) => (percentage > 100 ? "#cd071e" : "#76ba1b")};
  border-radius: 10px;
  transition: width 0.5s ease-in-out, background 0.5s ease-in-out;
`;

const CalorieTracker = () => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [goalCalories, setGoalCalories] = useState(2000);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodaysMeals = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

    try {
      setIsLoading(true);
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:5000/api/food-intake?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      const meals = await response.json();
      console.log('📊 Fetched meals for calories:', meals);

      // Calculate total calories from all meals
      const total = meals.reduce((acc, meal) => acc + (parseFloat(meal.calories) || 0), 0);
      console.log('🔢 Total calories calculated:', total);
      setTotalCalories(total);

      // Get user's calorie goal from localStorage or use default
      const storedGoal = localStorage.getItem("userCalorieGoal");
      if (storedGoal) {
        setGoalCalories(parseInt(storedGoal));
      }

    } catch (error) {
      console.error('Error fetching calories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch meals when component mounts
  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  // Add a refresh interval to update calories every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodaysMeals();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (totalCalories / goalCalories) * 100;

  return (
    <Container>
      <TopSection>
        <div>Total Calories</div>
        <div>{Math.round(totalCalories)} / {goalCalories}</div>
      </TopSection>
      <ProgressContainer>
        <ProgressBar percentage={progressPercentage} />
      </ProgressContainer>
    </Container>
  );
};

export default CalorieTracker;
