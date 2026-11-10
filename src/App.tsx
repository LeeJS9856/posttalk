import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home/Home';

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 제작 흐름과 보관함은 다음 작업에서 붙인다. */}
      </Routes>
    </Router>
  );
};

export default App;
