import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ModelPage } from './pages/ModelPage';

export const App: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);

 useEffect(() => {
  fetch('/models')
    .then((res) => {
      if (!res.ok) throw new Error("Server responded with " + res.status);
      return res.json();
    })
    .then((data) => setModels(Object.values(data)))
    .catch((err) => {
      console.error("❌ Failed to load models:", err);
    });
}, []);

 return (
  <Router>
    <>
      <Routes>
        <Route path="/" element={
          <ul>
            {models.map((m, i) => (
              <li key={i}><Link to={`/${m.id}`}>{m.name}</Link></li>
            ))}
          </ul>
        } />
        {models.map((m, i) => (
          <Route key={i} path={`/${m.id}`} element={<ModelPage model={m} />} />
        ))}
      </Routes>
      {models.length === 0 && (
        <div style={{ color: 'red', padding: '1rem' }}>
          🚨 No models loaded. Make sure the backend is running and accessible at <code>/models</code>.
        </div>
      )}
    </>
  </Router>
);
};