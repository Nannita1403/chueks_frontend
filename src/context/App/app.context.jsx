import { createContext, useContext, useReducer } from "react"

const AppContext = createContext()

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        productsLoading: false,
      }
    case "SET_PRODUCTS_LOADING":
      return {
        ...state,
        productsLoading: action.payload,
      }
    case "SET_ELEMENTS":
      return {
        ...state,
        elements: action.payload,
        elementsLoading: false,
      }
    case "SET_ELEMENTS_LOADING":
      return {
        ...state,
        elementsLoading: action.payload,
      }
    case "ADD_TO_FAVORITES":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      }
    case "SET_FAVORITES":
      return {
        ...state,
        favorites: action.payload,
      }
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) => item.productId === action.payload.productId && item.color === action.payload.color,
      )

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.payload.productId && item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (item) => !(item.productId === action.payload.productId && item.color === action.payload.color),
        ),
      }
    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === action.payload.productId && item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      }
    default:
      return state
  }
}

const initialState = {
  products: [],
  elements: [],
  favorites: [],
  cart: [],
  productsLoading: false,
  elementsLoading: false,
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setProducts = (products) => {
    dispatch({ type: "SET_PRODUCTS", payload: products })
  }

  const setProductsLoading = (loading) => {
    dispatch({ type: "SET_PRODUCTS_LOADING", payload: loading })
  }

  const setElements = (elements) => {
    dispatch({ type: "SET_ELEMENTS", payload: elements })
  }

  const setElementsLoading = (loading) => {
    dispatch({ type: "SET_ELEMENTS_LOADING", payload: loading })
  }

  const addToFavorites = (productId) => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: productId })
  }

  const removeFromFavorites = (productId) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: productId })
  }

  const setFavorites = (favorites) => {
    dispatch({ type: "SET_FAVORITES", payload: favorites })
  }

  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item })
  }

  const removeFromCart = (productId, color) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, color } })
  }

  const updateCartQuantity = (productId, color, quantity) => {
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { productId, color, quantity },
    })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const value = {
    ...state,
    setProducts,
    setProductsLoading,
    setElements,
    setElementsLoading,
    addToFavorites,
    removeFromFavorites,
    setFavorites,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
