export const VIDEO_CAPTURE_DURATION_MS = 2500;
export const MIN_VIDEO_DURATION_SECONDS = 2;

export const getVideoCaptureSteps = (menuIntro: string) => [
  { title: '가게 입구에서 안으로 들어가는 모습', helperText: '가게 입구에서 안으로 들어가는 모습을 2초 동안 찍어주세요.' },
  { title: '가게 간판', helperText: '가게 간판이 선명하게 보이도록 2초 동안 찍어주세요.' },
  { title: '주력 메뉴', helperText: `“${menuIntro}” 메뉴가 잘 보이도록 2초 동안 찍어주세요.` },
  { title: '주력 메뉴와 상호작용하는 모습', helperText: `“${menuIntro}” 메뉴를 들어 올리거나 맛있게 즐기는 모습을 2초 동안 찍어주세요.` },
  { title: '음식 조리', helperText: '음식을 조리하는 모습을 2초 동안 찍어주세요.' },
  { title: '서브메뉴', helperText: '주력 메뉴와 잘 어울리는 서브메뉴를 2초 동안 찍어주세요.' },
  { title: '서브메뉴와 상호작용하는 모습', helperText: '서브메뉴를 들어 올리거나 맛있게 즐기는 모습을 2초 동안 찍어주세요.' },
  { title: '추가로 어필하고 싶은 모습', helperText: '손님에게 추가로 보여주고 싶은 가게의 매력을 2초 동안 찍어주세요.' },
] as const;
