import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

type PhotoPreviewCarouselProps = {
  images: readonly string[];
};

const SWIPE_THRESHOLD = 48;

const PhotoPreviewCarousel = ({ images }: PhotoPreviewCarouselProps): React.JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const moveTo = (nextIndex: number): void => {
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), images.length - 1));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>): void => {
    if (startX.current === null) return;

    const distance = event.clientX - startX.current;
    if (distance <= -SWIPE_THRESHOLD) moveTo(currentIndex + 1);
    if (distance >= SWIPE_THRESHOLD) moveTo(currentIndex - 1);
    startX.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowLeft') moveTo(currentIndex - 1);
    if (event.key === 'ArrowRight') moveTo(currentIndex + 1);
  };

  return (
    <Carousel
      role="region"
      aria-roledescription="carousel"
      aria-label="사진 광고 미리보기"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={() => {
        startX.current = null;
      }}
    >
      <Track $currentIndex={currentIndex}>
        {images.map((image, index) => (
          <Slide key={image} aria-hidden={index !== currentIndex}>
            <img src={image} alt={`임시 사진 광고 ${index + 1}`} draggable={false} />
          </Slide>
        ))}
      </Track>
      <Pagination aria-label={`총 ${images.length}장 중 ${currentIndex + 1}번째 사진`}>
        {images.map((image, index) => (
          <Dot key={image} $active={index === currentIndex} aria-hidden="true" />
        ))}
      </Pagination>
    </Carousel>
  );
};

const Carousel = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  flex: 0 0 auto;
  overflow: hidden;
  background: ${COLORS.black200};
  touch-action: pan-y;
  user-select: none;

  &:focus-visible {
    outline: 3px solid ${COLORS.primary};
    outline-offset: -3px;
  }
`;

const Track = styled.div<{ $currentIndex: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${({ $currentIndex }) => `${-$currentIndex * 100}%`});
  transition: transform 260ms ease-out;
`;

const Slide = styled.div`
  width: 100%;
  height: 100%;
  flex: 0 0 100%;

  img {
    width: 100%;
    height: 100%;
    pointer-events: none;
    object-fit: cover;
  }
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 14px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 7px;
  transform: translateX(-50%);
`;

const Dot = styled.span<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? COLORS.primary : 'rgba(255, 255, 255, 0.94)')};
  box-shadow: 0 1px 3px rgba(33, 33, 33, 0.18);
  transition: background 180ms ease-out;
`;

export default PhotoPreviewCarousel;
