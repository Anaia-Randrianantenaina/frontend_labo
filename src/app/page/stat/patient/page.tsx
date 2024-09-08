"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaArrowRight, FaBaby, FaBrain, FaCalculator, FaEye, FaFirstAid, FaHeartbeat, FaMicroscope, FaStethoscope, FaUser } from "react-icons/fa";
import DataTable from 'react-data-table-component';
import { GiScalpel } from "react-icons/gi";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



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

  const columns = [
    {
      name: 'Pôle',
      selector: (row: ServiceData) => row.pole,
      sortable: true,
      cell: (row : ServiceData) => <span className="font-semibold text-[20px]">{row.pole}</span>,  // Ajout de style pour chaque pôle
    },
    {
      name: 'Service',
      selector: (row: ServiceData)=> row.service,
      sortable: true,
      cell: (row : ServiceData) => <span className="text-[20px]">{row.service}</span>,  
    },
    {
      name: 'Nombre de Patients',
      selector: (row: ServiceData) => row.nombre,
      sortable: true,
      right: true,
      cell: (row : ServiceData) => <span className="text-[20px]">{row.nombre}</span>,
    },
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
  }, [hospitaliseData]);


  const [openH, setOpenH] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [tabE, setTabE] = useState(false);
  const [tabH, setTabH] = useState(false);

  const openModalH = () => setOpenH(true);
  const closeModalH = () => setOpenH(false);
  const openModalE = () => setOpenE(true);
  const closeModalE = () => setOpenE(false);
  const openTabH = () => setTabH(true);
  const closeTabH = () => setTabH(false);
  const openTabE = () => setTabE(true);
  const closeTabE = () => setTabE(false)

  // Définition des colones pour les tableau
  const columnsH = [
    {
      name: 'Numéro',
      selector: (row: HospitaliseData) => row.num+"H",
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row: HospitaliseData) => row.nom,
      sortable: true,
    },
    {
      name: 'Prénom',
      selector: (row: HospitaliseData) => row.prenom,
      sortable: true,
    },
    {
      name: 'Sexe',
      selector: (row: HospitaliseData) => row.sexe,
      sortable: true,
    },
    {
      name: 'Date de Naissance',
      selector: (row: HospitaliseData) => row.date_naiss,
      sortable: true,
    },
    {
      name: 'Age',
      selector: (row: HospitaliseData) => row.age,
      sortable: true,
    },
    {
      name: 'Service',
      selector: (row: HospitaliseData) => row.service,
      sortable: true,
    },
    {
      name: "Date d'Ajout",
      selector: (row: HospitaliseData) => row.date_ajout,
      sortable: true,
    },
  ]

 

  // CALCUL DU NOMBRE DE PATIENT HOSPITALISE 
  const totalPatientH = hospitaliseData.length;
  // NOMBRE DE PATIENT PAR SEXE
  const Homme = hospitaliseData.filter(hospitalise => hospitalise.sexe === 'M').length;
  const Femme = hospitaliseData.filter(hospitalise => hospitalise.sexe === 'F').length;
  // NOMBRE DE PATIENT PAR SERVICE
  const Orthopedie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Orthopédie').length;
  const Chirurgie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Chirurgie').length;
  const Bloc = hospitaliseData.filter(hospitalise => hospitalise.service === 'Bloc').length;
  const Opthamologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Ophtamologie').length;
  const Interne = hospitaliseData.filter(hospitalise => hospitalise.service === 'Interne').length;
  const Cardiologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Cardiologie').length;
  const Pneumologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Pneumologie').length;
  const Infectueuse = hospitaliseData.filter(hospitalise => hospitalise.service === 'Infectieuse').length;
  const Oncologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Oncologie').length;
  const Psychiatrie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Psychiatrie').length;
  const Appareillage = hospitaliseData.filter(hospitalise => hospitalise.service === 'Appareillage').length;
  const Gynécologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Gynécologie').length;
  const Pédiatrie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Pédiatrie').length;
  const Néonaltologie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Néonatologie').length;
  const Réanimation = hospitaliseData.filter(hospitalise => hospitalise.service === 'Réanimation').length;
  const Triage = hospitaliseData.filter(hospitalise => hospitalise.service === 'Triage').length;
  const Imagérie = hospitaliseData.filter(hospitalise => hospitalise.service === 'Imagerie').length;
  const CRTS = hospitaliseData.filter(hospitalise => hospitalise.service === 'CRTS').length;
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

  const { Enfant, Jeune, Adulte, Vieux } = getPatientCountsByAge(hospitaliseData);
  



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


// GRAPHE CIRCULAIRE 
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

            <h1 className="text-center mt-1 font-bold">STATISTIQUES GÉNÉRALE DU GESTION DES PATIENTS</h1>

            {/* NOMBRE DE PATIENTS */}
            <div className="flex justify-between mt-[-10px]">
                {/* NOMBRE HOSPITALISÉ */}
                <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
                   <div className="flex items-center">
                  <FaUser className="text-green-700 text-[50px] mr-4" />
                  <div className="text-center">
                   <h2 className="font-bold text-[30px]">{totalPatientH}</h2>
                   <p className="text-gray-700 medium">Hospitalisé</p>
                  <button   className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center " onClick={openTabH}>
                  <FaArrowRight className="mr-2" />
                   Voir Détails
                  </button>
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
                    data={hospitaliseData}
                    pagination
                    paginationPerPage={5} // Définit le nombre de lignes par page à 5
                    paginationRowsPerPageOptions={[5]} // Options pour le nombre de lignes par page
                
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => window.print()}>
                      Imprimer
                    </button>
                    <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabH}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}


                {/* NOMBRE EXTERNE */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
             <div className="flex items-center">
             <FaUser className="text-blue-700 text-[50px] mr-4" />
             <div className="text-center">
             <h2 className="font-bold text-[30px]"></h2>
             <p className="text-gray-700 medium">Externe</p>
             <button   className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center " onClick={openTabE}>
        <FaArrowRight className="mr-2" />
        Voir Détails
      </button>
             </div>
            </div>
           </div>

            

           {/* Tableau des externes */}
                {/* TOTAL */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
              <div className="flex items-center">
              <FaCalculator className="text-gray-700 text-[50px] mr-4" />
              <div className="text-center">
              <h2 className="font-bold text-[30px]"></h2>
              <p className="text-gray-700 medium">Total</p>
              <button   className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center ">
        <FaArrowRight className="mr-2" />
        Voir Détails
      </button>
              </div>
              </div>
          </div>

            </div> 

            {/* TABLEAU DE BORD */}
            <div className="flex justify-center mt-[-17px]">
                {/* Tableau de bord hosipitalisé */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-green-700 text-[30px] mr-4 animate-bounce" />
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
  <button
    className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center "
    onClick={openModalH}
  >
    <FaEye className="mr-2" /> Voir Détails
  </button>
  </div>
             </div>

             {openH && (
 <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg shadow-2xl p-8 w-[80%] h-[80%] overflow-auto relative">
   <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Détails des Hospitalisés</h2>
   
   <div className="border-t border-gray-300 my-4"></div>

   <p className="text-lg font-semibold text-gray-700 mb-2">Nombre de patients par service :</p>


   <div className="border-t border-gray-300 my-6"></div>

   <div className="flex justify-end gap-4 mt-6 no-print">
     <button
       className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
       onClick={() => window.print()}
     >
       Imprimer
     </button>

     <button
       className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
       onClick={closeModalH}
     >
       Fermer
     </button>
   </div>

   <span className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-700 transition no-print" onClick={closeModalH}>&times;</span>
 </div>
</div>



)}


             {/* Tableau de bord externe */}
             <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
             <div className="flex items-center justify-center mb-6">
    <FaFirstAid className="text-blue-600 text-[30px] mr-3 animate-bounce" />
    <h2 className="text-center font-extrabold text-gray-800 text-[26px]">Nombre de patient par service</h2>
  </div>

  {/* NOMBRE DE PATIENT POUR CHAQUE POLE  */}
  <div className="grid grid-cols-2 gap-6 text-gray-800 font-medium text-[15px]">
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <FaHeartbeat className="text-red-500" />
      <p className="hover:text-blue-600">POLE CHIRURGIE : </p>
    </div>
    
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <FaBrain className="text-purple-500" />
      <p className="hover:text-blue-600">POLE TÊTE ET COU :</p>
    </div>
    
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <FaStethoscope className="text-green-500" />
      <p className="hover:text-blue-600">POLE MEDECINE :</p>
    </div>
    
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <FaBaby className="text-pink-500" />
      <p className="hover:text-blue-600">POLE MÈRE ENFANT :</p>
    </div>
    
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <GiScalpel className="text-blue-700" />
      <p className="hover:text-blue-600">POLE ANESTHÉSIE RÉANIMATION URGENCE :</p>
    </div>
    
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition duration-300 ease-in-out">
      <FaMicroscope className="text-yellow-500" />
      <p className="hover:text-blue-600">POLE PARACLINIQUE :</p>
    </div>
  </div>
  {/* Bouton Voir Détails */}
  <div className="flex justify-center mt-6">
    <button
      className="mt-1 px-5 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 flex items-center transition duration-300 transform hover:scale-105"
      onClick={openModalE}
    >
      <FaEye className="mr-2" /> Voir Détails
    </button>
  </div>
             </div>

             {openE && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[80%] overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Détails des Services Externes</h2>

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
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={() => window.print()}
        >
          Imprimer
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
            </div>

            </div>

            {/* GRAPHE TOTAL */}
            <div className="flex justify-normal mt-[-10px]">

            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[1220px] h-[210px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
             <p className="text-center">GRAPHE GENERATIONNEL</p>
           </div>

           <div className="relative mt-7 w-[500px] h-[220px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4">
            <p className="text-center">Sexe</p>
            <div className="w-full h-full pb-2">
            <Line data={areaData} options={areaOptions} />
            </div>
          </div>



            </div>


          </div>
        </div>
      </div>
    
    )
}