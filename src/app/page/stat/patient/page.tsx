"use client"
import { BiListOl } from "react-icons/bi"; 
import React, { useEffect, useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaArrowRight, FaBaby, FaBrain, FaEye, FaFirstAid, FaHeartbeat, FaMicroscope, FaStethoscope, FaUser } from "react-icons/fa";
import DataTable from 'react-data-table-component';
import { GiScalpel } from "react-icons/gi";
import {  Bar, Line, Pie, Radar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

// Enregistrer les composants nécessaires
Chart.register(CategoryScale, LinearScale, PointElement, LineElement,BarElement,ArcElement, Title, Tooltip, Legend);

export default function Patient() {
  // Definition de l'interface pour les données des personnels
  interface HospitaliseData {
    id: number; 
    num: string;
    nom: string;
    prenom: string;
    sexe: string; 
    date_naiss: string;
    age: string;
    service: string;
    date_ajout: string;
  }
  interface ServiceData {
    pole: string;
    service: string;
    nombre: number;
  }
  const [openE, setOpenE] = useState(false);
  const [tabH, setTabH] = useState(false);
  const [rapport, setRapport] = useState(false);
  const [loading, setLoading] = useState(false);
  const openModalE = () => setOpenE(true);
  const closeModalE = () => setOpenE(false);
  const openTabH = () => setTabH(true);
  const closeTabH = () => setTabH(false);
  const openRap = () => setRapport(true);
  const closeRap = () => setRapport(false);
   const [mois, setMois] = useState(''); // État pour stocker le mois
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const columns = [
    { name: 'Pôle', selector: (row: ServiceData) => row.pole, sortable: true, cell: (row : ServiceData) => <span className="font-semibold text-[20px]">{row.pole}</span>, },
    { name: 'Service', selector: (row: ServiceData)=> row.service, sortable: true, cell: (row : ServiceData) => <span className="text-[20px]">{row.service}</span>,  },
    { name: 'Nombre de Patients', selector: (row: ServiceData) => row.nombre, sortable: true, right: true, cell: (row : ServiceData) => <span className="text-[20px]">{row.nombre}</span>,},
  ];
    const [hospitaliseData, setDataH] = useState<HospitaliseData[]>([]);
  // Fonction pour récuperer les données des patients depuis le serveur 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/hospitalises');

        if(!response.ok) {
          throw new Error('Erreur réseau');
        }

        const result: HospitaliseData[] = await response.json();
        console.log("Données récuperées :", result);

        setDataH(result);
      }catch (error) {
        console.error("Erreur lors de la récupération de données :", error);
      } 
    };
    fetchData()
  }, []);

   // FONCTION POUR AFFICHER LES DONNÉES SELON LES DATE SELECTIONNER
   const convertToISO = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const filterByDate = (data: HospitaliseData[]) => {
    if (!startDate || !endDate) return data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter((hospitalise) => {
      const isoDate = convertToISO(hospitalise.date_ajout);
      const dateArriver = new Date(isoDate);

      return dateArriver >= start && dateArriver <= end;
    });
  };

  const filteredData = filterByDate(hospitaliseData);
  // Définition des colones pour les tableau
  const columnsH = [
    { name: 'Numéro', selector: (row: HospitaliseData) => row.num+"H", sortable: true, },
    { name: 'Nom', selector: (row: HospitaliseData) => row.nom, sortable: true,},
    { name: 'Prénom', selector: (row: HospitaliseData) => row.prenom, sortable: true,},
    { name: 'Sexe', selector: (row: HospitaliseData) => row.sexe, sortable: true,},
    { name: 'Date de Naissance', selector: (row: HospitaliseData) => row.date_naiss, sortable: true},
    { name: 'Age', selector: (row: HospitaliseData) => row.age, sortable: true, },
    { name: 'Service', selector: (row: HospitaliseData) => row.service, sortable: true,},
    { name: "Date d'Ajout", selector: (row: HospitaliseData) => row.date_ajout, sortable: true },
  ]
  
  // CALCUL DU NOMBRE DE PATIENT HOSPITALISE 
  const totalPatientH = filteredData.length;
  // NOMBRE DE PATIENT PAR SEXE
  const Homme = filteredData.filter(hospitalise => hospitalise.sexe === 'M').length;
  const Femme = filteredData.filter(hospitalise => hospitalise.sexe === 'F').length;
  // NOMBRE DE PATIENT PAR SERVICE
  const Orthopedie = filteredData.filter(hospitalise => hospitalise.service === 'Orthopédie').length;
  const Chirurgie = filteredData.filter(hospitalise => hospitalise.service === 'Chirurgie').length;
  const Bloc = filteredData.filter(hospitalise => hospitalise.service === 'Bloc').length;
  const Opthamologie = filteredData.filter(hospitalise => hospitalise.service === 'Ophtamologie').length;
  const Interne = filteredData.filter(hospitalise => hospitalise.service === 'Interne').length;
  const Cardiologie = filteredData.filter(hospitalise => hospitalise.service === 'Cardiologie').length;
  const Pneumologie = filteredData.filter(hospitalise => hospitalise.service === 'Pneumologie').length;
  const Infectueuse = filteredData.filter(hospitalise => hospitalise.service === 'Infectieuse').length;
  const Oncologie = filteredData.filter(hospitalise => hospitalise.service === 'Oncologie').length;
  const Psychiatrie = filteredData.filter(hospitalise => hospitalise.service === 'Psychiatrie').length;
  const Appareillage = filteredData.filter(hospitalise => hospitalise.service === 'Appareillage').length;
  const Gynécologie = filteredData.filter(hospitalise => hospitalise.service === 'Gynécologie').length;
  const Pédiatrie = filteredData.filter(hospitalise => hospitalise.service === 'Pédiatrie').length;
  const Néonaltologie = filteredData.filter(hospitalise => hospitalise.service === 'Néonatologie').length;
  const Réanimation = filteredData.filter(hospitalise => hospitalise.service === 'Réanimation').length;
  const Triage = filteredData.filter(hospitalise => hospitalise.service === 'Triage').length;
  const Imagérie = filteredData.filter(hospitalise => hospitalise.service === 'Imagerie').length;
  const CRTS = filteredData.filter(hospitalise => hospitalise.service === 'CRTS').length;
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
  
  const getPatientCountsByAge = (data: HospitaliseData[]) => {
    const ageGroups = {
      Enfant: 0,
      Jeune: 0,
      Adulte: 0,
      Vieux: 0,
    };
  
    data.forEach((patient) => {
      const age = typeof patient.age === 'number' ? patient.age : parseAge(patient.age);
  
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
  



  const data: ServiceData[] = [
    { pole: 'POLE CHIRURGIE', service: 'Orthopédie Traumatologie', nombre: Orthopedie },
    { pole: 'POLE CHIRURGIE', service: 'Chirurgie Viscérale', nombre: Chirurgie },
    { pole: 'POLE CHIRURGIE', service: 'Bloc Opératoire', nombre: Bloc },
    { pole: 'POLE TÊTE ET COU', service: 'Opthamologie', nombre: Opthamologie },
    { pole: 'POLE MEDECINE', service: 'Médecine Interne', nombre: Interne },
    { pole: 'POLE MEDECINE', service: 'Cardiologie', nombre: Cardiologie },
    { pole: 'POLE MEDECINE', service: 'Pneumologie Phtisiologie', nombre: Pneumologie },
    { pole: 'POLE MEDECINE', service: 'Maladie Infectueuse', nombre: Infectueuse },
    { pole: 'POLE MEDECINE', service: 'Oncologie', nombre: Oncologie },
    { pole: 'POLE MEDECINE', service: 'Psychiatrie', nombre: Psychiatrie },
    { pole: 'POLE MEDECINE', service: 'Appareillage et rééducation', nombre: Appareillage },
    { pole: 'POLE MERE ENFANT', service: 'Gynécologie Obstétrique', nombre: Gynécologie },
    { pole: 'POLE MERE ENFANT', service: 'Pédiatrie', nombre: Pédiatrie },
    { pole: 'POLE MERE ENFANT', service: 'Néonaltologie', nombre: Néonaltologie },
    { pole: 'POLE ANESTHESIE', service: 'Réanimation', nombre: Réanimation },
    { pole: 'POLE ANESTHESIE', service: 'Triage Urgrences', nombre: Triage },
    { pole: 'POLE PARACLINIQUE', service: 'Imagérie Médicale', nombre: Imagérie },
    { pole: 'POLE PARACLINIQUE', service: 'CRTS', nombre: CRTS },
  ];

  // Calcul du nombre de patients pour chaque pôle
const poleChirurgie = Orthopedie + Chirurgie + Bloc;
const poleTeteCou = Opthamologie;
const poleMedecine = Interne + Cardiologie + Pneumologie + Infectueuse + Oncologie + Psychiatrie + Appareillage;
const poleMereEnfant = Gynécologie + Pédiatrie + Néonaltologie;
const poleAnesthesie = Réanimation + Triage;
const poleParaclinique = Imagérie + CRTS;



// GRAPHE
const barData = {
  labels: ['Chirurgie', 'Tête et Cou', 'Médecine', 'Mère et Enfant', 'Anesthésie', 'Paraclinique'],
  datasets: [
    {
      label: 'Nombre de patients par pôle',
      data: [poleChirurgie, poleTeteCou, poleMedecine, poleMereEnfant, poleAnesthesie, poleParaclinique],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};
const barOptions = {
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

// EXPORATATION DES DONNÉES EN EXCEL
const exportToExcel = (data: any[], columns: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.name) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};

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
    const defaultContenu = 'Rapport pour la gestion du patient hospitalisé';

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
      {/* NAVBAR */}
      <div><Navbar/></div>

      <div className="w-full h-[100vh] p-2">
      {/* MANU */}
      <div><Menu/></div>
      <div className="w-full h-[2%]"></div>
 
          {/* CONTENU PRINCIPALE */}
          <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">

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
        <div> <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des patients hospitalisés</h2></div>

          {/* Espacement pour l'alignement */}
          <div className="mr-5 mt-1">
          <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 
              transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" onClick={openRap}>
              Rapport Analytiques
            </button>
          </div>
          </div>

            {/* NOMBRE DE PATIENTS */}
            <div className="flex justify-between mt-[-10px]">
                {/* NOMBRE HOSPITALISÉ */}
                <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
                   <div className="flex items-center">
                  <FaUser className="text-green-700 text-[50px] mr-4" />
                  <div className="text-center">
                   <h2 className="font-bold text-[30px]">{totalPatientH}</h2>
                   <p className="text-gray-700 text-[30px] font-bold  medium">Hospitalisés</p>
                  </div>
                 </div>
            </div>

          
                {/* TOTAL */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
              <div className="flex items-center">
              <BiListOl className="text-gray-700 text-[50px] mr-4" />
              <div className="text-center">
              <h2 className="font-bold text-[30px]"></h2>
              <p className="text-gray-700 font-bold text-[30px] medium">Listes</p>
              <button   className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center " onClick={openTabH}>
              <FaArrowRight className="mr-2" />
               Voir Détails
               </button>
              </div>
              </div>
          </div>

            </div> 
             {/* Tableau des hospitaliser */}
             {tabH && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
                  <h2 className="text-2xl text-center font-bold mb-4">Détails des Hospitalisés</h2>
                  <DataTable
                    columns={columnsH}
                    data={filteredData}
                    pagination
                    paginationPerPage={5} // Définit le nombre de lignes par page à 5
                    paginationRowsPerPageOptions={[5]} // Options pour le nombre de lignes par page
                
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    
                    <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(filteredData, columns, 'Liste des patient hospitaliser.xlsx')}>
                    Exporter en Excel
                   </button>
                    <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabH}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TABLEAU DE BORD */}
            <div className="flex justify-center mt-[-17px]">
                {/* Tableau de bord hosipitalisé */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-green-700 text-[30px] mr-4" />
    <h2 className="text-center font-bold text-[30px]">Hospitalisé</h2>
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
            <td>Femmes : {Femme}</td>
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
             <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
             <div className="flex items-center justify-center mb-6">
    <FaFirstAid className="text-blue-600 text-[30px] mr-3 " />
    <h2 className="text-center font-extrabold text-gray-800 text-[26px]">Nombre de patient par pôles</h2>
  </div>

  {/* NOMBRE DE PATIENT POUR CHAQUE POLE  */}
  <div className="grid grid-cols-2 gap-1 mt-[-15px] text-gray-800 font-medium text-[15px]">
  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <FaHeartbeat className="text-red-500" />
    <p className="hover:text-blue-600">POLE CHIRURGIE : {poleChirurgie} </p>
  </div>

  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <FaBrain className="text-purple-500" />
    <p className="hover:text-blue-600">POLE TÊTE ET COU : {poleTeteCou}</p>
  </div>

  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <FaStethoscope className="text-green-500" />
    <p className="hover:text-blue-600">POLE MEDECINE : {poleMedecine}</p>
  </div>

  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <FaBaby className="text-pink-500" />
    <p className="hover:text-blue-600">POLE MÈRE ENFANT : {poleMereEnfant}</p>
  </div>

  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <GiScalpel className="text-blue-700" />
    <p className="hover:text-blue-600">POLE RÉANIMATION URGENCE : {poleAnesthesie}</p>
  </div>

  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
    <FaMicroscope className="text-yellow-500" />
    <p className="hover:text-blue-600">POLE PARACLINIQUE : {poleParaclinique}</p>
  </div>
</div>

  {/* Bouton Voir Détails */}
  <div className="flex justify-center mt-3">
    <button
      className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center"
      onClick={openModalE}
    >
      <FaEye className="mr-2" /> Voir Détails
    </button>
  </div>
             </div>

             {openE && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[80%] overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Détails du nombre de patients par sevices</h2>

      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-lg font-semibold text-center mb-4">Liste des Services</h3>
        <div className="p-4 bg-white shadow-md rounded">
      <DataTable
        title="Nombre de Patients par Service et Pôle"
        columns={columns}
        data={data}
        pagination
        paginationPerPage={5} // Définit le nombre de lignes par page à 5
        paginationRowsPerPageOptions={[5]} // Options pour le nombre de lignes par page
        highlightOnHover  // Surligne au survol
        striped  // Style de lignes alternées
      />
    </div>
      </div>

      <div className="flex justify-end gap-4 mt-4 no-print">
        
      <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(data, columns, 'Liste des patient hospitaliser.xlsx')}>
                    Exporter en Excel
                   </button>
        <button
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          onClick={closeModalE}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}

            {/* Graphe generationnel */}
            <div className=" top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[400px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
              <p className="text-center">Géneration</p>
              <Line data={ScatterData} options={ScatterOption}/>
            </div>

            </div>

            {/* GRAPHE PAR POLE */}
            <div className="flex justify-normal mt-[-10px]">

            <div className="top-[50px] m-10 w-[1200px] h-[220px] bg-slate-50 shadow-lg z-10 p-4 overflow-auto rounded-3xl flex items-center justify-center">
              <div className="w-full h-full">
             <Bar data={barData}  options={ barOptions }/>
             </div>
            </div>
            {/* GRAPHE SEXE */}
           <div className="relative mt-7 w-[500px] h-[220px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4">
            <p className="text-center">Sexe</p>
            <div className="w-full h-full pb-2">
            <Line data={areaData} options={areaOptions} />
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

        <h3 className="font-bold text-xl mt-4 mb-3">Gestion des patients</h3>

        {/* Nombre total de patients */}
        <h4 className="font-bold text-md mt-3 mb-1">
          1. Nombre total de patients :{totalPatientH}
        </h4>

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

        {/* Tableau pour les pôles */}
        <h4 className="font-bold text-md mt-3 mb-1">4. Nombre de patients par pôles :</h4>
        <table className="min-w-full border-collapse border border-gray-400 mb-3">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left text-sm">Pôle</th>
              <th className="border border-gray-300 px-2 py-1 text-left text-sm">Nombre de Patients</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Chirurgie</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleChirurgie}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Tête et Cou</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleTeteCou}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Médecin</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleMedecine}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Mère Enfant</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleMereEnfant}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Réanimation</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleAnesthesie}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-2 py-1 text-sm">Pôle Paraclinique</td>
              <td className="border border-gray-300 px-2 py-1 text-sm">{poleParaclinique}</td>
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
    
    )
}