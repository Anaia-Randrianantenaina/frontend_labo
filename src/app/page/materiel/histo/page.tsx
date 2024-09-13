"use client";
import { BiMessageAltError } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Result } from "postcss";
import Menu from "../menu/page";
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false })

export default function listeMateriel() {

  const [loading, setLoading] = useState(true);

  function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  const SoityAjout = () => {
    Swal.fire({
      title: 'VOUS ETES SUR?',
      text: "Vous annuler cette ajout",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Retour',
      confirmButtonText: 'Oui, Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '../../liste'
      }
    });
  };

  // Definition de l'interface pour les données de l'historique
  interface HistoriqueData {
    date: Date;
    description: string;
    action: string;
    nombre: number;
    quantite: string;
    ajoute: number;
    commentaire: string;
  }

  // Formes pour les historiques
  const [historiqueModif, setHistoriqueModif] = useState({
    date: null,
    description: "",
    action: "",
    nombre: null,
    quantite: "",
    ajoute: null,
    commentaire: ""

  })

  const columns = [
    {
      name: "Date",
      selector: (row: HistoriqueData) => row.date,
      sortable: true,
      width: "150px",
      cell: row => (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
          {row.date}
        </div>
      ),
    },
    {
      name: "ID du MATERIEL / RESSOURCE",
      selector: (row: HistoriqueData) => row.description,
      sortable: true,
      width: "400px",
    },
    {
      name: "Evènement",
      selector: (row: HistoriqueData) => row.action,
      sortable: true,
      width: "200px"
    },
    {
      name: "Nbr",
      selector: (row: HistoriqueData) => row.nombre,
      sortable: true,
      width: "90px"
    },
    {
      name: "Commentaire ",
      selector: (row: HistoriqueData) => row.commentaire,
      sortable: true,
    
    },
    {
      name: "Quantite ",
      selector: (row: HistoriqueData) => row.quantite,
      sortable: true,
      width: "200px"
    },
  ]

  // const data = [
  //   {
  //     date: "12/01/2010", id: "Microscope_1", ev: "Ajout", etat: "Bonne", qt: "Aucun(e) ",
  //     action: <button className="cursor-pointers opacity-0.5" >
  //       <Image
  //         onClick={() => tog(id)}
  //         className=""
  //         src="/pic/eye_30px.png"
  //         alt="Next.js Logo"
  //         width={22}
  //         height={30}
  //       />
  //     </button>
  //   }
  // ]

  // États pour stocker les données, les états de chargement, et la visibilité des modaux
  const [data, setData] = useState<HistoriqueData[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [date_1, setDate_1] = useState("");
  const [date_2, setDate_2] = useState("");

  const filterData = data.filter(row => {
    return (
      row.description.toLowerCase().includes(searchTerm.toLowerCase())  // Terme de recherche 1 pour le nom
      // new Date(row.date) > new Date(date_1) &&  // Terme de recherche 2 pour l'unité
      // new Date(row.date) < new Date(date_1)  // Terme de recherche 3 pour la date de prescription
    );
  });



//   const recherche1 = () =>{
//     setData( data.filter(historique => {
//   return (historique.description.toLocaleLowerCase().includes(searchTerm) &&
//     (new Date(historique.date) > new Date(date_1)) &&
//     (new Date(historique.date) < new Date(date_2))
//   )
// }))
// }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  }

  const handleDate_1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate_1(e.target.value.toLowerCase());
  }

  const handleDate_2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate_2(e.target.value.toLowerCase());
  }

  



  // Affichage des listes des materiels: 
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/historique/liste');

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const result = await response.json();
      console.log("Données récupérées :", result);
      setData(result);

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    fetchData();
    setIsClient(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Délai de 2 secondes pour simuler le chargement des données
  }, [])

  //Pagination
  const page = {
    rowsPageText: 'Lignes par pages : ',
    rangesSeparatorText: 'de',
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Tous'
  }


  const id = ""
  const [materiel, setMateriel] = useState({
    nom: "",
    nombre: "",
  });
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show5, setShow5] = useState(false);

  const tog = async (id) => {
    setShow(!show);
  }

  const tog1 = async (id) => {
    setShow1(!show1);
  }

  const lien = async (e) => {
    e.preventDefault()
    window.location.href = `../materiel/ajout/${materiel.nom}/${materiel.nombre}`
  }


  const ressourcePage = async (id) => {
    setShow5(!show5);
    window.location.href = '../ressource/liste'
  }

  const materielPage = async (id) => {
    setShow5(!show5);
    window.location.href = '../materiel/liste'
  }
  return (
    <>

      <div className="flex">
        <Navbar />
        <div className="w-full h-[100vh] p-2">

         <div><Menu/></div>
          <div className="w-full h-[2%]"></div>

          <div className="w-full h-[85%] shadow-md rounded">
            <div className=" text-start px-5 mt-7">
              {/* <Link href="../materiel/liste"> */}
              <button onClick={() => materielPage(id)} className=" w-[15%] border  px-5 py-1 rounded text-gray-400 bg-gray-100
   hover:bg-gray-700  hover:text-white">
                <h1>MATERIEL</h1>
              </button>
              {/* </Link>
              <Link href="../ressource/liste"> */}
              <button onClick={() => ressourcePage(id)} className="border w-[15%]  mx-4 px-5 py-1 text-gray-400 rounded bg-gray-100
   hover:bg-gray-700 hover:text-white">
                <h1>RESSOURCE</h1>
              </button>
              {/* </Link> */}
              {/* <Link href=""> */}
              <button className="border-green-800 border w-[15%]  px-5 py-1  rounded 
   hover:bg-gray-700 hover:text-white">
                <h1> HISTORIQUE </h1>
              </button>
              {/* </Link> */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="mx-[5%] py-2 px-2 w-[90%] mt-4 h-[65%] rounded border-gray-50">
                  {
                    isClient && (
                      <div>
                        <div className="flex justify-center items-center">
                          <button className="w-[100%]  py-2 text-center rounded-sm bg-green-700 text-white"> HISTORIQUE PERSONNALISEE </button>
                        </div>
                        <div className="flex justify-center items-center my-2">
                         
                            <TextField required className="mx-[5%] my-[1%] w-[40%] z-0" label="Nom du Materiel/Ressource" name="searchTerm" value={searchTerm} onChange={handleSearchChange} variant="outlined" />

                            {/* <TextField type="date" required name="date_1" value={date_1} onChange={handleDate_1} variant="outlined" className="mx-[5%] my-[1%] w-[30%]" />

                            <label>Au</label>

                            <TextField type="date" required className="mx-[5%] my-[1%] w-[30%]" name="date_2" value={date_2} onChange={handleDate_2} variant="outlined" /> */}

                            {/* <button onClick={() => recherche()}  className="border-blue-600 border text-center w-[12%] py-2 rounded text-white bg-blue-600 mr-[5%] "> Afficher </button>

                            <button onClick={() => recherche1()}  className="border-gray-600 border text-center flex justify-center w-[12%] py-2 rounded text-white bg-gray-600 mr-[2%] ">  <Image
                    className="mx-4"
                    src="/pic/refresh_24px.png"
                    alt="Next.js Logo"
                    width={20}
                    height={30}
                  /> </button> */}

                        </div>
                      </div>
                    )
                  }
                </div>
              )}


            </div>
            <div className="mx-[5%] py-2 px-2 overflow-auto w-[90%] mt-4 h-[60%] rounded border">
              {
                isClient && (
                  <DataTable
                    columns={columns}
                    data={searchTerm ? filterData : data}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5]}
                    paginationComponentOptions={page}
                  />
                )
              }
            </div>
          </div>



        </div>

        {/* Chargement avant l'affichage du page suivant */}
        {show5 && (
          <div id="modal" className="h-[100%] w-[100%] fixed top-0 left-0 flex bg-white bg-opacity-25 justify-center items-center backdrop-blur-sm">
            {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
             <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-500"  fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="40" cy="40" r="38" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg> */}

            {/* <div className="flex justify-center items-center space-x-1">
  <div className="w-1 h-6 bg-blue-500 animate-pulse"></div>
  <div className="w-1 h-6 bg-blue-500 animate-pulse animation-delay-200"></div>
  <div className="w-1 h-6 bg-blue-500 animate-pulse animation-delay-400"></div>
</div> */}
            <div class="flex justify-center items-center">
              <div class="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              <div class="w-4 h-4 bg-blue-500 rounded-full mx-8 animate-ping animation-delay-200"></div>
              <div class="w-4 h-4 bg-red-500 rounded-full animate-ping animation-delay-400"></div>
            </div>
          </div>

        )
        }
      </div>
    </>
  )
}