"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaArrowRight } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { AiTwotoneDislike, AiFillLike } from "react-icons/ai";
import { FcDislike } from "react-icons/fc";

export default function Materiel() {
    const [tabM, settabM] = useState(false);
    const [materielData, setMaterielData] = useState<MaterielData[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const openTabM = () => settabM(true);
    const closeTabM = () => settabM(false);

    interface MaterielData {
        id: string;
        nom_materiel: string;
        etat: string;
        date_arriver: string;
        provenance: string;
        prix: string | number;
        emplacement: string;
    }

    const columns = [
        {
            name: 'Nom',
            selector: (row: MaterielData) => row.nom_materiel,
            sortable: true,
        },
        {
            name: 'État',
            selector: (row: MaterielData) => row.etat,
            sortable: true,
        },
        {
            name: "Date d'arrivée",
            selector: (row: MaterielData) => row.date_arriver,
            sortable: true,
        },
        {
            name: 'Provenance',
            selector: (row: MaterielData) => row.provenance,
            sortable: true,
        },
        {
            name: 'Prix',
            selector: (row: MaterielData) => row.prix + ' Ar',
            sortable: true,
        },
        {
            name: 'Emplacement',
            selector: (row: MaterielData) => row.emplacement,
            sortable: true,
        },
    ];

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/materiel/liste');
       
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
       
            const result = await response.json();
            console.log("Données récupérées :", result);
            setMaterielData(result);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

   

    // Calculer le prix total
    const totalPrice = materielData.reduce((acc, materiel) => {
        let prixNumerique;

        if (typeof materiel.prix === 'string') {
            prixNumerique = parseFloat(materiel.prix.replace(/[^0-9.-]+/g, ''));
        } else if (typeof materiel.prix === 'number') {
            prixNumerique = materiel.prix;
        } else {
            prixNumerique = 0;
        }

        return acc + (isNaN(prixNumerique) ? 0 : prixNumerique);
    }, 0);

    // Filtrer les matériels selon la période sélectionnée
    const filterByDate = (data: MaterielData[]) => {
        if (!startDate || !endDate) return data;

        return data.filter(materiel => {
            const dateArriver = new Date(materiel.date_arriver);
            return dateArriver >= new Date(startDate) && dateArriver <= new Date(endDate);
        });
    };

    const filteredData = filterByDate(materielData);

    const filteredTotalMat = filteredData.length;
    const filteredBonne = filteredData.filter(materiel => materiel.etat === 'bonne').length;
    const filteredMoyen = filteredData.filter(materiel => materiel.etat === 'moyen').length;
    const filteredMauvais = filteredData.filter(materiel => materiel.etat === 'mauvais').length;
    const filteredTotalPrice = filteredData.reduce((acc, materiel) => {
        let prixNumerique;

        if (typeof materiel.prix === 'string') {
            prixNumerique = parseFloat(materiel.prix.replace(/[^0-9.-]+/g, ''));
        } else if (typeof materiel.prix === 'number') {
            prixNumerique = materiel.prix;
        } else {
            prixNumerique = 0;
        }

        return acc + (isNaN(prixNumerique) ? 0 : prixNumerique);
    }, 0);

    return (
        <div className="flex">
            <Navbar />
            <div className="w-full h-[100vh] p-2">
                <Menu />
                <div className="w-full h-[2%]"></div>

                {/* CONTENU PRINCIPAL */}
                <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
                <div className="flex justify-between items-center mb-4">
    {/* Champ de dates */}
    <div className="flex space-x-2">
        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
    </div>

    {/* Titre centré */}
    <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des matériels</h2>

    {/* Espacement pour l'alignement */}
    <div className="w-1/4"></div>
</div>

                    
                    <div className="flex justify-between mt-3">

                        {/* Sélecteurs de Date */}
                        

                        <div className="w-[300px] h-[120px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center">
                            <div className="text-center">
                                <h2 className="font-bold text-gray-700 text-[24px]">{filteredTotalMat}</h2>
                                <p className="text-gray-600 text-[20px] font-semibold mb-1">Liste des matériels</p>
                                <button className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center" onClick={openTabM}>
                                    <FaArrowRight className="mr-2" />
                                    Voir Détails
                                </button>
                            </div>
                        </div>

                        {tabM && (
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
                                        <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabM}>
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                         <div className="w-[300px] h-[120px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center">
                           <div className="text-center">
                          <h2 className="font-bold text-gray-700 text-[24px]">{filteredBonne}</h2>
                           <p className="text-gray-600 text-[20px] font-semibold mb-2">Matériels en bon état</p>
                              <div className="flex items-center justify-center mt-2">
                              <AiFillLike className="text-green-500 text-[28px]" />
                           </div>
                         </div>
                        </div>


                        <div className="w-[300px] h-[120px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center">
                            <div className="text-center">
                                <h2 className="font-bold text-gray-700 text-[24px]">{filteredMoyen}</h2>
                                <p className="text-gray-600 text-[20px] font-semibold mb-2">Matériels en état moyen</p>
                                <div className="flex items-center justify-center mt-2">
                                    <AiTwotoneDislike className="text-yellow-500 text-[28px]" />
                                </div>
                            </div>
                        </div>

                        <div className="w-[300px] h-[120px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center">
                            <div className="text-center">
                                <h2 className="font-bold text-gray-700 text-[24px]">{filteredMauvais}</h2>
                                <p className="text-gray-600 text-[20px] font-semibold mb-2">Matériels en mauvais état</p>
                                <div className="flex items-center justify-center mt-2">
                                    <FcDislike className="text-red-500 text-[28px]" />
                                </div>
                            </div>
                        </div>

                        <div className="w-[300px] h-[120px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center">
                        <div className="text-center">
                            <h2 className="font-bold text-gray-700 text-[24px]">{filteredTotalPrice.toFixed(2)} Ar</h2>
                            <p className="text-gray-600 text-[20px] font-semibold mb-2">Prix Total des Matériels</p>
                        </div>
                    </div>
                    </div>
                    {/* <div className="w-full h-[3%]"></div> */}
                   
                </div>
            </div>
        </div>
    );
}
