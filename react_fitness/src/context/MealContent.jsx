import React, { createContext, useState, useContext } from "react";

const MealContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMealContext = () => {
  return useContext(MealContext);
};

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState({
    breakfast: 300,
    lunch: 600,
    snacks: 200,
    dinner: 500,
  });

  return (
    <MealContext.Provider value={{ meals, setMeals }}>
      {children}
    </MealContext.Provider>
  );
};
