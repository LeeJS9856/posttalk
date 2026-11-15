import styled from 'styled-components';

import heroImage from '@/assets/market-image.png';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';
import { skeleton } from '@/styles/skeleton';

/** 사진 위 인사가 사라지고 시트가 올라오는 속도. 둘을 맞춰야 한 동작으로 읽힌다. */
const SHEET_EASE = '0.32s cubic-bezier(0.2, 0.85, 0.25, 1)';

/** 시트가 접혔을 때의 윗선. 사진의 아래 끝도 이 선에 맞춘다. */
const SHEET_COLLAPSED_TOP = 'clamp(220px, 37%, 340px)';

/** 시트 위 모서리의 둥근 정도. 사진이 이만큼 시트 밑으로 들어가 모서리 뒤를 채운다. */
const SHEET_RADIUS = '28px';

/** 누르면 살짝 줄어드는 반응. 카드와 타일이 같은 손맛을 갖게 한다. */
const PRESS = 'transform 0.18s cubic-bezier(0.2, 0.85, 0.25, 1)';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

/** 하단 탭을 뺀 나머지. 사진과 시트가 이 안에 겹친다. */
export const Stage = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/*
 * 시장 사진. 아래 끝을 접힌 시트의 윗선에 맞추고, 사진도 아래쪽 기준으로 자른다.
 * 기기 비율이 달라도 시장 거리(사진 아래쪽)가 늘 시트 바로 위에 걸린다.
 * 전체를 위에서 아래로 옅어지는 막으로 덮어 흰 인사가 어떤 사진 위에서도 읽히게 한다.
 * 흐림(backdrop-filter)은 쓰지 않는다. 촬영과 녹화가 함께 도는 기기에서 GPU 를 아낀다.
 */
export const Hero = styled.header`
  position: absolute;
  inset: 0 0 auto;
  height: calc(${SHEET_COLLAPSED_TOP} + ${SHEET_RADIUS});
  background-color: ${COLORS.background.inverse};
  background-image: url(${heroImage});
  background-position: center bottom;
  background-size: cover;

  &::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      ${COLORS.heroShade.top} 0%,
      ${COLORS.heroShade.middle} 60%,
      ${COLORS.heroShade.bottom} 100%
    );
    content: '';
  }
`;

/* 시트를 펼치면 인사는 물러난다. 시트가 글자를 덮어 반만 보이는 순간을 만들지 않는다. */
export const HeroMessage = styled.h1<{ $hidden: boolean }>`
  position: relative;
  padding: calc(env(safe-area-inset-top) + 72px) 24px 0;
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.display};
  font-weight: ${FONT_WEIGHT.medium};
  line-height: 1.4;
  letter-spacing: -0.03em;
  word-break: keep-all;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translateY(${({ $hidden }) => ($hidden ? '-8px' : '0')});
  transition:
    opacity ${SHEET_EASE},
    transform ${SHEET_EASE};

  strong {
    font-weight: ${FONT_WEIGHT.bold};
  }
`;

/*
 * 끌어올리는 시트. 접히면 사진 아래쪽을 덮고, 펼치면 화면 위까지 올라온다.
 * 안쪽 목록은 스스로 스크롤된다. 끌기를 몰라도 손가락으로 밀면 끝까지 볼 수 있다.
 */
export const Sheet = styled.section<{ $expanded: boolean }>`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  top: ${({ $expanded }) =>
    $expanded ? 'calc(env(safe-area-inset-top) + 24px)' : SHEET_COLLAPSED_TOP};
  border-radius: ${SHEET_RADIUS} ${SHEET_RADIUS} 0 0;
  background-color: ${COLORS.background.main};
  box-shadow: 0 -6px 24px rgba(10, 10, 12, 0.12);
  transition: top ${SHEET_EASE};
`;

/* 손잡이는 버튼이다. 끌지 않고 눌러도 열리고 닫힌다. */
export const SheetHandle = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 28px;
  touch-action: none;
`;

export const HandleBar = styled.span`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background-color: ${COLORS.border.strong};
`;

export const SheetBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 20px 28px;
`;

/** 새 광고 만들기. 시트 맨 위에 항상 있는 단 하나의 주 행동이다. */
export const CreateCard = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 84px;
  padding: 16px 18px 16px 22px;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.brand.main};
  box-shadow: 0 10px 24px rgba(40, 30, 90, 0.28);
  text-align: left;
  transition:
    ${PRESS},
    background-color 0.18s ease;

  &:active {
    background-color: ${COLORS.brand.pressed};
    transform: scale(0.985);
  }

  svg {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    color: ${COLORS.onBrand.sub};
  }
`;

export const CreateText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const CreateTitle = styled.span`
  color: ${COLORS.onBrand.main};
  font-size: ${FONT_SIZE.title};
  font-weight: ${FONT_WEIGHT.bold};
  letter-spacing: -0.02em;
`;

export const CreateSub = styled.span`
  margin-top: 2px;
  color: ${COLORS.onBrand.sub};
  font-size: ${FONT_SIZE.label};
`;

export const Section = styled.section`
  margin-top: 22px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.title};
  font-weight: ${FONT_WEIGHT.bold};
  letter-spacing: -0.02em;
`;

/* 글자는 작아도 누르는 자리는 44px 을 지킨다. */
export const AllButton = styled.button`
  min-height: 44px;
  margin-right: -8px;
  padding: 0 8px;
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.medium};
`;

/* 최근 업로드한 광고. 왼쪽 띠의 색으로 올린 광고임을 먼저 알린다. */
export const RecentCard = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 96px;
  overflow: hidden;
  padding: 10px 12px 10px 24px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.white};
  box-shadow:
    0 0 0 1px ${COLORS.border.main},
    0 4px 14px rgba(20, 20, 30, 0.06);
  text-align: left;
  transition: ${PRESS};

  &::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 10px;
    background-color: ${COLORS.status.published};
    content: '';
  }

  &:active {
    transform: scale(0.985);
  }

  > svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-left: 8px;
    color: ${COLORS.status.published};
  }
`;

export const RecentThumb = styled.img`
  flex-shrink: 0;
  width: 76px;
  height: 76px;
  border-radius: 12px;
  background-color: ${COLORS.background.subtle};
  object-fit: cover;
`;

export const RecentText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  margin-left: 14px;
`;

export const RecentBadge = styled.span`
  margin-bottom: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${COLORS.statusSoft.published};
  color: ${COLORS.status.published};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const RecentName = styled.span`
  overflow: hidden;
  max-width: 100%;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.bold};
  line-height: 1.3;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const RecentDescription = styled.span`
  overflow: hidden;
  max-width: 100%;
  margin-top: 2px;
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.label};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

/** 인스타그램 게시물 비율(4:5)의 두 칸 격자. 글은 이름 한 줄만 둔다. */
export const AdGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 10px;
  list-style: none;
`;

export const AdTile = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  transition: ${PRESS};

  &:active {
    transform: scale(0.98);
  }
`;

export const AdThumb = styled.span`
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.background.subtle};

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/** 불러오는 동안 격자 자리를 지키는 빈 칸. */
export const LoadingTile = styled.span`
  display: block;
  aspect-ratio: 4 / 5;
  border-radius: ${RADIUS.card};
  ${skeleton}
`;

export const RetryButton = styled.button`
  min-height: 44px;
  margin-top: 8px;
  padding: 0 16px;
  border-radius: 999px;
  background-color: ${COLORS.background.subtle};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const PlayBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding-left: 2px;
  border-radius: 50%;
  background-color: ${COLORS.overlay};
  color: ${COLORS.white};

  svg {
    width: 11px;
    height: 11px;
  }
`;

export const AdName = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 8px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

/* 같은 메뉴의 광고끼리 구분하도록 이름 뒤에 만든 날을 옅게 붙인다. */
export const AdMeta = styled.span`
  color: ${COLORS.text.muted};
  font-weight: ${FONT_WEIGHT.regular};
`;

export const EmptyLine = styled.p`
  padding-top: 4px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

/** 생성에 실패해 돌아왔을 때 시트 맨 위에 한 번 띄우는 안내. */
export const FailNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  padding: 0 4px 0 14px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.statusSoft.failed};
`;

export const FailNoticeText = styled.p`
  flex: 1;
  padding: 12px 0;
  color: ${COLORS.status.failed};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const FailNoticeClose = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${COLORS.status.failed};

  svg {
    width: 18px;
    height: 18px;
  }
`;
