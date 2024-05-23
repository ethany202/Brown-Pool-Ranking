import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/Leaderboard';
import SiteHeader from './components/SiteHeader';
import HomePage from './components/HomePage';

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
