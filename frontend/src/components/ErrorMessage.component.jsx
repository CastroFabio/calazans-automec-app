const ErrorMessage = ({ errorMessage }) => {
  return (
    <div className="customer-error-message-container">
      {errorMessage && <div className="">{errorMessage}</div>}
    </div>
  );
};

export default ErrorMessage;
