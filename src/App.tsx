import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Heatmap from '@/pages/Heatmap';
import VoteHistory from '@/pages/VoteHistory';
import TemperatureAlertBanner from '@/components/TemperatureAlertBanner';
import AnnouncementBar from '@/components/AnnouncementBar';

export default function App() {
  return (
    <Router>
      <AnnouncementBar />
      <TemperatureAlertBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/history" element={<VoteHistory />} />
      </Routes>
    </Router>
  );
}
