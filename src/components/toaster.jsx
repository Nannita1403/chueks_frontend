
import { Button, For, HStack } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"

const toasterFunction = () => {
  return (
    <HStack>
      <For each={["exitosa", "error", "alerta", "info"]}>
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
