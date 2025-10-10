import { useEffect, useMemo, useState } from "react";
import { Box, HStack, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
export default function InfiniteCarousel({
  items = [],
  renderItem,
  gap = 16,
  autoPlay = false,
  autoPlayMs = 4000,
  title,
  showGhostArrowsOnMobile = true,
  perViewBreakpoints = { base: 1, md: 2, lg: 3 },
}) {
  const [idx, setIdx] = useState(0); // índice sobre items reales
  const [animating, setAnimating] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  const perView = useBreakpointValue(perViewBreakpoints) || 1;

  useEffect(() => {
    setIdx(0);
  }, [items?.length, perView]);

  const head = useMemo(() => items.slice(0, perView), [items, perView]);
  const tail = useMemo(() => items.slice(-perView), [items, perView]);
  const trackItems = useMemo(() => [...tail, ...items, ...head], [tail, items, head]);

  const trackIndex = perView + idx;

  useEffect(() => {
    if (!autoPlay || items.length <= perView) return;
    const id = setInterval(() => goNext(), autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayMs, items.length, perView, idx]);

  const goNext = () => {
    if (!items.length) return;
    setAnimating(true);
    setIdx((i) => (i + 1) % items.length);
  };
  const goPrev = () => {
    if (!items.length) return;
    setAnimating(true);
    setIdx((i) => (i - 1 + items.length) % items.length);
  };

  // Swipe en móvil
  const onTouchStart = (e) => setDragStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (dragStartX == null) return;
    const delta = e.changedTouches[0].clientX - dragStartX;
    const threshold = 40; // px
    if (delta <= -threshold) goNext();
    if (delta >= threshold) goPrev();
    setDragStartX(null);
  };

  const slideW = `${100 / perView}%`;
  const translateX = `calc(-${trackIndex} * (${slideW} + ${gap}px))`;

  return (
    <Box position="relative">
      {title ? (
        <HStack justify="space-between" mb={3}>
          <Box as="h3" fontWeight="bold" fontSize="xl">{title}</Box>
          <HStack>
            <IconButton aria-label="prev" icon={<FiChevronLeft />} onClick={goPrev} />
            <IconButton aria-label="next" icon={<FiChevronRight />} onClick={goNext} />
          </HStack>
        </HStack>
      ) : null}

      <Box
        position="relative"
        overflow="hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Box
          display="flex"
          columnGap={`${gap}px`}
          transform={`translateX(${translateX})`}
          transition={animating ? "transform 300ms ease" : "none"}
          onTransitionEnd={() => setAnimating(false)}
        >
          {trackItems.map((it, i) => (
            <Box key={`${it?._id || i}-${i}`} minW={slideW} maxW={slideW}>
              {renderItem?.(it)}
            </Box>
          ))}
        </Box>

        {/* Flechas fantasma en móvil */}
        {showGhostArrowsOnMobile && (
          <>
            <Box
              display={{ base: "block", md: "none" }}
              position="absolute"
              top={0}
              left={0}
              h="100%"
              w="18%"
              onClick={goPrev}
              cursor="pointer"
            />
            <Box
              display={{ base: "block", md: "none" }}
              position="absolute"
              top={0}
              right={0}
              h="100%"
              w="18%"
              onClick={goNext}
              cursor="pointer"
            />
          </>
        )}
      </Box>
    </Box>
  );
}

