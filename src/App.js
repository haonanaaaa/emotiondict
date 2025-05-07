import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Generation } from './Generation';
import Gallery from './Gallery'; // 假设您有一个 Gallery 组件
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/generation" element={<Generation />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
