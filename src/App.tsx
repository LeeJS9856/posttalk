import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from '@/components/common/RequireAuth';
import AdDetail from '@/pages/AdDetail/AdDetail';
import Archive from '@/pages/Archive/Archive';
import Create from '@/pages/Create/Create';
import CaptureCamera from '@/pages/Capture/CaptureCamera';
import CaptureList from '@/pages/Capture/CaptureList';
import CreateInfo from '@/pages/CreateInfo/CreateInfo';
import CreateScript from '@/pages/CreateScript/CreateScript';
import Generating from '@/pages/Generating/Generating';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
        {/* 로그인 상태에서도 열린다. 운영자가 다시 로그인할 길이 여기뿐이다. */}
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create/info" element={<CreateInfo />} />
          <Route path="/create/capture" element={<CaptureList />} />
          <Route path="/create/capture/:sceneIndex" element={<CaptureCamera />} />
          <Route path="/create/script" element={<CreateScript />} />
          <Route path="/create/generating" element={<Generating />} />
          <Route path="/ads/:adId" element={<AdDetail />} />
          <Route path="/archive" element={<Archive />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
