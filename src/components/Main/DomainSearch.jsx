import React, { useState } from "react";
import "../Main/Main.css";
import { useNavigate } from "react-router-dom";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const DomainSearch = () => {
  const navigate = useNavigate();

  const [domainInput, setDomainInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const searchDomains = () => {
    if (!domainInput.trim()) {
      alert("Vul een domeinnaam in om te zoeken.");
      return;
    }
    navigate(`/results?q=${domainInput.trim()}`);
  };

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:1122/api/domains/suggestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({ query: input }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error("Error fetching suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Zonder de debounce zouden er overbodige verzoeken en verhoogde belasting naar de server gestuurd worden.
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  return (
    <div>
      <section className="search-container">
        <h1>Tijd om jezelf op de online kaart te zetten.</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Claim jouw domein naam"
            value={domainInput}
            onChange={(e) => {
              const input = e.target.value;
              setDomainInput(input);
              debouncedFetchSuggestions(input);
            }}
          />
          <button onClick={searchDomains}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion.domain}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default DomainSearch;
