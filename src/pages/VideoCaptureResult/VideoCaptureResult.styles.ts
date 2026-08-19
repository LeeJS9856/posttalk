import styled from 'styled-components';

import Button from '@/components/common/Button';
import { FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`display: flex; min-height: 100svh; flex-direction: column; padding-bottom: 24px; background: ${COLORS.background.main};`;
export const Content = styled.main`display: flex; flex: 1; flex-direction: column; align-items: center; padding: clamp(48px, 10svh, 82px) 24px 0; text-align: center;`;
export const Popo = styled.img`width: 57px; height: 54px;`;
export const GuideCopy = styled(FlowTitle)`margin-top: 20px;`;
export const PreviewVideo = styled.video`width: 100%; aspect-ratio: 9 / 16; max-height: 52svh; margin-top: 16px; border-radius: 14px; background: ${COLORS.black700}; object-fit: contain;`;
export const EmptyVideo = styled.p`display: grid; width: 100%; aspect-ratio: 9 / 16; margin-top: 16px; place-items: center; color: ${COLORS.black500}; background: ${COLORS.primary100}; font-size: ${FONT_SIZE.body};`;
export const ActionArea = styled.div`display: grid; grid-template-columns: 1fr 2fr; gap: 8px; margin: auto 24px 0;`;
export const RetakeButton = styled(Button)`border: 1px solid ${COLORS.black400}; border-radius: 10px; color: ${COLORS.black500}; background: ${COLORS.white};`;
export const CameraInput = styled.input`display: none;`;
