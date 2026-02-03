import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Blog } from './components';
import TravelPage from './components/travel/TravelPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Blog />} />
      <Route path="/travel" element={<TravelPage />} />
    </Routes>
  );
}

export default App;
