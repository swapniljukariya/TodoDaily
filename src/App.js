import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/HomePage';
import ImageEditor from './Components/ImageCropper';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo-editor" element={<ImageEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
