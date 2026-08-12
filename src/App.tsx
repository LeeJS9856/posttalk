import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Archive from '@/pages/Archive/Archive';
import Capture from '@/pages/Capture/Capture';
import CaptureResult from '@/pages/CaptureResult/CaptureResult';
import Create from '@/pages/Create/Create';
import Home from '@/pages/Home/Home';

const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/create/capture" element={<Capture />} />
      <Route path="/create/capture/result" element={<CaptureResult />} />
      <Route path="/archive" element={<Archive />} />
    </Routes>
  </BrowserRouter>
);

export default App;
