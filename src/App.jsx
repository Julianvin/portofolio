import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="projects" element={<Projects />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<ChatRoom />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
