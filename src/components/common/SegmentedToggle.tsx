import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * 밑줄로 선택을 표시하는 세그먼트. 배경을 깔지 않아 결과물 미리보기와 경쟁하지 않는다.
 * 인디케이터는 항목 사이를 미끄러진다.
 */
const SegmentedToggle = <T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedToggleProps<T>): React.JSX.Element => {
  const activeIndex = Math.max(
    options.findIndex((option) => option.id === value),
    0,
  );

  return (
    <Track role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <Segment
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          $selected={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Segment>
      ))}
      <Indicator aria-hidden="true" $count={options.length} $index={activeIndex} />
    </Track>
  );
};

const Track = styled.div`
  position: relative;
  display: flex;
  box-shadow: inset 0 -1px 0 ${COLORS.border.main};
`;

const Segment = styled.button<{ $selected: boolean }>`
  flex: 1;
  min-height: 46px;
  color: ${({ $selected }) => ($selected ? COLORS.brand.main : COLORS.text.muted)};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
  transition: color 0.2s ease;
`;

const Indicator = styled.span<{ $count: number; $index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${({ $count }) => 100 / $count}%;
  height: 2px;
  background-color: ${COLORS.brand.main};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.28s cubic-bezier(0.2, 0.85, 0.25, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export default SegmentedToggle;
