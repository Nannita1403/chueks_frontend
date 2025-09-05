import { useState, useEffect, useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Image, Text, Flex, Select, useToast, IconButton
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import ApiService from "../../reducers/api/Api.jsx";
import { toggleFavorite } from "../ToggleFavorite/ToggleFavorite.jsx";

function flattenColors(colors = []) {
  const out = [];
  colors.forEach((c) => {
    const names = Array.isArray(c?.name) ? c.name : (c?.name ? [c.name] : []);
    names.forEach((n) => out.push({ name: n, stock: Number(c?.stock) || 0 }));
  });
  return out;
}

const ProductModal = ({ isOpen, onClose, product, addToCartHandler }) => {
  const { user, refreshCart, token } = useAuth();
  const toast = useToast();

  const [modalProduct, setModalProduct] = useState(product);
  const colorItems = useMemo(() => flattenColors(product?.colors), [product]);
  const [selectedColor, setSelectedColor] = useState(colorItems?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!product) return;
    setModalProduct(product);
    setSelectedColor(colorItems?.[0] || null);
    setQuantity(1);
    setIsFavorite(Boolean(user?.favorites?.some?.(f => f._id === product._id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?._id, user]);

  const maxQty = Math.max(1, Number(selectedColor?.stock) || 1);

  const handleToggleFavorite = async () => {
  if (!user) {
    return toast({ title: "Debes iniciar sesión", status: "warning" });
  }
  await toggleFavorite(modalProduct._id);
  setIsFavorite(!isFavorite); // actualiza el estado local del corazón
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
          color: (selectedColor?.name || "").trim(),
        });
      }

      if (typeof refreshCart === "function") await refreshCart();
      window.dispatchEvent(new CustomEvent("cart:updated"));

      toast({ title: `${qty} ${modalProduct.name} agregados al carrito`, status: "success" });
      setQuantity(1);
    } catch (e) {
      console.error(e);
      toast({ title: "No se pudo agregar al carrito", status: "error" });
    }
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

          <Flex mt={4} gap={3} wrap="wrap">
            <Button colorScheme="teal" onClick={handleAddToCart} isDisabled={selectedColor?.stock === 0}>
              Agregar al carrito
            </Button>
            <IconButton
              aria-label="Favorito"
              icon={isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
              onClick={handleToggleFavorite}
            />
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
