export const INITIAL_ELEMENTS_STATE = {
  elements: [],
  loading: false,
  error: null,
  element: null,
  elementId: null
};

export const elementsReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "GET_ELEMENTS":
      return {
        ...state,
        loading: false,
        elements: action.payload, // 👈 ya llega un array limpio
      };
    case "CREATE_ELEMENT":
      return {
          ...state,
        loading: false,
        elements: [...state.elements, action.payload],
        elementId: action.payload.id, // si tu backend devuelve el objeto completo
      };
    case "UPDATE_ELEMENT":
      return {
        ...state,
        loading: false,
        elements: state.elements.map((el) =>
        el.id === action.payload.id ? action.payload : el
    ),
  };
    case "GET_ELEMENT": 
      return {
        ...state, 
        element: { ...action.payload },
        loading: false
      }
    default:
      return state;
  }
};