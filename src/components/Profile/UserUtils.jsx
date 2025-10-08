export function getDefaultAddress(user) {
if (!user?.addresses?.length) return null;
  // Busca el default, si no hay ninguno devuelve el primero
  const defaultAddr = user.addresses.find(addr => addr.default === true);
  return defaultAddr || user.addresses[0];
}

export function getDefaultPhone(user) {
  if (!user?.phones?.length) return null;
  const defaultPhone = user.phones.find(phone => phone.default === true);
  return defaultPhone || user.phones[0];
}

export function formatAddress(address) {
  if (!address) return null;
  return [
    address.street || "",
    address.city || "",
    address.zip ? `(${address.zip})` : "",
    address.country ? `[${address.country}]` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function formatPhone(phone) {
  if (!phone) return null;
  return `${phone.number}${phone.label ? ` (${phone.label})` : ""}`;
}

export function formatPrice(amount) {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(amount);
}