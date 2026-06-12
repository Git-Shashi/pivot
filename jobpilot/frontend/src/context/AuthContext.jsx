import { useEffect, useState } from "react";
import * as authApi from "@/api/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    let cancelled = false;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { token, user: loggedInUser } = res.data.data;
    localStorage.setItem("token", token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { token, user: registeredUser } = res.data.data;
    localStorage.setItem("token", token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (updated) => setUser(updated);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

