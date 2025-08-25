import productsActions from "../../src/reducers/products/products.actions.jsx"
import { INITIAL_PRODUCTS_STATE, productsReducer } from "../reducers/products/products.reducer";
import { createContext, useReducer } from "react";


export const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, INITIAL_PRODUCTS_STATE);

  // Actions que llaman a la API y actualizan el reducer
  const getProducts = async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await productsActions.getProducts();
      dispatch({ type: "GET_PRODUCTS", payload: res.data }); // 👈 importante usar .data
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const getProduct = async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ProductsActions.getProduct(id);
      dispatch({ type: "GET_PRODUCT", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        product: state.product,
        loading: state.loading,
        error: state.error,
        getProducts,
        getProduct,
        dispatch,
        clearError,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;