import { API } from "../../utils/API/API";


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
};