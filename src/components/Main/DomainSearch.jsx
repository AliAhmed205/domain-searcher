import React, { useState } from "react";
import Cart from "../Main/Cart";
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
  const [cartWindow, setCartWindow] = useState(false);
  const [cart, setCart] = useState([]);

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

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const addToCart = (domain) => {
    if (domain.status === "free") {
      setCart((prevCart) => [...prevCart, domain]);
      setCartWindow(true); // Show cart
    } else {
      alert(`${domain.domain} is niet beschikbaar!`);
    }
  };

  const calculateTotal = () => {
    let subtotal = cart.reduce(
      (total, domain) => total + domain.price.product.price,
      0
    );

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
      const response = await fetch("http://localhost:1122/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
            <li 
            key={index} 
            onClick={() => {
              setDomainInput(suggestion.domain);
              setSuggestions([]); 
            }}
          >
            {suggestion.domain}
          </li>
              ))}
            </ul>
          )}
        </div>
      </section>

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
