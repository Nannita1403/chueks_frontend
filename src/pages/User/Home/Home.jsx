import { useEffect, useState } from "react";
import ProductsActions from "../../../reducers/products/products.actions.jsx";
import Product from "../../../components/Product/Product.jsx"; 

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductsActions.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error cargando productos en Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  if (products.length === 0) return <p>No hay productos disponibles</p>;

  return (
    <div className="products-list">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Home;
