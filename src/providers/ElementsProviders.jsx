// providers/ElementsProviders.jsx
import ElementsActions from "../../src/reducers/elements/elements.actions.jsx";
import {
  elementsReducer,
  INITIAL_ELEMENTS_STATE,
} from "../../src/reducers/elements/elements.reducer.jsx";
import { createContext, useReducer, useCallback } from "react";

export const ElementsContext = createContext();

const ElementsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(elementsReducer, INITIAL_ELEMENTS_STATE);

  // Obtener todos los elementos
  const getElements = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ElementsActions.getElements();
      // La API puede responder con distintos formatos
      const list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.elements || res?.elements || [];
      dispatch({ type: "GET_ELEMENTS", payload: list });
      console.log("✅ Elements cargados (provider):", list);
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      console.error("❌ Error al cargar elementos:", err);
    }
  }, []);

  // Obtener un elemento
  const getElement = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ElementsActions.getElement(id);
      dispatch({ type: "GET_ELEMENT", payload: res?.data || res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Crear elemento
  const createElement = useCallback(async (data) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ElementsActions.createElement(data);
      dispatch({ type: "CREATE_ELEMENT", payload: res?.data || res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Actualizar elemento
  const updateElement = useCallback(async (id, data) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await ElementsActions.updateElement(id, data);
      dispatch({ type: "UPDATE_ELEMENT", payload: res?.data || res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  // Eliminar elemento
  const deleteElement = useCallback(async (id) => {
    dispatch({ type: "LOADING" });
    try {
      await ElementsActions.deleteElement(id);
      dispatch({ type: "DELETE_ELEMENT", payload: id }); // ✅ caso limpio en el reducer
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  return (
    <ElementsContext.Provider
      value={{
        elements: state.elements, // ✅ nunca undefined, al menos []
        element: state.element,
        loading: state.loading,
        error: state.error,
        getElements,
        getElement,
        createElement,
        updateElement,
        deleteElement,
        clearError,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};

export default ElementsProvider;
