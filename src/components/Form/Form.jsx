
import { useContext } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

const FormItem = React.forwardRef(({ children, ...props }, ref) => {
  const id = React.useId()
  const { error } = useFormField()

  return (
    <FormItemContext.Provider value={{ id }}>
      <ChakraFormControl ref={ref} isInvalid={!!error} {...props}>
        {children}
      </ChakraFormControl>
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ children, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <ChakraFormLabel ref={ref} htmlFor={formItemId} {...props}>
      {children}
    </ChakraFormLabel>
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ children, ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId, error } = useFormField()

  return React.cloneElement(children, {
    ref,
    id: formItemId,
    "aria-describedby": !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
    ...props,
  })
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ children, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <FormHelperText ref={ref} id={formDescriptionId} {...props}>
      {children}
    </FormHelperText>
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <FormErrorMessage ref={ref} id={formMessageId} {...props}>
      {body}
    </FormErrorMessage>
  )
})
FormMessage.displayName = "FormMessage"

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
