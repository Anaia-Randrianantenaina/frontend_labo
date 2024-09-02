'use client';

import React, { useEffect, useState } from 'react';
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaBell, FaChartBar, FaEye, FaUserCog, FaUserGraduate, FaUserMd, FaUserTie } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default function Perso() {

 

  
  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // État pour le modal de notification
  const [notifications, setNotifications] = useState<string[]>([]); // État pour les notifications


  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openReportModal = () => setIsReportOpen(true);
  const closeReportModal = () => setIsReportOpen(false);

  const openNotificationModal = () => setIsNotificationOpen(true);
  const closeNotificationModal = () => setIsNotificationOpen(false);


  const [data, setData] = useState<PersonnelData[]>([]);
  const [loading, setLoading] = useState(true);

  // Définition de l'interface pour les données des personnels
  interface PersonnelData {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    adresse: string;
    contacte: string;
  }

  // Fonction pour récupérer les données des personnels depuis le serveur
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/personnels');
        
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
  
        const result: PersonnelData[] = await response.json(); // Spécifie le type ici
        console.log("Données récupérées :", result);
  
       
        setData(result);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [data]);
  
  

  // Calcul du nombre de personnels par poste
  const totalPersonnel = data.length;
  const biologiste = data.filter(personnel => personnel.poste === 'Medecin Biologiste').length;
  const techniciens = data.filter(personnel => personnel.poste === 'Technicien de laboratoire').length;
  const secretaire = data.filter(personnel => personnel.poste === 'Secretaire').length;
  const chefService = data.filter(personnel => personnel.poste === 'Chef de Service').length;

  // Définition des colonnes pour le tableau
  const columns = [
    {
      name: 'Matricule',
      selector: (row: PersonnelData) => row.matricule,
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row: PersonnelData) => row.nom,
      sortable: true,
    },
    {
      name: 'Prénoms',
      selector: (row: PersonnelData) => row.prenom,
      sortable: true,
    },
    {
      name: 'Poste',
      selector: (row: PersonnelData) => row.poste,
      sortable: true,
    },
    {
      name: 'Adresse',
      selector: (row: PersonnelData) => row.adresse,
      sortable: true,
    },
    {
      name: 'Contacte',
      selector: (row: PersonnelData) => row.contacte,
      sortable: true,
    }
  ];

  // Données et options pour le graphique à barres
  const barData = {
    labels: ['Médecin Biologiste', 'Technicien', 'Secrétaire', 'Chef de Service'],
    datasets: [
      {
        label: 'Nombre de Personnels',
        data: [biologiste, techniciens, secretaire, chefService],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Données et options pour le graphique circulaire
  const pieData = {
    labels: ['Médecin Biologiste', 'Technicien', 'Secrétaire', 'Chef de Service'],
    datasets: [
      {
        label: 'Répartition des Postes',
        data: [biologiste, techniciens, secretaire, chefService],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex">
      {/* NAVBAR */}
      <div><Navbar /></div>

      <div className="w-full h-[100vh] p-2">
        {/* MENU */}
        <div><Menu /></div>
        <div className="w-full h-[2%]"></div>

        {/* CONTENU PRINCIPAL */}
        <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
            {/* Ajouter un bouton pour ouvrir le modal du rapport analytique */}
            <div className="flex space-x-3 justify-end mt-2 mr-2">

              {/* Bouton pour les notifications */}
              <button
              className="px-4 font-bold py-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition-colors duration-300 flex justify-between ml-2"
              onClick={openNotificationModal}> 
              <FaBell className="mr-2 text-lg" /> Notifications
            </button>
             
            <button
              className="px-4 font-bold py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 flex justify-between"
              onClick={openReportModal}
            > <FaChartBar className="mr-2 text-lg" /> Rapport Analytique
            </button>
          </div>
          <div className="flex space-x-12 mt-[-20px]">
            {/* NOMBRE TOTALE DES PERSONNELS */}
            <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded-lg z-10 p-4 overflow-auto flex items-center justify-center">
              <div className="space-y-4 p-4 bg-white shadow-md rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col items-center">
                <p className="text-lg font-semibold text-gray-800">Total Personnel: {totalPersonnel}</p>
                <button
                  className="mt-2 px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-100 flex items-center transition-colors duration-300"
                  onClick={openModal}
                >
                  <FaEye className="mr-2 text-lg" /> Voir Détails
                </button>
              </div>
            </div>
            {/* MÉDECIN BIOLOGISTE */}
            <div className="m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded-lg border-2 border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-center p-6 overflow-auto">
              <FaUserMd className="text-4xl text-gray-600 mr-4 hover:text-blue-500 transition-colors" />
              <p className="text-xl font-semibold text-gray-800">Médecin Biologiste: {biologiste}</p>
            </div>

            {/* NOMBRE DE TECHNICIEN */}
            <div className="m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded-lg border-2 border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-center p-6 overflow-auto">
              <FaUserCog className="text-4xl text-gray-600 mr-4 hover:text-green-500 transition-colors" />
              <p className="text-xl font-semibold text-gray-800">Technicien: {techniciens}</p>
            </div>

            {/* NOMBRE DE SECRÉTAIRE */}
            <div className="m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded-lg border-2 border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-center p-6 overflow-auto">
              <FaUserGraduate className="text-4xl text-gray-600 mr-4 hover:text-purple-500 transition-colors" />
              <p className="text-xl font-semibold text-gray-800">Secrétaire: {secretaire}</p>
            </div>

            {/* NOMBRE DE CHEF DE SERVICE */}
            <div className="m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded-lg border-2 border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-center p-6 overflow-auto">
              <FaUserTie className="text-4xl text-gray-600 mr-4 hover:text-red-500 transition-colors" />
              <p className="text-xl font-semibold text-gray-800">Chef de Service: {chefService}</p>
            </div>
          </div>

        
          
          {/* PARTIE GRAPHE */}
          <div className="flex justify-center">
            <div className="top-[50px] m-10 w-[800px] h-[450px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
              <Bar data={barData} options={{ responsive: true }} />
            </div>

            <div className="top-[50px] m-10 w-[800px] h-[450px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>

          {/* MODAL POUR LES DÉTAILS DU PERSONNEL */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg z-50">
                <h2 className="text-xl font-bold mb-4">Détails du Personnel</h2>
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  highlightOnHover
                  pointerOnHover
                  striped
                  selectableRows
                />
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg" onClick={closeModal}>Fermer</button>
              </div>
            </div>
          )}




          {/* MODAL POUR LE RAPPORT ANALYTIQUE */}
          {isReportOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg z-50">
      <h2 className="text-xl font-bold mb-4">Rapport Analytique</h2>
      {/* Contenu du rapport analytique */}
      <p className="mb-4">Voici le rapport analytique basé sur les données du personnel :</p>
      <div className="mb-4">
        <Bar data={barData} options={{ responsive: true }} />
      </div>
      <div>
        <Pie data={pieData} options={{ responsive: true }} />
      </div>
      <div className="flex justify-between">
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg no-print" onClick={closeReportModal}>Fermer</button>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg no-print"  onClick={() => window.print()}>Imprimer</button>
      </div>
    </div>
  </div>
)}


        {/* Modal pour les notifications */}
        {isNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] h-[30%] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Notifications</h2>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg">
                    {notification}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune notification pour le moment.</p>
            )}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300"
                onClick={closeNotificationModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
}
