import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  position: relative;
  padding-bottom: 80px;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  padding: 30px 20px;
`;

export const ReviewList = styled.div`
  display: grid;
  gap: 10px;
`;

export const ReviewCard = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 108px;
  border: 0;
  border-radius: 10px;
  padding: 8px 14px 8px 10px;
  background: ${COLORS.white};
  box-shadow: 0 4px 10px rgba(33, 33, 33, 0.16);
  text-align: left;
`;

export const Thumbnail = styled.img`
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border-radius: 8px;
  object-fit: cover;
`;

export const VideoThumbnail = styled.video`
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border-radius: 8px;
  object-fit: cover;
  background: ${COLORS.black200};
`;

export const CardText = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  margin-left: 14px;
`;

export const Title = styled.strong`
  overflow: hidden;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Description = styled.span`
  color: ${COLORS.black400};
  font-size: ${FONT_SIZE.caption};
`;

export const Chevron = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  margin-left: 12px;
  color: ${COLORS.primary};

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const EmptyMessage = styled.p`
  padding: 72px 0;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
