"use client"

import React from "react"
import { Avatar as ChakraAvatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react"

const Avatar = React.forwardRef(({ size = "md", name, src, children, ...props }, ref) => (
  <ChakraAvatar ref={ref} size={size} name={name} src={src} {...props}>
    {children}
  </ChakraAvatar>
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ src, alt, ...props }, ref) => {
  // This component is kept for API compatibility but delegates to parent Avatar
  return null
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ children, ...props }, ref) => {
  // This component is kept for API compatibility
  return null
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup }
