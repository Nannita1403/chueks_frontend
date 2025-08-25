import { createContext, useContext, useReducer, useEffect } from "react"
import authService from "../../reducers/users/users.actions.jsx"

const AuthContext = createContext()

const authReducer = (state, action) => {
  console.log("[v0] AuthContext - Reducer action:", action.type, action.payload)
  switch (action.type) {
    case "LOGIN_START":
      console.log("[v0] AuthContext - Setting loading to true")
      return {
        ...state,
        loading: true,
        error: null,
      }
    case "LOGIN_SUCCESS":
      console.log("[v0] AuthContext - Login success, setting user:", action.payload.user)
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case "LOGIN_FAILURE":
      console.log("[v0] AuthContext - Login failure:", action.payload)
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        loading: false,
      }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] AuthContext - Checking initial auth state")
      const token = localStorage.getItem("token")
      const user = authService.getCurrentUser()

      if (token && user) {
        console.log("[v0] AuthContext - Found token and user in localStorage")
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          })
      } else {
        console.log("[v0] AuthContext - No token or user found, setting unauthenticated")
        dispatch({ type: "LOGOUT" })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" })
    try {
      console.log("[v0] AuthContext - Attempting login with:", credentials)
      const response = await authService.login(credentials)
      console.log("[v0] AuthContext - Login response received:", response)
      console.log("[v0] AuthContext - Response has user:", !!response.user)
      console.log("[v0] AuthContext - Response has token:", !!response.token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.user,
          token: response.token,
        },
      })
      console.log("[v0] AuthContext - LOGIN_SUCCESS dispatched")

      return response
    } catch (error) {
      console.error("[v0] AuthContext - Login failed:", error)
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message,
      })
      throw error
    }
  }

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message,
      })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    isAdmin: () => state.user?.rol === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

