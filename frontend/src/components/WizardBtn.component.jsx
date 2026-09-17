const WizardBtn = ({ label, openModal }) => {
  return (
    <button className="wz-link-btn" onClick={openModal}>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      {label}
    </button>
  );
};

export default WizardBtn;
