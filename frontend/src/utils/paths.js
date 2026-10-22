export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SERVICES: "/services",
  MATERIALS: "/materials",

  CUSTOMERS: {
    ROOT: "/customers",
    EDIT: "/customers/edit/:id",
    buildEdit: (id) => `/customers/edit/${id}`,
  },

  SERVICE_ORDERS: {
    ROOT: "/service-order",
    NEW: "/service-order/new",
    EDIT: "/service-order/edit/:id",
    PRINT: "/service-order/print/:id",
    buildEdit: (id) => `/service-order/edit/${id}`,
    buildPrint: (id) => `/service-order/print/${id}`,
  },

  NOT_FOUND: "*",
};
