export const INITIAL_PRODUCTS_STATE = {
  products: [],
  loading: false,
  error: null,
  productId: null,
  product: null
};

export const productsReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };   
    case "GET_PRODUCTS":
      return {
        ...state,
        loading: false,
        products: action.payload,
        };
    case "TOGGLE_LIKE":
      return {
        ...state,
        products: [...action.payload],
      };
    case "CREATE_PRODUCT":
      return {
        ...state,
        loading: false,
        productId: action.payload,
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
      };
    case "GET_PRODUCT": 
      return {
        ...state, 
        product: { ...action.payload },
        loading: false
      }
    default:
      return state;
  }
};