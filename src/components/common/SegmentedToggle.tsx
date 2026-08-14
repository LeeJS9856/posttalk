import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export type SegmentedToggleOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string;
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const SegmentedToggle = <T extends string,>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedToggleProps<T>): React.JSX.Element => {
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );

  return (
    <Toggle aria-label={ariaLabel} $optionCount={options.length}>
      <ToggleIndicator $selectedIndex={selectedIndex} $optionCount={options.length} aria-hidden="true" />
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <ToggleButton
            key={option.value}
            type="button"
            $selected={isSelected}
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </Toggle>
  );
};

const Toggle = styled.div<{ $optionCount: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $optionCount }) => $optionCount}, 1fr);
  gap: 4px;
  width: 100%;
  max-width: 256px;
  margin: 12px auto 0;
  padding: 4px;
  border-radius: 28px;
  background: ${COLORS.primary200};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.12);
`;

const ToggleIndicator = styled.span<{ $selectedIndex: number; $optionCount: number }>`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: ${({ $optionCount }) => `calc((100% - ${8 + ($optionCount - 1) * 4}px) / ${$optionCount})`};
  border-radius: 22px;
  background: ${COLORS.primary};
  transform: ${({ $selectedIndex }) => `translateX(calc(${$selectedIndex * 100}% + ${$selectedIndex * 4}px))`};
  transition: transform 220ms ease-out;
`;

const ToggleButton = styled.button<{ $selected: boolean }>`
  position: relative;
  z-index: 1;
  height: 40px;
  border: 0;
  border-radius: 22px;
  color: ${({ $selected }) => ($selected ? COLORS.white : COLORS.black400)};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  transition: color 180ms ease-out;
`;

export default SegmentedToggle;
