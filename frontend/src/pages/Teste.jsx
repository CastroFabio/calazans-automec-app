import React, { useState, useEffect } from "react";

// Dados de exemplo - você pode substituir por sua API
const suggestions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tomato",
  "Watermelon",
];

const AutocompleteSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrar sugestões baseado no input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleBlur = () => {
    // Delay para permitir clique na sugestão
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Busca Autocomplete</h2>

      <div style={styles.searchContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Digite para buscar..."
          style={styles.input}
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={styles.suggestionItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {inputValue && (
        <div style={styles.selected}>
          <strong>Selecionado:</strong> {inputValue}
        </div>
      )}
    </div>
  );
};

// Estilos básicos
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  searchContainer: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  suggestionsList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    listStyle: "none",
    border: "1px solid #ddd",
    borderTop: "none",
    backgroundColor: "white",
    borderRadius: "0 0 4px 4px",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 1000,
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
  },
  selected: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
};

export default AutocompleteSearch;
