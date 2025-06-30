import { INITIAL_PRODUCTS_STATE, productsReducer } from "../reducers/products/products.reducer";
import { createContext, useReducer } from "react";


export const ProductsContext = createContext();

const RecipesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, INITIAL_PRODUCTS_STATE);

  return (
    <ProductsContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default RecipesProvider;