import CustomerVehicleStep from "../components/CustomerVehicleStep";
import ServicesMaterialsStep from "../components/ServicesMaterialsStep";
import ServiceOrderInfoStep from "../components/ServiceOrderInfoStep";
import PaymentStep from "../components/PaymentStep";
import OrderSummaryStep from "../components/OrderSummaryStep";
import WizardStepper from "../components/WizardStepper";
import { useState } from "react";
import { parseInputValue } from "../utils/parseValue";
import { useCustomers } from "../context/Customer.context";
import { formatarCelular } from "../utils/convertCel";
import { useServiceOrders } from "../context/ServiceOrder.context";

const NewServiceOrderWizard = () => {
  const { setSelectedCustomerFromDetailPanel } = useCustomers();
  const {
    addServiceOrder,
    handleMaintenanceJobChange,
    setListMaintenanceJobs,
    listMaintenanceJobs,
    handleMaterialInputChange,
    setMaterialsList,
    materialsList,
  } = useServiceOrders();

  const [inputValue, setInputValue] = useState("");
  const [maintenanceJobsGroupData, setMaintenanceJobsGroupData] = useState([]);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({});
  const [selectedCustomerFromModal, setSelectedCustomerFromModal] = useState(
    {},
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVehicleFromModal, setSelectedVehicleFromModal] = useState({});
  const [formData, setFormData] = useState({
    professional: "",
    status: 1,
    paymentStatus: 1,
    arrived_at: new Date().toISOString(),
    entry_km: "",
    diagnosis: "",
    labor_cost: 0,
    observation: "",
    subtotal: 0,
    paid: 0,
    customer_id: "",
    vehicle_id: "",
  });

  const handleFormFieldChange = (field, value) => {
    if (field === "labor_cost" || field === "subtotal" || field == "entry_km") {
      const cleanValue = parseInputValue(value);
      setFormData((prev) => ({
        ...prev,
        [field]: cleanValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectedVehicle = (vehicle) => {
    setSelectedVehicleInfo(vehicle);
    handleFormFieldChange("vehicle_id", vehicle.id);
  };

  const handleRemoveMaintenanceJob = (id) => {
    // 1. Remove a manutenção selecionada
    setListMaintenanceJobs((prev) =>
      prev.filter((element) => element.id !== id),
    );

    // 2. Remove todos os materiais vinculados a essa manutenção
    setMaterialsList((prev) =>
      prev.filter((material) => material.itemMaintenance_id !== id),
    );
  };

  const handleAddMaintenanceJob = (itemService, customId = null) => {
    const totalPrice = itemService.materialsList.reduce(
      (accumulator, currentValue) =>
        parseFloat(currentValue.value_unit || 0) *
          parseFloat(currentValue.quantity || 0) +
        accumulator,
      0,
    );

    const updatedJob = {
      id: customId || Date.now(),
      isOpen: false,
      maintenance_id: itemService.service.id,
      description: itemService.description,
      name: itemService.service.name,
      materialsList: itemService.materialsList,
      totalPrice,
    };

    setListMaintenanceJobs((prev) => {
      // Se o ID já existir na lista, atualiza o item correspondente
      const exists = prev.some((job) => job.id === customId);
      if (exists) {
        return prev.map((job) => (job.id === customId ? updatedJob : job));
      }
      // Caso contrário, adiciona o novo serviço à lista
      return [...prev, updatedJob];
    });
  };

  return (
    <div>
      <WizardStepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <CustomerVehicleStep
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setFormData={setFormData}
        formData={formData}
        inputValue={inputValue}
        selectedCustomerFromModal={selectedCustomerFromModal}
        setSelectedCustomerFromModal={setSelectedCustomerFromModal}
        setSelectedCustomerInfo={setSelectedCustomerInfo}
        selectedCustomerInfo={selectedCustomerInfo}
        selectedVehicleInfo={selectedVehicleInfo}
        onInputChange={(val) => setInputValue(val)}
        handleSelectedVehicle={handleSelectedVehicle}
        setSelectedVehicleFromModal={setSelectedVehicleFromModal}
        selectedVehicleFromModal={selectedVehicleFromModal}
        handleFormFieldChange={handleFormFieldChange}
        onSelect={(customer) => {
          setInputValue(customer.name);
          setSelectedCustomerInfo(customer);

          // Atualiza o ID do cliente no formData
          handleFormFieldChange("customer_id", customer.id);

          // Se o cliente possuir exatamente 1 veículo, seleciona-o automaticamente
          if (customer.vehicles?.length === 1) {
            handleSelectedVehicle(customer.vehicles[0]);
          } else {
            // Se tiver múltiplos veículos ou nenhum, limpa o veículo selecionado anteriormente
            setSelectedVehicleInfo(null);
            handleFormFieldChange("vehicle_id", "");
          }
        }}
        onClear={() => {
          setInputValue("");
          setSelectedCustomerInfo(null);
          setSelectedVehicleInfo(null);
          handleFormFieldChange("customer_id", "");
          handleFormFieldChange("vehicle_id", "");
          setSelectedCustomerFromDetailPanel({});
          setSelectedCustomerFromModal({});
          setSelectedVehicleFromModal({});
        }}
        renderOption={(customer) => (
          <>
            <div className="ac-option-name">{customer.name}</div>
            <div className="ac-option-sub">
              {`${formatarCelular(customer.cell)} · ${customer.vehicles?.length || 0} veículo(s)`}
            </div>
          </>
        )}
      />
      <ServicesMaterialsStep
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        handleFormFieldChange={handleFormFieldChange}
        listMaintenanceJobs={listMaintenanceJobs}
        handleRemoveMaintenanceJob={handleRemoveMaintenanceJob}
        handleAddMaintenanceJob={handleAddMaintenanceJob}
      />
      {/*<ServiceOrderInfoStep />
      <PaymentStep />
      <OrderSummaryStep /> */}
    </div>
  );
};

export default NewServiceOrderWizard;
