import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const stack = keyframes`
  0% { transform: translateY(100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: white;
  font-family: 'Poppins', sans-serif;
  text-align: center;
`;

const LoadingText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: green;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
`;

const BurgerLayer = styled.div`
  width: 360px;
  height: ${(props) => props.height || '28px'};
  background: ${(props) => props.color};
  border-radius: ${(props) => (props.topLayer ? '150px 150px 0 0' : '12px')};
  margin: 3px 0;
  opacity: 0;
  animation: ${stack} 0.5s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const LoadingPage = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      navigate('/calories');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <LoadingContainer>
      <BurgerLayer color="#d79d55" height="105px" topLayer delay={2.9} />
      <BurgerLayer color="#4CAF50" height="40px" delay={2.1} />
      <BurgerLayer color="#5D4037" height="40px" delay={1.3} />
      <BurgerLayer color="#d79d55" height="40px" delay={0.5} />
      <LoadingText></LoadingText>
      <LoadingText>Preparing your burger...</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingPage;
