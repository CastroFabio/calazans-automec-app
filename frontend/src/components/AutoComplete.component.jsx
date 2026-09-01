import React, { useState, useMemo } from "react";

const AutoComplete = ({
  label = "",
  placeholder = "Digite para buscar...",
  items = [],
  filterKey = "name",
  value = "",
  selectedItem = null,
  onSelect,
  onClear,
  onInputChange,
  onCreateNew,
  renderOption,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cálculo derivado com useMemo em vez de useEffect + setState
  const filteredSuggestions = useMemo(() => {
    if (!value || !value.trim()) {
      return [];
    }

    return items.filter((item) => {
      const itemValue = item[filterKey] || "";
      return itemValue.toLowerCase().includes(value.toLowerCase());
    });
  }, [value, items, filterKey]);

  const handleSuggestionClick = (item) => {
    onSelect(item);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    onInputChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (value && value.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="ac-wrap">
        <div className="ac-input-row">
          <span className="ac-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          {selectedItem ? (
            <div className="ac-selected-pill">
              {selectedItem[filterKey]}
              <button type="button" onClick={onClear}>
                ×
              </button>
            </div>
          ) : (
            <>
              <input
                className="ac-input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <span className="ac-clear" onClick={onClear}>
                ×
              </span>
            </>
          )}
        </div>

        {showSuggestions && (
          <div className="ac-dropdown open">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => {
                const isDisabled = item.disabled || item.isDisabled;
                return (
                  <div
                    key={item.id || index}
                    className="ac-option"
                    onClick={() => {
                      if (!isDisabled) handleSuggestionClick(item);
                    }}
                  >
                    {renderOption ? (
                      renderOption(item)
                    ) : (
                      <div className="ac-option-name">{item[filterKey]}</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="ac-empty">Nenhum resultado encontrado</div>
            )}

            {onCreateNew && value.trim() !== "" && (
              <div
                className="ac-option-create"
                onClick={() => onCreateNew(value)}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {`Cadastrar "${value}"`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoComplete;
