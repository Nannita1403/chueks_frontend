import { useState, useEffect, useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, Text, Flex, Select, IconButton, useColorModeValue} from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import ApiService from "../../reducers/api/Api.jsx";
import { useToast } from "../../Hooks/useToast.jsx";
import { HeartLoading } from "../../components/Loading/Loading.jsx";

function flattenColors(colors = []) {
  return colors.flatMap((c) => {
    const names = Array.isArray(c?.name) ? c.name : c?.name ? [c.name] : [];
    return names.map((n) => ({
      name: n,
      stock: Number(c?.stock) || 0,
    }));
  });
}

const ProductModal = ({ isOpen, onClose, product, addToCartHandler }) => {
  const { user, refreshCart, toggleFavorite, refreshFavorites } = useAuth();
  const { toast } = useToast();

  const [modalProduct, setModalProduct] = useState(product);
  const colorItems = useMemo(() => flattenColors(product?.colors), [product]);

  const [selectedColor, setSelectedColor] = useState(colorItems?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const modalBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (!product) return;
    setModalProduct(product);
    setSelectedColor(colorItems?.[0] || null);
    setQuantity(1);
    setIsFavorite(Boolean(user?.favorites?.some?.((f) => f._id === product._id)));
  }, [isOpen, product?._id, user]);

  const maxQty = Math.max(1, Number(selectedColor?.stock) || 1);

  const handleToggleFavorite = async () => {
    if (!user) {
      return toast({ title: "Debes iniciar sesión", status: "warning" });
    }

    try {
    setLikeLoading(true);
    setIsFavorite((prev) => !prev);

    await toggleFavorite(modalProduct._id);
    await refreshFavorites(); 

    } catch (e) {
      console.error("Error al togglear favorito:", e);
      setIsFavorite((prev) => !prev); 
      toast({ title: "No se pudo actualizar favoritos", status: "error" });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedColor) {
      return toast({ title: "Selecciona un color", status: "warning" });
    }
    if (!user) {
      return toast({
        title: "Debes iniciar sesión para agregar al carrito",
        status: "warning",
      });
    }

    const qty = Math.min(quantity, maxQty);
    try {
      setCartLoading(true);
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

      toast({
        title: `${qty} ${modalProduct.name} agregado${qty > 1 ? "s" : ""} al carrito`,
        status: "success",
      });
      setQuantity(1);
    } catch (e) {
      console.error(e);
      toast({ title: "No se pudo agregar al carrito", status: "error" });
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <Modal isOpen={!!modalProduct && isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader fontWeight="bold">{modalProduct?.name}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <ChakraImage
            src={modalProduct?.imgPrimary || "/placeholder.svg"}
            alt={modalProduct?.name}
            mb={4}
            borderRadius="md"
            objectFit="cover"
            w="100%"
            maxH="320px"
            loading="lazy"
          />

          {modalProduct?.description && (
            <Text mb={3} color="gray.600">
              {modalProduct.description}
            </Text>
          )}

          <Text><strong>Precio Unitario:</strong> ${modalProduct?.priceMin}</Text>
          {typeof modalProduct?.priceMay === "number" && (
            <Text><strong>Precio Mayorista:</strong> ${modalProduct.priceMay}</Text>
          )}

          {selectedColor && (
            <Text mt={1}>
              <strong>Stock color:</strong> {selectedColor.stock}
            </Text>
          )}
          {selectedColor?.stock > 0 && selectedColor.stock < 5 && (
            <Text color="red.500" fontWeight="medium">
              ¡Solo quedan {selectedColor.stock} unidades de este color!
            </Text>
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

          <Flex mt={5} gap={3} wrap="wrap">
            <Button
              colorScheme="teal"
              onClick={handleAddToCart}
              isDisabled={selectedColor?.stock === 0 || cartLoading}
              isLoading={cartLoading}
              loadingText="Agregando..."
            >
              Agregar al carrito
            </Button>

            <IconButton
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              aria-pressed={isFavorite}
              icon={
                likeLoading ? (
                  <HeartLoading size={18} />
                ) : isFavorite ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )
              }
              onClick={handleToggleFavorite}
              isDisabled={likeLoading}
            />
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
