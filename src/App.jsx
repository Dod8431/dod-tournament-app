import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserTournamentList from "./components/UserTournamentList";
import AdminGate from "./components/AdminGate";
import AdminPanelHome from "./components/AdminPanelHome";
import MyTournaments from "./components/MyTournaments";
import CreateTournament from "./components/CreateTournament";
import BracketView from "./components/BracketView";

export default function App() {
  return (
    <Router>
      <NavBar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<UserTournamentList />} />
          <Route path="/my-tournaments" element={<MyTournaments />} />
          <Route path="/admin" element={<AdminGate><AdminPanelHome /></AdminGate>} />
          <Route path="/create" element={<CreateTournament />} />
          <Route path="/tournament/:tid/bracket" element={<BracketView />} />
        </Routes>
      </div>
    </Router>
  );
}
