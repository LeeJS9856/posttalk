import { useRef, useState } from 'react';
import styled from 'styled-components';

import playIcon from '@/assets/icons/play.svg?raw';
import { COLORS } from '@/constants/colors';

type VideoPreviewProps = {
  objectFit?: 'contain' | 'cover';
  videoSrc: string;
};

const VideoPreview = ({ objectFit = 'cover', videoSrc }: VideoPreviewProps): React.JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = async (): Promise<void> => {
    await videoRef.current?.play();
  };

  const handlePreviewClick = (): void => {
    if (isPlaying) {
      videoRef.current?.pause();
      return;
    }

    void play();
  };

  return (
    <Preview aria-label="동영상 광고 미리보기" onClick={handlePreviewClick}>
      <Video
        ref={videoRef}
        $objectFit={objectFit}
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={videoSrc} type="video/mp4" />
      </Video>
      {!isPlaying && (
        <PlayButton
          type="button"
          aria-label="동영상 재생"
          onClick={(event) => {
            event.stopPropagation();
            void play();
          }}
        >
          <PlayIcon aria-hidden="true" dangerouslySetInnerHTML={{ __html: playIcon }} />
        </PlayButton>
      )}
    </Preview>
  );
};

const Preview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  flex: 0 0 auto;
  overflow: hidden;
  background: ${COLORS.black200};
  cursor: pointer;
`;

const Video = styled.video<{ $objectFit: 'contain' | 'cover' }>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit};
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 80px;
  height: 80px;
  place-items: center;
  border: 0;
  color: ${COLORS.white};
  background: transparent;
  transform: translate(-50%, -50%);
`;

const PlayIcon = styled.span`
  display: grid;
  width: 49px;
  height: 56px;
  place-items: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export default VideoPreview;
