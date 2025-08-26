"use client"

import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react"

const Dialog = ({ children, open, onOpenChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose: () => onOpenChange?.(false),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {children}
    </Modal>
  )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  return React.cloneElement(children, {
    ...props,
    onClick: (e) => {
      children.props.onClick?.(e)
      props.onClick?.(e)
    },
  })
}

const DialogContent = React.forwardRef(({ children, size = "md", ...props }, ref) => (
  <>
    <ModalOverlay />
    <ModalContent ref={ref} size={size} {...props}>
      <ModalCloseButton />
      {children}
    </ModalContent>
  </>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ children, ...props }) => <ModalHeader {...props}>{children}</ModalHeader>
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ children, ...props }) => <ModalFooter {...props}>{children}</ModalFooter>
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ children, ...props }, ref) => (
  <span ref={ref} fontSize="sm" color="gray.600" {...props}>
    {children}
  </span>
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ({ children, ...props }) => {
  return React.cloneElement(children, props)
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose }
