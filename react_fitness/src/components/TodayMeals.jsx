import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Trash2, Calendar } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  font-family: "Poppins", sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }
`;

const DatePickerWrapper = styled.div`
  
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
`;

const CalendarIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #f5f5f5;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  border-radius: 12px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  gap: 12px;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
  font-family: 'Poppins';
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #76BA1B;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #4C9A2A;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TodayMeals = () => {
  const navigate = useNavigate();
  const [mealsByDate, setMealsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // Control DatePicker visibility
  const datePickerRef = useRef(null);

  useEffect(() => {
    const storedMeals = JSON.parse(localStorage.getItem("mealsByDate")) || {};
    setMealsByDate(storedMeals);
  }, []);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Check if selected date is today
  const isToday = formattedDate === new Date().toISOString().split("T")[0];

  const handleDeleteMeal = (mealName) => {
    if (!formattedDate) return;

    const updatedMeals = mealsByDate[formattedDate]?.filter((meal) => meal.name !== mealName);
    const newMealsByDate = { ...mealsByDate, [formattedDate]: updatedMeals };

    if (updatedMeals.length === 0) {
      delete newMealsByDate[formattedDate];
    }

    setMealsByDate(newMealsByDate);
    localStorage.setItem("mealsByDate", JSON.stringify(newMealsByDate));
  };

  return (
    <Container>
      <Title>Meal History</Title>

      <Section>
        {/* Date Picker with Calendar Icon for Today */}
        <DatePickerWrapper>
          <h2>{isToday ? "Today" : selectedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</h2>
          
          {/* Show Calendar Icon Instead of Input for Today */}
          <CalendarIconWrapper onClick={() => setShowDatePicker((prev) => !prev)}>
            <Calendar size={24} />
          </CalendarIconWrapper>

          {showDatePicker && (
            <StyledDatePicker
              ref={datePickerRef}
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setShowDatePicker(false);
              }}
              dateFormat="MMMM d, yyyy"
              maxDate={new Date()} // Prevent selecting future dates
              inline // Opens directly in UI
            />
          )}
        </DatePickerWrapper>

        <FoodList>
          {mealsByDate[formattedDate] && mealsByDate[formattedDate].length > 0 ? (
            mealsByDate[formattedDate].map((meal, index) => (
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

      <BackButton onClick={() => navigate("/calorieintake")}>Back</BackButton>
    </Container>
  );
};

export default TodayMeals;
