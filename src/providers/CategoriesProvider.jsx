import { createContext, useEffect, useState } from "react";
import api from "../reducers/api/Api.jsx";

export const CategoriesContext = createContext();

const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.categories || []);
    } catch (err) {
      setError("Error cargando categorías");
      console.error("❌ Error fetchCategories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    try {
      const res = await api.post("/products/categories", data);
      setCategories((prev) => [...prev, res.category]);
    } catch (err) {
      console.error("❌ Error createCategory:", err);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const res = await api.put(`/products/categories/${id}`, data);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? res.category : cat))
      );
    } catch (err) {
      console.error("❌ Error updateCategory:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/products/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("❌ Error deleteCategory:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
