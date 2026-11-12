import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

export const ChipRail = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  padding: 0 16px 8px;
  overflow-x: auto;
  scroll-padding-left: 16px;

  &:last-of-type {
    padding-bottom: 14px;
  }
`;

export const CreateButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  margin-right: -6px;
  padding: 0 6px;
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};

  svg {
    width: 15px;
    height: 15px;
  }
`;

/** 필터를 걸었는데 남는 게 없을 때. 아예 비어 있는 것과 다른 말을 한다. */
export const NoMatch = styled.p`
  padding: 40px 24px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;

export const Chip = styled.button<{ $on: boolean }>`
  flex-shrink: 0;
  padding: 7px 13px;
  border-radius: 999px;
  background-color: ${({ $on }) => ($on ? COLORS.brand.main : COLORS.background.subtle)};
  color: ${({ $on }) => ($on ? COLORS.text.inverse : COLORS.text.grey)};
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $on }) => ($on ? FONT_WEIGHT.medium : FONT_WEIGHT.regular)};
  white-space: nowrap;
  transition: background-color 0.18s ease;
`;

export const Feed = styled.ul`
  flex: 1;
  min-height: 0;
  list-style: none;
  overflow-y: auto;
`;

export const Post = styled.li`
  & + & {
    margin-top: 6px;
    border-top: 0.5px solid ${COLORS.border.main};
    padding-top: 14px;
  }
`;

/** 게시물 머리. 가게 아바타와 이름, 오른쪽에 올렸는지 여부. */
export const PostHead = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 16px 9px;
`;

export const Avatar = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${RADIUS.round};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const HeadText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ShopName = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const PostMeta = styled.p`
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const StatusBadge = styled.span<{ $published: boolean }>`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${({ $published }) =>
    $published ? COLORS.statusSoft.published : COLORS.statusSoft.unpublished};
  color: ${({ $published }) =>
    $published ? COLORS.status.published : COLORS.status.unpublished};
  font-size: ${FONT_SIZE.label};
`;

/** 인스타처럼 좌우 여백 없이 화면 끝까지 채운다. */
export const MediaButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  background-color: ${COLORS.background.subtle};
  overflow: hidden;
`;

export const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MediaVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Counter = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${COLORS.scrim};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.label};
`;

export const PlayMark = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: ${RADIUS.round};
  background-color: rgba(255, 255, 255, 0.88);
  color: ${COLORS.text.main};
  transform: translate(-50%, -50%);

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Caption = styled.p`
  padding: 10px 16px 14px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  line-height: 1.6;
`;

export const CaptionName = styled.span`
  margin-right: 5px;
  font-weight: ${FONT_WEIGHT.medium};
`;

export const PostDate = styled.p`
  margin-top: -8px;
  padding: 0 16px 14px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const EmptyWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 24px;
`;

export const EmptyMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.subtle};
  color: #b2b3b9;

  svg {
    width: 21px;
    height: 21px;
  }
`;

export const EmptyText = styled.p`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;

export const EmptyAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;
