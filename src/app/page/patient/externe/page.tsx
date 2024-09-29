"use client";

import { MdDelete, MdSave } from "react-icons/md";
import { FaFileExport, FaUserEdit } from "react-icons/fa";
import {
  BsFillEyeFill,
  BsFillPencilFill,
  BsFillPrinterFill,
  BsPersonFillAdd,
  BsQrCode,
} from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import {
  IoIosRefreshCircle,
  IoMdEye,
  IoMdNotificationsOutline,
} from "react-icons/io";
import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { TextField, Chip, Avatar, Menu } from "@mui/material";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { IoInformationCircle } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "@/app/navbar/navbar";
import { Input, Select } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import Menuu from "../menu/page";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
const Button = dynamic(
  () => import("@mui/material").then((mod) => mod.Button),
  {
    ssr: false,
  }
);

export default function Externe() {
  //ilaina amny tsa mampihetsika anle page refa actualisena
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    fetchMaxNum();
    fetchData();
  }, []);

  //MODAL d'ajout patieent
  const [showModale, setShowModale] = useState(false);

  //MODAL DE MODIFICATION
  const [showModie, setShowModie] = useState(false);

  //MODAL DE VUE
  const [showVuee, setShowVuee] = useState(false);

  //MODAL DE QR CODE
  const [showQrc, setShowQrc] = useState(false);

  //CONTENU QRCODE
  const [infoExterne, setInfoExterne] = useState({
    numero: "",
    nom: "",
    adresse: "",
    sexe: "",
    age: "",
  });

  //incrimentation num
  const [count, setCount] = useState(0);

  //recuperation ana donnée
  const [donnee, setDonnee] = useState<ExterneData[]>([]);

  //declaration date
  const [selectDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [Age, setAge] = useState<string | null>(null);

  //calendrier
  const currentDate = dayjs();

  // Notification de succès
  const message = () => toast.success('Patient externe enregistré', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: ()=> setShowModale(false)
});

// Notification d'erreur
const messageErreur = () => toast.error("Patient externe non enregistré", {
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
  const messageMod = () => toast.success('Patient externe modifié', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: () => setShowModie(false)
});

// message de modification echec
const messageErreurr = () => toast.error("Patient externe non modifié", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});


   // Information pour les données des hospitalisés
   interface ExterneData {
    numE: string,
    nomE: string,
    prenomE: string,
    sexeE: string,
    adresseE: string,
    ageE: string,
    date_naissE: Date,
    date_ajoutE: string
}

// État pour les valeurs du formulaire
const [formeValues, setFormeValues] = useState({
    numE: "",
    nomE: "",
    prenomE: "",
    sexeE: "",
    adresseE: "",
    ageE: "",
    date_naissE: "",
    date_ajoutE: ""
});

const [valueAjout, setValueAjout] = useState({
  numE: "",
  nomE: "",
  prenomE: "",
  sexeE: "",
  adresseE: "",
  ageE: "",
  date_naissE: "",
  date_ajoutE: ""
})

// Fonction pour calculer l'âge
const calculateAge = (date: dayjs.Dayjs) => {
  const today = dayjs();
  return today.year() - date.year();
}

// Mise à jour de la date sélectionnée et calcul de l'âge pour l'ajout
const handleDateChange = (newValue: dayjs.Dayjs | null) => {
setSelectedDate(newValue);
if (newValue) {
  const age = calculateAge(newValue);
  setAge(age.toString());
  setValueAjout(prevValues => ({
    ...prevValues,
    ageE: age.toString(),
    date_naissE: newValue.format('DD-MM-YYYY')
  }));
}
}

//Mise à jour de la date selectionnée et calcul de l'age pour la modification
const handleDateModi = (newValue: dayjs.Dayjs | null) =>{
setSelectedDate(newValue);
if(newValue){
  const age = calculateAge(newValue);
  setAge(age.toString());
  setFormeValues(prevValues =>({
    ...prevValues,
    ageE: age.toString(),
    date_naissE: newValue.format('DD-MM-YYYY')
  }))
}
}

// Fonction pour le changement de l'input
const InputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setValueAjout({
      ...valueAjout,
      [name]: value
  });
}

//Fonction pourqu'on peut saisir dans l'input de modification
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
  const { name, value } = e.target;
    setFormeValues({
      ...formeValues,
      [name]: value
    });
}

//declaration recherche
const [searchT, setSearcht] = useState('');

//ialaina amn vue sy qrcode aty modification, mtransporte ny donnée ao anaty modal
const [selectExterne, setSelectexterne] = useState<ExterneData | null>(null);

//FONCTION DE VUE mtransporte donnee anaty modal vue
const vuee = (externe: ExterneData)=>{
  setSelectexterne(externe);
  setFormeValues(externe) 
  setShowVuee(true)
}

//FONCTION DE QR CODE mtransporte donnee anaty modal qr
const qrr = (e: ExterneData)=>{
  setSelectexterne(e);
  setFormeValues(e)
  setShowQrc(true)
}

//FONCTION DE MODI mtransporte donnee anaty modifiaction
const modd = (mod: ExterneData)=>{
  setSelectexterne(mod);
  setFormeValues(mod)
  setShowModie(true)
}

//recuperation dernier numero dans la base de donnée
 const [maxNum, setMaxNum] = useState<number | 0>(0);
 const fetchMaxNum  = async()=>{
   try {
     const response = await fetch('http://localhost:3001/externes/max/numE')
       if(!response.ok){
         throw new Error("Error de reseau")
       }

       const resultt = await response.json();
       console.log("Donnees recuperes: ", resultt)
       setMaxNum(resultt)
   } 
   catch (error) {
     console.log("Erreur lors de l'affichage de derinier numero: ", error)
   }
 }

//FONCTION D AFFICHAGE DES DONNEES
const fetchData = async()=>{
  try {
    const response = await fetch('http://localhost:3001/externes');
    if(!response.ok){
        throw new Error("Error de reseau")
    }

    const resultt = await response.json();
    console.log("Donnees recuperes: ", resultt)
    setDonnee(resultt)
  } 
  catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

// FONCTION D'AJOUT
const save = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Mettre à jour le numéro de patient
    const newCount = maxNum + 1;
    const dateAnio = dayjs();
    const nouvelValeur = {...valueAjout, numE: newCount.toString(), date_ajoutE: dayjs().format('DD-MM-YYYY')};
    setCount(newCount);

    try {
      const response = await fetch('http://localhost:3001/externes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(nouvelValeur),
      });

      if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du nouvel externe');
      }

      const result = await response.json();
      console.log("Nouvel hospitalisé ajouté :", result);

      setDonnee([...donnee, result]);

      // Réinitialiser les valeurs du formulaire
      setValueAjout({
          numE: "",
          nomE: "",
          prenomE: "",
          sexeE: "",
          adresseE: "",
          ageE: "",
          date_naissE: "",
          date_ajoutE: ""
      });
      setMaxNum(maxNum +1)
      setSelectedDate(null)
      message();
  }
   catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      messageErreur();
  }
}

//FONCTION MODIFICATION
const modification = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectExterne) return;

  try {
    const response = await fetch(`http://localhost:3001/externes/${selectExterne.numE}`, {
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
    console.log("Externe modifié: ", result);

    setDonnee(donnee.map(externe => externe.numE === result.numE ? result : externe));

    setFormeValues({
      nomE: "",
      prenomE: "",
      sexeE: "",
      adresseE: "",
      ageE: "",
      date_naissE: ""
    });
    setSelectedDate(null)
    messageMod();
    fetchData(); 
  }
  catch (error) {
    console.error("Erreur lors de la modification: ", error);
    messageErreurr(); // Affiche le message d'erreur
  }
};

//FONCTION DE SUPPRESSION
const suppression = async (numE: string) =>{
  const result = await Swal.fire({
    title: "Vous voullez supprimer le patient externe numero: "+numE+"E",
    text: "Suppression de patient externe",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Supprimer'
  });
  if(result.isConfirmed){
    try {
      const response = await fetch(`http://localhost:3001/externes/${numE}`,{
        method: 'DELETE',
      });
      
      if(response.ok){
        Swal.fire(
          "Patient hospitalié numero: "+numE+"E"+" supprimmé",
          'Suppression de patient externe',
          'success'
        );
      }
      setDonnee(donnee.filter(externe=> externe.numE !== numE));
      window.location.reload();
      fetchData()
    } 
    catch (error) {
      Swal.fire(
        'Erreur lors de la suppression!',
        'Suppression de patient externe',
        'error'
      );
    }
  }
}

//RECHERCHE
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearcht(e.target.value.toLowerCase());
};

const filterDonne = (donnee: ExterneData[]) => {
  if (!searchT.trim()) {
    return donnee; // Si le champ de recherche est vide, renvoyer toutes les données
  }

  return donnee.filter(externe => {
    return externe.adresseE.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
          externe.nomE.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
          externe.prenomE.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
          externe.sexeE.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
          externe.numE.toString().includes(searchT);
  });
};

//REHCERHCE A PARTIR DE SELECT
const [selectData, setSelectData] = useState<string>('option2'); //par defaut androanY
const [filteredData, setFilteredData] = useState<ExterneData[]>([]);

const selecta = () => {
  const anio = dayjs().format('DD-MM-YYYY');
  let dataToDisplay = donnee;

  if (selectData === 'option1') {
    dataToDisplay = filterDonne(donnee);
  } 
  else if (selectData === 'option2') {
    dataToDisplay = donnee.filter(externe => externe.date_ajoutE === anio);
    dataToDisplay = filterDonne(dataToDisplay);
  }
  setFilteredData(dataToDisplay);
}

  //apesaina amn'ny donnee anaty selecta
  useEffect(() => {
    selecta();
  }, [selectData, searchT, donnee]);

  // TABLEAUX avec données
  const columns = [
    {
      name: "N°",
      selector: (row: ExterneData) => row.numE+"E",
      sortable: true,
      width: "100px",
    },
    {
      name: "Nom",
      selector: (row: ExterneData) => row.nomE,
      sortable: true,
      width: "250px",
    },
    {
      name: "Prénom",
      selector: (row: ExterneData) => row.prenomE,
    },
    {
      name: "Sexe",
      selector: (row: ExterneData) => row.sexeE,
      width: "100px",
    },
    {
      name: "QR Code",
      cell: (row: ExterneData) => (
        <div className="bg-white w-[30px] ml-[10px] h-[30px] pt-[6px] pl-[6px] rounded hover:bg-slate-200 transition duration-150 cursor-pointer">
          <BsQrCode className="text-[18px]" onClick={() => qrr(row)} />
        </div>
      ),
    },
    {
      name: "Adresse",
      selector: (row: ExterneData) => row.adresseE,
      width: "150px",
    },
    {
      name: "Date naissance",
      selector: (row: ExterneData) => row.date_naissE,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row: ExterneData) => (
        <div className="flex">
          <div className="bg-white mr-[6px] w-[25px] ml-1 h-[25px] pt-1 pl-1 rounded hover:bg-sky-200 transition duration-150 cursor-pointer">
            <IoMdEye
              className="text-sky-700 text-[18px] mr-2"
              onClick={() => vuee(row)}
            />
          </div>
          <div className="bg-white mr-[6px] w-[25px] h-[25px] pt-1 pl-[6px] rounded hover:bg-gray-200 transition duration-150 cursor-pointer">
            <BsFillPencilFill
              className="text-[15px] mr-2"
              onClick={() => modd(row)}
            />
          </div>
          <div className="bg-white w-[25px] h-[25px] pt-1 pl-1 rounded hover:bg-red-100 transition duration-150 cursor-pointer">
            <MdDelete 
            onClick={() => suppression(row.numE)}
            className="text-red-500 text-[18px] mr-2" />
          </div>
        </div>
      ),
    },
  ];

  // Pagination amn tableaux
  const paginationOptions = {
    rowsPerPageText: "Lignes par page:",
    rangeSeparatorText: "de",
    selectAllRowsItem: false,
    selectAllRowsItemText: "Tous",
  };

  //EXPORTER EN EXCEL
  const exporte = () => {
    const ws = XLSX.utils.json_to_sheet(donnee);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient externe");
    XLSX.writeFile(wb, "Patient_externe.XLSX");
  };

  const [showHos, setShowHos] = useState(false);
  const pageHos = (id: number) => {
    setShowHos(!showHos);
    window.location.href = "/page/patient/hospitalise";
  }

  return (
    <>
      <div className="bg-slate-50 flex">
        <Navbar />

        <div className="w-full h-[100vh] p-2">
          {/* MENU AMBONY EO INY */}
          <div>
          <Menuu />
        </div>
          <div className="w-full h-[2%]"></div> {/*Tsa kitiana*/}
          <div className="w-full h-[91%] shadow-md bg-white rounded">
            {/*Contenu*/}
            <div className="pt-5">
              <ul className="flex">
                <li className="ml-3 mr-2">
                <button onClick={() => pageHos(1)}>
                    <span className="border-b-2 hover:border-blue-500 hover:text-blue-500 transition duration-200 border-gray-300 text-gray-600 mr-1 flex text-[14px] font-sans">
                      Hospitalisés
                    </span>
                  </button>
                </li>
                <li className="mr-[71%]">
                  <Link href="">
                    <span className="border-b-2 border-blue-600 text-blue-600 mr-1 flex text-[14px] font-sans">
                      Externes
                    </span>
                  </Link>
                </li>
                <li>
                  <Button
                    className="h-[35px] w-[200px] text-white shadow-none mr-2 bg-green-600 hover:bg-green-600"
                    type="submit"
                    onClick={() => setShowModale(true)}
                  >
                    <BsPersonFillAdd className="mr-2 text-[18px]" />
                    <span className="text-[12px] pt-1 font-semibold">
                      Nouvel patient
                    </span>
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
                Listes des patients externes:
              </p>
            </div>

            <div className="flex mt-4 ml-10">
              <Select className="w-[200px] h-[35px] ml-3 mr-3" 
                  value={selectData}
                  onChange={value => setSelectData(value)}
              >
                <option value="option1">Tous</option>
                <option value="option2">Ajourd'hui</option>
              </Select>

              <Input
                type="text"
                className="w-[200px] h-[35px]"
                placeholder="Recherche..."
                onChange={handleSearchChange}
                value={searchT}
              />

              <Button onClick={()=> exporte()} className="w-[100px] h-[35px] ml-3 bg-gray-700 hover:bg-slate-600 text-white">
                <FaFileExport className="text-[18px]" />
                <span className="ml-1 text-[11px]">Exporter</span>
              </Button>
            </div>

            <div className="w-[90%] h-[50%] ml-12 mt-8">
              {isClient && (
                <DataTable
                  columns={columns}
                  // data={donnee}
                  // selectableRows
                  data={filteredData}
                  pagination
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5]}
                  paginationComponentOptions={paginationOptions}
                />
              )}
            </div>
          </div>
        </div>

        {/* MODAL D'AJOUT */}
        {showModale && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={save}>
              <div className="bg-white w-[550px] h-[380px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowModale(false), setValueAjout({
                    numE: "",
                    nomE: "",
                    prenomE: "",
                    sexeE: "",
                    adresseE: "",
                    ageE: "",
                    date_naissE: "",
                    date_ajoutE: ""
                }),setSelectedDate(null)}}
                >
                  X
                </button>
                <div className="flex ml-4">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <BsPersonFillAdd className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Nouveau patient Externe
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      name="nomE"
                      value={valueAjout.nomE}
                      onChange={InputeChange}
                      label="Nom*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenomE"
                      value={valueAjout.prenomE}
                      onChange={InputeChange}
                      label="Prénom"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="adresseE"
                      value={valueAjout.adresseE}
                      onChange={InputeChange}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexeE"
                      value={valueAjout.sexeE}
                      onChange={InputeChange}
                      label="sexe*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date de naissance*"
                        maxDate={currentDate}
                        sx={{ width: "210px" }}
                        className="mt-5 ml-10"
                        value={selectDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <br />
                    <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]">
                      <MdSave className="text-[15px] ml-1 mr-1" />
                      <span className="text-[12px]">Enregistrer</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ToastContainer/>
            </form>
          </div>
        )}

        {/* MODAL DE MODIFICATION */}
        {showModie && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={modification}>
              <div className="bg-white w-[550px] h-[380px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() => setShowModie(false)}
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
                    Mise à jour du patient Externe
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                
                    <TextField
                      name="nomE"
                      value={formeValues.nomE}
                      onChange={handleInputChange}
                      label="Nom*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenomE"
                      value={formeValues.prenomE}
                      onChange={handleInputChange}
                      label="Prénom"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="adresseE"
                      value={formeValues.adresseE}
                      onChange={handleInputChange}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexeE"
                      value={formeValues.sexeE}
                      onChange={handleInputChange}
                      label="sexe*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        onChange={handleDateModi}
                        label="Date de naissance*"
                        maxDate={currentDate}
                        minDate={currentDate}
                        sx={{ width: "210px" }}
                        className="mt-5 ml-10"
                      />
                    </LocalizationProvider>
                    <br />
                    <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]">
                      <IoIosRefreshCircle className="text-[20px] ml-1 mr-1" />
                      <span className="text-[12px]">Modifier</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ToastContainer/>
            </form>
          </div>
        )}

        {/* MODAL DE VUE */}
        {showVuee && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form>
              <div className="bg-white w-[550px] h-[450px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() => setShowVuee(false)}
                >
                  X
                </button>
                <div className="flex ml-4">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <BsFillEyeFill className="text-green-700 ml-[7px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    A propos du patient externes
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      name="numE"
                      value={formeValues.numE+"E"}
                      label="Numero*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="nomE"
                      value={formeValues.nomE}
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenomE"
                      value={formeValues.prenomE}
                      label="Prénom"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="adresseE"
                      value={formeValues.adresseE}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexeE"
                      value={formeValues.sexeE}
                      label="sexe*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="ageE"
                      value={formeValues.ageE}
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="ageE"
                      value={formeValues.ageE}
                      label="Age*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date de naissance*"
                        maxDate={currentDate}
                        minDate={currentDate}
                        sx={{ width: "210px" }}
                        className="mt-5 ml-10"
                      />
                    </LocalizationProvider>
                    <br />
                    <Button
                      onClick={() => {
                        setShowVuee(false), setShowQrc(true);
                      }}
                      className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]"
                    >
                      <BsQrCode className="text-[15px] ml-1 mr-1" />
                      <span className="text-[12px]">QR Code</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* MODAL DE QR Code */}
        {showQrc && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form className="flex">
              <div className="bg-white w-[550px] h-[450px] rounded">
                <div className="flex ml-4 mt-5">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 mr-[1px]">
                      <IoInformationCircle className="text-green-700 ml-[8px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Information sur le patient externe
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    <TextField
                      name="numE"
                      value={formeValues.numE+"E"}
                      label="Num*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="nomE"
                      value={formeValues.nomE}
                      label="Nom*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenomE"
                      value={formeValues.prenomE}
                      label="Prénom"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="adresseE"
                      value={formeValues.adresseE}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexeE"
                      value={formeValues.sexeE}
                      label="sexe*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="ageE"
                      value={formeValues.ageE}
                      label="Age*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="ageE"
                      value={formeValues.ageE}
                      label="Age*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date de naissance*"
                        minDate={currentDate}
                        sx={{ width: "210px" }}
                        className="mt-5 ml-10"
                      />
                    </LocalizationProvider>
                    <br />
                  </div>
                </div>
              </div>

              <div className="w-[300px] h-[450px] bg-white ml-3 rounded">
                <div className="ml-3">
                  <button
                    className="bg-white w-6 h-6 rounded-sm mt-1 mx-[260px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                    onClick={() => setShowQrc(false)}
                  >
                    X
                  </button>
                  <span className="flex">
                    <BsQrCode className="text-black ml-[8px] text-[25px]" />
                    <p className="ml-2 mt-[-3px] font-bold text-[22px]">
                      Son QR Code
                    </p>
                  </span>

                  <QRCodeCanvas
                    value={JSON.stringify(formeValues)}
                    size={150}
                    className="mt-16 ml-14 mb-16"
                  />

                  <Button className="text-white bg-green-800 hover:bg-green-700 ml-[58px] w-[150px] h-[35px]">
                    <BsFillPrinterFill className="text-[20px] ml-1 mr-1" />
                    <span className="text-[12px]">Imprimer</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {showHos && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </>
  );
}
