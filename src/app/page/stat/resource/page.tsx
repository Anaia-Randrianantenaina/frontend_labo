"use client";
import { FcMoneyTransfer } from "react-icons/fc"; 
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "../menu/page";
import { FaArrowRight, FaInfoCircle, FaListAlt } from "react-icons/fa";
import DataTable from "react-data-table-component";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import 'chart.js/auto';

// Enregistre les éléments pour Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement,ArcElement,BarElement, Title, Tooltip, Legend);


export default function Resource() {
    const [tabI, setTabI] = useState(false);
    const openTabI = () => setTabI(true);
    const closeTabI = () => setTabI(false);
    const [intrantData, setIntrantData] = useState<IntrantData[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [tabPrix, setTabPrix] = useState(false);
    const openPrix = () => setTabPrix(true);
    const closePrix = () => setTabPrix(false);
    const [rapport, setRapport] = useState(false);
    const openRap = () => setRapport(true);
    const closeRap = () => setRapport(false);

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
    // CALCULE DU PRIX DES INTRANTS
    const filteredTotalPrice = filteredData.reduce((acc, intrant) => {
        let prixNumerique;

        if (typeof intrant.prix === 'string') {
            prixNumerique = parseFloat(intrant.prix.replace(/[^0-9.-]+/g, ''));
        } else if (typeof intrant.prix === 'number') {
            prixNumerique = intrant.prix;
        } else {
            prixNumerique = 0;
        }

        return acc + (isNaN(prixNumerique) ? 0 : prixNumerique);
    }, 0);
    // FONCTION POUR COMPTER LES MATÉRIELS PAR SON NOM
    const countByIntrant = (data: IntrantData[]) => {
        return data.reduce((acc, intrant) => {
            if (acc[intrant.designation]) {
                acc[intrant.designation] += 1;
            } else {
                acc[intrant.designation] = 1;
            }
            return acc;
        }, {} as Record<string, number>); // { "Materiel1": 5, "Materiel2": 3, ... }
    };
    // OBTENEZ LE NOMBRE D'INTRANT
    const intrantCounts = countByIntrant(filteredData);
    // FONCTION POUR CALCULER LE PRIX DES INTRANTS PAR SON NOM
    const prixByInt = (data: IntrantData[]) => {
        return data.reduce((acc: { [prix: number]: string[] }, intrant) => {
            let prixNumerique;
    
            if (typeof intrant.prix === 'string') {
                prixNumerique = parseFloat(intrant.prix.replace(/[^0-9.-]+/g, '')); // Convertir en nombre
            } else if (typeof intrant.prix === 'number') {
                prixNumerique = intrant.prix;
            } else {
                prixNumerique = 0; // Valeur par défaut si le prix est invalide
            }
    
            if (acc[prixNumerique]) {
                acc[prixNumerique].push(intrant.designation);
            } else {
                acc[prixNumerique] = [intrant.designation];
            }
    
            return acc;
        }, {});
    };
    // FONCTION POUR CALCULER LE RPIX TOTALE PAR DESIGNATION
const prixParIntrant = (data: IntrantData[]) => {
    return data.reduce((acc: { [designation: string]: number }, intrant) => {
        let prixNumerique;
        if (typeof intrant.prix === 'string') {
            prixNumerique = parseFloat(intrant.prix.replace(/[^0-9.-]+/g, ''));
        } else if (typeof intrant.prix === 'number') {
            prixNumerique = intrant.prix;
        } else {
            prixNumerique = 0;
        }
        if (acc[intrant.designation]) {
            acc[intrant.designation] += prixNumerique;
        } else {
            acc[intrant.designation] = prixNumerique;
        }
        return acc;
    }, {});
};

const prixParIntrantData = prixParIntrant(filteredData);
// COLONE POUR LE TABLEAU DEX PRIX 
const prixColumns = [
    { name: 'Désignation', selector: (row: { designation: string }) => row.designation, sortable: true },
    { name: 'Prix Total', selector: (row: { prixTotal: number }) => row.prixTotal, sortable: true }
];
// PREPARER LES DONNÉES DU TABLEAUX 
const prixData = Object.entries(prixParIntrantData).map(([designation, prixTotal]) => ({
    designation,
    prixTotal
}));
// EXPORATATION DES DONNÉES EN EXCEL
const exportToExcel = (data: any[], columns: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.name) });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};
// STATISTIQUE
// PAR PRIX
const chartData = () => {
    const prixInt = prixByInt(filteredData);

    const labels = Object.keys(prixInt);
    const data = Object.values(prixInt).map(intrant => intrant.length);

    return {
        labels,
        datasets: [
            {
                label: 'NOMBRE DE MATÉRIELS PAR PRIX',
                data,
                backgroundColor: '#36A2EB',
                borderColor: '#2c3e50',
                borderWidth: 1,
            },
        ],
    };
};

const chartOptions = {
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
// PAR NOM
const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const, // TypeScript astuce pour le type 'top' ou 'bottom' etc.
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    return `Matériel: ${context.raw.x}, Quantité: ${context.raw.y}`;
                },
            },
        },
    },
    scales: {
        x: {
            type: 'category' as const,
            title: {
                display: true,
                text: 'Nom du Matériel',
            },
            ticks: {
                autoSkip: false, // Pour afficher tous les labels
            },
        },
        y: {
            type: 'linear' as const,
            title: {
                display: true,
                text: 'Quantité',
            },
            beginAtZero: true,
        },
    },
};

const scatterData = () => {
    const intrantCounts = countByIntrant(filteredData);

    return {
        datasets: [
            {
                label: 'Nombre de Matériels',
                data: Object.entries(intrantCounts).map(([name, count]) => ({
                    x: name, // Utiliser le nom du matériel pour l'axe X
                    y: count, // Quantité pour l'axe Y
                })),
                backgroundColor: '#36A2EB',
                borderColor: '#2c3e50',
                borderWidth: 1,
                pointRadius: 7, // Taille des points
            },
        ],
    };
};

// PRIX PAR DESIGNATION
// Fonction pour générer les données du graphique
const generateBarChartData = (data: { [designation: string]: number }) => {
    return {
        labels: Object.keys(data),
        datasets: [{
            label: 'Prix Total par Désignation',
            data: Object.values(data),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
};

const barChartData = generateBarChartData(prixParIntrantData);

<Bar
    data={barChartData}
    options={{
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Prix Total par Désignation',
            },
        },
    }}
/>



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
    transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" onClick={openRap}>
        Rapport Analytiques
    </button>
</div>

                    </div>

                {/* PARTIE 1 */}
                    <div className="flex justify-between">
                    <div className="w-[570px] h-[270px] ml-4 bg-gradient-to-r  from-gray-300 via-gray-50 to-white rounded-3xl shadow-xl p-6 border border-gray-300">
                            <h3 className="text-center font-bold text-2xl mb-4 text-gray-900">Nombre de chaque Intrant</h3>
                          <div className="overflow-y-auto max-h-[180px]">
                          <ul className="list-disc pl-5 space-y-2">
                          {Object.entries(intrantCounts).map(([materiel, count]) => (
                         <li key={materiel} className="text-lg text-gray-800 flex justify-between items-center">
                        <span>{materiel} :</span>
                          <span className="font-semibold">{count}</span>
                     </li>
                   ))}
                    </ul>
                   </div>
                  </div>


                        <div className="space-y-2">
                        <div className="bg-white w-[250px] h-[130px] rounded-3xl shadow-lg flex flex-col items-center justify-center">
    <div className="text-center flex items-center">
        <FaListAlt className="text-gray-700 text-[24px] mr-2" /> {/* Ajouter l'icône */}
        <h2 className="font-bold text-gray-700 text-[24px]">{filteredTotalInt}</h2>
    </div>
    <p className="text-gray-600 text-[20px] font-semibold mb-2">Nombre total Intrants</p>
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
                <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(filteredData, columns, 'details_intrants.xlsx')}>
                    Exporter en Excel
                </button>
                <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closeTabI}>
                    Fermer
                </button>
            </div>
        </div>
    </div>
)}

 
 <div className="bg-white w-[250px] h-[130px] rounded-3xl shadow-lg flex flex-col items-center justify-center">
    <div className="text-center flex flex-col items-center">
        <FaListAlt className="text-gray-600 text-[24px] mb-2" /> {/* Icône ajoutée ici */}
        <p className="text-gray-600 text-[20px] font-semibold mb-2">Liste des Intrants</p>
        <button
            className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center"
            onClick={openTabI}
        >
            <FaArrowRight className="mr-2" />
            Voir Détails
        </button>
    </div>
</div>
                        

 

                        </div>

                        <div className="space-y-2">
                        <div className="bg-white w-[250px] h-[130px] rounded-3xl shadow-lg flex flex-col items-center justify-center">
                              <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 text-green-600">
                                      <FcMoneyTransfer className="text-3xl" /> 
                                      <h2 className="font-bold text-gray-800 text-[20px]">Prix des Intrants</h2> {/* Style du titre */}
                                  </div>
                                  <p className="text-gray-600 text-[24px] font-semibold mt-2">{filteredTotalPrice} Ar</p> {/* Affichage du prix avec style */}
                              </div>
                        </div>
                          
                        <div className="bg-white w-[250px] h-[130px] rounded-3xl shadow-lg flex flex-col items-center justify-center">
    <div className="text-center flex flex-col items-center">
        <FaInfoCircle className="text-gray-600 text-[24px] mb-2" /> {/* Icône ajoutée ici */}
        <p className="text-gray-600 text-[20px] font-semibold mb-2">Prix par désignation</p>
        <button
            className="px-4 py-2 border border-green-700 text-green-700 rounded-full hover:bg-green-100 transition-colors flex items-center"
            onClick={openPrix}
        >
            <FaArrowRight className="mr-2" />
            Voir Détails
        </button>
    </div>
</div>

{tabPrix && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
            <h2 className="text-2xl text-center font-bold mb-4">Détails des prix</h2>
            <DataTable
                columns={prixColumns}
                data={prixData}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5]}
            />
            <div className="flex justify-end gap-4 mt-4">
                <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => window.print()}>
                    Imprimer
                </button>
                <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(prixData, prixColumns, 'prix_intrants.xlsx')}>
                    Exporter en Excel
                </button>
                <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800" onClick={closePrix}>
                    Fermer
                </button>
            </div>
        </div>
    </div>
)}

                        </div>

                        <div className="w-[570px] h-[270px] mr-2 bg-gradient-to-r from-gray-300 via-gray-50 to-white rounded-3xl shadow-xl p-6 border border-gray-300">
                      <h3 className="text-center font-bold text-2xl mb-4 text-gray-700">Prix par matériel</h3>
                      <div className="flex flex-wrap justify-center space-x-4 h-[150px] overflow-y-auto"> {/* Limite la hauteur et active le scroll */}
                          {Object.entries(prixByInt(filteredData)).map(([prix, intrant]) => (
                              <div key={prix} className="text-center bg-white p-2 rounded-lg shadow-lg mb-2">
                                  <h4 className="font-bold text-[15px] text-gray-700"><u>{prix} Ar</u></h4>
                                  <ul className="mt-1 text-[13px] text-gray-600 font-bold">
                                      {intrant.map(intrant => (
                                          <li key={intrant}>{intrant}</li>
                                      ))}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </div>
                    </div>

                {/* PARTIE 2 */}
                <div className="flex justify-between mt-4">
                    <div className="w-[550px] h-[200px] ml-4 bg-white rounded-3xl">
                    <Scatter data={scatterData()} options={scatterOptions} />
                    </div>
                    <div className="w-[550px] h-[200px] bg-white rounded-3xl p-4">
            <Bar data={barChartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,  // Important to fit within the container
                    plugins: {
                        legend: {
                            position: 'top' as const,
                        },
                        title: {
                            display: true,
                            text: 'Prix Total par Désignation',
                        },
                    },
                }}
            />
        </div>
                    <div className="w-[550px] h-[200px] mr-4 bg-white rounded-3xl">
                    <Bar data={chartData()} options={chartOptions} />
                    </div>
                </div>

                {rapport && (
                <div  className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div id="report-content" className="bg-white rounded-lg shadow-md p-6 w-[210mm] h-[297mm] max-h-[100vh] overflow-auto print:w-[210mm] print:h-[297mm] print:overflow-visible">
      
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold">CHU TAMBOHOBE FIANARANTSOA</h3>
        <h3 className="text-lg font-bold">SERVICE LABORATOIRE</h3>

        <h3 className="text-md mt-3 mb-1">Rapport d'Activités de Laboratoire:</h3>
        <h4 className="text-sm font-medium">{startDate && endDate ? `${startDate} au ${endDate}` : " "}</h4>

        <h3 className="font-bold text-xl mt-4 mb-3">Gestion des patients</h3>
        
       <p className="text-[20px] text-center">Nombre de matériels : {}</p>

       <h3 className="text-center font-bold text-2xl mb-4 text-gray-900">Nombre de chaque Intrant</h3>
<div className="overflow-y-auto max-h-[180px]">
<div className="overflow-x-hidden">
  <table className="min-w-full bg-white border border-gray-300 w-full">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-4 py-2 text-left">Intrant</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Nombre</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(intrantCounts).map(([materiel, count]) => (
        <tr key={materiel} className="hover:bg-gray-100">
          <td className="border border-gray-300 px-4 py-2">{materiel}</td>
          <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{count}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>

       <p className="text-[20px] mt-3 text-center">Prix total des matériels : {filteredTotalPrice} Ariary</p>
       <table className="table-auto w-full text-center">
  <thead>
    <tr>
      <th className="border px-4 py-2 text-[15px]">Prix (Ar)</th>
      <th className="border px-4 py-2 text-[15px]">Matériels</th>
    </tr>
  </thead>
  <tbody className="h-[150px] overflow-y-auto">
  <div className="w-[570px] h-[270px] mr-2 bg-gradient-to-r from-gray-300 via-gray-50 to-white rounded-3xl shadow-xl p-6 border border-gray-300">
                      <h3 className="text-center font-bold text-2xl mb-4 text-gray-700">Prix par matériel</h3>
                      <div className="flex flex-wrap justify-center space-x-4 h-[150px] overflow-y-auto"> {/* Limite la hauteur et active le scroll */}
                          {Object.entries(prixByInt(filteredData)).map(([prix, intrant]) => (
                              <div key={prix} className="text-center bg-white p-2 rounded-lg shadow-lg mb-2">
                                  <h4 className="font-bold text-[15px] text-gray-700"><u>{prix} Ar</u></h4>
                                  <ul className="mt-1 text-[13px] text-gray-600 font-bold">
                                      {intrant.map(intrant => (
                                          <li key={intrant}>{intrant}</li>
                                      ))}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </div>
  </tbody>
</table>

              
      </div>

      {/* Section pour les boutons */}
      <div className="flex justify-end gap-4 mt-4 print:hidden">
      {/* <button
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
  onClick={saveAsPDF}
  disabled={loading}
>
  {loading ? 'En cours...' : 'Enregistrer en PDF'}
</button> */}

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
    );
}
