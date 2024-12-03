import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/Store';
 import Countries from './components/Contries';
import Header from './components/Header';
import './App.css';
import {  Route, Routes } from 'react-router-dom';
import TimeCalculator from './components/TimeCalculator';
import CountryList from './components/AddCountry';


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className='App'>
        <Header />
      
       
          <Routes>
            <Route path='/timecalculator' element={<TimeCalculator />} />
            <Route path='/' element={<Countries />} />
            <Route path='/addcountries' element={<CountryList />} />
          </Routes>
       
      
      </div>
    </Provider>
  );
};

export default App;
