import productsActions from "../../src/reducers/products/products.actions.jsx";
import { INITIAL_PRODUCTS_STATE, productsReducer } from "../reducers/products/products.reducer";
import { createContext, useReducer, useCallback } from "react";

export const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, INITIAL_PRODUCTS_STATE);

  const getProducts = useCallback(async () => {
  dispatch({ type: "LOADING" });
  try {
    const products = await productsActions.getProducts(); // ← ya es array
    dispatch({ type: "GET_PRODUCTS", payload: products });
    console.log("✅ Productos cargados (provider):", products);
  } catch (err) {
    dispatch({ type: "ERROR", payload: err.message });
    console.error("❌ Error al cargar productos:", err);
  }
}, []);


  const getProduct = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
    const product = await productsActions.getProduct(id);
    dispatch({ type: "GET_PRODUCT", payload: product });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const createProduct = useCallback(async (data) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await productsActions.createProduct(data);
      dispatch({ type: "CREATE_PRODUCT", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await productsActions.updateProduct(id, data);
      dispatch({ type: "UPDATE_PRODUCT", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      await productsActions.deleteProduct(id);
      dispatch({
        type: "GET_PRODUCTS",
        payload: (prevProducts) => prevProducts.filter((p) => p._id !== id),
      });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        product: state.product,
        loading: state.loading,
        error: state.error,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        dispatch,
        clearError,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
