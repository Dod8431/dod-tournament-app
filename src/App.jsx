// Main entrypoint: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTournament from './components/CreateTournament';
import JoinTournament from './components/JoinTournament';
import VotingPanel from './components/VotingPanel';
import RecapScreen from './components/RecapScreen';
import BracketView from './components/BracketView';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateTournament />} />
        <Route path="/tournament/:tid/join" element={<JoinTournament />} />
        <Route path="/tournament/:tid/vote" element={<VotingPanel />} />
        <Route path="/tournament/:tid/recap" element={<RecapScreen />} />
        <Route path="/tournament/:tid/bracket" element={<BracketView />} />
        <Route path="/tournament/:tid/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
