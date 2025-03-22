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
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const datePickerRef = useRef(null);

  const fetchMealsForDate = async (date) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      setIsLoading(true);
      // Ensure date is in YYYY-MM-DD format and represents start of day in local timezone
      const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        .toISOString().split('T')[0];

      console.log('🔍 Frontend - Fetching meals:', {
        formattedDate,
        originalDate: date,
        tokenExists: !!token
      });

      const response = await fetch(`http://localhost:5000/api/food-intake?date=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📦 Fetched meals:', data);
      setMeals(data);
    } catch (error) {
      console.error('❌ Error fetching meals:', error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchMealsForDate(new Date());
  }, []);

  const handleDeleteMeal = async (meal) => {
    if (!meal._id) {
      console.error('No meal ID found');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/food-intake/${meal._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      // Update the meals list after successful deletion
      setMeals(currentMeals => currentMeals.filter(m => m._id !== meal._id));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  return (
    <Container>
      <Title>Meal History</Title>

      <Section>
        <DatePickerWrapper>
          <h2>
            {selectedDate.toLocaleDateString(undefined, { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </h2>
          
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
              maxDate={new Date()}
              inline
            />
          )}
        </DatePickerWrapper>

        <FoodList>
          {isLoading ? (
            <div>Loading meals...</div>
          ) : meals && meals.length > 0 ? (
            meals.map((meal) => (
              <FoodItem key={meal._id}>
                <FoodImage 
                  src={meal.image || '/default-food.png'} 
                  alt={meal.foodName}
                  onError={(e) => {
                    e.target.src = '/default-food.png';
                  }}
                />
                <FoodDetails>
                  <div style={{ fontWeight: "bold" }}>{meal.foodName}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fats}g | Calories: {meal.calories}
                  </div>
                </FoodDetails>
                <DeleteButton onClick={() => handleDeleteMeal(meal)}>
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