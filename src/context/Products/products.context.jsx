"use client"

import { useContext } from "react"
import { ProductsContext } from "../../providers/ProductsProviders.jsx"

// Hook para usar el contexto de productos
export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}

// Re-exportar el contexto
export { ProductsContext }
