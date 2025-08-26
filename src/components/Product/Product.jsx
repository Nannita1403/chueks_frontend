import { useContext } from "react";
import Button from "../../components/Button/Button.jsx";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Auth/auth.context.jsx";
import { ProductsContext } from "../../providers/ProductsProviders.jsx";
import { toggleLike } from "../../reducers/products/toggleLike.jsx";
import { Card, Flex } from "@chakra-ui/react";

const Product = ({ product }) => {
  const { state: productsState, dispatch } = useContext(ProductsContext);
  const { state } = useContext(AuthContext);
  const { user } = state;
  const { products } = productsState;

  return (
    <Flex className="product" direction="column" gap="4" p="4" border="1px solid #eee" borderRadius="lg">
      {/* Botón Like */}
      <Card
        className="like"
        onClick={() =>
          toggleLike(
            product._id,
            dispatch,
            user._id,
            !product?.likes?.includes(user?._id),
            products
          )
        }
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}
      >
        <p style={{ color: product?.likes?.includes(user?._id) ? "red" : "black" }}>
          {product.likes.length}
        </p>
        {product?.likes?.includes(user?._id) ? (
          <img src="/icons/corazon-relleno.png" className="heart" />
        ) : (
          <img src="/icons/corazon-vacio.png" className="heart" />
        )}
      </Card>

      {/* Imagen */}
      <div className="img">
        <img src={product.imgPrimary} alt={product.name} style={{ width: "100%", borderRadius: "8px" }} />
      </div>

      {/* Info */}
      <div className="info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div>
          <p><strong>Precio Unitario:</strong> ${product.priceMin}</p>
          <p><strong>Mayorista:</strong> ${product.priceMay}</p>
        </div>

        <p><strong>Categoría:</strong> {product.category?.join(", ")}</p>
        <p><strong>Estilo:</strong> {product.style?.join(", ")}</p>

        {/* Colores */}
        <div style={{ marginTop: "8px" }}>
          {product.colors?.map((color, i) => (
            <span key={i} style={{ marginRight: "8px", fontSize: "12px" }}>
              {color.name?.join(", ")} ({color.stock})
            </span>
          ))}
        </div>
      </div>

      {/* Ver Producto */}
      <Card className="categories">
        <Button width="auto">
          <Link to={`/product/${product._id}`}>Ver Producto</Link>
        </Button>
      </Card>
    </Flex>
  );
};

export default Product;
