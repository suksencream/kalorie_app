import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const todayMealsIcon = "/todaymeal.png";
const eggImage = "/egg.png";

// Recommended meals list
//const recommendedMeals = [
//  { name: "Hard-boiled egg (large)", protein: "6g", carbs: "0.6g", fat: "5g", calories: "70", image: eggImage },
//  { name: "Fried Eggs", protein: "7g", carbs: "1g", fat: "6g", calories: "90", image: eggImage },
//  { name: "Egg Salad", protein: "8g", carbs: "2g", fat: "9g", calories: "120", image: eggImage },
 // { name: "Egg Fried Rice", protein: "9g", carbs: "20g", fat: "10g", calories: "250", image: eggImage }
//];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  background-color: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: 70%;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #76BA1B;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background-color: #4C9A2A;
  }
`;

const RecentSearchesDropdown = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  display: ${({ show }) => (show ? "block" : "none")};
  z-index: 10;
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f8f8f8;
  }
`;

const ClockIcon = styled(Clock)`
  margin-right: 10px;
  color: gray;
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: color 0.3s, transform 0.2s;
  &:hover {
    color: #76BA1B;
    transform: scale(1.15);
  }
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  align-self: flex-start;
  padding-left: 15%;
  @media (max-width: 768px) {
    padding-left: 5%;
    font-size: 18px;
  }
`;

const FoodList = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const FoodItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: white;
  border: 1px solid #ddd;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;

const FoodImage = styled.img`
  width: 50px;
  height: 50px;
`;

const CalorieTab = () => {
  const navigate = useNavigate();
  const [showRecent, setShowRecent] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [ recommendedMeals, setRecommendedMeals ] = useState([]);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleMealClick = (meal) => {
    setSearchInput(meal.name);
    setShowRecent(false);
    setSelectedMeal(meal);

    const updatedSearches = [meal, ...recentSearches.filter((item) => item.name !== meal.name)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/food?query=${searchInput}`, {
        method: 'GET',
      })
      const resObj = await response.json()
      console.log(resObj)      
      setRecommendedMeals(resObj)
    } catch (error) {
      console.error(`Error fetching data ${error.message}`)
    }
  }

  const handleAddToMeals = async () => {
    if (!selectedMeal) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error('No access token found');
        return;
    }

    try {
        const parseNutrient = (value) => {
            if (typeof value === 'string') {
                return parseFloat(value.replace('g', '')) || 0;
            }
            return parseFloat(value) || 0;
        };

        // Get current date in ISO format
        const currentDate = new Date().toISOString();
        
        console.log('💾 Saving meal:', {
            meal: selectedMeal,
            date: currentDate,
            tokenExists: !!token
        });

        const response = await fetch('http://localhost:5000/api/food-intake', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                foodName: selectedMeal.name,
                calories: parseFloat(selectedMeal.calories) || 0,
                protein: parseNutrient(selectedMeal.protein),
                carbs: parseNutrient(selectedMeal.carbs),
                fats: parseNutrient(selectedMeal.fat),
                image: selectedMeal.image || '',
                date: currentDate
            })
        });

        const data = await response.json();
        console.log('✅ Meal saved successfully:', data);
        
        setSelectedMeal(null);
        setSearchInput("");

    } catch (error) {
        console.error('❌ Error saving meal:', error);
    }
  };

  return (
    <Container>
      <Title>Food Log</Title>

      {/* Search Bar */}
      <SearchBarContainer>
        <form onSubmit={handleSubmit}>
        <SearchBar
          type="text"
          placeholder="Search for meals..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowRecent(true)}
          onBlur={() => setTimeout(() => setShowRecent(false), 200)}
        />
        
        </form>

        <RecentSearchesDropdown show={showRecent}>
          {recentSearches.map((meal, index) => (
            <RecentItem key={index} onClick={() => handleMealClick(meal)}>
              <ClockIcon size={18} />
              {meal.name}
            </RecentItem>
          ))}
        </RecentSearchesDropdown>
      </SearchBarContainer>

      {/* Show Add Button when a meal is selected */}
      {selectedMeal && <AddButton onClick={handleAddToMeals}>Add</AddButton>}

      {/* Today's Meals */}
      <CategoryContainer>
        <Category onClick={() => navigate("/today-meals")}>
          <Icon src={todayMealsIcon} alt="Today's Meals" />
          Today's Meals
        </Category>
      </CategoryContainer>

      {/* Recommended Meals */}
      <SectionTitle>Recommended</SectionTitle>
      <FoodList>
        {recommendedMeals.map((meal, index) => (
          <FoodItem key={index} onClick={() => handleMealClick(meal)}>
            <FoodImage src={meal.image} alt={meal.name} />
            <div>
              <div style={{ fontWeight: "bold" }}>{meal.name}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Protein: {meal.protein} | Carbs: {meal.carbs} | Fat: {meal.fat} | Calories: {meal.calories}
              </div>
            </div>
          </FoodItem>
        ))}
      </FoodList>
    </Container>
  );
};

export default CalorieTab;