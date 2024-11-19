import React from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import SearchResults from './components/Main/SearchResults'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
