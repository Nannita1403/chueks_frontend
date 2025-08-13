import apiService from "../api/api.actions.jsx"
class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post("/users/register", userData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post("/users/login", credentials)

      if (response.token) {
        apiService.setToken(response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      throw error
    }
  }

  // Verify account
  async verifyAccount(id) {
    try {
      const response = await apiService.get(`/users/verify/${id}`)

      if (response.token) {
        apiService.setToken(response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      throw error
    }
  }

  // Check session
  async checkSession() {
    try {
      const response = await apiService.get("/users/checksession")
      return response
    } catch (error) {
      throw error
    }
  }

  // Logout user
  logout() {
    apiService.setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("token")
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    return user && user.rol === "admin"
  }
}

export default new AuthService()



/*import { API } from "../../utils/API/API";

/*const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Toaster({ title: 'Login exitoso', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      Toaster({ title: 'Error al iniciar sesión', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };*/

/*
export const login = async (body, dispatch, navigate) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({
    endpoint: "/users/login",
    method: "POST",
    body,
    content_type: true,
  });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "LOGIN", payload: response });
    localStorage.setItem("token", response.token);
    navigate("/");
  }
};

export const checkSession = async (dispatch, navigate) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: "/users/checksession" });

  if (error) {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  } else {
    dispatch({ type: "LOGIN", payload: response });
    navigate("/");
  }
};

/*const handleRegister = async () => {
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, telephone, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      Toaster({ title: 'Registro exitoso', description: 'Verifica tu email para continuar.', status: 'success', duration: 4000, isClosable: true });
    } catch (error) {
      Toaster({ title: 'Error al registrarse', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };
*/
/*
export const registerUser = async (body, dispatch, navigate) => {
  dispatch({ type: "LOADING" });

  const { error } = await API({
    endpoint: "/users/register",
    method: "POST",
    body,
    content_type: true,
  });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({
      type: "REGISTER",
      payload: { email: body.email, password: body.password },
    });
    navigate("/verifyaccount");
  }
};

export const verifyAccount = async (id, dispatch, navigate) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: `/users/verifyaccount/${id}` });

  if (!error) {
    dispatch({ type: "LOGIN", payload: response });
    localStorage.setItem("token", response.token);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  } else {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }

};*/