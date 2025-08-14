"use client"

import { useContext } from "react"
import { ElementsContext } from "../../providers/ElementsProviders.jsx"

// Hook para usar el contexto de elementos
export const useElements = () => {
  const context = useContext(ElementsContext)
  if (!context) {
    throw new Error("useElements must be used within an ElementsProvider")
  }
  return context
}

// Re-exportar el contexto
export { ElementsContext }
