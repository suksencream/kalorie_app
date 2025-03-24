import { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: auto;
  font-family: "Poppins", sans-serif;
`;

const Toggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    background: #eee;
    cursor: pointer;
    font-weight: bold;

    &.active {
      background-color: #4caf50;
      color: white;
    }
  }
`;

const MacroContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 30px;
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
  color: #006400;
`;

// Move defaultGoals outside the component
const DEFAULT_GOALS = {
  fats: 70,
  carbs: 200,
  proteins: 100,
  calories: 2000,
};

const ProgressRing = ({ percentage, color, label, total, unit }) => {
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
      <InnerText>{Math.round(percentage)}%</InnerText>
      <div style={{ marginTop: "8px", fontSize: "14px", color: "#333" }}>
        Total: {total} {unit}
      </div>
    </RingContainer>
  );
};

ProgressRing.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired
};

const WeeklyMonthlyReport = () => {
  const [view, setView] = useState("weekly");
  const [data, setData] = useState([]);
  const [macroTotals, setMacroTotals] = useState({
    fats: 0,
    carbs: 0,
    proteins: 0,
    calories: 0,
  });
  const [macroAverages, setMacroAverages] = useState({
    fats: 0,
    carbs: 0,
    proteins: 0,
    calories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const getDateRangeLabel = (start, end) =>
    `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;

  const fetchMealsForDateRange = async (startDate, endDate) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return [];
    }

    try {
      const response = await fetch(`http://localhost:5000/api/food-intake?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching meals:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const storedGoals = JSON.parse(localStorage.getItem("userMacroGoals")) || DEFAULT_GOALS;
      const chartData = [];
      let totalFats = 0,
        totalCarbs = 0,
        totalProteins = 0,
        totalCalories = 0;

      if (view === "weekly") {
        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return formatDate(d);
        });

        const startDate = last7Days[0];
        const endDate = last7Days[6];
        const meals = await fetchMealsForDateRange(startDate, endDate);

        // Group meals by date
        const mealsByDate = {};
        meals.forEach(meal => {
          const date = formatDate(new Date(meal.date));
          if (!mealsByDate[date]) {
            mealsByDate[date] = [];
          }
          mealsByDate[date].push(meal);
        });

        last7Days.forEach((date) => {
          const dayMeals = mealsByDate[date] || [];
          let calories = 0,
            fats = 0,
            carbs = 0,
            proteins = 0;

          dayMeals.forEach((meal) => {
            calories += parseFloat(meal.calories) || 0;
            fats += parseFloat(meal.fats) || 0;
            carbs += parseFloat(meal.carbs) || 0;
            proteins += parseFloat(meal.protein) || 0;
          });

          chartData.push({
            date,
            label: date,
            calories,
            fats,
            carbs,
            proteins,
          });

          totalCalories += calories;
          totalFats += fats;
          totalCarbs += carbs;
          totalProteins += proteins;
        });

        setMacroAverages({
          fats: (totalFats / (storedGoals.fats * 7)) * 100,
          carbs: (totalCarbs / (storedGoals.carbs * 7)) * 100,
          proteins: (totalProteins / (storedGoals.proteins * 7)) * 100,
          calories: (totalCalories / (storedGoals.calories * 7)) * 100,
        });
      }

      if (view === "monthly") {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);

        const dates = [];
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }

        const meals = await fetchMealsForDateRange(formatDate(startDate), formatDate(today));

        // Group meals by date
        const mealsByDate = {};
        meals.forEach(meal => {
          const date = formatDate(new Date(meal.date));
          if (!mealsByDate[date]) {
            mealsByDate[date] = [];
          }
          mealsByDate[date].push(meal);
        });

        for (let i = 0; i < dates.length; i += 7) {
          const weekChunk = dates.slice(i, i + 7);
          let calories = 0,
            fats = 0,
            carbs = 0,
            proteins = 0;

          weekChunk.forEach((date) => {
            const dateStr = formatDate(date);
            const dayMeals = mealsByDate[dateStr] || [];

            dayMeals.forEach((meal) => {
              calories += parseFloat(meal.calories) || 0;
              fats += parseFloat(meal.fats) || 0;
              carbs += parseFloat(meal.carbs) || 0;
              proteins += parseFloat(meal.protein) || 0;
            });
          });

          const start = weekChunk[0];
          const end = weekChunk[weekChunk.length - 1];

          chartData.push({
            label: `Week ${chartData.length + 1}`,
            tooltipLabel: getDateRangeLabel(start, end),
            calories,
            fats,
            carbs,
            proteins,
          });

          totalCalories += calories;
          totalFats += fats;
          totalCarbs += carbs;
          totalProteins += proteins;
        }

        const numWeeks = Math.ceil(dates.length / 7);
        setMacroAverages({
          fats: (totalFats / (storedGoals.fats * numWeeks * 7)) * 100,
          carbs: (totalCarbs / (storedGoals.carbs * numWeeks * 7)) * 100,
          proteins: (totalProteins / (storedGoals.proteins * numWeeks * 7)) * 100,
          calories: (totalCalories / (storedGoals.calories * numWeeks * 7)) * 100,
        });
      }

      setData(chartData);
      setMacroTotals({ fats: totalFats, carbs: totalCarbs, proteins: totalProteins, calories: totalCalories });
      setIsLoading(false);
    };

    // Initial fetch
    fetchData();

    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [view]);

  return (
    <Container>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Weekly & Monthly Report</h2>

      <Toggle>
        <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>
          Weekly
        </button>
        <button className={view === "monthly" ? "active" : ""} onClick={() => setView("monthly")}>
          Monthly
        </button>
      </Toggle>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>Loading data...</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis label={{ value: "Amount (g / kcal)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(label, payload) => {
                  if (!payload || payload.length === 0) return label;
                  return payload[0].payload.tooltipLabel || label;
                }}
              />
              <Legend />
              <Bar dataKey="fats" stackId="a" fill="#FFD700" name="Fats" />
              <Bar dataKey="carbs" stackId="a" fill="#FFA500" name="Carbs" />
              <Bar dataKey="proteins" stackId="a" fill="#FF0000" name="Proteins" />
              <Bar dataKey="calories" stackId="a" fill="#4CAF50" name="Calories" />
            </BarChart>
          </ResponsiveContainer>

          <MacroContainer>
            <ProgressRing percentage={macroAverages.fats} color="#FFD700" label="Fats" total={macroTotals.fats} unit="g" />
            <ProgressRing percentage={macroAverages.carbs} color="#FFA500" label="Carbs" total={macroTotals.carbs} unit="g" />
            <ProgressRing percentage={macroAverages.proteins} color="#FF0000" label="Proteins" total={macroTotals.proteins} unit="g" />
            <ProgressRing percentage={macroAverages.calories} color="#4CAF50" label="Calories" total={macroTotals.calories} unit="kcal" />
          </MacroContainer>
        </>
      )}
    </Container>
  );
};

export default WeeklyMonthlyReport;
