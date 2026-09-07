export const PATHS = {
  home: "/",
  serviceOrder: "/service-order",
  customer: "/customers",
  services: "/services",
  materials: "/materials",
  newServiceOrder: "/new-service-order",
  editCustomer: "/customers/edit/:id",
  editCustomerFN: (customerID) => `/customers/edit/${customerID}`,
  editServiceOrder: "/service-order/edit/:id",
  editServiceOrderFN: (serviceOrderID) =>
    `/service-order/edit/${serviceOrderID}`,
  notFound: "*",
  printServiceOrder: "/service-order/print/:id",
  printServiceOrderFN: (serviceOrderID) =>
    `/service-order/print/${serviceOrderID}`,
};
