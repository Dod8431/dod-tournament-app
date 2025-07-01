import React from "react";
import MyTournaments from "./MyTournaments";

export default function AdminPanelHome() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <MyTournaments />
    </div>
  );
}
