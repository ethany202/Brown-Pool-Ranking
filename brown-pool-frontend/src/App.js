import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/Leaderboard';
import SiteHeader from './components/SiteHeader';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import Team from './components/Team';

function App() {
  return (
    <div className="wrapper">
      <SiteHeader />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element=
            {
              <HomePage />
            }>
          </Route>
          <Route path="/leaderboard" element=
            {
              <>
                <Leaderboard />
              </>

            }>

          </Route>

          <Route path="/team" element={<Team />}>

          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
