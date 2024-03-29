import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SnippetsPage from './components/SnippetsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/snippets" element={<SnippetsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

