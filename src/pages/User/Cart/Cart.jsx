import { useEffect, useMemo, useState, useCallback } from "react";
import {  Box, Grid, GridItem, Text, HStack, VStack, Image, Divider, IconButton,
  Alert, AlertIcon, useColorModeValue, Container,
  Tooltip} from "@chakra-ui/react";
import { CloseIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../reducers/api/Api.jsx";
import CustomButton from "../../../components/Button/Button.jsx";
import {  CustomCard as Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription
} from "../../../components/Card/Card.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { getDefaultAddress, getDefaultPhone } from "../../../components/Profile/UserUtils.jsx";
import AddressPhoneModal from "../../../components/Order/AddressPhoneModal.jsx"

const styles = {
  cardHover: {
    transition: "all 0.25s ease-in-out",
    _hover: { transform: "scale(1.02)", shadow: "lg", borderColor: "pink.300" },
  },
  qtyBtn: {
    size: "sm",
    variant: "ghost",
    _hover: { bg: "pink.50", color: "pink.500" },
  },
};

const handleError = (toast, err, title = "Error") => {
  toast({
    title,
    description: err?.response?.data?.message || err.message || "Ocurrió un error",
    status: "error",
  });
};

const MIN_ITEMS = 10;

const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n);


export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], shipping: 0 });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const { toast } = useToast();
  const { refreshCart, user } = useAuth();
  const navigate = useNavigate();
  const [lineLoading, setLineLoading] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("pink.500", "pink.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const muted = useColorModeValue("gray.600", "gray.400");
  const panelBg = useColorModeValue("white", "gray.800");
  const warnBg = useColorModeValue("orange.50", "orange.900");
  const warnBorder = useColorModeValue("orange.200", "orange.700");
  const thumbBg = useColorModeValue("gray.100", "whiteAlpha.100");

  const apiFetchCart = useCallback(() => ApiService.get("/cart"), []);
  const apiPatchQtyByLine = useCallback(
    (lineId, delta) => ApiService.patch(`/cart/line/${encodeURIComponent(lineId)}`, { delta }),
    []
  );
  const apiRemoveByLine = useCallback(
    (lineId) => ApiService.delete(`/cart/line/${encodeURIComponent(lineId)}`),
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetchCart();
        if (mounted) setCart(data);
      } catch (e) {
        setError(e?.message || "No se pudo cargar el carrito");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [apiFetchCart]);

  const items = useMemo(() => (cart.items || []).map((item) => item), [cart.items]);
  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
  const missing = Math.max(0, MIN_ITEMS - itemCount);
  const canCheckout = missing === 0 && items.length > 0;

  const defaultAddress = getDefaultAddress(user);
  const defaultPhone = getDefaultPhone(user);

  const onChangeQtyLine = async (lineId, delta) => {
    setLineLoading((prev) => ({ ...prev, [lineId]: true }));
    try {
      const data = await apiPatchQtyByLine(lineId, delta);
      setCart(data);
      await refreshCart?.();
    } catch (e) {
      handleError(toast, e, "Cantidad no actualizada");
    } finally {
      setLineLoading((prev) => ({ ...prev, [lineId]: false }));
    }
  };

  const onRemoveLine = async (lineId) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmed) return;

    setLineLoading((prev) => ({ ...prev, [lineId]: true }));
    try {
      const data = await apiRemoveByLine(lineId);
      setCart(data);
      await refreshCart?.();
      toast({ title: "Producto eliminado", status: "success" });
    } catch (e) {
      handleError(toast, e, "No se pudo eliminar");
    } finally {
      setLineLoading((prev) => ({ ...prev, [lineId]: false }));
    }
  };

  const onCheckout = async () => {
    if (!defaultAddress || !defaultPhone) {
      setIsAddressModalOpen(true);
      return;
    }
    try {
      setCheckoutLoading(true);
      const res = await ApiService.post("/orders/checkout", {
        addressId: defaultAddress._id,
        telephoneId: defaultPhone._id,
      });
      await refreshCart();
      navigate(`/order/confirm?orderId=${res.order._id}`);
    } catch (err) {
      handleError(toast, err, "Error al procesar el pedido");
    } finally {
      setCheckoutLoading(false);
    }
  };
      
  const openProductDetail = async (productId) => {
    try {
      const product = await ApiService.get(`/products/${productId}`);
      setSelected(product?.product || product);
    } catch {
      toast({ title: "No se pudo abrir el producto", status: "error" });
    }
  };
     if (loading) return (
    <Box minH="100vh" bg={pageBg}>
      <AppHeader />
      <Container maxW="container.xl" py={6}>
        <BackButton mb={4} />
        <Loading />
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={6}>
          {[...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </Grid>
      </Container>
    </Box>
  );

  if (error) return (
    <Box minH="100vh" bg={pageBg}>
      <AppHeader />
      <Container maxW="container.xl" py={6}>
        <BackButton mb={4} />
        <Alert status="error" rounded="md"><AlertIcon />{error}</Alert>
      </Container>
    </Box>
  );

    return (
    <Box minH="100vh" bg={pageBg}>
      <AppHeader />
      <Box bg={headerBg} color="white" py={3}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <BackButton color="white" variant="link" />
            <Text fontWeight="bold" fontSize="xl">Mi Carrito</Text>
            <Box w="88px" />
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={4}>
        <Text color={muted} mb={4}>
          {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
        </Text>

        <Card borderColor={warnBorder} bg={warnBg} mb={4}>
          <CardContent py={3}>
            {missing > 0 ? (
              <Text fontSize="sm">
                Tu pedido tiene <b>{itemCount}</b> productos. La compra mínima es <b>{MIN_ITEMS}</b>. 
                Faltan <b>{missing}</b> {missing === 1 ? "producto" : "productos"}.
              </Text>
            ) : (
              <Text fontSize="sm">¡Perfecto! Cumples la compra mínima de {MIN_ITEMS} productos.</Text>
            )}
          </CardContent>
        </Card>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap={6}>
          <GridItem>
            {items.length === 0 ? (
              <Card bg={panelBg} borderColor={borderColor}>
                <CardContent py={6}>
                  <Text color={muted} textAlign="center">Tu carrito está vacío.</Text>
                </CardContent>
              </Card>
            ) : (
              <VStack spacing={3} align="stretch">
                  {items?.map((item) => {
                  console.log("🖼️ Imagen:", item.imgPrimary || item.image || item.imageUrl, "🧩 item:", item);
                  return (
                  <Card  key={item.id} bg={panelBg} borderColor={borderColor} {...styles.cardHover}>
                    <CardContent>
                      <Grid templateColumns={{ base: "1fr", md: "72px 1fr 170px" }} gap={3} alignItems="center">
                        {/* Imagen */}
                        <Box
                          w="72px"
                          h="72px"
                          rounded="md"
                          overflow="hidden"
                          bg={thumbBg}
                          onClick={() => openProductDetail(item.productId)}
                          mx={{ base: "auto", md: "0" }}
                          mb={{ base: 2, md: 0 }}
                        >
                          <Image
                            src={item?.imgPrimary || item?.image || item?.imageUrl || "/placeholder.svg"}
                            alt={item?.name || "Producto"}
                            objectFit="cover"
                            w="100%"
                            h="100%"
                            borderRadius="md"
                          />
                        </Box>                
                     
                        {/* Info */}
                        <VStack align="stretch" spacing={1} mb={{ base: 2, md: 0 }}>
                          <HStack justify="space-between" align="start">
                            <Box>
                              <Text
                                fontWeight="semibold"
                                noOfLines={1}
                                cursor="pointer"
                                onClick={() => openProductDetail(item.productId)}
                              >
                                {item.name}
                              </Text>
                              {!!item.color && <Text fontSize="xs" color={muted}>Color: {item.color}</Text>}
                              <Text fontSize="xs" color={muted}>Unitario: {money(item.price)}</Text>
                            </Box>
                            <IconButton
                                aria-label="Eliminar"
                                icon={lineLoading[item.id] ? <Loading size="xs" /> : <CloseIcon boxSize={3} />}
                                {...styles.qtyBtn}
                                onClick={() => onRemoveLine(item.id)}
                                isDisabled={lineLoading[item.id]}
                              />
                          </HStack>
                        </VStack>

                        {/* Cantidad + total */}
                        <VStack align={{ base: "stretch", md: "end" }} spacing={2}>
                          <HStack spacing={0} border="1px" borderColor={borderColor} rounded="md" overflow="hidden">
                            <Tooltip label="Quitar una unidad" hasArrow>
                            <IconButton
                              aria-label="Restar"
                              icon={lineLoading[item.id] ? <Loading size="xs" /> : <MinusIcon boxSize={3} />}
                              {...styles.qtyBtn}
                              onClick={() => onChangeQtyLine(item.id, -1)}
                              isDisabled={item.quantity <= 1 || lineLoading[item.id]}
                            />
                            </Tooltip>
                            <Box px={3} minW="36px" textAlign="center">{item.quantity}</Box>
                            <Tooltip label="Agregar una unidad" hasArrow>
                            <IconButton
                              aria-label="Sumar"
                              icon={lineLoading[item.id] ? <Loading size="xs" /> : <AddIcon boxSize={3} />}
                              {...styles.qtyBtn}
                              onClick={() => onChangeQtyLine(item.id, +1)}
                              isDisabled={lineLoading[item.id]}
                            />
                            </Tooltip>
                          </HStack>
                          <Text fontWeight="semibold">{money(item.price * item.quantity)}</Text>
                        </VStack>
                      </Grid>
                    </CardContent>
                  </Card>
                  );
              })}
              </VStack>
            )}
          </GridItem>
          <GridItem display={{ base: "none", lg: "block" }}>
            <Card  id="resumen-pedido" position="sticky" top={4} bg={panelBg} borderColor={borderColor}>
              <CardHeader pb={2}>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>Revisa los totales antes de continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <HStack justify="space-between" mb={2}>
                  <Text>Subtotal</Text><Text fontWeight="semibold">{money(subtotal)}</Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text>Envío</Text><Text fontWeight="semibold">{cart.shipping ? money(cart.shipping) : "Gratis"}</Text>
                </HStack>
                <Divider my={3} />
                <HStack justify="space-between" mb={2}>
                  <Text>Total</Text><Text fontWeight="bold">{money(subtotal + (cart.shipping || 0))}</Text>
                </HStack>
              </CardContent>
              <CardFooter flexDir="column" gap={2}>
                {(!defaultAddress || !defaultPhone) && (
                  <Text fontSize="sm" color="orange.500">
                    Debes completar tu
                    {!defaultAddress ? " dirección" : ""}
                    {!defaultAddress && !defaultPhone ? " y " : ""}
                    {!defaultPhone ? " teléfono" : ""}
                    para continuar.
                  </Text>
                )}
                <CustomButton
                  onClick={onCheckout}
                  isDisabled={!canCheckout}
                  isLoading={checkoutLoading}
                  size="lg"
                  w="100%"
                >
                  Completar la compra
                </CustomButton>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem display={{ base: "block", lg: "none" }} mt={8}>
            <Card id="resumen-pedido" bg={panelBg} borderColor={borderColor}>
              <CardHeader pb={2}>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>Revisa los totales antes de continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <HStack justify="space-between" mb={2}>
                  <Text>Subtotal</Text><Text fontWeight="semibold">{money(subtotal)}</Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text>Envío</Text><Text fontWeight="semibold">{cart.shipping ? money(cart.shipping) : "Gratis"}</Text>
                </HStack>
                <Divider my={3} />
                <HStack justify="space-between" mb={2}>
                  <Text>Total</Text><Text fontWeight="bold">{money(subtotal + (cart.shipping || 0))}</Text>
                </HStack>
              </CardContent>
              <CardFooter flexDir="column" gap={2}>
                {(!defaultAddress || !defaultPhone) && (
                  <Text fontSize="sm" color="orange.500">
                    Debes completar tu
                    {!defaultAddress ? " dirección" : ""}
                    {!defaultAddress && !defaultPhone ? " y " : ""}
                    {!defaultPhone ? " teléfono" : ""}
                    para continuar.
                  </Text>
                )}
                <CustomButton
                  onClick={() => {
                    console.log("defaultAddress:", defaultAddress, "defaultPhone:", defaultPhone);
                    if (!defaultAddress || !defaultPhone) {
                      setIsAddressModalOpen(true);
                    } else {
                      onCheckout();
                    }
                  }}
                  isDisabled={!canCheckout}
                  size="lg"
                  w="100%"
                >
                  Completar la compra
                </CustomButton>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
        
        <ProductModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          product={selected}
          products={[]} setProducts={() => {}}
          addToCartHandler={async (product, qty, color) => {
            try {
              await ApiService.post("/cart/add", { productId: product._id, quantity: qty, color: color?.name });
              await refreshCart?.();
              toast({ title: `Agregado ${qty} al carrito`, status: "success" });
            } catch {
              toast({ title: "No se pudo agregar al carrito", status: "error" });
            }
          }}
        />

        <AddressPhoneModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={() => {
          setIsAddressModalOpen(false);
          onCheckout();
        }}
      />
        <Box
          display={{ base: canCheckout ? "flex" : "none", lg: "none" }}
          position="fixed"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={10}
          bg="pink.500"
          color="white"
          px={6}
          py={3}
          rounded="full"
          shadow="lg"
          cursor="pointer"
          onClick={() => {
            const el = document.getElementById("resumen-pedido");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <HStack>
            <Text fontWeight="bold">Ver resumen</Text>
            <Text>({itemCount} {itemCount === 1 ? "item" : "items"})</Text>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}
