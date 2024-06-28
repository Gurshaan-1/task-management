import "./App.css";
import React from "react";
import LandingPage from "./Components/LandingPage/LandingPage";
import Login from "./Components/Login/Login.js";
import SignUp from "./Components/SignUp/SignUp.js";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard.js";
import UserDashboard from "./Components/UserDashboard/UserDashboard.js";
import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "./Components/ManagerDashboard/ManagerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/manager" element={<ManagerDashboard />} />
    </Routes>
  );
}

export default App;
