import React from "react";
import "../Main/Main.css";
import { useNavigate } from "react-router-dom"; 

const Cart = ({ cart, calculateTotal, placeOrder, isVisible, handleRemoveFromCart }) => {
  const { tax, total } = calculateTotal();
  const navigate = useNavigate(); 

  const handleOrder = async () => {
    const orderSuccess = await placeOrder();
    
    if (orderSuccess) {
      navigate("/"); 
    }
  };

  return (
    <div className={`cart-container ${isVisible ? "visible" : ""}`}>
      <h3>
        <span>
          <i className="fa-solid fa-cart-shopping"></i>
        </span> 
        Winkelwagen
      </h3>

      {cart.length > 0 ? (
        <ul>
          {cart.map((domain, index) => (
            <li key={index}>
              <p>{domain.domain}</p> 
              <p>€{domain.price.product.price}</p>
              <button onClick={() => handleRemoveFromCart(domain)}>
                <i className="fa-solid fa-trash-can"></i> 
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Je winkelwagen is leeg</p>
      )}

      <div className="btw-container flex padding">
        <p>+BTW (21%)</p><p>€{tax}</p>
      </div>
      <div className="total-container flex padding">
        <p>Totaal</p> <p>€{total}</p>
      </div>

      <button onClick={handleOrder} disabled={cart.length === 0}>
        Bestellen
      </button>
    </div>
  );
};

export default Cart;
