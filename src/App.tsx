import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Heatmap from '@/pages/Heatmap';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heatmap" element={<Heatmap />} />
      </Routes>
    </Router>
  );
}
