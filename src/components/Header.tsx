import React from 'react'
import './Country.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path : any) => location.pathname === path ? 'active' : '';

  return (
    <div>
      <div className='heading'>
        <div className='head'>
          <h2 
            className={isActive('/')} 
            onClick={() => navigate('/')}
          >
            Countries
          </h2>
          <h2 
            className={isActive('/addcountries')} 
            onClick={() => navigate('/addcountries')}
          >
            Add Your Fav Countries Here
          </h2>
          <h2 
            className={isActive('/timecalculator')} 
            onClick={() => navigate('/timecalculator')}
          >
            Time Calculator
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Header;
