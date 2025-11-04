import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Text, useBreakpointValue, VStack, keyframes  } from "@chakra-ui/react";

export default function Loading() {
  const items = useMemo(
    () => [
      {
        name: "Bendita",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/4de1f304-049c-39ac-72d9-d64e875e7396/3-684335129813b.webp",
      },
      {
        name: "Bonnie",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/53bef3ca-718e-17b9-da4d-417557e3dada/IMG-0315-683ef1d379b31-O.jpg",
      },
      {
        name: "Berta",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/0211554b-487e-e906-307c-5175f9b97915/variantes/bertadoblebei-685adb1df2aad-O.jpg",
      },
      {
        name: "Madrid",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/4187eba5-11a3-8ff6-cdb9-d3f8959c91f7/IMG-6952-683ef57698cc3-O.jpg",
      },
      {
        name: "Toledo",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/b7d422cd-0b87-0530-3aad-c768278a9bb8/9-683f188d48ef4-O.jpg",
      },
      {
        name: "Lisboa",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/ac7b3b4b-54c7-16f4-b9a2-b89c8bc8a365/IMG-5640-683ef275785a4-O.jpg",
      },
      {
        name: "Roma",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/d56ff750-3e2f-347e-e6be-c576e056ea1d/romacadena-685b1b6484f3d.webp",
      },
      {
        name: "Mini Cleo",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/46278fcf-1646-587c-a0b0-18136325ce1e/IMG-9151-683f01399f46c-O.jpg",
      },
      {
        name: "Croco",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/c54548b3-ce0a-04e7-4a92-04c1860c00d7/pamp-685afea17d4ce.webp",
      },
      {
        name: "Revel",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/a3975559-df4a-519c-179e-664b17e13e4d/IMG-1826-683f4396a207a-O.jpg",
      },
      {
        name: "Venus",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/b6abf248-1783-0ee7-7973-b86c0ee4059a/3-683f57af72d86.webp",
      },
      {
        name: "Avril",
        image:
          "https://d28hi93gr697ol.cloudfront.net/4a15db8f-2205-0dda/img/Producto/df9249e0-568c-c365-b681-e7d96e4ab1da/IMG-8999-683f4634d239f.webp",
      },
    ],
    []
  );

  const textSize = useBreakpointValue({ base: "4xl", sm: "6xl", md: "8xl" });

  return (
    <VStack
      w="full"
      h="100vh"
      justify="center"
      spacing={8}
      position="relative"
      bg="white"
    >

        {/* Imagen circular arriba */}
      <TypewriterTextEffectWithImage items={items} speed={200} textSize={textSize} />

      {/* Texto fijo debajo */}
      <Text
        position="absolute"
        bottom="4"
        fontSize="lg"
        color="gray.600"
        fontWeight="medium"
      >
        Cargando... por favor espera
      </Text>

      //Texto fijo debajo
    </VStack>
  );
}

export const TypewriterTextEffectWithImage = ({
  items = [],
  speed = 200,
  textSize = "6xl",
}) => {
  const [activeText, setActiveText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let placeholderIndex = 0;
    let textIndex = 0;
    let isBackward = false;

 const textInterval = setInterval(() => {
      const currentText = `  ${items[placeholderIndex].name}  `;
      if (textIndex === currentText.length) {
        isBackward = true;
      } else if (textIndex === 0) {
        isBackward = false;
      }

      if (isBackward) {
        textIndex--;
        if (textIndex === 0) {
          placeholderIndex++;
          if (placeholderIndex === items.length) placeholderIndex = 0;
          setIndex(placeholderIndex);
        }
      } else {
        textIndex++;
      }

      setActiveText(currentText.slice(0, textIndex).trim());
    }, speed);

    const cursorInterval = setInterval(() => {
      setShowCursor((show) => !show);
    }, speed);

    return () => {
      clearInterval(textInterval);
      clearInterval(cursorInterval);
    };
  }, [items, speed]);
  
 const activeImage = items[index]?.image;

  return (
    <VStack spacing={6}>
      {/* Imagen circular */}
      {activeImage && (
        <Box
          boxSize={{ base: "120px", md: "180px" }}
          borderRadius="full"
          overflow="hidden"
          border="4px solid white"
          boxShadow="0px 8px 25px rgba(0,0,0,0.2)"
          transition="all 0.4s ease-in-out"
          transform="translateY(0px)"
          _hover={{ transform: "translateY(-6px)", boxShadow: "0px 12px 30px rgba(0,0,0,0.3)" }}
        >
          <Image src={activeImage} alt={activeText} objectFit="cover" w="100%" h="100%" />
        </Box>
      )}

      {/* Texto con efecto */}
      <Text fontSize={textSize} fontWeight="bold">
        {activeText}
        <Text
          as="span"
          style={{ opacity: showCursor ? 0.5 : 0 }}
          transition="all 0.3s ease-in-out"
        >
          _
        </Text>
      </Text>
    </VStack>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;


export const HeartLoading = ({ size = 20, color = "red" }) => {
  return (
    <Box
      as="span"
      display="inline-block"
      animation={`${spin} 1s linear infinite`}
      fontSize={`${size}px`}
      color={color}
      filter="drop-shadow(0 0 3px rgba(255,0,0,0.4))"
      lineHeight="1"
    >
      ❤️
    </Box>
  );
};