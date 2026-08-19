import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { SWIPE_THRESHOLD } from '@/constants/ui';

type PhotoPreviewCarouselProps = {
  images: readonly string[];
};

const PhotoPreviewCarousel = ({ images }: PhotoPreviewCarouselProps): React.JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const moveTo = (nextIndex: number): void => {
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), images.length - 1));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>): void => {
    if (pointerStart.current === null) return;

    const distanceX = event.clientX - pointerStart.current.x;
    const distanceY = event.clientY - pointerStart.current.y;
    if (distanceX <= -SWIPE_THRESHOLD) moveTo(currentIndex + 1);
    if (distanceX >= SWIPE_THRESHOLD) moveTo(currentIndex - 1);
    if (Math.abs(distanceX) < 8 && Math.abs(distanceY) < 8) setIsLightboxOpen(true);
    pointerStart.current = null;
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
        pointerStart.current = null;
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
      {isLightboxOpen && createPortal(
        <Lightbox role="dialog" aria-modal="true" aria-label="사진 원본 비율 미리보기" onClick={() => setIsLightboxOpen(false)}>
          <LightboxImage src={images[currentIndex]} alt={`사진 광고 원본 비율 ${currentIndex + 1}`} onClick={(event) => event.stopPropagation()} />
        </Lightbox>,
        document.body,
      )}
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

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
`;

const LightboxImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export default PhotoPreviewCarousel;
