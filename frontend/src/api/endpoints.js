export const ENDPOINTS = {
  // Customers
  customers: {
    base: "/customers",
    perPage: "/customers/page",
    byId: (id) => `/customers/${id}`,
    orders: (id) => `/customers/${id}/orders`,
    count: `/customers/count`,
  },

  auth: {
    fetchMe: "/auth/me",
    login: "/auth/login",
  },

  // Cars
  vehicles: {
    base: "/vehicles",
    byId: (id) => `/vehicles/${id}`,
    maintenance: (id) => `/vehicles/${id}/maintenance`,
  },

  // Orders (Service Orders)
  orders: {
    base: "/service-order",
    perPage: "/service-order/page",
    byId: (id) => `/service-order/${id}`,
    status: (id) => `/service-order/${id}/status`,
    byCustomer: (customerId) => `/service-order/customer/${customerId}`,
    byVehicle: (vehicleId) => `/service-order/vehicle/${vehicleId}`,
    byStatus: (status) => `/service-order/status/${status}`,
    recalculate: (id) => `/service-order/${id}/recalculate`,
    count: `/service-order/count`,
  },

  // Maintenance Jobs
  maintenanceJobs: {
    base: "/maintenance",
    byId: (id) => `/maintenance/${id}`,
    byGroup: (groupId) => `/maintenance/group/${groupId}`,
  },

  // Maintenance Groups
  maintenanceGroups: {
    base: "/maintenance-group",
    count: `/maintenance-group/count`,
    byId: (id) => `/maintenance-group/${id}`,
    jobs: (id) => `/maintenance-group/${id}/jobs`,
  },

  // Materials
  materials: {
    base: "/material",
    byId: (id) => `/material/${id}`,
    byGroup: (groupId) => `/material/group/${groupId}`,
  },

  // Material Groups
  materialGroups: {
    base: "/material-group",
    count: `/material-group/count`,
    byId: (id) => `/material-group/${id}`,
    materials: (id) => `/material-group/${id}/materials`,
  },

  // Item Materials (materiais dentro da OS)
  itemMaterials: {
    base: "/material-item",
    byId: (id) => `/material-item/${id}`,
    byOrder: (orderId) => `/material-item/order/${orderId}`,
  },

  // Item Maintenance (manutenações dentro da OS)
  itemMaintenances: {
    base: "/maintenance-item",
    byId: (id) => `/maintenance-item/${id}`,
    byOrder: (orderId) => `/maintenance-item/order/${orderId}`,
  },
};
