import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserTournamentList from "./components/UserTournamentList";
import AdminGate from "./components/AdminGate";
import AdminPanelHome from "./components/AdminPanelHome";
import MyTournaments from "./components/MyTournaments";
import CreateTournament from "./components/CreateTournament";
import BracketView from "./components/BracketView";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  // Track admin code state for live updates
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("adminPanelCodeOk") === "yes");

  useEffect(() => {
    // Watch for changes to adminPanelCodeOk in localStorage
    function check() {
      setIsAdmin(localStorage.getItem("adminPanelCodeOk") === "yes");
    }
    window.addEventListener("storage", check);
    // Also poll in-app since same-tab setItem doesn't trigger
    const poll = setInterval(check, 300);
    return () => {
      window.removeEventListener("storage", check);
      clearInterval(poll);
    };
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="pt-16">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<UserTournamentList />} />
            <Route path="/my-tournaments" element={
              isAdmin
                ? <MyTournaments />
                : <div className="flex min-h-screen items-center justify-center text-xl text-red-500">Not authorized</div>
            } />
            <Route path="/admin" element={<AdminGate><AdminPanelHome /></AdminGate>} />
            <Route path="/create" element={
              isAdmin
                ? <CreateTournament />
                : <div className="flex min-h-screen items-center justify-center text-xl text-red-500">Not authorized</div>
            } />
            <Route path="/tournament/:tid/bracket" element={<BracketView />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}
