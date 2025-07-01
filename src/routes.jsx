// src/routes.jsx
// Not strictly necessary but shows how to split routes if you wish
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateTournament from './components/CreateTournament';
import JoinTournament from './components/JoinTournament';
import VotingPanel from './components/VotingPanel';
import RecapScreen from './components/RecapScreen';
import BracketView from './components/BracketView';
import AdminPanel from './components/AdminPanel';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<CreateTournament />} />
    <Route path="/tournament/:tid/join" element={<JoinTournament />} />
    <Route path="/tournament/:tid/vote" element={<VotingPanel />} />
    <Route path="/tournament/:tid/recap" element={<RecapScreen />} />
    <Route path="/tournament/:tid/bracket" element={<BracketView />} />
    <Route path="/tournament/:tid/admin" element={<AdminPanel />} />
  </Routes>
);

export default AppRoutes;