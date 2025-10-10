import { useContext } from "react"
import { ElementsContext } from "../../providers/ElementsProviders.jsx"

export const useElements = () => {
  const context = useContext(ElementsContext)
  if (!context) {
    throw new Error("useElements must be used within an ElementsProvider")
  }
  return context
}

export { ElementsContext }
