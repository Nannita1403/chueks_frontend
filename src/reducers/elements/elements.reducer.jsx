export const INITIAL_ELEMENTS_STATE = {
  elements: [],
  loading: false,
  error: null,
  element: null,
  elementId: null,
};

export const elementsReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    case "GET_ELEMENTS_SUCCESS":
      return { ...state, loading: false, elements: action.payload };

    case "GET_ELEMENT_SUCCESS":
      return { ...state, loading: false, element: action.payload };

    case "CREATE_ELEMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        elements: [...state.elements, action.payload],
        elementId: action.payload._id || action.payload.id,
      };

    case "UPDATE_ELEMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        elements: state.elements.map((el) =>
          el._id === action.payload._id ? action.payload : el
        ),
      };

    case "DELETE_ELEMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        elements: state.elements.filter((el) => el._id !== action.payload),
      };

    default:
      return state;
  }
};
