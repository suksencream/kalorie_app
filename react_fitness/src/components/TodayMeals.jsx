import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  font-family: "Poppins", sans-serif;
  background-color: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.div`
  width: 70%;
  max-width: 600px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const DateText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const FoodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
`;

const FoodItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 10px;
  background: #f8f8f8;
  border: 1px solid #ddd;
  font-size: 16px;
  transition: background 0.3s;
  gap: 12px;

  &:hover {
    background: #f0f0f0;
  }
`;

const FoodDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const FoodImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: white;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const NoMealMessage = styled.p`
  text-align: center;
  color: #888;
  font-size: 16px;
  font-style: italic;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 12px 25px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background-color: darkorange;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TodayMeals = () => {
  const navigate = useNavigate();
  const [mealsByDate, setMealsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  // Format date to display "Today" for current day
  const formatDate = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return "Today";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem("mealsByDate")) || {};
    setMealsByDate(storedMeals);

    // Set today's date dynamically
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const handleDeleteMeal = (mealName) => {
    if (!selectedDate) return;

    const updatedMeals = mealsByDate[selectedDate]?.filter((meal) => meal.name !== mealName);
    const newMealsByDate = { ...mealsByDate, [selectedDate]: updatedMeals };

    if (updatedMeals.length === 0) {
      delete newMealsByDate[selectedDate];
    }

    setMealsByDate(newMealsByDate);
    localStorage.setItem("mealsByDate", JSON.stringify(newMealsByDate));
  };

  return (
    <Container>
      <Title>Meal History</Title>

      <Section>
        {/* Navigation for Back & Next */}
        <Navigation>
          <NavButton
            onClick={() => changeDate(-1)}
            disabled={selectedDate === getLast7Days()[6]}
          >
            <ChevronLeft size={28} />
          </NavButton>

          <DateText>{formatDate(selectedDate)}</DateText>

          <NavButton
            onClick={() => changeDate(1)}
            disabled={selectedDate === new Date().toISOString().split("T")[0]} // Prevents future dates
          >
            <ChevronRight size={28} />
          </NavButton>
        </Navigation>

        <FoodList>
          {mealsByDate[selectedDate] && mealsByDate[selectedDate].length > 0 ? (
            mealsByDate[selectedDate].map((meal, index) => (
              <FoodItem key={index}>
                <FoodImage src={meal.image} alt={meal.name} />
                <FoodDetails>
                  <div style={{ fontWeight: "bold" }}>{meal.name}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Protein: {meal.protein} | Carbs: {meal.carbs} | Fat: {meal.fat} | Calories: {meal.calories}
                  </div>
                </FoodDetails>
                <DeleteButton onClick={() => handleDeleteMeal(meal.name)}>
                  <Trash2 color="black" size={20} />
                </DeleteButton>
              </FoodItem>
            ))
          ) : (
            <NoMealMessage>No meals recorded for this day.</NoMealMessage>
          )}
        </FoodList>
      </Section>

      <BackButton onClick={() => navigate("/calories")}>Back</BackButton>
    </Container>
  );
};

export default TodayMeals;
