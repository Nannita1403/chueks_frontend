export function getDefaultAddress(user) {
  if (!user?.addresses?.length) return null;
  return user.addresses.find(a => a.default) || user.addresses[0];
}

export function getDefaultPhone(user) {
  if (!user?.phones?.length) return null;
  return user.phones.find(p => p.default) || user.phones[0];
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
