import { Routes, Route } from 'react-router-dom';
// import Index from './pages/index';
import Index from './pages/index';
// import "./App.css";

import './assets/css/main.css';
import './assets/css/buttons.css';

function App() {
  return (
    <div className="main-content">
      <div className="content">
        <div className="route-layout">
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
