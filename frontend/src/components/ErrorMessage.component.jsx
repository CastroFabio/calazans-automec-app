const ErrorMessage = ({ errorMessage }) => {
  if (!errorMessage) return;

  return (
    <div className="customer-error-message-container">
      <div className="">{errorMessage}</div>
    </div>
  );
};

export default ErrorMessage;
