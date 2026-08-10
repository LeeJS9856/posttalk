import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/Home/Home';

const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
