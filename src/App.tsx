import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdDetail from '@/pages/AdDetail/AdDetail';
import Create from '@/pages/Create/Create';
import CaptureCamera from '@/pages/Capture/CaptureCamera';
import CaptureList from '@/pages/Capture/CaptureList';
import CreateInfo from '@/pages/CreateInfo/CreateInfo';
import CreateScript from '@/pages/CreateScript/CreateScript';
import Generating from '@/pages/Generating/Generating';
import Home from '@/pages/Home/Home';

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/create/info" element={<CreateInfo />} />
        <Route path="/create/capture" element={<CaptureList />} />
        <Route path="/create/capture/:sceneIndex" element={<CaptureCamera />} />
        <Route path="/create/script" element={<CreateScript />} />
        <Route path="/create/generating" element={<Generating />} />
        <Route path="/ads/:adId" element={<AdDetail />} />
        {/* 정보 입력 이후 화면은 다음 작업에서 붙인다. */}
      </Routes>
    </Router>
  );
};

export default App;
