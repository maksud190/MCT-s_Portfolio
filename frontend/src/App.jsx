import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject"; // 🔥 Import করা
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* 🔥 Edit route - Protected */}
        
        <Route 
          path="/edit/:projectId" 
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}