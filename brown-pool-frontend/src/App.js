import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/Leaderboard';
import SiteHeader from './components/SiteHeader';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import Team from './components/Team';
import Register from './components/Register';

function App() {
  return (
    <div className="wrapper">
      <SiteHeader />

      <BrowserRouter>
        <Routes>
          <Route path="home" element={<HomePage />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="team" element={<Team />} />

          <Route path="new-member" element={<Register />} />
        </Routes>
      </BrowserRouter>

      <Footer />
    </div >
  );
}

export default App;
