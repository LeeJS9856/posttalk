import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

type PromotionCardProps = { image?: string; title?: string; onClick: () => void };

const PromotionCard = ({ image, title, onClick }: PromotionCardProps): React.JSX.Element => {
  if (!image)
    return (
      <AddCard type="button" aria-label="새 광고 만들기" onClick={onClick}>
        +
      </AddCard>
    );

  return (
    <ImageCard type="button" onClick={onClick}>
      <img src={image} alt={`${title ?? '홍보물'} 미리보기`} />
    </ImageCard>
  );
};

const CardBase = styled.button`
  width: 180px;
  height: 180px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 14px;
  cursor: pointer;
`;

const AddCard = styled(CardBase)`
  display: grid;
  place-items: center;
  border: 2px dashed ${COLORS.primary};
  padding: 0;
  color: ${COLORS.primary};
  background: transparent;
  font-size: 58px;
  font-weight: 400;
  line-height: 1;
`;

const ImageCard = styled(CardBase)`
  border: 0;
  padding: 0;
  background: ${COLORS.white};
  box-shadow: 0 4px 14px rgba(33, 33, 33, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default PromotionCard;
