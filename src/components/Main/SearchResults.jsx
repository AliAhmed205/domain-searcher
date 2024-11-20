import React, { useEffect, useState } from "react";
import "../Main/Main.css";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [cartWindow, setCartWindow] = useState(false);
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get("q");

  const handleRemoveFromCart = (domainToRemove) => {
    setCart(cart.filter((domain) => domain.domain !== domainToRemove.domain));
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
        return true;
      } else {
        alert("Er is een probleem met het plaatsen van je bestelling.");
        return false;
      }
    } catch (error) {
      alert("Er is een fout opgetreden bij het plaatsen van je bestelling.");
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    const success = await placeOrder();
    if (success) {
      navigate("/");
    }
  };

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

        const response = await fetch(
          "http://localhost:1122/api/domains/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

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
    <section className="result-parent">
      <section className="results-container">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {results.map((domain, index) => (
            <li key={index}>
              <button onClick={() => setCart([...cart, domain])}>
                <p>{domain.domain}</p>{" "}
                <p>
                  € {domain.price?.product?.price ?? "Prijs niet beschikbaar"}*
                </p>{" "}
                <span>
                  <i className="fa-solid fa-cart-shopping"></i>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <Cart
        cart={cart}
        calculateTotal={calculateTotal}
        placeOrder={handlePlaceOrder}
        isVisible={cartWindow}
        handleRemoveFromCart={handleRemoveFromCart} 
      />
    </section>
  );
};

export default SearchResults;
