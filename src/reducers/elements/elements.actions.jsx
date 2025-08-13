import apiService from "../api/Api.jsx"
class ElementsActions {
  // Get all elements
  async getElements() {
    try {
      const response = await apiService.get("/elements")
      return response
    } catch (error) {
      throw error
    }
  }

  // Get single element
  async getElement(id) {
    try {
      const response = await apiService.get(`/elements/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Create new element (admin only)
  async createElement(elementData) {
    try {
      const formData = new FormData()

      // Add text fields
      Object.keys(elementData).forEach((key) => {
        if (key !== "logo") {
          if (Array.isArray(elementData[key])) {
            formData.append(key, JSON.stringify(elementData[key]))
          } else {
            formData.append(key, elementData[key])
          }
        }
      })

      // Add logo file
      if (elementData.logo) {
        formData.append("logo", elementData.logo)
      }

      const response = await apiService.postFormData("/elements", formData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Update element (admin only)
  async updateElement(id, elementData) {
    try {
      const formData = new FormData()

      // Add text fields
      Object.keys(elementData).forEach((key) => {
        if (key !== "logo") {
          if (Array.isArray(elementData[key])) {
            formData.append(key, JSON.stringify(elementData[key]))
          } else {
            formData.append(key, elementData[key])
          }
        }
      })

      // Add logo file if provided
      if (elementData.logo) {
        formData.append("logo", elementData.logo)
      }

      const response = await apiService.putFormData(`/elements/${id}`, formData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete element (admin only)
  async deleteElement(id) {
    try {
      const response = await apiService.delete(`/elements/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default new ElementsActions()


/*import { API } from "../../utils/API/API";

export const createElement = async (
  data,
  image,
  setError,
  imageRef,
  reset,
  setImage,
  dispatch,
  setOpenned,
  materialSelected,
  styleSelected,
  typeSelected
) => {
  if (!image) {
    setError("image", {
      message: "Tienes que subir un logo para el ingrediente",
    });
    return;
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("logo", imageRef.current.files[0]);

  for (const material of materialSelected) {
    formData.append("material", material);
  };

   for (const style of styleSelected) {
    formData.append("style", style);
  }

  for (const type of typeSelected) {
    formData.append("type", type);
  }
  dispatch({ type: "LOADING" });

  const { error, response } = await API({
    method: "POST",
    endpoint: "/elements",
    body: formData,
  });

  if (error) {
    setError("subida", {
      message:
        "El elemento no se ha creado por fallo del servidor, prueba de nuevo en un rato",
    });
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "POST_ELEMENTS", payload: response });
    reset();
    setImage();
    setOpenned(true);
  }
};

export const getElements = async (dispatch) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: "/elements" });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "GET_ELEMENTS", payload: response });
  }
};

export const getElement = async (dispatch, id) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: `/elements/${id}` });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "GET_ELEMENT", payload: response });
  }
};

export const updateElement = async (body, dispatch, navigate, id) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({
    method: "PUT",
    endpoint: `/elements/${id}`,
    body,
    content_type: true,
  });

  if (!error) {
    dispatch({ type: "UPDATE_ELEMENT", payload: response.element });
    navigate(`/element/${response.element._id}`);
  }
};
*/