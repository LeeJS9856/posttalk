import { useMemo, useState } from 'react';
import styled from 'styled-components';

import ArchivedAdCard from '@/components/archive/ArchivedAdCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { ARCHIVED_ADS, ARCHIVE_FILTERS, type ArchiveFormat, type StatusFilter } from '@/constants/archive';
import { COLORS } from '@/constants/colors';

const Archive = (): React.JSX.Element => {
  const [format, setFormat] = useState<ArchiveFormat>('photo');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const ads = useMemo(
    () => ARCHIVED_ADS.filter((ad) => ad.format === format && (filter === 'all' || ad.status === filter)),
    [filter, format],
  );

  return (
    <Page aria-label="보관함 페이지">
      <Header>
        <Title>보관함</Title>
        <SearchButton type="button" aria-label="광고 검색">
          <SearchIcon aria-hidden="true" />
        </SearchButton>
      </Header>

      <FormatTabs aria-label="광고 형식">
        <FormatTab type="button" $active={format === 'photo'} onClick={() => setFormat('photo')}>
          사진 광고
        </FormatTab>
        <FormatTab type="button" $active={format === 'video'} onClick={() => setFormat('video')}>
          동영상 광고
        </FormatTab>
      </FormatTabs>

      <FilterList aria-label="광고 상태 필터">
        {ARCHIVE_FILTERS.map(({ label, value }) => (
          <FilterButton
            key={value}
            type="button"
            $active={filter === value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </FilterButton>
        ))}
      </FilterList>

      <Content>
        {ads.length > 0 ? (
          <AdList>
            {ads.map((ad) => (
              <ArchivedAdCard key={ad.id} {...ad} />
            ))}
          </AdList>
        ) : (
          <EmptyMessage>해당 조건의 광고가 없어요.</EmptyMessage>
        )}
      </Content>
      <BottomNavigation fixed />
    </Page>
  );
};

const Page = styled.main`
  width: min(100%, 480px);
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 96px;
  background: ${COLORS.background.main};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 42px 24px 18px;
`;

const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: 20px;
  font-weight: 700;
`;

const SearchButton = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  background: transparent;
`;

const SearchIcon = styled.span`
  position: relative;
  width: 15px;
  height: 15px;
  border: 2px solid ${COLORS.black700};
  border-radius: 50%;

  &::after {
    position: absolute;
    right: -5px;
    bottom: -3px;
    width: 7px;
    height: 2px;
    border-radius: 2px;
    background: ${COLORS.black700};
    content: '';
    transform: rotate(45deg);
  }
`;

const FormatTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: 1px solid ${COLORS.black200};
  background: ${COLORS.white};
`;

const FormatTab = styled.button<{ $active: boolean }>`
  position: relative;
  height: 48px;
  border: 0;
  color: ${({ $active }) => ($active ? COLORS.black700 : COLORS.black400)};
  background: transparent;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};

  &::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: ${({ $active }) => ($active ? COLORS.black700 : 'transparent')};
    content: '';
  }
`;

const FilterList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 14px 24px;
  background: ${COLORS.white};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  padding: 7px 12px;
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.black500)};
  background: ${({ $active }) => ($active ? COLORS.primary : COLORS.primary100)};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const Content = styled.section`
  padding-top: 6px;
`;

const AdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyMessage = styled.p`
  padding: 72px 24px;
  color: ${COLORS.black500};
  font-size: 16px;
  text-align: center;
`;

export default Archive;
