"use client"
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "../menu/page";
import { FaArrowRight, FaEye, FaInfoCircle, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { BiListOl } from "react-icons/bi";
import DataTable from "react-data-table-component";
import MapModal from "./MapModal"; // Importez le nouveau composant

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

  const [data, setData] = useState<ExterneData[]>([]);
  const [tableau, setTableau] = useState(false);
  const openE = () => setTableau(true);
  const closeE = () => setTableau(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [mapVisible, setMapVisible] = useState(false); // État pour la visibilité du modal

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
                  <h2 className="text-2xl text-center font-bold mb-4">Détails des Externes</h2>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5]}
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                      onClick={() => window.print()}
                    >
                      Imprimer
                    </button>
                    <button
                      className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeE}
                    >
                      Fermer
                    </button>
                    <button
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                      onClick={() => setMapVisible(true)}
                    >
                      Voir sur Carte
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
  <button
    className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center "
    
  >
    <FaEye className="mr-2" /> Voir Détails
  </button>
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
              <p className="text-center">Géneration</p>
            
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}
