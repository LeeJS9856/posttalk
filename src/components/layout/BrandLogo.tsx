import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

type BrandLogoProps = {
  /** 심볼 한 변의 길이(px). 글자 크기는 여기에 맞춰 따라간다. */
  size?: number;
};

/**
 * 말풍선(Talk) 안에 사진(Post).
 * 머리 띠에서 24px 로 서기 때문에 모양은 세 개뿐이다.
 * 풍경이나 산 같은 잔 디테일을 넣으면 그 크기에서 뭉개진다.
 */
const BrandLogo = ({ size = 24 }: BrandLogoProps): React.JSX.Element => (
  <Wrap $size={size} aria-label="PostTalk">
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <path
        d="M3.5 11.5A7 7 0 0 1 10.5 4.5h19a7 7 0 0 1 7 7v11a7 7 0 0 1-7 7H19l-7.6 6.2A1.7 1.7 0 0 1 8.6 34.4V29.2A7 7 0 0 1 3.5 22.5Z"
        fill={COLORS.brand.main}
      />
      <rect x="10.5" y="10.5" width="19" height="13" rx="4" fill={COLORS.white} />
      <circle cx="20" cy="17" r="3.6" fill={COLORS.brand.main} />
    </svg>
    <Wordmark $size={size}>PostTalk</Wordmark>
  </Wrap>
);

export default BrandLogo;

const Wrap = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => Math.round($size * 0.3)}px;
`;

const Wordmark = styled.span<{ $size: number }>`
  font-family: 'Gabarito', system-ui, sans-serif;
  font-size: ${({ $size }) => Math.round($size * 0.82)}px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${COLORS.text.main};
  line-height: 1;
`;
