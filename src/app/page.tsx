// pages/home.tsx
"use client"
import React, { useState, useEffect } from "react";
import Accueil from "./page/accueil/page";
import { ToastContainer } from "react-toastify";
import 'antd/dist/reset.css';
import 'tailwindcss/tailwind.css'; // Assurez-vous que Tailwind CSS est importé
import Loader from "./components/Loader"; // Importer le composant Loader

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simule un délai de 1 seconde

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {loading && <Loader />}
      <Accueil />
      <ToastContainer />
    </div>
  );
};

export default Home;
