'use client';
import React, { useEffect, useState } from 'react';
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaBell, FaChartBar, FaEye, FaUserCog, FaUserGraduate, FaUserMd, FaUserTie } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default function Perso() {

  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openReportModal = () => setIsReportOpen(true);
  const closeReportModal = () => setIsReportOpen(false);
  const [data, setData] = useState<PersonnelData[]>([]);
  const [loading, setLoading] = useState(false);

  // Définition de l'interface pour les données des personnels
  interface PersonnelData {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    adresse: string;
    contacte: string;
    date_ajout: string;
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
      name: 'Matricule', selector: (row: PersonnelData) => row.matricule, sortable: true,
    },
    {
      name: 'Nom', selector: (row: PersonnelData) => row.nom, sortable: true,
    },
    {
      name: 'Prénoms', selector: (row: PersonnelData) => row.prenom, sortable: true,
    },
    {
      name: 'Poste', selector: (row: PersonnelData) => row.poste, sortable: true,
    },
    {
      name: 'Adresse', selector: (row: PersonnelData) => row.adresse, sortable: true,
    },
    {
      name: 'Contacte', selector: (row: PersonnelData) => row.contacte, sortable: true,
    },
    {
      name: 'Date d\'ajout',
      selector: (row: PersonnelData) => {
        const dateAjout = new Date(row.date_ajout);
        return isNaN(dateAjout.getTime()) ? 'Date invalide' : format(dateAjout, 'dd/MM/yyyy');
      },
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

  // Fonction pour capturer le contenu et générer le PDF
  const saveAsPDF = async () => {
    setLoading(true);
    const input = document.getElementById('report-content') as HTMLElement | null; // Typage

    // Vérification si l'élément est trouvé
    if (!input) {
        console.error('Element with ID "report-content" not found');
        setLoading(false);
        return; // Sortir de la fonction si l'élément n'est pas trouvé
    }

    try {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('portrait', 'pt', 'a4');
        const imgWidth = 595.28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Générer un fichier blob
        const pdfBlob = pdf.output('blob');

        // Créer un URL pour le PDF blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Ouvrir le PDF dans un nouvel onglet
        window.open(pdfUrl);

         // Valeur par défaut pour le contenu
    const defaultContenu = 'Rapport pour la gestion du personnel';

        // Envoyer le PDF au backend
        const formData = new FormData();
        formData.append('file', pdfBlob, 'personnel_rapport.pdf');

        formData.append('contenu', defaultContenu); // Ajouter la valeur du contenu ici

        const response = await fetch('http://localhost:3001/upload-pdf', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('PDF envoyé avec succès au backend');
        } else {
            console.error('Erreur lors de l\'envoi du PDF');
        }
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
    }
    setLoading(false);
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
 <div className="bg-white w-[500px] h-[900px] rounded-lg shadow-lg z-50 p-6" id="report-content">
   <h2 className="text-xl font-bold mb-1 text-center">CHU Tambohobe Fianarantsoa</h2>
   <h3 className="text-lg font-semibold mb-2 text-center">Service Laboratoire</h3>
   
   {/* Date et Heure */}
   <p className="text-center text-sm mb-4 text-gray-600">
     Rapport généré le : {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
   </p>

   {/* Introduction */}
   <p className="text-md mb-4 text-justify text-gray-700">
     Ce rapport présente une vue d'ensemble de la répartition des personnels au sein du laboratoire du CHU Tambohobe.
     Il vise à faciliter la gestion et l'optimisation des ressources humaines en fournissant des données claires et actualisées.
   </p>

   {/* Titre principal */}
   <p className="text-lg font-semibold mb-4 text-center">Nombre total de personnel : {totalPersonnel}</p>
   
   {/* Tableau des fonctions */}
   <table className="min-w-full border-collapse border border-gray-400 mb-5">
     <thead>
       <tr>
         <th className="border border-gray-300 px-3 py-1 text-left text-sm font-semibold">Fonction</th>
         <th className="border border-gray-300 px-3 py-1 text-left text-sm font-semibold">Nombre</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td className="border border-gray-300 px-3 py-1 text-sm">Chef de Service</td>
         <td className="border border-gray-300 px-3 py-1 text-sm">{chefService}</td>
       </tr>
       <tr>
         <td className="border border-gray-300 px-3 py-1 text-sm">Médecin Biologiste</td>
         <td className="border border-gray-300 px-3 py-1 text-sm">{biologiste}</td>
       </tr>
       <tr>
         <td className="border border-gray-300 px-3 py-1 text-sm">Technicien de Laboratoire</td>
         <td className="border border-gray-300 px-3 py-1 text-sm">{techniciens}</td>
       </tr>
       <tr>
         <td className="border border-gray-300 px-3 py-1 text-sm">Secrétaire</td>
         <td className="border border-gray-300 px-3 py-1 text-sm">{secretaire}</td>
       </tr>
     </tbody>
   </table>
   
   {/* Statistiques supplémentaires */}
   <p className="text-md font-semibold mb-2 text-gray-700">Statistiques supplémentaires :</p>
   <ul className="list-disc list-inside mb-4 text-gray-600">
     <li>Chefs de service : {((chefService / totalPersonnel) * 100).toFixed(1)}%</li>
     <li>Médecins biologistes : {((biologiste / totalPersonnel) * 100).toFixed(1)}%</li>
     <li>Techniciens de laboratoire : {((techniciens / totalPersonnel) * 100).toFixed(1)}%</li>
     <li>Secrétaires : {((secretaire / totalPersonnel) * 100).toFixed(1)}%</li>
   </ul>

   {/* Remarques */}
   <p className="text-sm mb-4 text-gray-700">Remarques : Ce rapport est conçu pour fournir une analyse précise de la composition du personnel, en vue d’optimiser les ressources humaines du laboratoire.</p>
   
   {/* Conclusion */}
   <p className="text-md mt-6 mb-4 text-justify text-gray-700">
     La répartition actuelle des rôles et fonctions assure un fonctionnement optimal du laboratoire. Des ajustements périodiques seront faits en fonction des besoins opérationnels et des évolutions au sein du laboratoire.
   </p>
   
   {/* Pied de page */}
   <p className="text-xs text-center text-gray-500 mt-5">© 2024 CHU Tambohobe Fianarantsoa. Tous droits réservés.</p>
   
   {/* Boutons */}
   <div className="flex justify-between mt-6">
     <button
       className="px-4 py-2 bg-red-600 text-white rounded-lg"
       onClick={closeReportModal}
     >
       Fermer
     </button>
     <button
       className="px-4 py-2 bg-blue-600 text-white rounded-lg"
       onClick={saveAsPDF}
       disabled={loading}
     >
       {loading ? 'En cours...' : 'Enregistrer en PDF'}
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
