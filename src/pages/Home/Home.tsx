import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

const Home = (): React.JSX.Element => {
  return (
    <HomeContainer>
      <Title>PostTalk</Title>
    </HomeContainer>
  );
};

const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100svh;
  background-color: ${COLORS.background.main};
`;

const Title = styled.h1`
  color: ${COLORS.brand.primary};
`;

export default Home;
