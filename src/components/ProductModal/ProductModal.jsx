import { useState, useEffect, useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Image, Text, Flex, Select, useToast
} from "@chakra-ui/react";
import { toggleLike } from "../../reducers/products/toggleLike.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import ApiService from "../../reducers/api/Api.jsx";

function flattenColors(colors = []) {
  const out = [];
  colors.forEach((c) => {
    const names = Array.isArray(c?.name) ? c.name : (c?.name ? [c.name] : []);
    names.forEach((n) => out.push({ name: n, stock: Number(c?.stock) || 0 }));
  });
  return out;
}

const ProductModal = ({ isOpen, onClose, product, products, setProducts, addToCartHandler }) => {
  const { user, refreshCart } = useAuth(); // 👈 usaremos refreshCart si está disponible
  const toast = useToast();

  const [modalProduct, setModalProduct] = useState(product);
  const colorItems = useMemo(() => flattenColors(product?.colors), [product]);
  const [selectedColor, setSelectedColor] = useState(colorItems?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);


  useEffect(() => {
    if (!product) return;
    setModalProduct(product);
    setSelectedColor(colorItems?.[0] || null);
    setQuantity(1);
    setLiked(Boolean(user && product.likes?.includes(user.id)));
    setInWishlist(Boolean(user && user.wishlist?.includes?.(product._id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?._id, user]);

  const maxQty = Math.max(1, Number(selectedColor?.stock) || 1);

  const handleToggleLike = async () => {
    if (!user) return toast({ title: "Debes iniciar sesión", status: "warning" });
    try {
      await toggleLike(modalProduct._id, !liked, products, setProducts);
      setLiked((prev) => !prev);
      const updated = products.find((p) => p._id === modalProduct._id);
      if (updated) setModalProduct(updated);
      toast({ title: liked ? "Quitado de favoritos" : "Agregado a favoritos", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error actualizando like", status: "error" });
    }
  };

const handleAddToCart = async () => {
  if (!selectedColor) return toast({ title: "Selecciona un color", status: "warning" });
  if (!user) return toast({ title: "Debes iniciar sesión para agregar al carrito", status: "warning" });

  const qty = Math.min(quantity, maxQty);

  try {
    if (typeof addToCartHandler === "function") {
      await addToCartHandler(modalProduct, qty, { name: selectedColor.name });
    } else {
      await ApiService.post("/cart/add", {
        productId: modalProduct._id,
        quantity: qty,
        color: (color?.name || "").trim(),
      });
    }

    // 🔁 refresca el contador del header
    if (typeof refreshCart === "function") await refreshCart();
    window.dispatchEvent(new CustomEvent("cart:updated"));

    toast({ title: `${qty} ${modalProduct.name} agregados al carrito`, status: "success" });
    setQuantity(1);
    // onClose(); // si quieres cerrar el modal al agregar
  } catch (e) {
    console.error(e);
    toast({ title: "No se pudo agregar al carrito", status: "error" });
  }
};

  const handleToggleWishlist = () => {
    setInWishlist((prev) => !prev);
    toast({
      title: `${modalProduct?.name} ${inWishlist ? "eliminado de" : "agregado a"} wishlist`,
      status: "success",
    });
    // TODO: llamar a tu endpoint real de wishlist si lo tienes
  };

  return (
    <Modal isOpen={!!modalProduct && isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalProduct?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={modalProduct?.imgPrimary || "/placeholder.svg"}
            alt={modalProduct?.name}
            mb={4}
            borderRadius="md"
            objectFit="cover"
            w="100%"
            maxH="320px"
          />
          {modalProduct?.description && <Text mb={2}>{modalProduct.description}</Text>}

          <Text><strong>Precio Unitario:</strong> ${modalProduct?.priceMin}</Text>
          {typeof modalProduct?.priceMay === "number" && (
            <Text><strong>Precio Mayorista:</strong> ${modalProduct.priceMay}</Text>
          )}

          {selectedColor && (
            <Text mt={1}><strong>Stock color:</strong> {selectedColor.stock}</Text>
          )}
          {selectedColor?.stock > 0 && selectedColor.stock < 5 && (
            <Text color="red.500">¡Solo quedan {selectedColor.stock} unidades de este color!</Text>
          )}

          <Select
            mt={3}
            value={selectedColor?.name || ""}
            onChange={(e) => {
              const color = colorItems.find((c) => c.name === e.target.value);
              setSelectedColor(color || null);
              setQuantity(1);
            }}
          >
            {colorItems.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.stock} disponibles)
              </option>
            ))}
          </Select>

          <Flex mt={3} align="center" gap={2}>
            <Button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</Button>
            <Text>{quantity}</Text>
            <Button onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}>+</Button>
          </Flex>

          <Flex mt={4} gap={2} wrap="wrap">
            <Button colorScheme="teal" onClick={handleAddToCart} isDisabled={selectedColor?.stock === 0}>
              Agregar al carrito
            </Button>
            <Button onClick={handleToggleLike}>{liked ? "❤️" : "🤍"}</Button>
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
