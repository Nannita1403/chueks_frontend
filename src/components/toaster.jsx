"use client"

import { useToast } from "@chakra-ui/react"

export function toasterFunction() {
  const toast = useToast()

  const showSuccess = (title, description) => {
    toast({
      title,
      description,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
      variant: "subtle",
    })
  }

  const showError = (title, description) => {
    toast({
      title,
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
      variant: "subtle",
    })
  }

  const showWarning = (title, description) => {
    toast({
      title,
      description,
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
      variant: "subtle",
    })
  }

  const showInfo = (title, description) => {
    toast({
      title,
      description,
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
      variant: "subtle",
    })
  }

  return { showSuccess, showError, showWarning, showInfo }
}



/*import { Button, For, HStack } from "@chakra-ui/react"
import { toaster } from "./ui/toaster"


export const toasterFunction = () => {
  return (
    <HStack>
      <For each={["success", "error", "warning", "info"]}>
        {(type) => (
          <Button
            size="sm"
            variant="outline"
            key={type}
            onClick={() =>
              toaster.create({
                title: `Se ha resuelto de manera ${type}`,
                type: type,
              })
            }
          >
            {type}
          </Button>
        )}
      </For>
    </HStack>
  )
}*/
