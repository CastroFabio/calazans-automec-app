export const ENDPOINTS = {
  // Customers
  customers: {
    base: "/customers",
    byId: (id) => `/customers/${id}`,
    orders: (id) => `/customers/${id}/orders`,
  },

  // Cars
  cars: {
    base: "/cars",
    byId: (id) => `/cars/${id}`,
    maintenance: (id) => `/cars/${id}/maintenance`,
  },

  // Orders (Service Orders)
  orders: {
    base: "/service-order",
    byId: (id) => `/service-order/${id}`,
    status: (id) => `/service-order/${id}/status`,
    byCustomer: (customerId) => `/service-order/customer/${customerId}`,
    byVehicle: (vehicleId) => `/service-order/vehicle/${vehicleId}`,
    byStatus: (status) => `/service-order/status/${status}`,
    recalculate: (id) => `/service-order/${id}/recalculate`,
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
    byId: (id) => `/material-group/${id}`,
    materials: (id) => `/material-group/${id}/materials`,
  },

  // Item Materials (materiais dentro da OS)
  itemMaterials: {
    base: "/item-material",
    byId: (id) => `/item-material/${id}`,
    byOrder: (orderId) => `/item-material/order/${orderId}`,
  },
};
