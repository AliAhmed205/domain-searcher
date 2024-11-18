import React from "react";
import "../Header/Header.css"

const Header = () => {
  return (
    <>
      <header>
        <nav>
          <div className="logo">
            
            <a href="/"><i className="fa-solid fa-globe"></i> Do<b>Mijn</b></a>
            <p>Jouw domein, jouw terrein</p>
          </div>

          <ul>
            <li>Domein</li>
            <li>E-mail</li>
            <li>Website</li>
            <li>VPS</li>
            <li>Over ons</li>
          </ul>
          <button>
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
        </nav>
      </header>
    </>
  );
};

export default Header;
