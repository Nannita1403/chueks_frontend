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
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "GET_ELEMENTS":
      return {
        ...state,
        loading: false,
        elements: [...action.payload],
      };
    case "CREATE_ELEMENT":
      return {
        ...state,
        loading: false,
        elementId: action.payload,
      };
    case "UPDATE_ELEMENT":
      return {
        ...state,
        loading: false,
        elements: [...state.elements, action.payload.element],
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