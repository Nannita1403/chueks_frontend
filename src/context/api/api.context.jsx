
import usersActions from "../../reducers/users/users.actions.jsx"
import { createContext, useContext, useReducer, useEffect } from "react"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case "LOGIN_FAILURE":
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
        loading: false, // Set loading to false on logout
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
  loading: true, // Start with loading true to check initial auth state
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const user = usersActions.getCurrentUser()

      if (token && user) {
        try {
          await UsersActions.checkSession()
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          })
        } catch (error) {
          UsersActions.logout()
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "LOGOUT" })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await rvice.login(credentials)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
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
      const response = await UsersActions.register(userData)
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
    UsersActions.logout()
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
