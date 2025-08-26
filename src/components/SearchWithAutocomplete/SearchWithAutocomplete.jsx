"use client"

import { useState, useRef } from "react"
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"

export function SearchWithAutocomplete({ placeholder = "Buscar...", suggestions = [], onSelect, onSearch }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const ref = useRef()

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  })

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0) {
      const filtered = suggestions.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      setFilteredSuggestions(filtered)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }

    onSearch?.(value)
  }

  const handleSelect = (suggestion) => {
    setQuery(suggestion)
    setIsOpen(false)
    onSelect?.(suggestion)
  }

  return (
    <Box position="relative" ref={ref}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray" />
        </InputLeftElement>
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
      </InputGroup>

      {isOpen && filteredSuggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={10}
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          maxH="200px"
          overflowY="auto"
          mt={1}
        >
          <List>
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                px={4}
                py={2}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => handleSelect(suggestion)}
              >
                <Text fontSize="sm">{suggestion}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}
