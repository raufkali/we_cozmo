export const formatPrice = (amount) => `PKR ${(amount || 0).toLocaleString()}`;

export const cleanPhoneNumber = (phone) => {
  if (!phone) return "923492000050";
  let cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "92" + cleaned.slice(1);
  } else if (!cleaned.startsWith("92")) {
    cleaned = "92" + cleaned;
  }
  return cleaned;
};

export const generateOrderMessage = ({ customerInfo = {}, cartItems = [], total = 0 }) => {
  const itemsText = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} x${item.quantity} - Rs. ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
    )
    .join("\n");

  let msg = `🛍️ *NEW ORDER - RESHINE COSMETICS*\n\n`;
  msg += `👤 *Customer Details:*\n`;
  msg += `• Name: ${customerInfo.fullName || "Not provided"}\n`;
  msg += `• Phone: ${customerInfo.phone || "Not provided"}\n`;
  if (customerInfo.email && customerInfo.email !== "N/A") {
    msg += `• Email: ${customerInfo.email}\n`;
  }
  msg += `• City: ${customerInfo.city || "Not provided"}\n`;
  msg += `• Address: ${customerInfo.address || "Not provided"}\n`;
  if (customerInfo.notes && customerInfo.notes !== "None") {
    msg += `• Notes: ${customerInfo.notes}\n`;
  }
  msg += `\n📦 *Order Items:*\n`;
  msg += `${itemsText || "No items"}\n\n`;
  msg += `💰 *Total Amount:* Rs. ${(total || 0).toFixed(2)} (+ Delivery Fee)\n\n`;
  msg += `Please confirm my order. Thank you!`;

  return msg;
};
