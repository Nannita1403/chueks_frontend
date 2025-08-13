import apiService from "../api/api.actions.jsx"
class ProductsService {
  // Get all products
  async getProducts() {
    try {
      const response = await apiService.get("/products")
      return response
    } catch (error) {
      throw error
    }
  }

  // Get single product
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Create new product (admin only)
  async createProduct(productData) {
    try {
      const formData = new FormData()

      // Add text fields
      Object.keys(productData).forEach((key) => {
        if (key !== "imgPrimary" && key !== "imgSecondary") {
          if (Array.isArray(productData[key])) {
            formData.append(key, JSON.stringify(productData[key]))
          } else {
            formData.append(key, productData[key])
          }
        }
      })

      // Add image files
      if (productData.imgPrimary) {
        formData.append("imgPrimary", productData.imgPrimary)
      }
      if (productData.imgSecondary) {
        formData.append("imgSecondary", productData.imgSecondary)
      }

      const response = await apiService.postFormData("/products", formData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Update product (admin only)
  async updateProduct(id, productData) {
    try {
      const formData = new FormData()

      // Add text fields
      Object.keys(productData).forEach((key) => {
        if (key !== "imgPrimary" && key !== "imgSecondary") {
          if (Array.isArray(productData[key])) {
            formData.append(key, JSON.stringify(productData[key]))
          } else {
            formData.append(key, productData[key])
          }
        }
      })

      // Add image files if provided
      if (productData.imgPrimary) {
        formData.append("imgPrimary", productData.imgPrimary)
      }
      if (productData.imgSecondary) {
        formData.append("imgSecondary", productData.imgSecondary)
      }

      const response = await apiService.putFormData(`/products/${id}`, formData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Toggle like on product
  async toggleLike(productId, addLike) {
    try {
      const response = await apiService.put(`/products/toggleLike/${productId}/${addLike}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete product (admin only)
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default new ProductsService()

/*import { API } from "../../utils/API/API";


export const getProducts = async (dispatch) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: "/products" });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "GET_PRODUCTS", payload: response });
  }
};

export const filterProducts = async (dispatch, data) => {
  dispatch({ type: "LOADING" });

  let query = "/products?";

  for (const key in data) {
    if (data[key]) {
      query += `${key}=${data[key]}&`;
    }
  }

  const { error, response } = await API({
    endpoint: query,
  });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    console.log(response);
    dispatch({ type: "GET_PRODUCTS", payload: response });
  }
};

export const toggleLike = async (
  idProduct,
  dispatch,
  idUser,
  addLike = true,
  products
) => {
  let newProducts = [];

  newProducts = products.map((product) => {
    if (product._id === idProduct) {
      addLike
        ? product.likes.push(idUser)
        : product.likes.splice(product.likes.indexOf(idUser), 1);
    }
    return product;
  });

  dispatch({ type: "TOGGLE_LIKE", payload: newProducts });

  const { error, response } = await API({
    method: "PUT",
    endpoint: `/products/toggleLike/${idProduct}/${addLike}`,
    content_type: true,
    body: { likes: [idUser] },
  });
};

export const createProduct = async (body, dispatch, setStep) => {
  dispatch({ type: "LOADING" });

  console.log(body);

  const { error, response } = await API({
    method: "POST",
    endpoint: "/products",
    body,
  });

  if (!error) {
    setStep(1);
    dispatch({ type: "CREATE_PRODUCT", payload: response.product._id });
  }

  console.log(error);
  console.log(response);
};

export const updateProduct = async (body, dispatch, navigate, id) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({
    method: "PUT",
    endpoint: `/products/${id}`,
    body,
    content_type: true,
  });

  if (!error) {
    dispatch({ type: "UPDATE_PRODUCT", payload: response.product });
    navigate(`/product/${response.product._id}`);
  }
};

export const getProduct = async (dispatch, id) => {
  dispatch({ type: "LOADING" });

  const { error, response } = await API({ endpoint: `/products/${id}` });

  if (error) {
    dispatch({ type: "ERROR", payload: error });
  } else {
    dispatch({ type: "GET_PRODUCT", payload: response });
  }
};*/