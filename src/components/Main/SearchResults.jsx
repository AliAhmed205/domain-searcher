import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const searchDomains = async () => {
      try {
        const requestBody = [
          { name: searchQuery, extension: "com" },
          { name: searchQuery, extension: "nl" },
          { name: searchQuery, extension: "net" },
          { name: searchQuery, extension: "eu" },
          { name: searchQuery, extension: "dev" },
        ];

        const response = await fetch("http://localhost:1122/api/domains/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setError("Er is iets mis gegaan met de aanvraag.");
        }
      } catch (error) {
        setError("Fout bij het ophalen van resultaten: " + error.message);
      }
    };

    searchDomains();
  }, [searchQuery]);

  return (
    <div>
      <h1>Zoekresultaten voor: {searchQuery}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {results.map((domain, index) => (
          <li key={index}>
            {domain.domain} - {domain.status} - €
            {domain.price?.product?.price ?? "Prijs niet beschikbaar"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
