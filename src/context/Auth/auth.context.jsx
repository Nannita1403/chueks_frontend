import { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import authService from "../../reducers/users/users.actions.jsx";
import ApiService from "../../reducers/api/Api.jsx";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  cartItems: [],
  favorites: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token, error: null };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: action.payload };
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_CART_ITEMS":
      return { ...state, cartItems: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_FAVORITES":
      return { ...state, favorites: Array.isArray(action.payload) ? action.payload : [] };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(() => {
    try { authService.logout?.(); } catch (e) { console.warn("⚠️ authService.logout no definido:", e); }
    localStorage.removeItem("token");
    ApiService.setToken(null);
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  }, [navigate]);

  const refreshCart = useCallback(async () => {
    try {
      const data = await ApiService.get("/cart");
      dispatch({ type: "SET_CART_ITEMS", payload: data?.items || [] });
      return data;
    } catch (err) {
      if (err?.response?.status === 401) logout();
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
      return null;
    }
  }, [logout]);

  const refreshFavorites = useCallback(async () => {
    try {
      const data = await ApiService.get("/users/favorites");
      dispatch({ type: "SET_FAVORITES", payload: data?.favorites || [] });
      return data;
    } catch (err) {
      if (err?.response?.status === 401) logout();
      dispatch({ type: "SET_FAVORITES", payload: [] });
      return null;
    }
  }, [logout]);

  // 🔁 Inicializar sesión
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      ApiService.setToken(token);

      try {
        const res = await ApiService.get("/users/checksession"); // <--- cambio
        dispatch({ type: "LOGIN_SUCCESS", payload: { user: res.user, token } });
      } catch (err) {
        console.warn("Token inválido o expirado", err);
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  useEffect(() => {
    if (state.isAuthenticated) {
      refreshCart();
      refreshFavorites();
    } else {
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
      dispatch({ type: "SET_FAVORITES", payload: [] });
    }
  }, [state.isAuthenticated, refreshCart, refreshFavorites]);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(credentials);
      if (response.status === 403 || response.message?.includes("verifica")) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Debes verificar tu correo antes de ingresar." });
        alert("⚠️ Debes verificar tu correo antes de ingresar.");
        return;
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: { user: response.user, token: response.token } });
      ApiService.setToken(response.token);
      localStorage.setItem("token", response.token);
      await Promise.all([refreshCart(), refreshFavorites()]);
      navigate("/home");
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const registerUser = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.register(userData);
      dispatch({ type: "LOGOUT" });
      navigate("/auth", { replace: true });
      alert(response.message || "Cuenta creada. Verifica tu correo antes de iniciar sesión.");
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const setUser = useCallback((user) => {
    const currentToken = localStorage.getItem("token");
    dispatch({ type: "SET_USER", payload: user });
    if (user) {
    // Usa el token que venga del user o el que ya tenías
    const tokenToUse = user.token || currentToken;
    ApiService.setToken(tokenToUse);
    localStorage.setItem("user", JSON.stringify(user));
    if (tokenToUse) {
      localStorage.setItem("token", tokenToUse);
    }
  } else {
    // Solo borra si user es null o undefined
    ApiService.setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}, []);

  const toggleFavorite = useCallback(async (productId) => {
    try {
      const data = await ApiService.put(`/users/favorites/${productId}/toggle`);
      dispatch({ type: "SET_FAVORITES", payload: data.favorites || [] });
      return data;
    } catch (err) {
      console.error("Error toggling favorite:", err);
      return null;
    }
  }, []);

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });
  const cartCount = state.cartItems.reduce((acc, it) => acc + (Number(it?.quantity) || 0), 0);

  if (authLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        cartCount,
        login,
        registerUser,
        logout,
        clearError,
        refreshCart,
        refreshFavorites,
        toggleFavorite,
        setUser,
        isAdmin: () => state.user?.rol === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
