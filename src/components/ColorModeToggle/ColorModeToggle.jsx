"use client"

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FiSun, FiMoon } from "react-icons/fi"

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const icon = useColorModeValue(<FiMoon />, <FiSun />)

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={icon}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
        transform: "scale(1.1)",
      }}
      transition="all 0.2s"
    />
  )
}
