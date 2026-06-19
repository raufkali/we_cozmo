export const formatPrice = (amount) => `PKR ${amount.toLocaleString()}`;

export const generateOrderMessage = (orderData) => {
  const { fullName, address, city, postalCode, phone, items, total } =
    orderData;
  let msg = "New Order:\n\n";
  msg += `Customer: ${fullName}\n`;
  msg += `Address: ${address}, ${city}, ${postalCode}\n`;
  msg += `Phone: ${phone || "Not provided"}\n\n`;
  msg += "Items:\n";
  items.forEach((item) => {
    msg += `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
  });
  msg += `\nTotal: ${formatPrice(total)}`;
  return msg;
};
