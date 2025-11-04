import { createContext, useEffect, useState, useCallback  } from "react";
import api from "../reducers/api/Api.jsx";

export const CategoriesContext = createContext();

const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products/categories");
      setCategories(res.categories || []);
    } catch (err) {
      console.error("❌ Error fetchCategories:", err);
      setError("Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/products/categories", data);
      if (res.category) {
        setCategories((prev) => [...prev, res.category]);
      }
    } catch (err) {
      console.error("❌ Error createCategory:", err);
      setError("No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const res = await api.put(`/products/categories/${id}`, data);
      if (res.category) {
        setCategories((prev) =>
          prev.map((category) => (category._id === id ? res.category : category))
        );
      }
    } catch (err) {
      console.error("❌ Error updateCategory:", err);
      setError("No se pudo actualizar la categoría");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.delete(`/products/categories/${id}`);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      console.error("❌ Error deleteCategory:", err);
      setError("No se pudo eliminar la categoría");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoriesContext.Provider
        value={{
        categories,
        loading,
        error,
        fetchCategories,
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
