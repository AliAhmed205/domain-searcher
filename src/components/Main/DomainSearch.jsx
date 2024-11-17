import React, { useState } from "react";

const DomainSearch = () => {
  const [domainInput, setDomainInput] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const searchDomains = async () => {
    try {
      const requestBody = [
        { name: domainInput, extension: "com" },
        { name: domainInput, extension: "nl" },
        { name: domainInput, extension: "net" },
        { name: domainInput, extension: "eu" },
        { name: domainInput, extension: "dev" },
      ];

      const response = await fetch('http://localhost:1122/api/domains/search', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.REACT_APP_API_KEY}`,
        }, 
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResults(data);
      } else {
        setError("Er is iets mis gegaan met de aanvraag.");
      }
    } catch (error) {
      setError(
        "Er is een fout opgetreden bij het ophalen van de gegevens: " +
          error.message
      );
    }
  };

  return (
    <div>
      <h2>Domein Zoeken</h2>
      <input
        type="text"
        placeholder="Voer een domeinnaam in"
        value={domainInput}
        onChange={(e) => setDomainInput(e.target.value)}
      />
      <button onClick={searchDomains}>Zoek</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Resultaten:</h3>
        <ul>
          {results.map((domain, index) => (
            <li key={index}>
              {domain.domain} - {domain.status} - €
              {domain.price.product
                ? domain.price.product.amount
                : "Prijs niet beschikbaar"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DomainSearch;
