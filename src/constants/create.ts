export const AD_FORMAT_OPTIONS = [
  { label: '사진 광고', value: 'photo' },
  { label: '동영상 광고', value: 'video' },
] as const;

export type AdFormat = (typeof AD_FORMAT_OPTIONS)[number]['value'];

export const PHOTO_PREVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=960&q=85',
] as const;

export const VIDEO_PREVIEW_SOURCE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
