"use client";

import {
  Button,
  Chip,
  Avatar,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import {
  BsFillPencilFill,
  BsFillPrinterFill,
  BsPersonFillAdd,
} from "react-icons/bs";
import { FaFileExport, FaUserEdit, FaUserMd } from "react-icons/fa";
import {
  IoIosRefreshCircle,
  IoMdEye,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbClipboardList } from "react-icons/tb";
import { MdDelete, MdSave } from "react-icons/md";
import Navbar from "@/app/navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

export default function MedecinE() {
  //ilaina amny tsa mampihetsika anle page refa actualisena
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    affichage()

    setTimeout(()=> {
      setLoading(false);
    }, 1000)
  }, []);

  //Modal d'ajout
  const [showModal, setShowModal] = useState(false);

  //Modal modification
  const [showModi, setShowModi] = useState(false);

  //DONNEE
  const [donnee, setDonnee] = useState<MedecinData[]>([]);

  //LOADING
  const [loading, setLoading] = useState(true);

  // Notification de succès
  const message = () => toast.success('Préscripteur local enregistré', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: ()=> setShowModal(false)
});

// Notification d'erreur
const messageErreur = () => toast.error("Préscripteur local non enregistré", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

  //message de modification reussit
  const messageMod = () => toast.success('Préscripteur externe modifié', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: () => setShowModi(false)
});

// message de modification echec
const messageErreurr = () => toast.error("Préscripteur local non modifié", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

  //declaration variable ajout
  const [ajoutValue, setAjoutValue] = useState({
    id: "",
    nomME: "",
    contact: "",
    adresseME: ""
  })

  //declaration variable modification
  const [formeValues, setFormeValues] = useState({
    id: "",
    nomME: "",
    contact: "",
    adresseME: ""
  })

  interface MedecinData{
    id: string,
    nomME: string,
    contact: string,
    adresseME: string
  }

   //afahana manoratra anaty modification
   const InputeChangeMod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormeValues({
        ...formeValues,
        [name]: value
    });
  }

  //AFAHANA MANORATRA ANATY INPUT MISY VALEUR ajout
  const InputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setAjoutValue({
      ...ajoutValue,
      [name]: value
  });
}

  //iaina aminah modification
  const [selectedMedecinexterne, setSelectedMedecinexterne] = useState<MedecinData | null>(null);

  const modd = (mod: MedecinData)=>{
    setSelectedMedecinexterne(mod);
    setFormeValues(mod)
    setShowModi(true)
  }

  //FONCTION D'AJOUT
  const save = async(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3001/Medecinexternes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ajoutValue),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du nouvel hospitalisé');
        }

        const result = await response.json();
        console.log("Prescripteur externe enregistré: ", result)
        setDonnee([...donnee, result]);

        setAjoutValue({
          id: "",
          nomE: "",
          contact: "",
          adresseE: ""
      });
      message()
      affichage()
    } 
    catch (error) {
      console.log("Erreur lors de l'enregistrement de prescripteur: ", error) 
      messageErreur() 
    }
  }

  //FONCTION D'AFFICHAGE
  const affichage = async()=>{
    try {
      const response = await fetch('http://localhost:3001/Medecinexternes');
        if(!response.ok){
          throw new Error("Error de reseau")
        }

        const result = await response.json();
        console.log("Donnee recuperee: ", result)
        setDonnee(result)
    } 
    catch (error) {
      console.log("Erreur lors d'affichage de donnee prescripteur exrene: ", error)
    }
  }

  //FONCTION DE SUPPRESSION
  const suppression = async(id: string)=>{
    const result = await Swal.fire({
      title: "Vous voullez supprimer le prescripteur externe qui a l'id': "+id,
      text: "Suppression préscripteur externe",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer'
    });
    if(result.isConfirmed){
      try {
        const response = await fetch(`http://localhost:3001/Medecinexternes/${id}`,{
          method: 'DELETE',
        });
        
        if(response.ok){
          Swal.fire(
            'Préscripteur externe qui a l id '+id +' supprimmé',
            'Suppression de prescripteur local',
            'success'
          );
        }
        setDonnee(donnee.filter(medecinexterne=> medecinexterne.id !== id));
        affichage()
      } 
      catch (error) {
        Swal.fire(
          'Erreur lors de la suppression de prescripteur externe!',
          'Suppression prescripteur externe',
          'error'
        );
      }
    }
  }

  //FONCTION MODIFICATION
  const modification = async(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if (!selectedMedecinexterne) return;

    try {
      const response = await fetch(`http://localhost:3001/Medecinexternes/${selectedMedecinexterne.id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formeValues),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Prescipteur local modifié: ", result);

      setDonnee(donnee.map(medecinexterne => medecinexterne.id === result.id ? result : medecinexterne));

      setFormeValues({
        id: "",
        nomE: "",
        adresseE: "",
        contact: "",
      });
      messageMod();
      affichage();
    } 
    catch (error) {
      console.log("Erreur lors de modification de prescripteur externe: ", error)
      messageErreurr();
    }
  }

  //recherche
  const [searchT, setSearcht] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearcht(e.target.value.toLowerCase());
  };

  const filterDonne = donnee.filter(medecinexterne => {
    return medecinexterne.id.toLocaleLowerCase().includes(searchT) ||
           medecinexterne.nomME.toLocaleLowerCase().includes(searchT) ||
           medecinexterne.contact.toLocaleLowerCase().includes(searchT) ||
           medecinexterne.adresseME.toLocaleLowerCase().includes(searchT)
  });

  //TABLEAUX
  const columns = [
    {
      name: "Id",
      selector: (row: MedecinData) => row.id,
      sortable: true,
      width: "200px",
    },
    {
      name: "Nom",
      selector: (row: MedecinData) => row.nomME,
      sortable: true,
      width: "350px",
    },
    {
      name: "Contact",
      selector: (row: MedecinData) => row.contact,
      width: "200px",
    },
    {
      name: "Adresse",
      selector: (row: MedecinData) => row.adresseME,
      width: "200px",
    },
    {
      name: "Action",
      cell: (row: MedecinData) => (
        <div className="flex">
          <div className="bg-white mr-[6px] w-[25px] h-[25px] pt-1 pl-[6px] rounded hover:bg-gray-200 transition duration-150 cursor-pointer">
            <BsFillPencilFill
              className="text-[15px] mr-2"
              onClick={() => modd(row)}
            />
          </div>
          <div onClick={()=> suppression(row.id)} className="bg-white w-[25px] h-[25px] pt-1 pl-1 rounded hover:bg-red-100 transition duration-150 cursor-pointer">
            <MdDelete className="text-red-500 text-[18px] mr-2" />
          </div>
        </div>
      ),
      width: "100px",
    },
  ];

  // Pagination amn tableaux
  const paginationOptions = {
    rowsPerPageText: "Lignes par page:",
    rangeSeparatorText: "de",
    selectAllRowsItem: false,
    selectAllRowsItemText: "Tous",
  };

   //exporter en EXCEL
   const exporte = () => {
    const ws = XLSX.utils.json_to_sheet(donnee);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Préscripteur externe");
    XLSX.writeFile(wb, "prescripteur_externe.XLSX");
  };

  function LoadingSpiner(){
    return(
      <div className="text-center mt-24">
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black border-opacity-75"></div>
        </div>
        <p className="mt-5 text-[12px]">Chargement du donnée</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-slate-50 flex">
        <Navbar />

        <div className="w-full h-[100vh] p-2">
          <div className="w-full h-[7%] shadow-md bg-white rounded">
            <ul className="flex pt-3">
              <li className="bg-green-50 rounded-md bg-opacity-45 w-[100px] hover:bg-green-100 hover:scale-110 transition duration-150  ml-3 text-center mr-2">
                <Link href="/page/patient/hospitalise">
                  <span className="font-medium text-[12px] text-green-950">
                    Patients
                  </span>
                </Link>
              </li>
              <li className="bg-green-50 rounded-md bg-opacity-45 w-[100px] hover:bg-green-100 hover:scale-110 transition duration-150 text-center mr-2">
                <Link href="/page/patient/analyse" className="">
                  <span className="font-medium text-[12px] text-green-950">
                    Analyses
                  </span>
                </Link>
              </li>
              <li className="bg-green-500 rounded-md bg-opacity-45 w-[100px] text-center mr-2">
                <Link href="/page/patient/medecin" className="">
                  <span className="font-medium text-[12px] text-green-950">
                    Préscripteurs
                  </span>
                </Link>
              </li>
              <li className="bg-green-50 rounded-md bg-opacity-45 w-[100px] hover:bg-green-100 hover:scale-110 transition duration-150  text-center">
                <Link href="" className="">
                  <span className="font-medium text-[12px] text-green-950">
                    Archives
                  </span>
                </Link>
              </li>
              <p className="flex ml-[52%]">
                <button>
                  <IoMdNotificationsOutline className="text-[22px] mr-3" />
                </button>
                <button>
                  <Chip
                    className="mt-[-7px] cursor-pointer mr-4"
                    avatar={<Avatar></Avatar>}
                    label="Utilisateur"
                  />
                </button>
              </p>
            </ul>
          </div>

          <div className="w-full h-[2%]"></div>

          <div className="w-full h-[91%] shadow-md bg-white rounded-md">
          <div className="pt-5">
            <ul className="flex">
              <li className="ml-3 mr-2">
                <Link href="/page/patient/medecin">
                  <span className="border-b-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition duration-200 text-gray-600 mr-1 flex text-[14px] font-sans">
                    Locals
                  </span>
                </Link>
              </li>
              <li className="mr-[70%]">
                <Link href="/page/patient/medecinE">
                  <span className="border-b-2 border-blue-600 text-blue-600 mr-1 flex text-[14px] font-sans">
                    Externes
                  </span>
                </Link>
              </li>
              <li>
                <Button
                  className="h-[35px] w-[200px] text-white shadow-none mr-2 bg-green-500 hover:bg-green-600"
                  type="submit"
                  onClick={() => setShowModal(true)}
                >
                  <BsPersonFillAdd className="mr-2 text-[18px]" />
                  <span className="text-[12px] pt-1 font-semibold">Nouvel précripteur</span>
                </Button>
              </li>
            </ul>
          </div>

          {/* LISTE DES HOSPITALISES */}
          <div className="flex mt-5 ml-4">
            <div className="bg-gray-400 rounded-[20px] w-10 h-10">
              <div className="mt-2 ml-[1px]">
                <TbClipboardList className="text-gray-950 ml-[6px] text-[25px]" />
              </div>
            </div>
            <p className="ml-2 mt-2 font-sans">
              Listes des préscripteurs externes:
            </p>
          </div>

          <div className="flex mt-4 ml-10">
            <input
              type="text"
              onChange={handleSearchChange}
              className="search-input text-[10px] ml-5 block w-[200px] h-[35px] pl-3 pr-3 py-2 border border-gray-300 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Recherche..."
            />
            <Button onClick={()=> exporte()} className="w-[100px] h-[35px] ml-3 bg-gray-700 hover:bg-slate-600 text-white">
              <FaFileExport className="text-[18px]" />
              <span className="ml-1 text-[11px]">Exporter</span>
            </Button>
          </div>

          {loading ? (
                <LoadingSpiner/>
            ): (
                  <div className="w-[90%] h-[50%] ml-12 mt-8">
                    {isClient && (
                     <DataTable
                     columns={columns}
                     data={searchT ? filterDonne : donnee}
                     // selectableRows
                     pagination
                     paginationPerPage={5}
                     paginationRowsPerPageOptions={[5]}
                     paginationComponentOptions={paginationOptions}
                   /> 
                )}
            </div>
            )}

        {/* MODAL MODI */}
        {showModi && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={modification}>
              <div className="bg-white w-[550px] h-[330px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() => setShowModi(false)}
                >
                  X
                </button>
                <div className="flex ml-4">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <FaUserEdit className="text-green-700 ml-[8px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Mise à jour du préscripteur externe
                  </p>
                  <br />
                </div>

                <hr className="w-[200px] ml-[170px] mt-5" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      name="ide"
                      value={formeValues.id}
                      onChange={InputeChangeMod}
                      label="ID*"
                      variant="outlined"
                      className="mt-3 ml-10"
                    />
                    <TextField
                      name="nomME"
                      value={formeValues.nomME}
                      onChange={InputeChangeMod}
                      label="Nom*"
                      variant="outlined"
                      className="mt-3 ml-10"
                    />
                    <TextField
                      name="contact"
                      value={formeValues.contact}
                      onChange={InputeChangeMod}
                      label="Contact*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="adresseME"
                      value={formeValues.adresseME}
                      onChange={InputeChangeMod}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]">
                      <IoIosRefreshCircle className="text-[20px] ml-1 mr-1" />
                      <span className="text-[12px]">Modifier</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <ToastContainer/>
          </div>
        )}

        {/* MODAL AJOUT */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={save}>
              <div className="bg-white w-[550px] h-[330px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() => setShowModal(false)}
                >
                  X
                </button>
                <div className="flex ml-4">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <FaUserMd className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Nouvel préscripteur externe
                  </p>
                  <br />
                </div>

                <hr className="w-[200px] ml-[170px] mt-5" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      name="id"
                      value={ajoutValue.id}
                      onChange={InputeChange}
                      label="ID*"
                      variant="outlined"
                      className="mt-3 ml-10"
                    />
                    <TextField
                      name="nomME"
                      value={ajoutValue.nomME}
                      onChange={InputeChange}
                      label="Nom*"
                      variant="outlined"
                      className="mt-3 ml-10"
                    />
                    <TextField
                      name="contact"
                      value={ajoutValue.contact}
                      onChange={InputeChange}
                      label="Contact*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="adresseME"
                      value={ajoutValue.adresseME}
                      onChange={InputeChange}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]">
                      <MdSave className="text-[15px] ml-1 mr-1" />
                      <span className="text-[12px]">Enregistrer</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <ToastContainer/>
          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
}
