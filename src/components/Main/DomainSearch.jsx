import React, { useState } from "react";
import Cart from "../Main/Cart"; 
import "../Main/Main.css"

const DomainSearch = () => {
  const [domainInput, setDomainInput] = useState("");
  const [results, setResults] = useState([]);
  const [cartWindow, setCartWindow] = useState(false);
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
      setCartWindow(true); // Maak de winkelwagen zichtbaar
    } else {
      alert(`${domain.domain} is niet beschikbaar!`);
    }
  };

  const calculateTotal = () => {
    let subtotal = cart.reduce((total, domain) => total + domain.price.product.price, 0);
    
    if (isNaN(subtotal)) {
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

  const placeOrder = async () => {
    const { subtotal, tax, total } = calculateTotal();
  
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
        alert("Bestelling succesvol geplaatst!");
        setCart([]);  
        setCartWindow(false); 
      } else {
        alert("Er is een probleem met het plaatsen van je bestelling.");
      }
    } catch (error) {
      alert("Er is een fout opgetreden bij het plaatsen van je bestelling.");
    }
  };

  return (
    <div>
      <section className="search-container">
          <h1>Tijd om jezelf op de online kaart te zetten.</h1>
        <div>
      <input
        type="text"
        placeholder="Claim jouw domein naam"
        value={domainInput}
        onChange={(e) => setDomainInput(e.target.value)}
      />
      <button onClick={searchDomains}> <i className="fa-solid fa-magnifying-glass"></i> </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
      <div>
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

      <Cart 
        cart={cart} 
        calculateTotal={calculateTotal} 
        placeOrder={placeOrder} 
        isVisible={cartWindow} 
      />
    </div>
  );
};

export default DomainSearch;
