import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay({ isOpen, onClose, allProducts = [] }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const term = search.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [search, allProducts]);

  const handleSelect = (product) => {
    onClose();
    navigate(`/products/${product._id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent borderRadius="2xl" overflow="hidden" p={4}>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <InputGroup>
              <InputLeftElement>
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input
                autoFocus
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            {!allProducts.length && (
              <HStack justify="center" py={6}>
                <Spinner />
                <Text>Cargando productos...</Text>
              </HStack>
            )}

            {search && filtered.length === 0 && (
              <Text textAlign="center" color="gray.500" py={6}>
                No se encontraron productos.
              </Text>
            )}

            <VStack align="stretch" spacing={3} maxH="60vh" overflowY="auto">
              {filtered.map((p) => (
                <Box
                  key={p._id}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  p={2}
                  borderRadius="lg"
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => handleSelect(p)}
                >
                  <Image
                    src={p.image || p.images?.[0]}
                    alt={p.name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Box flex="1">
                    <Text fontWeight="medium">{p.name}</Text>
                    <Text fontSize="sm" color="gray.500" noOfLines={1}>
                      {p.description}
                    </Text>
                  </Box>
                  <Text fontWeight="bold" color="pink.500">
                    ${p.price}
                  </Text>
                </Box>
              ))}
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
