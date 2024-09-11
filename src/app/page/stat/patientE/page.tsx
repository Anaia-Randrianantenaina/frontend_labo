"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import DataTable from 'react-data-table-component';
import { FaArrowRight, FaCalculator, FaEye, FaUser } from "react-icons/fa";
import { BiListOl } from "react-icons/bi";
import { Bar, Line } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart, LinearScale, LineElement, PointElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement);





export default function PatientE() {

  const [tabE, setTabE] = useState(false);
  const openTabE = () => setTabE(true);
  const closeTabE = () => setTabE(false);

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

  const columnsH = [
    {
      name: 'Numéro',
      selector: (row: ExterneData) => row.numE+"E",
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row: ExterneData) => row.nomE,
      sortable: true,
    },
    {
      name: 'Prénom',
      selector: (row: ExterneData) => row.prenomE,
      sortable: true,
    },
    {
      name: 'Sexe',
      selector: (row: ExterneData) => row.sexeE,
      sortable: true,
    },
    {
      name: 'Date de Naissance',
      selector: (row: ExterneData) => row.date_naissE,
      sortable: true,
    },
    {
      name: 'Age',
      selector: (row: ExterneData) => row.ageE,
      sortable: true,
    },
    {
      name: 'Adresse',
      selector: (row: ExterneData) => row.adresseE,
      sortable: true,
    },
    {
      name: "Date d'Ajout",
      selector: (row: ExterneData) => row.date_ajoutE,
      sortable: true,
    },
  ]

  // Fonction pour récuperer les données des patients depuis le serveur
  const [externeData, setDataE] = useState<ExterneData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/externes');

        if(!response.ok) {
          throw new Error('Erreur réseau');
        }

        const result: ExterneData[] = await response.json();
        console.log("DOnnées récuperer : ", result);

        setDataE(result);
      }catch (error) {
        console.error("Erreurlors de la récupérations des données :", error);
      }
    };
    fetchData()
  }, [externeData]);

  // Nombre de patient Externe
  const totalPatientE = externeData.length;
  // NOMBRE DE PATIENT PAR SEXE
  const Homme = externeData.filter(externe => externe.sexeE === 'M').length;
  const Femme = externeData.filter(externe => externe.sexeE === 'F').length;
  // NOMBRE DE PATIENT PAR GENARATION
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
  
    const { Enfant, Jeune, Adulte, Vieux } = getPatientCountsByAge(externeData);

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

// GRAPHE BARE GENERATION
const barData = {
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
                <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
                   <div className="flex items-center">
                  <FaUser className="text-green-700 text-[50px] mr-4" />
                  <div className="text-center">
                   <h2 className="font-bold text-[30px]">{totalPatientE}</h2>
                   <p className="text-gray-700 medium font-bold text-[30px]">Externes</p>
                  </div>
                 </div>
            </div>
           

           {/* Tableau des externes */}
                {/* TOTAL */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[800px] h-[130px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto flex items-center justify-center">
              <div className="flex items-center">
              <BiListOl className="text-gray-700 text-[50px] mr-4" />
              <div className="text-center">
              <h2 className="font-bold text-[30px]"></h2>
              <p className="text-gray-700 medium font-bold text-[30px]">Listes</p>
              <button   className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center " onClick={openTabE}>
              <FaArrowRight className="mr-2" />
               Voir Détails
              </button>
              </div>
              </div>
          </div>
          {tabE && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
                  <h2 className="text-2xl text-center font-bold mb-4">Détails des Hospitalisés</h2>
                  <DataTable
                    columns={columnsH}
                    data={externeData}
                    pagination
                    paginationPerPage={5} // Définit le nombre de lignes par page à 5
                    paginationRowsPerPageOptions={[5]} // Options pour le nombre de lignes par page
                
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => window.print()}>
                      Imprimer
                    </button>
                    <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabE}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}

            </div> 

            {/* TABLEAU DE BORD */}
            <div className="flex justify-center mt-[-17px]">
                {/* Tableau de bord hosipitalisé */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-green-700 text-[30px] mr-4" />
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
  >
    <FaEye className="mr-2" /> Voir Détails
  </button>
  </div>
             </div>
         

            {/* Graphe generationnel */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded-3xl z-10 p-4 overflow-auto">
              <p className="text-center">Géneration</p>
              <Line data={ScatterData} options={ScatterOption}/>
            </div>

            </div>

            {/* GRAPHE TOTAL */}
            <div className="flex justify-center mt-[-10px]">

            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[1180px] h-[210px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
             <p className="text-center">GRAPHE GENERATIONNEL</p>
             <Bar data={barData}  options={ barOptions }/>
           </div>

            <div className=" top-[50px] m-10 left-[1.5cm] right-[35cm] w-[400px] h-[210px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
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