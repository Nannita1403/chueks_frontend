
import { Button, For, HStack } from "@chakra-ui/react"
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
}
