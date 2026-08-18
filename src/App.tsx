import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Archive from '@/pages/Archive/Archive';
import AdminHome from '@/pages/AdminHome/AdminHome';
import AdminArchive from '@/pages/AdminArchive/AdminArchive';
import AdminReviews from '@/pages/AdminReviews/AdminReviews';
import AdminReviewDetailPage from '@/pages/AdminReviewDetail/AdminReviewDetail';
import Capture from '@/pages/Capture/Capture';
import CaptureResult from '@/pages/CaptureResult/CaptureResult';
import Create from '@/pages/Create/Create';
import GenerationComplete from '@/pages/GenerationComplete/GenerationComplete';
import Generating from '@/pages/Generating/Generating';
import Home from '@/pages/Home/Home';
import PublishRequested from '@/pages/PublishRequested/PublishRequested';
import VoiceQuestion from '@/pages/VoiceQuestion/VoiceQuestion';

const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
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
    </Routes>
  </BrowserRouter>
);

export default App;
