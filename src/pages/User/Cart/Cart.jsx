import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  HStack,
  VStack,
  Image,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";

import { CloseIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { CustomButton } from "../../../components/Button/Button.jsx";
import {
  CustomCard as Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../../../components/Card/Card.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

/** Config */
const MIN_ITEMS = 10;

/** Formato moneda */
const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

/** ---- API calls ---- */
async function fetchCart() {
  const res = await fetch("/api/cart", { credentials: "include" });
  if (!res.ok) throw new Error("No se pudo cargar el carrito");
  return res.json();
}
async function updateQty(productId, delta) {
  const res = await fetch(`/api/cart/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ delta }),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la cantidad");
  return res.json();
}
async function removeItem(productId) {
  const res = await fetch(`/api/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo eliminar el producto");
  return res.json();
}
async function startCheckout() {
  const res = await fetch(`/api/cart/checkout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const { message } = await res.json().catch(() => ({ message: "Error en el checkout" }));
    throw new Error(message);
  }
  return res.json();
}

/** Normaliza items para soportar {product?...} o campos planos */
function normalizeItem(it) {
  const p = it.product || {};
  const _id = p._id || it.id;
  const name = p.name || it.name || "Producto";
  const color = it.color || p.color;
  const price = typeof it.price === "number" ? it.price : p.price || 0;
  const quantity = it.quantity || 1;
  const image =
    it.image ||
    p?.imgPrimary?.url ||
    p?.image ||
    (Array.isArray(p?.images) && p.images[0]) ||
    "";
  return { ...it, _id, name, color, price, quantity, image };
}

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], shipping: 0 });
  const [error, setError] = useState("");

  // Tu hook de toasts (custom)
  const { toast } = useToast ();

  // Tokens de color
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const muted = useColorModeValue("gray.600", "gray.400");
  const panelBg = useColorModeValue("white", "gray.800");
  const warnBg = useColorModeValue("orange.50", "orange.900");
  const warnBorder = useColorModeValue("orange.200", "orange.700");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCart();
        if (mounted) setCart(data);
      } catch (e) {
        setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(() => (cart.items || []).map(normalizeItem), [cart.items]);
  const itemCount = useMemo(() => items.reduce((acc, it) => acc + (it.quantity || 0), 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0),
    [items]
  );

  const missing = Math.max(0, MIN_ITEMS - itemCount);
  const canCheckout = missing === 0 && items.length > 0;

  const onChangeQty = async (productId, delta) => {
    try {
      const data = await updateQty(productId, delta);
      setCart(data);
    } catch (e) {
      toast({
        title: "Cantidad no actualizada",
        description: e.message,
      });
    }
  };

  const onRemove = async (productId) => {
    try {
      const data = await removeItem(productId);
      setCart(data);
      toast({ title: "Producto eliminado" });
    } catch (e) {
      toast({ title: "No se pudo eliminar", description: e.message });
    }
  };

  const onCheckout = async () => {
    try {
      const res = await startCheckout();
      if (res?.redirectUrl) window.location.href = res.redirectUrl;
    } catch (e) {
      toast({ title: "Checkout bloqueado", description: e.message });
    }
  };

  // Loading "antes de la carga" (tu componente)
  if (loading) {
    return (
      <Box maxW="1080px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <Loading />
        {/* Skeletons de items */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={6}>
          {[...Array(3)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="1080px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <Alert status="error" rounded="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="1080px" mx="auto" px={{ base: 4, md: 6 }} py={4}>
      <Heading size="lg" mb={1}>
        Mi Carrito
      </Heading>
      <Text color={muted} mb={4}>
        {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
      </Text>

      {/* Aviso compra mínima (inline, usando Card para consistencia de UI) */}
      <Card borderColor={warnBorder} bg={warnBg} mb={4}>
        <CardContent py={3}>
          {missing > 0 ? (
            <Text fontSize="sm">
              Tu pedido actual tiene <b>{itemCount}</b> productos. La compra mínima es de{" "}
              <b>{MIN_ITEMS}</b>. <b>Te faltan {missing}</b>{" "}
              {missing === 1 ? "producto" : "productos"} para completar el pedido.
            </Text>
          ) : (
            <Text fontSize="sm">¡Perfecto! Cumples la compra mínima de {MIN_ITEMS} productos.</Text>
          )}
        </CardContent>
      </Card>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap={4}>
        {/* LISTA DE ITEMS */}
        <GridItem>
          {items.length === 0 ? (
            <Card bg={panelBg} borderColor={borderColor}>
              <CardContent py={6}>
                <Text color={muted} textAlign="center">
                  Tu carrito está vacío.
                </Text>
              </CardContent>
            </Card>
          ) : (
            <VStack spacing={3} align="stretch">
              {items.map((it) => (
                <Card key={it._id} bg={panelBg} borderColor={borderColor}>
                  <CardContent>
                    <Grid templateColumns="72px 1fr 150px" gap={3} alignItems="center">
                      <Box
                        w="72px"
                        h="72px"
                        bg={useColorModeValue("gray.100", "whiteAlpha.100")}
                        rounded="md"
                        overflow="hidden"
                      >
                        {!!it.image && (
                          <Image src={it.image} alt={it.name} w="100%" h="100%" objectFit="cover" />
                        )}
                      </Box>

                      <VStack align="stretch" spacing={1}>
                        <HStack justify="space-between" align="start">
                          <Box>
                            <Text fontWeight="semibold" noOfLines={1}>
                              {it.name}
                            </Text>
                            {!!it.color && (
                              <Text fontSize="xs" color={muted}>
                                Color: {it.color}
                              </Text>
                            )}
                          </Box>
                          <IconButton
                            aria-label="Eliminar"
                            icon={<CloseIcon boxSize={3} />}
                            size="sm"
                            variant="ghost"
                            color={muted}
                            onClick={() => onRemove(it._id)}
                          />
                        </HStack>
                      </VStack>

                      <VStack align="end" spacing={2}>
                        <HStack
                          spacing={0}
                          border="1px"
                          borderColor={borderColor}
                          rounded="md"
                          overflow="hidden"
                        >
                          <IconButton
                            aria-label="Restar"
                            icon={<MinusIcon boxSize={3} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => onChangeQty(it._id, -1)}
                            isDisabled={it.quantity <= 1}
                          />
                          <Box px={3} minW="36px" textAlign="center">
                            {it.quantity}
                          </Box>
                          <IconButton
                            aria-label="Sumar"
                            icon={<AddIcon boxSize={3} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => onChangeQty(it._id, +1)}
                          />
                        </HStack>
                        <Text fontWeight="semibold">{money(it.price * it.quantity)}</Text>
                      </VStack>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </VStack>
          )}
        </GridItem>

        {/* RESUMEN */}
        <GridItem>
          <Card position="sticky" top={4} bg={panelBg} borderColor={borderColor}>
            <CardHeader pb={2}>
              <CardTitle>Resumen del Pedido</CardTitle>
              <CardDescription>Revisa los totales antes de continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <HStack justify="space-between" mb={2}>
                <Text>Subtotal</Text>
                <Text fontWeight="semibold">{money(subtotal)}</Text>
              </HStack>
              <HStack justify="space-between" mb={2}>
                <Text>Envío</Text>
                <Text fontWeight="semibold">
                  {cart.shipping ? money(cart.shipping) : "Gratis"}
                </Text>
              </HStack>
              <Divider my={3} />
              <HStack justify="space-between" mb={2}>
                <Text>Total</Text>
                <Text fontWeight="bold">{money(subtotal + (cart.shipping || 0))}</Text>
              </HStack>
            </CardContent>
            <CardFooter flexDir="column" alignItems="stretch">
              <Tooltip
                isDisabled={canCheckout}
                hasArrow
                label={
                  canCheckout
                    ? "Continuar con el pago"
                    : `Te faltan ${missing} ${missing === 1 ? "producto" : "productos"}`
                }
                placement="top"
              >
                <CustomButton
                  onClick={onCheckout}
                  isDisabled={!canCheckout}
                  size="lg"
                  // usa tu colorScheme por defecto = "brand" (según tu Button.jsx)
                >
                  Completar la compra
                </CustomButton>
              </Tooltip>

              {!canCheckout && (
                <Text mt={2} fontSize="sm" color={muted}>
                  🔒 Para continuar te faltan <b>{missing}</b>{" "}
                  {missing === 1 ? "producto" : "productos"}.
                </Text>
              )}

              <Text mt={3} fontSize="xs" color={muted}>
                Al finalizar la compra, se enviará una solicitud de pedido que será revisada por nuestro equipo.
              </Text>
            </CardFooter>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
