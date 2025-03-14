import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Animation for jumping effect
const jump = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const BubbleContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  position: absolute;
  margin-left: 35%;
  top: 20px;
  background: #76BA1B;
  color: white;
  border: 2px solid #388E3C;
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 15px solid #76BA1B;
  }
`;

const JumpingBurger = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  cursor: pointer;
  animation: ${jump} 1.5s infinite;
  position: relative;
`;

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
    <JumpingBurger onClick={() => navigate('/calorieintake')}>
      <BunTop>
        <Seed style={{ top: '18px', left: '70px', rotate: '-15deg' }} />
        <Seed style={{ top: '28px', left: '110px', rotate: '10deg' }} />
        <Seed style={{ top: '20px', left: '150px', rotate: '-12deg' }} />
        <Seed style={{ top: '32px', left: '190px', rotate: '15deg' }} />
        <Seed style={{ top: '24px', left: '230px', rotate: '-18deg' }} />
        <Seed style={{ top: '30px', left: '270px', rotate: '12deg' }} />
      </BunTop>
      <BurgerLayer color="#76BA1B" height="35px" />
      <BurgerLayer color="#5D4037" height="35px" />
      <BurgerLayer color="#d79d55" height="25px" />
      <BurgerLayer color="#BDBDBD" height="0px" />
      <BubbleContainer>Tap Me!</BubbleContainer>
    </JumpingBurger>
  );
};

export default BurgerLayout;
