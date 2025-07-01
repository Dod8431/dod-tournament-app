import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from './routes';

export default function App() {
  // Track admin code state for live updates (for NavBar logic)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("adminPanelCodeOk") === "yes");

  useEffect(() => {
    function check() {
      setIsAdmin(localStorage.getItem("adminPanelCodeOk") === "yes");
    }
    window.addEventListener("storage", check);
    const poll = setInterval(check, 300);
    return () => {
      window.removeEventListener("storage", check);
      clearInterval(poll);
    };
  }, []);

  return (
    <Router>
      <NavBar isAdmin={isAdmin} />
      <div className="pt-16">
        <ErrorBoundary>
          <AppRoutes isAdmin={isAdmin} />
        </ErrorBoundary>
      </div>
    </Router>
  );
}
