// src/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserTournamentList from './components/UserTournamentList';
import CreateTournament from './components/CreateTournament';
import JoinTournament from './components/JoinTournament';
import VotingPanel from './components/VotingPanel';
import RecapScreen from './components/RecapScreen';
import BracketView from './components/BracketView';
import AdminPanel from './components/AdminPanel';
import AdminPanelHome from './components/AdminPanelHome';
import AdminGate from './components/AdminGate';
import MyTournaments from './components/MyTournaments';

const AppRoutes = ({ isAdmin }) => (
  <Routes>
    <Route path="/" element={<UserTournamentList />} />
    <Route
      path="/my-tournaments"
      element={isAdmin
        ? <MyTournaments />
        : <div className="flex min-h-screen items-center justify-center text-xl text-red-500">Not authorized</div>
      }
    />
    <Route
      path="/admin"
      element={
        <AdminGate>
          <AdminPanelHome />
        </AdminGate>
      }
    />
    <Route
      path="/create"
      element={isAdmin
        ? <CreateTournament />
        : <div className="flex min-h-screen items-center justify-center text-xl text-red-500">Not authorized</div>
      }
    />
    <Route path="/tournament/:tid/join" element={<JoinTournament />} />
    <Route path="/tournament/:tid/vote" element={<VotingPanel />} />
    <Route path="/tournament/:tid/recap" element={<RecapScreen />} />
    <Route path="/tournament/:tid/bracket" element={<BracketView />} />
    <Route path="/tournament/:tid/admin" element={<AdminPanel />} />
    {/* fallback 404 route */}
    <Route path="*" element={<div className="flex min-h-screen items-center justify-center text-xl text-red-500">404 Not Found</div>} />
  </Routes>
);

export default AppRoutes;
