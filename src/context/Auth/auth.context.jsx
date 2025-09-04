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
  cartItems: [],       // <- items del carrito (para contar unidades)
  wishlistItems: [],   // <- opcional
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
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null, error: action.payload };

    case "LOGOUT":
      return { ...initialState, loading: false };

    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SET_CART_ITEMS":
      return { ...state, cartItems: Array.isArray(action.payload) ? action.payload : [] };

    case "SET_WISHLIST_ITEMS":
      return { ...state, wishlistItems: Array.isArray(action.payload) ? action.payload : [] };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate(); 

  // Chequeo inicial de sesión
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

  // Refresca carrito desde el backend (siempre unidades)
  const refreshCart = useCallback(async () => {
    try {
      const data = await ApiService.get("/cart"); // { items, itemCount, ... }
      dispatch({ type: "SET_CART_ITEMS", payload: data?.items || [] });
      return data;
    } catch {
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
      return null;
    }
  }, []);

  // Cuando cambia la auth, actualizamos carrito
  useEffect(() => {
    if (state.isAuthenticated) {
      refreshCart();
    } else {
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
    }
  }, [state.isAuthenticated, refreshCart]);

  // Listener opcional para eventos globales
  useEffect(() => {
    const onCartUpdated = () => refreshCart();
    window.addEventListener("cart:updated", onCartUpdated);
    return () => window.removeEventListener("cart:updated", onCartUpdated);
  }, [refreshCart]);

  // --- Login ---
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

      await refreshCart();
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  // --- Register ---
  const registerUser = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.register(userData);

      // si el backend devuelve user + token al registrarse, hacemos login automático
      if (response.token && response.user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: response.user, token: response.token },
        });
        ApiService.setToken(response.token);
        localStorage.setItem("token", response.token);

        await refreshCart();
      }
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "SET_CART_ITEMS", payload: [] });
    navigate("/auth", { replace: true });
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  // Conteo de unidades (unificado para Home, Header y Carrito)
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
