import { elementsReducer, INITIAL_ELEMENTS_STATE } from "../../src/reducers/elements/elements.reducer";
import { createContext, useReducer } from "react";


export const ElementsContext = createContext();

const ElementsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    elementsReducer,
    INITIAL_ELEMENTS_STATE
  );

  return (
    <ElementsContext.Provider value={{ state, dispatch }}>
      {children}
    </ElementsContext.Provider>
  );
};

export default ElementsProvider;