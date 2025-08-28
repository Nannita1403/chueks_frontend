import {
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton,
  Button, Stack, Checkbox, CheckboxGroup, HStack, Text
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

/**
 * Si props.options vienen vacías, puedes pasar también uniqueOptions
 * calculadas en el contenedor (CategoryPage) a partir de los productos.
 */
export default function CategoryFiltersDrawer({
  isOpen,
  onClose,
  value = { colors: [], styles: [] },
  onChange = () => {},
  options = { colorOptions: [], styleOptions: [] },
}) {
  const colorOptions = options?.colorOptions || [];
  const styleOptions = options?.styleOptions || [];

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader display="flex" alignItems="center" gap={2}>
          <FiFilter /> Filtros
        </DrawerHeader>
        <DrawerBody>
          <Stack spacing={6}>
            <Stack>
              <Text fontWeight="bold">Colores</Text>
              <CheckboxGroup
                value={value.colors}
                onChange={(arr) => onChange({ ...value, colors: arr })}
              >
                <Stack spacing={2}>
                  {colorOptions.map((c) => (
                    <Checkbox key={c} value={c}>{c}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Stack>

            <Stack>
              <Text fontWeight="bold">Estilos</Text>
              <CheckboxGroup
                value={value.styles}
                onChange={(arr) => onChange({ ...value, styles: arr })}
              >
                <Stack spacing={2}>
                  {styleOptions.map((s) => (
                    <Checkbox key={s} value={s}>{s}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Stack>

            <HStack justify="flex-end">
              <Button onClick={onClose} variant="outline">Cerrar</Button>
              <Button onClick={onClose} colorScheme="pink">Aplicar</Button>
            </HStack>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
