import React from "react";
import "../Main/Main.css";

const Cart = ({ cart, calculateTotal, placeOrder, isVisible }) => {
  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className={`cart-container ${isVisible ? "" : "hidden"}`}>
      <h3>Checkout:</h3>
      <ul>
        {cart.map((domain, index) => (
          <li key={index}>{domain.domain} - €{domain.price.product.price}</li>
        ))}
      </ul>
      <p>Subtotaal: €{subtotal}</p>
      <p>BTW (21%): €{tax}</p>
      <p>Totaal: €{total}</p>
      <button onClick={placeOrder} disabled={cart.length === 0}>
        Bestellen
      </button>
    </div>
  );
};

export default Cart;
