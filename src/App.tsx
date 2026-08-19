import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Archive from '@/pages/Archive/Archive';
import ArchiveDetail from '@/pages/ArchiveDetail/ArchiveDetail';
import AdminHome from '@/pages/AdminHome/AdminHome';
import AdminArchive from '@/pages/AdminArchive/AdminArchive';
import AdminReviews from '@/pages/AdminReviews/AdminReviews';
import AdminReviewDetailPage from '@/pages/AdminReviewDetail/AdminReviewDetail';
import Capture from '@/pages/Capture/Capture';
import CaptureResult from '@/pages/CaptureResult/CaptureResult';
import Create from '@/pages/Create/Create';
import Entry from '@/pages/Entry/Entry';
import GenerationComplete from '@/pages/GenerationComplete/GenerationComplete';
import Generating from '@/pages/Generating/Generating';
import Home from '@/pages/Home/Home';
import PublishRequested from '@/pages/PublishRequested/PublishRequested';
import QrLogin from '@/pages/QrLogin/QrLogin';
import VoiceQuestion from '@/pages/VoiceQuestion/VoiceQuestion';
import { MerchantSessionProvider } from '@/hooks/useMerchantSession';
import { useMerchantSession } from '@/hooks/useMerchantSession';

const Root = (): React.JSX.Element => {
  const { isLoading, session } = useMerchantSession();
  const qrToken = new URLSearchParams(window.location.search).get('qrToken');

  if (qrToken && !isLoading && !session) {
    return <Navigate to={`/entry${window.location.search}`} replace />;
  }

  return <Home />;
};

const App = (): React.JSX.Element => (
  <MerchantSessionProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/qr-login" element={<QrLogin />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/archive" element={<AdminArchive />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/reviews/:submissionId" element={<AdminReviewDetailPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/create/capture" element={<Capture />} />
        <Route path="/create/capture/result" element={<CaptureResult />} />
        <Route path="/create/questions/:questionIndex" element={<VoiceQuestion />} />
        <Route path="/create/generating" element={<Generating />} />
        <Route path="/create/complete" element={<GenerationComplete />} />
        <Route path="/create/requested" element={<PublishRequested />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/:submissionId" element={<ArchiveDetail />} />
      </Routes>
    </BrowserRouter>
  </MerchantSessionProvider>
);

export default App;
