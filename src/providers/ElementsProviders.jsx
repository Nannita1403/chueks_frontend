import ElementsActions from "../../src/reducers/elements/elements.actions.jsx";
import { elementsReducer, INITIAL_ELEMENTS_STATE } from "../../src/reducers/elements/elements.reducer.jsx";
import { createContext, useReducer } from "react";



export const ElementsContext = createContext();

const ElementsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(elementsReducer, INITIAL_ELEMENTS_STATE);

  // Obtener todos los elementos
  const getElements = async () => {
  dispatch({ type: "LOADING" });
  try {
    const res = await ElementsActions.getElements();
    const list = res.data.elements; 
    dispatch({ type: "GET_ELEMENTS", payload: list });
  } catch (err) {
    dispatch({ type: "ERROR", payload: err.message });
  }
};

  // Obtener un elemento por id
  const getElement = async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ElementsActions.getElement(id);
      dispatch({ type: "GET_ELEMENT", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <ElementsContext.Provider
      value={{
        elements: state.elements,
        element: state.element,
        loading: state.loading,
        error: state.error,
        getElements,
        getElement,
        dispatch,
        clearError,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};

export default ElementsProvider;