import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ User loaded:", parsedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ Error parsing user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (data) => {
    const userData = data.user || data;
    const token = data.token;
    
    console.log("✅ Login:", userData);
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🔥 Update user - এখন properly কাজ করবে
  const updateUser = (updatedData) => {
    console.log("✅ Updating user:", updatedData);
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};