import { useState, useEffect } from "react";
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
  font-size: 11px;
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
  const progress = (Math.min(percentage, 100) / 100) * circumference;

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
  const [isLoading, setIsLoading] = useState(true);

  const defaultGoals = {
    fats: 70,    // Default fat goal in grams
    carbs: 200,  // Default carb goal in grams
    proteins: 100 // Default protein goal in grams
  };

  const fetchTodaysMeals = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

    try {
      setIsLoading(true);
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
      console.log('📊 Fetched meals for macros:', meals);

      // Calculate totals with detailed logging
      let totalFats = 0;
      let totalCarbs = 0;
      let totalProteins = 0;

      meals.forEach((meal, index) => {
        console.log(`Meal ${index + 1}:`, {
          name: meal.foodName,
          fats: meal.fats,
          carbs: meal.carbs,
          protein: meal.protein
        });

        totalFats += parseFloat(meal.fats) || 0;
        totalCarbs += parseFloat(meal.carbs) || 0;
        totalProteins += parseFloat(meal.protein) || 0;
      });

      console.log('📈 Calculated totals:', {
        fats: totalFats,
        carbs: totalCarbs,
        proteins: totalProteins
      });

      // Get user's macro goals
      const storedGoals = JSON.parse(localStorage.getItem("userMacroGoals")) || defaultGoals;

      // Calculate and set percentages
      setTotals({
        fats: Math.round((totalFats / storedGoals.fats) * 100),
        carbs: Math.round((totalCarbs / storedGoals.carbs) * 100),
        proteins: Math.round((totalProteins / storedGoals.proteins) * 100)
      });

    } catch (error) {
      console.error('Error fetching macros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch meals when component mounts
  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  // Add a refresh interval to update macros every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodaysMeals();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Loading macronutrients...</div>;
  }

  return (
    <MacroContainer>
      <ProgressRing percentage={totals.fats} color="#FFD700" label="Fats" />
      <ProgressRing percentage={totals.carbs} color="#FFA500" label="Carbs" />
      <ProgressRing percentage={totals.proteins} color="#FF0000" label="Proteins" />
    </MacroContainer>
  );
};

export default MacronutrientTracker;
