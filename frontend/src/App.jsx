import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import ProjectDetail from "./pages/ProjectDetail"; // ✅
import EditProject from "./pages/EditProject"; // ✅
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:userId" element={<UserProfile />} />
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
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/edit-project/:projectId" 
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;