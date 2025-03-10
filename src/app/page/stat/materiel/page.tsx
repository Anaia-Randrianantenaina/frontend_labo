"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaArrowRight } from "react-icons/fa";
import DataTable from "react-data-table-component";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AiTwotoneDislike, AiFillLike } from "react-icons/ai";
import { FcDislike } from "react-icons/fc";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import 'chart.js/auto';

// Enregistre les éléments pour Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement,ArcElement,BarElement, Title, Tooltip, Legend);


export default function Materiel() {
    const [tabM, settabM] = useState(false);
    const [rapportM, setRapport] = useState(false)
    const [materielData, setMaterielData] = useState<MaterielData[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const openTabM = () => settabM(true);
    const closeTabM = () => settabM(false);
    const openRapport = () => setRapport(true);
    const closeRapport = () => setRapport(false);

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

    // AFFICHER LA LISTE DES MATÉRIELS
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

    // EXPORATATION DES DONNÉES EN EXCEL
const exportToExcel = (data: any[], columns: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map(col => col.name) });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
  };
  

   

    
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
    // caclule du prix des matériels
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

      // Fonction pour compter les matériels par nom
      const countByMateriel = (data: MaterielData[]) => {
        return data.reduce((acc, materiel) => {
            if (acc[materiel.nom_materiel]) {
                acc[materiel.nom_materiel] += 1;
            } else {
                acc[materiel.nom_materiel] = 1;
            }
            return acc;
        }, {} as Record<string, number>); // { "Materiel1": 5, "Materiel2": 3, ... }
    };

    // Obtenez le nombre de matériels
    const materielCounts = countByMateriel(filteredData);

    const prixByMat = (data: MaterielData[]) => {
        return data.reduce((acc: { [prix: number]: string[] }, materiel) => {
            let prixNumerique;
    
            if (typeof materiel.prix === 'string') {
                prixNumerique = parseFloat(materiel.prix.replace(/[^0-9.-]+/g, '')); // Convertir en nombre
            } else if (typeof materiel.prix === 'number') {
                prixNumerique = materiel.prix;
            } else {
                prixNumerique = 0; // Valeur par défaut si le prix est invalide
            }
    
            if (acc[prixNumerique]) {
                acc[prixNumerique].push(materiel.nom_materiel);
            } else {
                acc[prixNumerique] = [materiel.nom_materiel];
            }
    
            return acc;
        }, {});
    };
    



    
    
    // GRAPHE D'ÉTAT
    const pieData = {
        labels: ['Bonn État', 'Moyen État', 'Mauvais État'],
        datasets: [
            {
                label: 'Répartition des États',
                data: [filteredBonne, filteredMoyen, filteredMauvais],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };
    const pieOption = {
        responsive: true,
        maintainAspectRatio: false,
      };

    // GRAPHE POUR LES PRIX 
      const chartData = () => {
        const prixMat = prixByMat(filteredData);

        const labels = Object.keys(prixMat);
        const data = Object.values(prixMat).map(materiels => materiels.length);

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

    // GRAPHE MATÉRIELS :
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
        const materielCounts = countByMateriel(filteredData);
    
        return {
            datasets: [
                {
                    label: 'Nombre de Matériels',
                    data: Object.entries(materielCounts).map(([name, count]) => ({
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
    const defaultContenu = 'Rapport pour la gestion du matériels';

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
            <Navbar />
            <div className="w-full h-[100vh] p-2">
                <Menu />
                <div className="w-full h-[2%]"></div>

                {/* CONTENU PRINCIPAL */}
                <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
                <div className="flex justify-between items-center mb-4">
        {/* Champ de dates */}
        <div className="flex ml-2 space-x-8">
  <input
    type="date" 
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800 placeholder-opacity-70"
    placeholder="Start Date"
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="border border-gray-300 rounded-lg px-6 py-3 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-transform duration-300 ease-in-out bg-white shadow-lg hover:shadow-2xl placeholder-gray-400 text-gray-800 placeholder-opacity-70"
    placeholder="End Date"
  />
        </div>


         {/* Titre centré */}
         <h2 className="text-center font-bold text-xl mx-auto">Statistique générale des matériels</h2>

         {/* Espacement pour l'alignement */}
         <div className="mr-5">
    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 
    transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50" onClick={openRapport}>
        Rapport Analytiques
    </button>
</div>

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
                                        
                                        <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800" onClick={() => exportToExcel(filteredData, columns, 'Liste des matériels externes.xlsx')}>
                                            Exporter en Excel
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

                    {/* DEUXIEME PARTIE  */}
                    <div className="flex justify-between mt-5">
                        <div className="w-[570px] h-[250px] bg-white ml-2 rounded-3xl">
                            {/* <h2 className="text-center mt-1 text-gray-600">Graphe Matériels</h2> */}
                            <Pie data={pieData} options={pieOption} />
                        </div>

                        <div className="w-[570px] h-[250px] bg-gradient-to-r from-gray-300 via-gray-50 to-white rounded-3xl shadow-xl p-6 border border-gray-300">
                            <h3 className="text-center font-bold text-2xl mb-4 text-gray-900">Nombre de chaque matériel</h3>
                          <div className="overflow-y-auto max-h-[180px]">
                          <ul className="list-disc pl-5 space-y-2">
                          {Object.entries(materielCounts).map(([materiel, count]) => (
                         <li key={materiel} className="text-lg text-gray-800 flex justify-between items-center">
                        <span>{materiel} :</span>
                          <span className="font-semibold mr-6">{count}</span>
                     </li>
                   ))}
                    </ul>
                   </div>
                  </div>

                  <div className="w-[570px] h-[250px] mr-2 bg-gradient-to-r from-gray-300 via-gray-50 to-white rounded-3xl shadow-xl p-6 border border-gray-300">
                      <h3 className="text-center font-bold text-2xl mb-4 text-gray-700">Prix par matériel</h3>
                      <div className="flex flex-wrap justify-center space-x-4 h-[150px] overflow-y-auto"> {/* Limite la hauteur et active le scroll */}
                          {Object.entries(prixByMat(filteredData)).map(([prix, materiels]) => (
                              <div key={prix} className="text-center bg-white p-2 rounded-lg shadow-lg mb-2">
                                  <h4 className="font-bold text-[15px] text-gray-700"><u>{prix} Ar</u></h4>
                                  <ul className="mt-1 text-[13px] text-gray-600 font-bold">
                                      {materiels.map(materiel => (
                                          <li key={materiel}>{materiel}</li>
                                      ))}
                                  </ul>
                              </div>
                          ))}
                      </div>
                  </div>

                    </div>

                    {/* TROISIEME PARTIE */}
                      {/* GRAPHE DU PRIX DES MATÉRIELS  */}
                      <div className="flex justify-between mt-7">
                      <div className="w-[900px] h-[280px] ml-2 bg-white rounded-3xl">
            {/* <h3 className="text-center font-bold text-2xl mb-4 text-gray-700">Quantité des Matériels par Nom (Scatter Plot)</h3> */}
            <div className="h-full">
                <Scatter data={scatterData()} options={scatterOptions} />
            </div>
        </div>

                            {/* GRAPHE POUR LE PRIX */}
                            <div className="w-[900px] h-[280px] ml-2 bg-white rounded-3xl">
                                 <Bar data={chartData()} options={chartOptions} />
                            </div>
                        </div>
                </div>
            </div>

            {rapportM && (
                <div  className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div id="report-content" className="bg-white rounded-lg shadow-md p-6 w-[210mm] h-[297mm] max-h-[100vh] overflow-auto print:w-[210mm] print:h-[297mm] print:overflow-visible">
      
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold">CHU TAMBOHOBE FIANARANTSOA</h3>
        <h3 className="text-lg font-bold">SERVICE LABORATOIRE</h3>

        <h3 className="text-md mt-3 mb-1">Rapport d'Activités de Laboratoire:</h3>
        <h4 className="text-sm font-medium">{startDate && endDate ? `${startDate} au ${endDate}` : "Sélectionnez les dates"}</h4>

        <h3 className="font-bold text-xl mt-4 mb-3">Gestion des patients</h3>
        
       <p className="text-[20px] text-center">Nombre de matériels : {filteredTotalMat}</p>

       <table className="table-auto w-full text-center">
  <thead>
    <tr>
      <th className="border px-4 py-2 text-[15px]">État</th>
      <th className="border px-4 py-2 text-[15px]">Nombre de Matériels</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border px-4 py-2 text-[12px]">Bonne état</td>
      <td className="border px-4 py-2 text-[12px]">{filteredBonne}</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 text-[12px]">État moyen</td>
      <td className="border px-4 py-2 text-[12px]">{filteredMoyen}</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 text-[12px]">Mauvais état</td>
      <td className="border px-4 py-2 text-[12px]">{filteredMauvais}</td>
    </tr>
  </tbody>
       </table>

       <p className="text-[20px] mt-3 text-center">Prix total des matériels : {filteredTotalPrice} Ariary</p>
       <table className="table-auto w-full text-center">
  <thead>
    <tr>
      <th className="border px-4 py-2 text-[15px]">Prix (Ar)</th>
      <th className="border px-4 py-2 text-[15px]">Matériels</th>
    </tr>
  </thead>
  <tbody className="h-[150px] overflow-y-auto">
    {Object.entries(prixByMat(filteredData)).map(([prix, materiels]) => (
      <tr key={prix}>
        <td className="border px-4 py-2 text-[15px] font-bold ">
          <u>{prix} Ar</u>
        </td>
        <td className="border px-4 py-2 text-[13px]">
          <ul className="list-disc text-left">
            {materiels.map(materiel => (
              <li key={materiel}>{materiel}</li>
            ))}
          </ul>
        </td>
      </tr>
    ))}
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
  {loading ? 'En cours...' : 'Enregistrer en PDF'}
</button>

<button
  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
  onClick={closeRapport}
>
  Fermer
</button>

      </div>
    </div>
  </div>

)}

        </div>
    );
}
