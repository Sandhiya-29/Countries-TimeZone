import React from 'react'
import './Country.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path : any) => location.pathname === path ? 'active' : '';

  return (
    <div>
      <div className='heading' style={{height:"80px"}}>
        <div className='head'>
          <h3
            className={isActive('/')} 
            onClick={() => navigate('/')}
          >
            Countries
          </h3>
          <h3 
            className={isActive('/addcountries')} 
            onClick={() => navigate('/addcountries')}
          >
            Add Your Fav Country
          </h3>
          <h3 
            className={isActive('/timecalculator')} 
            onClick={() => navigate('/timecalculator')}
          >
            Time Calculator
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Header;
