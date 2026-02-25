// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/layout/Layout';
// import Home from './pages/Home';
// import About from './pages/About';
// import Achievements from './pages/Achievements';
// import Projects from './pages/Projects';
// import Dashboard from './pages/Dashboard';
// import Contact from './pages/Contact';
// import GreetingLoader from './components/ui/GreetingLoader';

// // ── Admin imports ──
// import { AuthProvider } from './admin/context/AuthContext';
// import ProtectedRoute from './admin/components/ProtectedRoute';
// import AdminLayout from './admin/components/AdminLayout';
// import Login from './admin/pages/Login';
// import AdminDashboard from './admin/pages/AdminDashboard';
// import AdminProjects from './admin/pages/AdminProjects';
// import ProjectForm from './admin/pages/ProjectForm';
// import AdminTechStacks from './admin/pages/AdminTechStacks';
// import TechStackForm from './admin/pages/TechStackForm';
// // import ExperiencesList from './admin/pages/ExperiencesList';
// // import ExperienceForm from './admin/pages/ExperienceForm';

// function App() {
//   const [isLoading, setIsLoading] = useState(true);

//   return (
//     <>
//       {isLoading && <GreetingLoader onComplete={() => setIsLoading(false)} />}
//       <Router>
//         <AuthProvider>
//           <Routes>
//             {/* ── Public routes (existing, untouched) ── */}
//             <Route path="/" element={<Layout />}>
//               <Route index element={<Home />} />
//               <Route path="about" element={<About />} />
//               <Route path="achievements" element={<Achievements />} />
//               <Route path="projects" element={<Projects />} />
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="contact" element={<Contact />} />
//             </Route>

//             {/* ── Admin routes (hidden, no public links) ── */}
//             <Route path="/admin/login" element={<Login />} />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute>
//                   <AdminLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route path="dashboard" element={<AdminDashboard />} />
//               <Route path="projects" element={<AdminProjects />} />
//               <Route path="projects/new" element={<ProjectForm />} />
//               <Route path="projects/:id/edit" element={<ProjectForm />} />
//               <Route path="tech-stacks" element={<AdminTechStacks />} />
//               <Route path="tech-stacks/new" element={<TechStackForm />} />
//               <Route path="tech-stacks/:id/edit" element={<TechStackForm />} />
//               {/* <Route path="experiences" element={<ExperiencesList />} />
//               <Route path="experiences/new" element={<ExperienceForm />} />
//               <Route path="experiences/:id/edit" element={<ExperienceForm />} /> */}
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </Router>
//     </>
//   );
// }

// export default App;

import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        {/* Ikon Animasi Sederhana */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Under Maintenance
        </h1>
        <p className="text-[#8b949e] text-lg">
          I'm currently upgrading the portfolio with a new dynamic backend system. Please check back soon!
        </p>
        <p className="text-blue-500 mt-8 font-medium">
          - Muhammad Delvin Julian
        </p>
      </div>
    </div>
  );
}