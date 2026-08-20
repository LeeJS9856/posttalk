import photoExample1 from '@/assets/photo-ex1.jpg';
import photoExample2 from '@/assets/photo-ex2.jpg';
import photoExample3 from '@/assets/photo-ex3.jpg';
import photoExample4 from '@/assets/photo-ex4.jpg';
import videoExample from '@/assets/video-ex.mp4';

export const AD_FORMAT_OPTIONS = [
  { label: '사진 광고', value: 'photo' },
  { label: '동영상 광고', value: 'video' },
] as const;

export type AdFormat = (typeof AD_FORMAT_OPTIONS)[number]['value'];

export const PHOTO_PREVIEW_IMAGES = [
  photoExample1,
  photoExample2,
  photoExample3,
  photoExample4,
] as const;

export const VIDEO_PREVIEW_SOURCE = videoExample;
