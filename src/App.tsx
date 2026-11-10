import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Create from '@/pages/Create/Create';
import Home from '@/pages/Home/Home';

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        {/* 정보 입력 이후 화면은 다음 작업에서 붙인다. */}
      </Routes>
    </Router>
  );
};

export default App;
