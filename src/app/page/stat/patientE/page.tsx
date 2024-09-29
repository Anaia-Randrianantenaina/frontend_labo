"use client"
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "../menu/page";
import { FaArrowRight, FaEye, FaInfoCircle, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { BiListOl } from "react-icons/bi";
import DataTable from "react-data-table-component";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MapModal from "./MapModal"; // Importez le nouveau composant
import {  Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

// Enregistrer les composants nécessaires
Chart.register(CategoryScale, LinearScale, PointElement, LineElement,BarElement,ArcElement, Title, Tooltip, Legend);


export default function PatientE() {
  interface ExterneData {
    id: number;
    numE: string;
    nomE: string;
    prenomE: string;
    sexeE: string;
    date_naissE: string;
    ageE: string;
    adresseE: string;
    date_ajoutE: string;
  }

  // EXPORATATION DES DONNÉES EN EXCEL
const exportToExcel = (data: any[], columns: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.name) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};


  // ETATS POUR STOCKER LES DONNÉES 
  const [data, setData] = useState<ExterneData[]>([]);
  const [tableau, setTableau] = useState(false);
  const [rapport, setRapport] = useState(false);
  const openE = () => setTableau(true);
  const closeE = () => setTableau(false);
  const openRap = () => setRapport(true);
  const closeRap = () => setRapport(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [mapVisible, setMapVisible] = useState(false); // État pour la visibilité du modal
  const [loading, setLoading] = useState(false);


  // FONCTION POUR RÉCUPERER LES DONNÉES DU SERVEUR
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/externes");
        if (!response.ok) {
          throw new Error("Erreur réseau");
        }
        const result = await response.json();
        console.log("Données récupérées:", result);
        setData(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);


  // FILTRAGE DES DONNÉES SELON LA PERIODE SÉLECTIONNÉE
  const convertToISO = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const filterByDate = (data: ExterneData[]) => {
    if (!startDate || !endDate) return data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter((externe) => {
      const isoDate = convertToISO(externe.date_ajoutE);
      const dateArriver = new Date(isoDate);

      return dateArriver >= start && dateArriver <= end;
    });
  };

  const filteredData = filterByDate(data);

  // COLONNE DU TABLEAU
  const columns = [
    { name: "Numéro", selector: (row: ExterneData) => row.numE, sortable: true },
    { name: "Nom", selector: (row: ExterneData) => row.nomE, sortable: true },
    { name: "Prénoms", selector: (row: ExterneData) => row.prenomE, sortable: true },
    { name: "Sexe", selector: (row: ExterneData) => row.sexeE, sortable: true },
    { name: "Date de naissance", selector: (row: ExterneData) => row.date_naissE, sortable: true },
    { name: "Age", selector: (row: ExterneData) => row.ageE, sortable: true },
    { name: "Adresse", selector: (row: ExterneData) => row.adresseE, sortable: true },
    { name: "Date d'ajout", selector: (row: ExterneData) => row.date_ajoutE, sortable: true },
  ];

  const filteredTotalMat = filteredData.length;

  // NOMBRE DE PATIENT PAR SEXE
  const Homme = filteredData.filter(externe => externe.sexeE === 'M').length;
  const Femme = filteredData.filter(externe => externe.sexeE === 'F').length;

   // NOMBRE DE PATIENT PAR GÉNÉRATION
  // Fonction pour obtenir le nombre de patients par tranche d'âge
// Fonction pour convertir les âges en nombres
const parseAge = (age: string): number => {
  const range = age.split('-');
  if (range.length === 2) {
    return (parseInt(range[0]) + parseInt(range[1])) / 2;
  }
  return parseInt(age);
};
  
  const getPatientCountsByAge = (data: ExterneData[]) => {
    const ageGroups = {
      Enfant: 0,
      Jeune: 0,
      Adulte: 0,
      Vieux: 0,
    };
  
    data.forEach((patient) => {
      const age = typeof patient.ageE === 'number' ? patient.ageE : parseAge(patient.ageE);
  
      if (age >= 0 && age <= 12) {
        ageGroups.Enfant += 1;
      } else if (age >= 13 && age <= 24) {
        ageGroups.Jeune += 1;
      } else if (age >= 25 && age <= 64) {
        ageGroups.Adulte += 1;
      } else if (age >= 65) {
        ageGroups.Vieux += 1;
      }
    });
  
    return ageGroups;
  };

  const { Enfant, Jeune, Adulte, Vieux } = getPatientCountsByAge(filteredData);

  // GRAPHE GENERATIONNEL
const ScatterData = {
  labels: ['Enfants', 'Jeunes', 'Adultes', 'Vieux'],
  datasets: [
    {
      label: 'Nombre par génération',
      data: [Enfant, Jeune, Adulte, Vieux],
      borderColor: ['#36A2EB', '#FF6384', '#36A2EB', '#FFCE56'],
      borderWidth: 1,
      backgroundColor: 'rgba(54, 162, 235, 0.2)', // Ajoute un peu de transparence
    },
  ],
};
const ScatterOption = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

// GRAPHE SEXE
const areaData = {
  labels: ['Homme', 'Femme'],
  datasets: [
    {
      label: 'Nombre par sexe',
      data: [Homme, Femme],
      backgroundColor: ['#36A2EB', '#FF6384'],
      borderColor: ['#36A2EB', '#FF6384'],
      borderWidth: 1,
    },
  ],
};

const areaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  
};

// FONCTION POUR COMPTER LES ECHANTILLONS PAR NOM
const countByEch = (data: ExterneData[]) => {
  return data.reduce((acc, externe) => {
      if (acc[externe.adresseE || '']) {
          acc[externe.adresseE|| ''] += 1;
      } else {
          acc[externe.adresseE || ''] = 1;
      }
      return acc;
  }, {} as Record<string, number>); 
};

const externeCounts = countByEch(filteredData);

// Fonction pour capturer le contenu et générer le PDF
const saveAsPDF = async () => {
  setLoading(true);
  const input = document.getElementById('report-content') as HTMLElement | null; // Typage

  if (!input) {
      console.error('Element with ID "report-content" not found');
      alert("Erreur : Le contenu du rapport n'a pas été trouvé.");
      setLoading(false);
      return;
  }

  try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('portrait', 'pt', 'a4');
      const imgWidth = 595.28;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);

       // Valeur par défaut pour le contenu
    const defaultContenu = 'Rapport pour la gestion des patients externes';

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
          alert('Erreur lors de l\'envoi du PDF. Veuillez réessayer.');
          console.error('Erreur lors de l\'envoi du PDF');
      }
  } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
  }

  setLoading(false);
};
  


  return (
    <div className="flex">
      <div>
        <Navbar />
      </div>

      <div className="w-full h-[100vh] p-2">
        <div>
          <Menu />
        </div>
        <div className="w-full h-[2%]"></div>

        <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
          {/* EN TETE DE LA PAGE */}
          <div className="flex justify-between">
            <div className="flex ml-2 space-x-8">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800"
              placeholder="Date de début"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800"
              placeholder="Date de fin"
            />
            </div>

<div> <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des patients externes</h2></div>

{/* Espacement pour l'alignement */}
<div className="mr-5 mt-1">
<button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 
    transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" onClick={openRap}>
    Rapport Analytiques
  </button>
</div>
          </div>

            {/* PREMIERE PARTIE */}
          <div className="flex mt-[-25px] justify-center">
            <div className="top-[50px] m-10 w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 flex items-center justify-center">
              <div className="flex items-center">
                <FaUser className="text-green-700 text-[50px] mr-4" />
                <div className="text-center">
                  <h2 className="font-bold text-[30px]">{filteredTotalMat}</h2>
                  <p className="text-gray-700 text-[30px] font-bold">Externes</p>
                </div>
              </div>
            </div>

            <div className="top-[50px] m-10 w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 flex items-center justify-center">
              <div className="flex items-center">
                <BiListOl className="text-gray-700 text-[50px] mr-4" />
                <div className="text-center">
                  <p className="text-gray-700 font-bold text-[30px]">Listes</p>
                  <button
                    className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center"
                    onClick={openE}
                  >
                    <FaArrowRight className="mr-2" />
                    Voir Détails
                  </button>
                </div>
              </div>
            </div>

            {tableau && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
                  <h2 className="text-2xl text-center font-bold mb-4">Détails des Externes : {startDate && endDate ? `${startDate} au ${endDate}` : " "}</h2>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5]}
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    
                    <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(filteredData, columns, 'Liste des patients externes.xlsx')}>
                    Exporter en Excel
                   </button>
                    <button
                      className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeE}
                    >
                      Fermer
                    </button>
                   
                  </div>
                </div>
              </div>
            )}

            <MapModal
              show={mapVisible}
              onClose={() => setMapVisible(false)}
              data={filteredData}
            />
          </div>

            {/* DEUXIEME PARTIE */}
          <div className="flex justify-center mt-[-17px]">
                {/* Tableau de bord hosipitalisé */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-green-700 text-[30px] mr-4 " />
    <h2 className="text-center font-bold text-[30px]">Externes</h2>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Sexe</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Hommes : {Homme}</td>
            <td className="font-bold"></td>
          </tr>
          <tr className="flex justify-between">
            <td>Femmes {Femme}: </td>
            <td className="font-bold"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Génération</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Enfants (-12ans):</td>
            <td className="font-bold">{Enfant}</td>
          </tr>
          <tr className="flex justify-between">
            <td>Jeunes (13 - 24ans):</td>
            <td className="font-bold">{Jeune}</td>
          </tr>
          <tr className="flex justify-between">
            <td>Adultes (25 - 64ans):</td>
            <td className="font-bold">{Adulte}</td>
          </tr>
          <tr className="flex justify-between">
            <td>Vieux (+65ans):</td>
            <td className="font-bold">{Vieux}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="ml-[180px]">
 
  </div>
             </div>

            

             {/* Tableau de bord externe */}
             <div className="top-[50px] mx-4 left-[1cm] right-[2cm] w-[400px] h-[250px] bg-white shadow-2xl rounded-3xl z-10 p-4 overflow-auto border border-gray-200">

  <div className="text-center mb-4">
    <h2 className="text-xl font-bold text-gray-800 mb-2">
      <FaMapMarkerAlt className="inline-block mr-2 text-green-700" />
      Géolocalisation de la Zone où il y a le Plus de Patients
    </h2>
    <p className="text-gray-600">
      <FaInfoCircle className="inline-block mr-2 text-gray-500" />
      Visualisez les zones avec une concentration élevée de patients pour une meilleure gestion.
    </p>
  </div>


  <div className="flex items-center justify-center mb-4">
    <MapModal
      show={mapVisible}
      onClose={() => setMapVisible(false)}
      data={filteredData}
    />
  </div>


  <div className="flex justify-center mt-4">
    <button
      className="flex items-center px-4 py-2 bg-green-700 text-white rounded-full shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
      onClick={() => setMapVisible(true)}
    >
      <FaMapMarkerAlt className="mr-2" />
      Voir sur Carte
    </button>
  </div>
</div>


            {/* Graphe generationnel */}
            <div className=" top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
              <p className="mt-[-10px] text-center">Géneration</p>
              <Line data={ScatterData} options={ScatterOption}/>
            </div>

          </div>

          {/* TROISIEME PARTIE */}
          <div className="flex justify-center space-x-10 ]">
  {/* Bloc pour afficher le nombre d'échantillons enregistrés */}
  <div className="ml-5 w-[850px] mt-7 h-[220px] bg-white shadow-xl rounded-3xl p-4">
  <h3 className="text-center font-bold text-[14px] mb-3 text-gray-900">Nombre de chaque quartier enregistré</h3>
  
  {/* Conteneur avec défilement pour les échantillons */}
  <div className="overflow-y-auto max-h-[140px] border border-gray-300 rounded-lg p-2 bg-gray-50">
    <ul className="space-y-2"> {/* Réduction de l'espacement vertical */}
      {Object.entries(externeCounts).map(([test, count]) => (
        <li 
          key={test} 
          className="text-sm text-gray-800 flex flex-col space-y-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm"
        >
          {/* Ligne contenant le nom et la quantité */}
          <div className="flex justify-between items-center">
            <span className="font-medium">{test}</span>
            <span className="font-semibold">{count}</span>
          </div>

          {/* Barre de comparaison */}
          <div className="w-full bg-gray-200 h-1 rounded-full">
            {/* Largeur dynamique de la barre basée sur le nombre */}
            <div 
              className="bg-blue-800 h-1 rounded-full" 
              style={{ width: `${(count / Math.max(...Object.values(externeCounts))) * 100}%` }}
            ></div>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>


  {/* GRAPHE SEXE */}
  <div className="rrelative mt-7 w-[500px] h-[220px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4">
    <p className="text-cente font-semibold">Répartition par sexe</p>
    <div className="w-full h-full pb-2">
      <Line data={areaData} options={areaOptions} />
    </div>
  </div>
</div>


{rapport && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div id="report-content" className="bg-white rounded-lg shadow-md p-6 w-[210mm] h-[297mm] max-h-[100vh] overflow-auto print:w-[210mm] print:h-[297mm] print:overflow-visible">
      
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold">CHU TAMBOHOBE FIANARANTSOA</h3>
        <h3 className="text-lg font-bold">SERVICE LABORATOIRE</h3>

        <h3 className="text-md mt-3 mb-1">Rapport d'Activités de Laboratoire:</h3>
        <h4 className="text-sm font-medium">{startDate && endDate ? `${startDate} au ${endDate}` : " "}</h4>

        <h3 className="font-bold text-xl mt-4 mb-3">Gestion des patients</h3>
        
        {/* Nombre total de patients */}
        <h4 className="font-bold text-md mt-3 mb-1">1. Nombre total de patients :{filteredTotalMat}</h4>
       

      {/* Nombre de patients par sexe */}
<h4 className="font-bold text-md mt-3 mb-1">2. Nombre de patients par sexe:</h4>
<table className="min-w-full border-collapse border border-gray-400 mb-3">
  <thead>
    <tr>
      <th className="border border-gray-300 px-2 py-1 text-left text-sm">Sexe</th>
      <th className="border border-gray-300 px-2 py-1 text-left text-sm">Nombre de Patients</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Hommes</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Homme}</td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Femmes</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Femme}</td>
    </tr>
  </tbody>
</table>

{/* Nombre de patients par génération */}
<h4 className="font-bold text-md mt-3 mb-1">3. Nombre de patients par génération :</h4>
<table className="min-w-full border-collapse border border-gray-400 mb-3">
  <thead>
    <tr>
      <th className="border border-gray-300 px-2 py-1 text-left text-sm">Génération</th>
      <th className="border border-gray-300 px-2 py-1 text-left text-sm">Nombre de Patients</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Enfants</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Enfant}</td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Jeunes</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Jeune}</td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Adultes</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Adulte}</td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-2 py-1 text-sm">Vieux</td>
      <td className="border border-gray-300 px-2 py-1 text-sm">{Vieux}</td>
    </tr>
  </tbody>
</table>

        
      </div>

      {/* Section pour les boutons */}
      <div className="flex justify-end gap-4 mt-4 print:hidden">
      <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          onClick={saveAsPDF}
          disabled={loading}
        >
          {loading ? "En cours..." : "Enregistrer en PDF"}
        </button>


        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
          onClick={closeRap}
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
