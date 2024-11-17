import React, { useState } from "react";

const DomainSearch = () => {
  const [domainInput, setDomainInput] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

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

  const addToCart = (domain) => {
    if (domain.status === "free") {
      setCart((prevCart) => [...prevCart, domain]);
    } else {
      alert(`${domain.domain} is niet beschikbaar!`);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let subtotal = cart.reduce((total, domain) => total + domain.price.product.price, 0);
    
    if (isNaN(subtotal)) {
      console.error("Subtotal is geen geldig getal:", subtotal);
      subtotal = 0;
    } else {
      subtotal = parseFloat(subtotal).toFixed(2); 
    }

    const tax = (subtotal * 0.21).toFixed(2); 

    return {
      subtotal: parseFloat(subtotal),
      tax: parseFloat(tax),
      total: (parseFloat(subtotal) + parseFloat(tax)).toFixed(2),
    };
  };

  const { subtotal, tax, total } = calculateTotal();

  const placeOrder = async () => {
    const orderData = {
      domains: cart,
      subtotal: subtotal,
      tax: tax,
      total: total,
    };

    try {
      const response = await fetch('http://localhost:1122/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Bestelling succesvol geplaatst!");
        setCart([]);
      } else {
        alert("Er is een probleem met het plaatsen van je bestelling.");
      }
    } catch (error) {
      alert("Er is een fout opgetreden bij het plaatsen van je bestelling.");
      console.error("Fout bij het plaatsen van de bestelling:", error);
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
                ? domain.price.product.price
                : "Prijs niet beschikbaar"}
              <button onClick={() => addToCart(domain)}>Voeg toe aan winkelmand</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Winkelmand:</h3>
        <ul>
          {cart.map((domain, index) => (
            <li key={index}>
              {domain.domain} - €
              {domain.price.product
                ? domain.price.product.price
                : "Prijs niet beschikbaar"}
              <button onClick={() => removeFromCart(index)}>Verwijder</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Checkout:</h3>
        <p>Subtotaal: €{subtotal}</p>
        <p>BTW (21%): €{tax}</p>
        <p>Totaal: €{total}</p>
        <button onClick={placeOrder} disabled={cart.length === 0}>
          Bestellen
        </button>
      </div>
    </div>
  );
};

export default DomainSearch;
