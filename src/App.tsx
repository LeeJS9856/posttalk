import { type ReactElement } from 'react';
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
import Login from '@/pages/Login/Login';
import PublishRequested from '@/pages/PublishRequested/PublishRequested';
import VoiceQuestion from '@/pages/VoiceQuestion/VoiceQuestion';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import LoginRequired from '@/components/auth/LoginRequired';

const LoginRequiredRoute = ({ children }: { children: ReactElement }): React.JSX.Element => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <LoginRequired />;
};

const App = (): React.JSX.Element => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRequiredRoute><Home /></LoginRequiredRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/archive" element={<AdminArchive />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/reviews/:submissionId" element={<AdminReviewDetailPage />} />
        <Route path="/create" element={<LoginRequiredRoute><Create /></LoginRequiredRoute>} />
        <Route path="/create/capture" element={<LoginRequiredRoute><Capture /></LoginRequiredRoute>} />
        <Route path="/create/capture/result" element={<LoginRequiredRoute><CaptureResult /></LoginRequiredRoute>} />
        <Route path="/create/questions/:questionIndex" element={<LoginRequiredRoute><VoiceQuestion /></LoginRequiredRoute>} />
        <Route path="/create/generating" element={<LoginRequiredRoute><Generating /></LoginRequiredRoute>} />
        <Route path="/create/complete" element={<LoginRequiredRoute><GenerationComplete /></LoginRequiredRoute>} />
        <Route path="/create/requested" element={<LoginRequiredRoute><PublishRequested /></LoginRequiredRoute>} />
        <Route path="/archive" element={<LoginRequiredRoute><Archive /></LoginRequiredRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
