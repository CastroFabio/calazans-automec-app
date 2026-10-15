import CustomerVehicleStep from "../components/CustomerVehicleStep"
import ServicesMaterialsStep from "../components/ServicesMaterialsStep"
import ServiceOrderInfoStep from "../components/ServiceOrderInfoStep"
import PaymentStep from "../components/PaymentStep"
import OrderSummaryStep from "../components/OrderSummaryStep"
import WizardStepper from "../components/WizardStepper"
import { useState } from "react"
import { parseInputValue } from "../utils/parseValue"
import { useCustomers } from "../context/Customer.context"
import { formatarCelular } from "../utils/convertCel"

const NewServiceOrderWizard = () => {
  const {
    selectedCustomerFromDetailPanel,
    setSelectedCustomerFromDetailPanel,
    addServiceOrderToCustomer,
  } = useCustomers()

  const [inputValue, setInputValue] = useState("")
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null)
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState({})
  const [selectedCustomerFromModal, setSelectedCustomerFromModal] = useState({})
  const [selectedVehicleFromModal, setSelectedVehicleFromModal] = useState({})
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
  })

  const handleFormFieldChange = (field, value) => {
    if (field === "labor_cost" || field === "subtotal") {
      const cleanValue = parseInputValue(value)

      setFormData((prev) => ({
        ...prev,
        [field]: cleanValue,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleSelectedVehicle = (vehicle) => {
    setSelectedVehicleInfo(vehicle)
    handleFormFieldChange("vehicle_id", vehicle.id)
  }

  return (
    <div>
      <WizardStepper />
      <CustomerVehicleStep
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
          setInputValue(customer.name)
          setSelectedCustomerInfo(customer)

          // Atualiza o ID do cliente no formData
          handleFormFieldChange("customer_id", customer.id)

          // Se o cliente possuir exatamente 1 veículo, seleciona-o automaticamente
          if (customer.vehicles?.length === 1) {
            handleSelectedVehicle(customer.vehicles[0])
          } else {
            // Se tiver múltiplos veículos ou nenhum, limpa o veículo selecionado anteriormente
            setSelectedVehicleInfo(null)
            handleFormFieldChange("vehicle_id", "")
          }
        }}
        onClear={() => {
          setInputValue("")
          setSelectedCustomerInfo(null)
          setSelectedVehicleInfo(null)
          handleFormFieldChange("customer_id", "")
          handleFormFieldChange("vehicle_id", "")
          setSelectedCustomerFromDetailPanel({})
          setSelectedCustomerFromModal({})
          setSelectedVehicleFromModal({})
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
      {/*<ServicesMaterialsStep />
      <ServiceOrderInfoStep />
      <PaymentStep />
      <OrderSummaryStep /> */}
    </div>
  )
}

export default NewServiceOrderWizard
