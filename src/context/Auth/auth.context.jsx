// src/context/Auth/auth.context.jsx
import { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import authService from "../../reducers/users/users.actions.jsx";
import ApiService from "../../reducers/api/Api.jsx";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

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
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload, 
        loading: false 
      };

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
  const [initialLoading, setInitialLoading] = useState(true);


  // 🔁 cargar sesión inicial
  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = authService.getCurrentUser();

  if (token && user) {
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
    ApiService.setToken(token);
  }
  // No hacemos logout aquí
  setInitialLoading(false);
}, []);

if (initialLoading) {
  return <Spinner/>; // O cualquier loader
}

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

      // si el backend responde con 403 (usuario no verificado)
      if (response.status === 403 || response.message?.includes("verifica")) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Debes verificar tu correo antes de ingresar." });
        alert("⚠️ Debes verificar tu correo antes de ingresar.");
        return;
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
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

  // --- REGISTER ---
const registerUser = async (userData) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const response = await authService.register(userData);

    // ⚠️ El backend ya NO devuelve token ni user
    // Solo devolvemos mensaje de éxito
    dispatch({ type: "LOGOUT" }); // limpiar estado
    navigate("/auth", { replace: true });

    // opcional: alerta
    alert(response.message || "Cuenta creada. Verifica tu correo antes de iniciar sesión.");

    return response;
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
    throw error;
  }
};

const toggleFavorite = useCallback(async (productId) => {
  try {
    const data = await ApiService.put(`/users/favorites/${productId}/toggle`);
    // Actualiza el estado global de favoritos inmediatamente
    dispatch({ type: "SET_FAVORITES", payload: data.favorites || [] });
    return data;
  } catch (err) {
    console.error("Error toggling favorite:", err);
    return null;
  }
}, []);

// --- SET USER  ---
const setUser = useCallback((user) => {
  dispatch({ type: "SET_USER", payload: user });
  if (user?.token) {
    ApiService.setToken(user.token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  } else {
    ApiService.setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}, []);

// --- LOGOUT ---
  const logout = useCallback(() => {
    try { authService.logout?.(); } catch (e) {
      console.warn("⚠️ authService.logout no definido:", e);
    }
    localStorage.removeItem("token");
    ApiService.setToken(null);
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
