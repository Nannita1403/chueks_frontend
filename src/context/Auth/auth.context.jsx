// src/context/Auth/auth.context.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
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
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case "LOGOUT":
      return { ...initialState, loading: false };

    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };

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

  // 🔁 cargar sesión inicial
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = authService.getCurrentUser();
    if (token && user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
      ApiService.setToken(token);
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // --- refrescar carrito ---
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
  }, []);

  // --- refrescar favoritos ---
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
  }, []);

  // sincronizar carrito + favoritos cuando el usuario cambia
  useEffect(() => {
    if (state.isAuthenticated) {
      refreshCart();
      refreshFavorites();
    } else {
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
      dispatch({ type: "SET_FAVORITES", payload: [] });
    }
  }, [state.isAuthenticated, refreshCart, refreshFavorites]);

  // --- LOGIN ---
  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
      ApiService.setToken(response.token);
      localStorage.setItem("token", response.token);

      await Promise.all([refreshCart(), refreshFavorites()]);
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  // --- REGISTER ---
  const registerUser = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.register(userData);
      if (response.token && response.user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: response.user, token: response.token },
        });
        ApiService.setToken(response.token);
        localStorage.setItem("token", response.token);

        await Promise.all([refreshCart(), refreshFavorites()]);
      }
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  // --- LOGOUT ---
  const logout = useCallback(() => {
    try {
      authService.logout?.();
    } catch (e) {
      console.warn("⚠️ authService.logout no definido:", e);
    }
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  }, [navigate]);

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  // contador de carrito
  const cartCount = state.cartItems.reduce((acc, it) => acc + (Number(it?.quantity) || 0), 0);

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
