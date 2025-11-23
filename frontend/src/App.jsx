// import { Route, Routes } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Upload from "./pages/Upload";
// import ProjectDetails from "./pages/ProjectDetail";
// import EditProject from "./pages/EditProject";
// import Settings from "./pages/Settings";
// import Profiles from "./pages/Profiles";
// import ImageConverter from "./pages/ImageConverter";
// import ProtectedRoute from "./components/ProtectedRoute";

// // ✅ Use Sonner instead
// import { Toaster } from 'sonner';

// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profiles" element={<Profiles />} />
//         <Route path="/user/:userId" element={<Profile />} />
//         <Route path="/project/:projectId" element={<ProjectDetails />} />
//         <Route path="/image-converter" element={<ImageConverter />} />
        
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/upload"
//           element={
//             <ProtectedRoute>
//               <Upload />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/edit-project/:projectId"
//           element={
//             <ProtectedRoute>
//               <EditProject />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/settings"
//           element={
//             <ProtectedRoute>
//               <Settings />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
      
//       {/* ✅ Sonner Toaster - Much simpler! */}
//       <Toaster position="top-right" richColors />
      
//     </>
//   );
// }

// export default App;
















import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import ProjectDetails from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import Settings from "./pages/Settings";
import Profiles from "./pages/Profiles";
import ImageConverter from "./pages/ImageConverter";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'sonner';
// import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/imageConverter" element={<ImageConverter />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
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
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      <Toaster position="top-right" richColors />
      
    </div>
  );
}

export default App;