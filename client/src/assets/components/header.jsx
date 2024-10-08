// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import '../css/components.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-nav">
        <ul className="d-flex nav-list">
          <li>
            <Link to="/" className="navlink">
              Catalog control
            </Link>
          </li>
          <li>
            <Link to="/ebss" className="navlink">
              EBSS
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
