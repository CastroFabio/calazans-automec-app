export const getCustomerNameInitials = (customerName) => {
  return customerName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
