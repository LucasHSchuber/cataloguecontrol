import { Routes, Route, Navigate } from 'react-router-dom';
// import Index from './pages/index';
import Index from './pages/index';
import Ebbs from './pages/ebss';


import "./assets/css/main.css"

function App() {
  return (
    <div className="main-content">
      <div className="content">
        <div className="route-layout">
          <Routes>
            {/* <Route path="/" element={<Index />} /> */}
            <Route path="/" element={<Navigate to="/catalogcontrol" replace />} />
            {/* Define the catalogcontrol route */}
            <Route path="/catalogcontrol" element={<Index />} />

            <Route path="/ebss" element={<Ebbs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
