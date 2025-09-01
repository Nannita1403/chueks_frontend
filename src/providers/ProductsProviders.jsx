// ProductsProviders.jsx
import productsActions from "../../src/reducers/products/products.actions.jsx";
import {
  INITIAL_PRODUCTS_STATE,
  productsReducer,
} from "../reducers/products/products.reducer";
import { createContext, useReducer, useCallback } from "react";

export const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, INITIAL_PRODUCTS_STATE);

  // Obtener todos los productos
  const getProducts = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try {
      const products = await productsActions.getProducts();
      dispatch({ type: "GET_PRODUCTS", payload: products });
      console.log("✅ Productos cargados (provider):", products);
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      console.error("❌ Error al cargar productos:", err);
    }
  }, []);

  // Obtener un producto
  const getProduct = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const product = await productsActions.getProduct(id);
      dispatch({ type: "GET_PRODUCT", payload: product });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (data) => {
    dispatch({ type: "LOADING" });
    try {
      const product = await productsActions.createProduct(data);
      dispatch({ type: "CREATE_PRODUCT", payload: product });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Actualizar producto
  const updateProduct = useCallback(async (id, data) => {
    dispatch({ type: "LOADING" });
    try {
      const product = await productsActions.updateProduct(id, data);
      dispatch({ type: "UPDATE_PRODUCT", payload: product });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Eliminar producto
  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      await productsActions.deleteProduct(id);
      dispatch({ type: "DELETE_PRODUCT", payload: id }); // ✅ ahora usa el reducer
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
        clearError,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
