export const AD_FORMAT_OPTIONS = [
  { label: '사진 광고', value: 'photo' },
  { label: '동영상 광고', value: 'video' },
] as const;

export type AdFormat = (typeof AD_FORMAT_OPTIONS)[number]['value'];
