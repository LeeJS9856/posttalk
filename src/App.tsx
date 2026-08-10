import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Archive from '@/pages/Archive/Archive';
import Create from '@/pages/Create/Create';
import Home from '@/pages/Home/Home';
import My from '@/pages/My/My';

const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/my" element={<My />} />
    </Routes>
  </BrowserRouter>
);

export default App;
