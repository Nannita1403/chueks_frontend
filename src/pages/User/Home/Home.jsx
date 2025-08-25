import React, { useEffect, useState } from "react";
import productsActions from "../../../reducers/products/products.actions.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsActions.getProducts();
        // ✅ Aquí accedemos correctamente al array de productos
        if (response && Array.isArray(response.products)) {
          setProducts(response.products);
        } else {
          setProducts([]);
          console.warn("No se encontró el array de productos en la respuesta:", response);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio mínimo: ${product.priceMin}</p>
              <p>Precio mayorista: ${product.priceMay}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
