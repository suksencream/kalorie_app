import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const BunTop = styled.div`
  width: 300px;
  height: 105px;
  background: linear-gradient(to bottom, #d79d55, #c47d30);
  border-radius: 150px 150px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  overflow: hidden;
  cursor: pointer; /* Clickable */
`;

const Seed = styled.div`
  width: 8px;
  height: 4px;
  background: #f8e4c0;
  border-radius: 50%;
  position: absolute;
  transform: rotate(${props => props.rotate || 0}deg);
`;

const BurgerLayer = styled.div`
  width: 340px;
  height: ${props => props.height || '28px'};
  background: ${props => props.color};
  border-radius: 12px;
  margin: 3px 0;
`;

const BurgerLayout = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '30px',
        cursor: 'pointer',
      }}
      onClick={() => navigate('/calorieintake')} // Navigates when clicked
    >
      <BunTop>
        {/* Correct Seed Placement from Figma */}
        <Seed style={{ top: '18px', left: '70px', rotate: '-15deg' }} />
        <Seed style={{ top: '28px', left: '110px', rotate: '10deg' }} />
        <Seed style={{ top: '20px', left: '150px', rotate: '-12deg' }} />
        <Seed style={{ top: '32px', left: '190px', rotate: '15deg' }} />
        <Seed style={{ top: '24px', left: '230px', rotate: '-18deg' }} />
        <Seed style={{ top: '30px', left: '270px', rotate: '12deg' }} />
      </BunTop>

      {/* Burger Layers */}
      <BurgerLayer color="#4CAF50" height="35px" /> {/* Breakfast */}
      <BurgerLayer color="#5D4037" height="35px" /> {/* Lunch */}
      <BurgerLayer color="#d79d55" height="25px" /> {/* Snacks */}
      <BurgerLayer color="#BDBDBD" height="0px" /> {/* Dinner */}
    </div>
  );
};

export default BurgerLayout;
