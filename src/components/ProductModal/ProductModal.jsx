import { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Image, Text, Flex, Select, useToast
} from "@chakra-ui/react";
import { toggleLike } from "../../reducers/products/toggleLike.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";

const ProductModal = ({ isOpen, onClose, product, products, setProducts, addToCartHandler }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [modalProduct, setModalProduct] = useState(product);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Normaliza los colores para que siempre tengan un name string
  const normalizeColors = (colors) =>
    colors?.map(c => ({
      ...c,
      name: Array.isArray(c.name) ? c.name.join(" / ") : c.name
    }));

  // Inicializar cuando se abre el modal o cambia el producto
  useEffect(() => {
    if (!product) return;
    const normalizedColors = normalizeColors(product.colors);
    setModalProduct({ ...product, colors: normalizedColors });
    setSelectedColor(normalizedColors?.[0] || null);
    setQuantity(1);
    setLiked(user && product.likes?.includes(user.id));
    setInWishlist(user && user.wishlist?.includes(product._id));
  }, [isOpen, product?._id, user]);

  const handleToggleLike = async () => {
    if (!user) return toast({ title: "Debes iniciar sesión", status: "warning" });
    try {
      await toggleLike(modalProduct._id, !liked, products, setProducts);
      setLiked(prev => !prev);
      // Actualizamos modalProduct para reflejar cambios en cantidad de likes
      const updated = products.find(p => p._id === modalProduct._id);
      if (updated) setModalProduct(updated);
      toast({ title: liked ? "Quitado de favoritos" : "Agregado a favoritos", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error actualizando like", status: "error" });
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor) return toast({ title: "Selecciona un color", status: "warning" });
    const qty = Math.min(quantity, selectedColor.stock || 1);
    addToCartHandler(modalProduct, qty, selectedColor);
    toast({ title: `${qty} ${modalProduct.name} agregados al carrito`, status: "success" });
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    setInWishlist(prev => !prev);
    toast({ title: `${modalProduct.name} ${inWishlist ? "eliminado de" : "agregado a"} wishlist`, status: "success" });
    // Aquí podés hacer dispatch o API para wishlist real
  };

  return (
    <Modal isOpen={!!modalProduct && isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalProduct?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={modalProduct?.imgPrimary || "/placeholder.svg"} alt={modalProduct?.name} mb={4} borderRadius="md" />
          <Text mb={2}>{modalProduct?.description}</Text>
          <Text><strong>Precio Unitario:</strong> ${modalProduct?.priceMin}</Text>
          <Text><strong>Precio Mayorista:</strong> ${modalProduct?.priceMay}</Text>
          <Text mb={2}><strong>Stock total:</strong> {modalProduct?.stock}</Text>
          {selectedColor?.stock < 5 && <Text color="red.500">¡Solo quedan {selectedColor?.stock} unidades de este color!</Text>}

          {/* Selección de colores */}
          <Select
            mt={2}
            value={selectedColor?.name || ""}
            onChange={(e) => {
              const color = modalProduct.colors.find(c => c.name === e.target.value);
              setSelectedColor(color);
              setQuantity(1);
            }}
          >
            {modalProduct?.colors?.map(c => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.stock} disponibles)
              </option>
            ))}
          </Select>

          {/* Cantidad */}
          <Flex mt={2} align="center" gap={2}>
            <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
            <Text>{quantity}</Text>
            <Button onClick={() => setQuantity(q => Math.min(selectedColor?.stock || 1, q + 1))}>+</Button>
          </Flex>

          {/* Botones acción */}
          <Flex mt={3} gap={2}>
            <Button colorScheme="teal" onClick={handleAddToCart}>Agregar al carrito</Button>

            <Button onClick={handleToggleLike}>
              {liked ? "❤️" : "🤍"} 
            </Button>

            <Button
              onClick={handleToggleWishlist}
              bg={inWishlist ? "black" : "white"}
              color={inWishlist ? "white" : "black"}
              border="1px solid black"
              _hover={{ bg: inWishlist ? "gray.800" : "gray.100" }}
            >
              💖 Wishlist
            </Button>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
