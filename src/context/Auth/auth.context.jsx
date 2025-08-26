import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../../reducers/users/users.actions.jsx";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
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
      return { ...state, user: action.payload, isAuthenticated: true };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = authService.getCurrentUser();
      if (token && user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: { user: response.user, token: response.token } });
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError, isAdmin: () => state.user?.rol === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
