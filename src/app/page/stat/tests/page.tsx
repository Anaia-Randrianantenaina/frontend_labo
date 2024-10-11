"use client"
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "../menu/page";
import { FaArrowRight, FaDna, FaFlask, FaMicroscope, FaVial, FaViruses } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DataTable from "react-data-table-component";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

// Enregistrer les composants nécessaires
Chart.register(CategoryScale, LinearScale, PointElement, LineElement,BarElement,ArcElement, Title, Tooltip, Legend);


export default function Tests() {
  const [liste, setListe] = useState(false);
  const openListe = () => setListe(true);
  const closeListe = () => setListe(false);
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [listeE, setListeE] = useState(false);
  const openE = () => setListeE(true);
  const closeE = () => setListeE(false);
  const [listeP, setListeP] = useState(false);
  const openP = () => setListeP(true);
  const closeP = () => setListeP(false);
  const [rapport, setRapport] = useState(false);
  const OpenRap = () => setRapport(true);
  const closeRap = () => setRapport(false);

  interface TestData {
    id: number;
    unite: string;
    sous_unite: string;
    parametre: string;
    echantillon: {
      id: number;
      type: string;
      date_prelevement: string;
    } | null;
  }

  interface EchantillonData{
    id: number;
    type: string;
    date_prelevement: string;
  }

  // fonction pour récupérer la liste des tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/teste/listes');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const result: TestData[] = await response.json(); // Spécifie le type ici
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

  const columns = [
    { name: 'Echantillon ID', selector: (row: TestData) => row.echantillon?.id || 'N/A', sortable: true },
    { name: 'Unité', selector: (row: TestData) => row.unite, sortable: true },
    { name: 'Sous Unité', selector: (row: TestData) => row.sous_unite, sortable: true },
    { name: 'Paramètre', selector: (row: TestData) => row.parametre, sortable: true },
    { name: 'Echantillon Type', selector: (row: TestData) => row.echantillon?.type || 'N/A', sortable: true },
    { name: 'Date de Prélèvement', selector: (row: TestData) => row.echantillon?.date_prelevement || 'N/A', sortable: true },
  ];

  const columnsE = [
    { name: 'Echantillon ID', selector: (row: EchantillonData) => row.type, sortable: true },
    { name: 'Unité', selector: (row: EchantillonData) => row.date_prelevement, sortable: true },
  ];

  // Filtrer les données selon la périodes séléctionnée
  const filterByDate = (data: TestData[]) => {
    if (!startDate || !endDate) return data; // Retourne toutes les données si les dates ne sont pas définies
    return data.filter(test => {
      const datePrelevement = new Date(test.echantillon?.date_prelevement || '');
      return datePrelevement >= new Date(startDate) && datePrelevement <= new Date(endDate);
    });
  }

  const filteredData = filterByDate(data);
  
  const Total = filteredData.length;
  const nbrHemma = filteredData.filter(teste => teste.unite === 'HEMATOLOGIE').length;
  const nbrBio = filteredData.filter(teste => teste.unite === 'BIOCHIMIE').length;
  const nbrSero = filteredData.filter(teste => teste.unite === 'SERO-IMMINOLOGIE').length;
  const nbrPara = filteredData.filter(teste => teste.unite === 'PARASITOLOGIE').length;
  const nbrBact = filteredData.filter(teste => teste.unite === 'BACTERIOLOGIE(sur tube stérile').length;

  // FONCTION POUR COMPTER LES PARAMETRE PAR NOM
  const countByTest = (data: TestData[]) => {
    return data.reduce((acc, test) => {
        if (acc[test.parametre]) {
            acc[test.parametre] += 1;
        } else {
            acc[test.parametre] = 1;
        }
        return acc;
    }, {} as Record<string, number>); // { "Materiel1": 5, "Materiel2": 3, ... }
};

const testCounts = countByTest(filteredData);

// FONCTION POUR COMPTER LES ECHANTILLONS PAR NOM
const countByEch = (data: TestData[]) => {
  return data.reduce((acc, test) => {
      if (acc[test.echantillon?.type || '']) {
          acc[test.echantillon?.type || ''] += 1;
      } else {
          acc[test.echantillon?.type || ''] = 1;
      }
      return acc;
  }, {} as Record<string, number>); 
};

const EchCounts = countByEch(filteredData);
  
  // GRAPHE GENERATIONNEL
const ScatterData = {
  labels: ['Bactériologie', 'Biochimie', 'Hématologie', 'Parasitologie', 'Séro-Immunologie'],
  datasets: [
    {
      label: 'Nombre par unité',
      data: [nbrBact, nbrBio, nbrHemma, nbrPara, nbrSero],
      borderColor: ['#36A2EB', '#FF6384', '#36A2EB', '#FFCE56', 'FFCE56'],
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

 // EXPORATATION DES DONNÉES EN EXCEL
 const exportToExcel = (data: any[], columns: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.name) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};
  
  
  return (
    <div className="flex">
      {/* NAVBAR */}
      <div><Navbar /></div>

      <div className="w-full h-[100vh] p-2">
        {/* MANU */}
        <div><Menu /></div>
        <div className="w-full h-[2%]"></div>

        {/* CONTENU PRINCIPAL */}
        <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
          {/* EN TÊTE */}
        <div className="flex justify-between">
            <div>
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

             {/* Titre centré */}
        <div> <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des tests et des échantillons</h2></div>

          {/* Espacement pour l'alignement */}
          <div className="mr-5 mt-1">
          <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 
              transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" onClick={OpenRap}>
              Rapport Analytiques
            </button>
          </div>
        </div>

        {/* PREMIERE PARTIE */}
        <div className="flex mt-4 space-x-4">

       <div className="ml-5 w-[430px] h-[230px] bg-gradient-to-r from-gray-300 via-gray-50 to-white border-gray-300 rounded-3xl shadow-xl flex justify-center items-center text-gray-800 p-4">
  <div className="flex flex-col items-center">
    <p className="text-lg font-bold mb-2">Nombre de tests</p> {/* Augmentation de la taille du texte */}
    <div className="flex items-center space-x-3"> {/* Augmentation de l'espacement entre les éléments */}
      <span className="text-5xl font-bold">{Total}</span> {/* Augmentation de la taille de la police */}
      <FaFlask className="text-4xl text-gray-500" /> {/* Augmentation de la taille de l'icône */}
    </div>
    <button className="px-4 py-2 border border-gray-700 text-gray-700 rounded-full hover:bg-green-100 transition-colors flex items-center" onClick={openListe}>
    <FaArrowRight className="mr-2" /> Voir détails 
    </button> {/* Augmentation de la taille du texte et du bouton */}
  </div>
</div>
{/* TABLEAU LISTE DES TESTS */}
   {liste && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
                  <h2 className="text-2xl text-center font-bold mb-4">Détails des tests : {startDate && endDate ? `${startDate} au ${endDate}` : ""}</h2>

                  <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5]}
                 
                />
                  
                  <div className="flex justify-end gap-4 mt-4">
                  <button 
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" 
          onClick={() => exportToExcel(Object.entries(EchCounts), ['Paramètre', 'Nombre'], 'Liste des tests.xlsx')}
        >
          Exporter en Excel
        </button>
        
                    {/* <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(filteredData, columns, 'Liste des patient hospitaliser.xlsx')}>
                    Exporter en Excel
                   </button> */}
                    <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeListe}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
             )}


      <div className="ml-2 w-[430px] h-[230px] bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <h2 className="mt-[-13px] text-xl font-bold text-gray-800 mb-4 text-center">Nombre par tests</h2>
      <div className=" mt-[-10px] grid grid-cols-2 gap-y-2 text-gray-700">
        <p className="font-semibold text-lg flex items-center">
          <FaFlask className="mr-1 text-gray-500" size={10} /> Hématologie :
        </p>
        <span className="font-bold text-lg text-gray-600 text-right">{nbrHemma}</span>

        <p className="font-semibold text-lg flex items-center">
          <FaVial className="mr-1 text-grau-500" size={10} /> Biochimie :
        </p>
        <span className="font-bold text-lg text-gray-600 text-right">{nbrBio}</span>

        <p className="font-semibold text-lg flex items-center">
          <FaMicroscope className="mr-1 text-yellow-500" size={10} /> Séro-immunologie :
        </p>
        <span className="font-bold text-lg text-gray-600 text-right">{nbrSero}</span>

        <p className="font-semibold text-lg flex items-center">
          <FaViruses className="mr-1 text-red-500" size={10} /> Bactériologie :
        </p>
        <span className="font-bold text-lg text-gray-600 text-right">{nbrSero}</span>

        <p className="font-semibold text-lg flex items-center">
          <FaDna className="mr-1 text-purple-500" size={10} /> Parasitologie :
        </p>
        <span className="font-bold text-lg text-gray-600 text-right">{nbrPara}</span>
      </div>
      </div>


          <div className="ml-2 w-[880px] h-[230px] bg-white rounded-3xl shadow-lg"> <Line data={ScatterData} options={ScatterOption}/></div>
        
        </div>

        {/* DEUXIEME PARTIE */}
        <div className="flex mt-5 justify-center">
          {/* LISTE PARAMETRE */}
        <div className="ml-5 w-[550px] h-[100px] bg-white shadow-xl rounded-3xl flex flex-col justify-center items-center space-y-4">
        <p className="text-gray-800 font-medium text-lg">Paramètre enregistré</p>
  
  <button className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center" onClick={openP}>
    <FaArrowRight className="mr-2" />
    Voir Détails
  </button>
</div>

{listeP && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[70%] h-[60%] overflow-auto">
      <h2 className="text-2xl text-center font-bold mb-4">
        Détails sur le nombre de paramètre enregistré : {startDate && endDate ? `${startDate} au ${endDate}` : ""}
      </h2>
      
      {/* Tableau des paramètres */}
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Paramètre</th>
            <th className="px-4 py-2 border">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(testCounts).map(([test, count]) => (
            <tr key={test} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{test}</td>
              <td className="px-4 py-2 border">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 mt-4">
        <button 
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" 
          onClick={() => exportToExcel(Object.entries(testCounts), ['Paramètre', 'Nombre'], 'Liste des paramètres.xlsx')}
        >
          Exporter en Excel
        </button>
        <button 
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" 
          onClick={closeP}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}



<div className="ml-5 w-[550px] h-[100px] bg-white shadow-xl rounded-3xl flex flex-col justify-center items-center space-y-4">
        <p className="text-gray-800 font-medium text-lg">Échantillon enregistré</p>
  
  <button className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center" onClick={openE}>
    <FaArrowRight className="mr-2" />
    Voir Détails
  </button>
</div>
{listeE && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[70%] h-[60%] overflow-auto">
      <h2 className="text-2xl text-center font-bold mb-4">
        Détails sur le nombre de echantillon enregistré : {startDate && endDate ? `${startDate} au ${endDate}` : ""}
      </h2>
      
      {/* Tableau des paramètres */}
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Échantillon</th>
            <th className="px-4 py-2 border">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(EchCounts).map(([test, count]) => (
            <tr key={test} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{test}</td>
              <td className="px-4 py-2 border">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 mt-4">
        <button 
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" 
          onClick={() => exportToExcel(Object.entries(EchCounts), ['Paramètre', 'Nombre'], 'Liste des echantillon.xlsx')}
        >
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
        
        </div>

         {/* TROISIEME PARTIE  */}
         <div className="flex mt-6 justify-between">
         <div className="ml-5 w-[850px] h-[300px] bg-white shadow-xl rounded-3xl p-6">
  <h3 className="text-center font-bold text-2xl mb-4 text-gray-900">Nombre de chaque paramètre enregistré</h3>

  <div className="overflow-y-auto max-h-[180px] border border-gray-300 rounded-lg p-4 bg-gray-50">
  <ul className="space-y-3"> {/* Réduction de l'espacement vertical */}
  {Object.entries(testCounts).map(([test, count]) => (
    <li 
      key={test} 
      className="text-base text-gray-800 flex flex-col space-y-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
    >
      {/* Ligne contenant le nom et la quantité */}
      <div className="flex justify-between items-center">
        <span className="font-medium">{test}</span>
        <span className="font-semibold">{count}</span>
      </div>

      {/* Barre de comparaison */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full"> {/* Réduction de la hauteur de la barre */}
        {/* Largeur dynamique de la barre basée sur le nombre */}
        <div 
          className="bg-green-500 h-1.5 rounded-full" 
          style={{ width: `${(count / Math.max(...Object.values(testCounts))) * 100}%` }}
        ></div>
      </div>
    </li>
  ))}
</ul>

  </div>
</div>



<div className="ml-5 w-[850px] h-[300px] bg-white shadow-xl rounded-3xl p-6">
  <h3 className="text-center font-bold text-2xl mb-4 text-gray-900">Nombre de chaque echantillon enregistré</h3>

  <div className="overflow-y-auto max-h-[180px] border border-gray-300 rounded-lg p-4 bg-gray-50">
  <ul className="space-y-3"> {/* Réduction de l'espacement vertical */}
  {Object.entries(EchCounts).map(([test, count]) => (
    <li 
      key={test} 
      className="text-base text-gray-800 flex flex-col space-y-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
    >
      {/* Ligne contenant le nom et la quantité */}
      <div className="flex justify-between items-center">
        <span className="font-medium">{test}</span>
        <span className="font-semibold">{count}</span>
      </div>

      {/* Barre de comparaison */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full"> {/* Réduction de la hauteur de la barre */}
        {/* Largeur dynamique de la barre basée sur le nombre */}
        <div 
          className="bg-blue-800 h-1.5 rounded-full" 
          style={{ width: `${(count / Math.max(...Object.values(EchCounts))) * 100}%` }}
        ></div>
      </div>
    </li>
  ))}
</ul>

  </div>
</div>
        </div>
        {rapport && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div
      id="report-content"
      className="bg-white rounded-lg shadow-md p-6 w-[210mm] h-[297mm] max-h-[100vh] overflow-auto print:w-[210mm] print:h-[297mm] print:overflow-visible"
    >
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold">CHU TAMBOHOBE FIANARANTSOA</h3>
        <h3 className="text-lg font-bold">SERVICE LABORATOIRE</h3>

        <h3 className="text-md mt-3 mb-1">Rapport d'Activités de Laboratoire:</h3>
        <h4 className="text-sm font-medium">
          {startDate && endDate ? `${startDate} au ${endDate}` : "Sélectionnez les dates"}
        </h4>

        <h3 className="font-bold text-xl mt-4 mb-3">Gestion des tests et échantillons</h3>

        {/* Nombre total de tests */}
        <h4 className="font-bold text-md mt-3 mb-1">
          1. Nombre total de tests enregistrés : {Total}
        </h4>

        {/* Nombre de tests par unité */}
        <h4 className="font-bold text-md mt-3 mb-1">2. Nombre de tests par unité :</h4>
        <table className="table-auto w-3/4 mx-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left font-semibold text-lg">Type de Test</th>
              <th className="border border-gray-300 px-2 py-1 text-right font-semibold text-lg">Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-2 py-1">Hématologie</td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg text-gray-600">{nbrHemma}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1">Biochimie</td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg text-gray-600">{nbrBio}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1">Séro-immunologie</td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg text-gray-600">{nbrSero}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1">Bactériologie</td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg text-gray-600">{nbrBact}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1">Parasitologie</td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg text-gray-600">{nbrPara}</td>
            </tr>
          </tbody>
        </table>

        {/* Nombre de patients par génération */}
        <h4 className="font-bold text-md mt-3 mb-1">3. Nombre de patients par génération :</h4>
        <table className="w-3/4 mx-auto text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Paramètre</th>
              <th className="px-2 py-1 border">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(EchCounts).map(([test, count]) => (
              <tr key={test} className="hover:bg-gray-100">
                <td className="px-2 py-1 border">{test}</td>
                <td className="px-2 py-1 border">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tableau pour les pôles */}
        <h4 className="font-bold text-md mt-3 mb-1">4. Nombre de patients par pôles :</h4>
        <table className="w-3/4 mx-auto text-left table-auto border-collapse">
          <thead>
            <tr className="">
              <th className="px-2 py-1 border">Échantillon</th>
              <th className="px-2 py-1 border">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(EchCounts).map(([test, count]) => (
              <tr key={test} className="hover:bg-gray-100">
                <td className="px-2 py-1 border">{test}</td>
                <td className="px-2 py-1 border">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section pour les boutons */}
      <div className="flex justify-end gap-4 mt-4 print:hidden">
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          // onClick={saveAsPDF}
          disabled={loading}
        >
          {loading ? "En cours..." : "Enregistrer en PDF"}
        </button>

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
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
  )}