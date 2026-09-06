import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return Boolean(storedUser && storedUser !== "null" && storedUser !== "undefined");
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync state whenever user or token is saved
  const login = useCallback((userData, tokenData) => {
    try {
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
      if (tokenData) {
        localStorage.setItem("token", tokenData);
        setToken(tokenData);
      }
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Error during login state update:", e);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (e) {
      console.warn("Logout API call error:", e);
    } finally {
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (e) {
        console.warn("Error removing user from localStorage:", e);
      }
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.warn("Error updating user:", e);
    }
  }, []);

  // Verify auth session with backend on initial load
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const res = await API.get("/api/auth/verify");
        if (isMounted && res.data?.user) {
          const verifiedUser = res.data.user;
          setUser(verifiedUser);
          setIsLoggedIn(true);
          try {
            localStorage.setItem("user", JSON.stringify(verifiedUser));
          } catch (e) {
            console.warn("Failed to persist verified user:", e);
          }
        }
      } catch (error) {
        // If unauthenticated or token expired, clear invalid local credentials
        if (error.response?.status === 401 || error.response?.status === 403) {
          if (isMounted) {
            setUser(null);
            setToken(null);
            setIsLoggedIn(false);
            try {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            } catch (e) {
              console.warn("Failed to clear localStorage on 401:", e);
            }
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
