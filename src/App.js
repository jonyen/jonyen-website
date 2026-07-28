import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Blog } from './components';
import TravelPage from './components/travel/TravelPage';
import PortfolioPage from './components/portfolio/PortfolioPage';
import DigestPage from './components/digest/DigestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Blog />} />
      <Route path="/travel" element={<TravelPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/digest" element={<DigestPage />} />
      <Route path="/digest/:date" element={<DigestPage />} />
    </Routes>
  );
}

export default App;
