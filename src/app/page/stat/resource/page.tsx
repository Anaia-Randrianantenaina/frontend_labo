"use client";
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "../menu/page";
import { FaArrowRight } from "react-icons/fa";
import DataTable from "react-data-table-component";

export default function Resource() {
    const [tabI, setTabI] = useState(false);
    const openTabI = () => setTabI(true);
    const closeTabI = () => setTabI(false);
    const [intrantData, setIntrantData] = useState<IntrantData[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    interface IntrantData {
        id: string;
        designation: string;
        forme: string;
        dosage_forme: string;
        unite_dosage: string;
        unite: string;
        contenu: string;
        prix: string;
        date_prescription: string;
        numero_lot: string;
        quantite: string;
        unite_mesure: string;
        dosage: string;
        utilise: string;
        date_ajout: string
    }

    // LISTE DES COLONNES
    const columns = [
        { name: 'Désignation', selector: (row: IntrantData) => row.designation, sortable: true },
        { name: 'Forme', selector: (row: IntrantData) => row.forme, sortable: true },
        { name: 'Dosage(Forme)', selector: (row: IntrantData) => row.dosage_forme, sortable: true },
        { name: 'Unité(Dosage)', selector: (row: IntrantData) => row.unite_dosage, sortable: true },
        { name: 'Unité', selector: (row: IntrantData) => row.unite, sortable: true },
        { name: 'Contenu', selector: (row: IntrantData) => row.contenu, sortable: true },
        { name: 'Prix', selector: (row: IntrantData) => row.prix, sortable: true },
        { name: 'Date de Prescription', selector: (row: IntrantData) => row.date_prescription, sortable: true },
        { name: 'Numéro Lot', selector: (row: IntrantData) => row.numero_lot, sortable: true },
        { name: 'Quantité', selector: (row: IntrantData) => row.quantite, sortable: true },
        { name: 'Unité de Mesure', selector: (row: IntrantData) => row.unite_mesure, sortable: true },
        { name: 'Dosage', selector: (row: IntrantData) => row.dosage, sortable: true },
        { name: 'Utilisé', selector: (row: IntrantData) => row.utilise, sortable: true },
    ];

    // AFFICHER LA LISTE DES INTRANTS
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/intrant/liste');
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            const result = await response.json();
            console.log("Données récupérées:", result);
            setIntrantData(result);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // FILTRER LES MATÉRIELS SELON LA PÉRIODE SÉLÉCTIONNÉE
    const filterByDate = (data: IntrantData[]) => {
        if (!startDate || !endDate) return data;

        return data.filter(intrant => {
            const dateArriver = new Date(intrant.date_ajout);
            return dateArriver >= new Date(startDate) && dateArriver <= new  Date(endDate);
        });
    };
    const filteredData = filterByDate(intrantData);

    // NOMBRE D'INTRANT
    const filteredTotalInt = filteredData.length;

    return (
        <div className="flex">
            {/* NAVBAR */}
            <Navbar />
            {/* MENU */}
            <div className="w-full h-[100vh] p-2">
                <Menu />
                <div className="w-full h-[2%]"></div>
                {/* CONTENU PRINCIPAL */}
                <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
                    {/* PARTIE EN TETE */}
                    <div className="flex justify-between items-center mb-4">
        {/* Champ de dates */}
                  <div className="flex ml-2 space-x-8">
                                           <input type="date"  value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800 placeholder-opacity-70"
                        placeholder="Start Date"></input>
                        <input  type="date" value={endDate}  onChange={(e) => setEndDate(e.target.value)}
                           className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800 placeholder-opacity-70"
                           placeholder="End Date"
                         />
                  </div>
                       

         {/* Titre centré */}
         <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des matériels</h2>

         {/* Espacement pour l'alignement */}
         <div className="mr-5">
    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 
    transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" >
        Rapport Analytiques
    </button>
</div>

                </div>
                    <div className="flex justify-between">
                        <div className="bg-white w-[550px] h-[270px] ml-4 rounded-3xl"></div>

                        <div className="space-y-2">
                            <div className="bg-white w-[250px] h-[130px] rounded-3xl flex flex-col items-center justify-center">
                                <div className="text-center">
                                    <h2 className="font-bold text-gray-700 text-[24px]">{filteredTotalInt}</h2>
                                    <p className="text-gray-600 text-[20px] font-semibold mb-1">Liste des Intrants</p>
                                    <button
                                        className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center"
                                        onClick={openTabI}
                                    >
                                        <FaArrowRight className="mr-2" />
                                        Voir Détails
                                    </button>
                                </div>
                            </div>

                            {tabI && (
                                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
                                        <h2 className="text-2xl text-center font-bold mb-4">Détails des Matériels</h2>
                                        <DataTable
                                            columns={columns}
                                            data={filteredData}
                                            pagination
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[5]}
                                        />
                                        <div className="flex justify-end gap-4 mt-4">
                                            <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => window.print()}>
                                                Imprimer
                                            </button>
                                            <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabI}>
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white w-[250px] h-[130px] rounded-3xl"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-white w-[250px] h-[130px] rounded-3xl"></div>
                            <div className="bg-white w-[250px] h-[130px] rounded-3xl"></div>
                        </div>

                        <div className="bg-white w-[550px] h-[270px] mr-4 rounded-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
