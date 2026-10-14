import CustomerVehicleStep from "../components/CustomerVehicleStep";
import ServicesMaterialsStep from "../components/ServicesMaterialsStep";
import ServiceOrderInfoStep from "../components/ServiceOrderInfoStep";
import PaymentStep from "../components/PaymentStep";
import OrderSummaryStep from "../components/OrderSummaryStep";
import WizardStepper from "../components/WizardStepper";

const NewServiceOrderWizard = () => {
  return (
    <div>
      <WizardStepper />
      <CustomerVehicleStep />;
      <ServicesMaterialsStep />
      <ServiceOrderInfoStep />
      {/*<PaymentStep />
      <OrderSummaryStep /> */}
    </div>
  );
};

export default NewServiceOrderWizard;
