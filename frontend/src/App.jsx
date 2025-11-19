// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import UserProfile from "./pages/UserProfile";
// import Upload from "./pages/Upload";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import ProfileSettings from "./pages/ProfileSettings";
// import ProjectDetail from "./pages/ProjectDetail";
// import EditProject from "./pages/EditProject";
// import Settings from "./pages/Settings";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer"; // ✅ Import
// import ImageConverter from "./pages/ImageConverter";






// function App() {
//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/user/:userId" element={<UserProfile />} />
//           <Route path="/project/:projectId" element={<ProjectDetail />} />
          
//           <Route
//             path="/upload"
//             element={
//               <ProtectedRoute>
//                 <Upload />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile/settings"
//             element={
//               <ProtectedRoute>
//                 <ProfileSettings />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <Settings />
//               </ProtectedRoute>
//             }
//           />
//           <Route 
//             path="/edit-project/:projectId" 
//             element={
//               <ProtectedRoute>
//                 <EditProject />
//               </ProtectedRoute>
//             } 
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route path="/image-converter" element={<ImageConverter />} />

//         </Routes>
//       </main>
//       <Footer /> {/* ✅ Add Footer */}
//     </div>
//   );
// }

// export default App;















import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageConverter from "./pages/ImageConverter";
import Profiles from "./pages/Profiles";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* 🆕 Unified Profile Route - Works for both own and others' profiles */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/user/:userId" element={<Profile />} />
          
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          
          {/* 🆕 Unified Settings Route - Includes all settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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
          <Route path="/imageConverter" element={<ImageConverter />} />
          <Route path="/profiles" element={<Profiles />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;