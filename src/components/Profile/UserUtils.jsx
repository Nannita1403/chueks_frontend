export function getDefaultAddress(user) {
  if (!user?.addresses?.length) return null;
  return user.addresses.find(addr => addr.default) || user.addresses[0];
}

export function getDefaultPhone(user) {
  if (!user?.telephones?.length) return null;
  return user.telephones.find(tel => tel.default) || user.telephones[0];
}

export function formatAddress(address) {
  if (!address) return null;
  return [
    address.street || "",
    address.city || "",
    address.zip ? `(${address.zip})` : "",
    address.country ? `[${address.country}]` : ""
  ].filter(Boolean).join(" ");
}

export function formatPhone(telephone) {
  if (!telephone) return null;
  return `${telephone.number}${telephone.label ? ` (${telephone.label})` : ""}`;
}

export function formatPrice(amount) {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(amount);
}