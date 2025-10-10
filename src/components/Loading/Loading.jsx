import React, { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Text, useBreakpointValue } from '@chakra-ui/react'

export default function Loading() {
  const textSet = useMemo(
    () => [
      'Bendita',
      'Bonnie',
      'Berta',
      'Madrid',
      'Toledo',
      'Lisboa',
      'Paris',
      'Mini Cleo',
      'Alice',
      'Revel',
      'Venus',
      'Avril',
    ],
    []
  )

  const textSize = useBreakpointValue({
    base: '4xl', sm: '6xl', md: '8xl'})
  return (
    <Box w="full" h="50vh" as={Grid} placeContent="center" fontSize={textSize}>
      <TypewriterTextEffect textSet={textSet} speed={200} />
    </Box>
  )
}

export const TypewriterTextEffect = ({ textSet = ['An a lonely type writer'], speed = 200, ...props }) => {
  const [activeText, setActiveText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let placeholderTextIndex = 0
    let textIndex = 0
    let isBackward = false
    const textInterval = setInterval(() => {
      const text = `  ${textSet[placeholderTextIndex]}  `
      if (textIndex === text.length) {
        isBackward = true
      } else if (textIndex === 0) {
        isBackward = false
      }
      if (isBackward) {
        textIndex--
        if (textIndex === 0) {
          placeholderTextIndex++
          if (placeholderTextIndex === textSet.length) {
            placeholderTextIndex = 0
          }
        }
      } else {
        textIndex++
      }

      setActiveText(text.slice(0, textIndex).trim())
    }, speed)

    const cursorInterval = setInterval(() => {
      setShowCursor((show) => !show)
    }, speed)
    return () => {
      clearInterval(textInterval)
      clearInterval(cursorInterval)
    }
  }, [textSet, speed])

  return (
    <Text {...props}>
      {activeText}
      <Text
        as="span"
        style={{ opacity: showCursor ? 0.5 : 0 }}
        transition="all 0.3s ease-in-out"
      >
        _
      </Text>
    </Text>
  )
}
