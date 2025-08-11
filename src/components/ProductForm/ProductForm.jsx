import { useContext } from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { UsersContext } from "../../providers/UsersProvider";
import { ProductsContext } from "@/providers/ProductsProviders";
import { toggleLike } from "@/reducers/products/products.actions";
import { Card, Flex } from "@chakra-ui/react";

const Product = ({ product }) => {
  const { state: productsState, dispatch } = useContext(ProductsContext);
  const { state } = useContext(UsersContext);
  const { user } = state;
  const { products } = productsState;

  return (
    <Flex className="product">
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
      >
        {
          <p
            style={{
              color: product?.likes?.includes(user?._id) ? "white" : "black",
            }}
          >
            {product.likes.length}
          </p>
        }
        {product?.likes?.includes(user?._id) ? (
          <img src="/icons/corazon-relleno.png" className="heart" />
        ) : (
          <img src="/icons/corazon-vacio.png" className="heart" />
        )}
      </Card>

      <div className="img">
        <img src={product.img} />
      </div>
      <div className="info">
        <h3>{product.title}</h3>
        <div>
          <p>Dificultad: {product.difficulty}</p>
          <p>⏱ {product.time} min</p>
        </div>
      </div>
      <Card className="categories">
        <div>
          {product.categories.map((category) => (
            <img
              src={allergensImgs[category].src}
              alt={allergensImgs[category].alt}
              title={category}
              key={category}
            />
          ))}
        </div>
        <Button width="auto">
          <Link to={`/product/${product._id}`}>Ver Producto</Link>
        </Button>
      </Card>
    </Flex>
  );
};

export default Recipe;