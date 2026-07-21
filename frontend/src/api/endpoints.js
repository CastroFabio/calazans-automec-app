export const ENDPOINTS = {
  // Customers
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id) => `/customers/${id}`,

  // Cars
  CARS: "/cars",
  CAR_BY_ID: (id) => `/cars/${id}`,

  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id) => `/orders/${id}`,

  // Maintenance Jobs
  MAINTENANCE_JOBS: "/maintenance-jobs",
  MAINTENANCE_JOB_BY_ID: (id) => `/maintenance-jobs/${id}`,

  // Materials
  MATERIALS: "/materials",
  MATERIAL_BY_ID: (id) => `/materials/${id}`,

  // Endpoints específicos (exemplos extras)
  CUSTOMER_ORDERS: (customerId) => `/customers/${customerId}/orders`,
  CAR_MAINTENANCE: (carId) => `/cars/${carId}/maintenance`,
};

// Opção 2: Objeto aninhado por entidade
export const ENDPOINTS = {
  customers: {
    base: "/customers",
    byId: (id) => `/customers/${id}`,
    orders: (id) => `/customers/${id}/orders`,
  },
  cars: {
    base: "/cars",
    byId: (id) => `/cars/${id}`,
    maintenance: (id) => `/cars/${id}/maintenance`,
  },
  orders: {
    base: "/orders",
    byId: (id) => `/orders/${id}`,
    status: (id) => `/orders/${id}/status`,
  },
  maintenanceJobs: {
    base: "/maintenance-jobs",
    byId: (id) => `/maintenance-jobs/${id}`,
  },
  materials: {
    base: "/materials",
    byId: (id) => `/materials/${id}`,
  },
};

// Opção 3: Constantes de string com prefixo
export const API_PATHS = {
  CUSTOMERS: {
    ROOT: "/customers",
    GET_ALL: "/customers",
    GET_ONE: "/customers/{id}",
    CREATE: "/customers",
    UPDATE: "/customers/{id}",
    DELETE: "/customers/{id}",
  },
  CARS: {
    ROOT: "/cars",
    GET_ALL: "/cars",
    GET_ONE: "/cars/{id}",
    CREATE: "/cars",
    UPDATE: "/cars/{id}",
    DELETE: "/cars/{id}",
  },
};
