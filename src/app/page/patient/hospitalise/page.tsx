"use client";

import { BsFillPrinterFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IoIosRefreshCircle } from "react-icons/io";
import { MdDelete, MdSave } from "react-icons/md";
import { FaFileExport } from "react-icons/fa";
import { BsFillPencilFill, BsPersonFillAdd, BsQrCode } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { IoMdEye, IoMdNotificationsOutline } from "react-icons/io";
import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Button, TextField, Chip, Avatar, Box, Stack, Menu } from "@mui/material";
import dynamic from "next/dynamic";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IoInformationCircle } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import { Input, Select, Skeleton } from 'antd';
import Navbar from "@/app/navbar/navbar";
import Search from "antd/es/transfer/search";
import * as XLSX from "xlsx";
import Menuu from "../menu/page";
// import { Select, Input } from "antd";
// import Navbar from "@/app/navbar/navbar";

// const Navbar = dynamic(() => import("@/app/navbar/navbar"), { ssr: false });
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
const SelectComponent = dynamic(
  () => import("antd").then((mod) => mod.Select),
  { ssr: false }
);
const InputComponent = dynamic(() => import("antd").then((mod) => mod.Input), {
  ssr: false,
});

export default function Hospitalise() {
  //ilaina amny tsa mampihetsika anle page refa actualisena
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    fetchData();
    fetchMaxNum ();

    }, []);

  // Date actuelle
  const currentDate = dayjs();

  //recuperation ana donnée
  const [donnee, setDonnee] = useState<HospitaliseData[]>([]);

  // État pour la sélection de la date et l'âge calculé
  const [selectDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [Age, setAge] = useState<string | null>(null);

  // MODAL d'ajout patient
  const [showModal, setShowModal] = useState(false);

  //Modal de modification
  const [showModi, setShowModi] = useState(false);

  //Modal de VUE
  const [showVue, setShowVue] = useState(false);

  //Modal QR CODE
  const [showQr, setShowQr] = useState(false);

  //ILAINA REFA HANISY SPINER SY CHARGEMEN
  const [loading, setLoading] = useState(true);

  //ialaina amn vue sy qrcode aty modification, mtransporte ny donnée ao anaty modal
  const [selectedHospitalise, setSelectedHospitalise] = useState<HospitaliseData | null>(null);

  //incrimentation num
  const [count, setCount] = useState(0);

  //declaration recherche
  const [searchT, setSearcht] = useState('');

  //recuperation dernier numero
  const [dernierNum, setDernierNum] = useState<string | null>(null);

  // Notification de succès
  const message = () => toast.success('Patient hospitalisé enregistré', {
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
const messageErreur = () => toast.error("Patient hospitalisé non enregistré", {
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
  const messageMod = () => toast.success('Patient hospitalisé modifié', {
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
const messageErreurr = () => toast.error("Patient hospitalisé non modifié", {
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
  interface HospitaliseData {
    num: string,
    nom: string,
    prenom: string,
    service: string,
    sexe: string,
    adresse: string,
    age: string,
    date_naiss: Date,
    date_ajout: string
}

// État pour les valeurs du formulaire
const [formeValues, setFormeValues] = useState({
    num: "",
    nom: "",
    prenom: "",
    service: "",
    sexe: "",
    adresse: "",
    age: "",
    date_naiss: "",
    date_ajout: ""
});

const [valueAjout, setValueAjout] = useState({
    num: "",
    nom: "",
    prenom: "",
    service: "",
    sexe: "",
    adresse: "",
    age: "",
    date_naiss: "",
    date_ajout:""
})

// Fonction pour le changement de l'input
const InputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setValueAjout({
      ...valueAjout,
      [name]: value
  });
}

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
      age: age.toString(),
      date_naiss: newValue.format('DD-MM-YYYY')
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
      age: age.toString(),
      date_naiss: newValue.format('DD-MM-YYYY')
    }))
  }
}

//Fonction d'affichage et recuperation de donnée
const fetchData = async()=>{
  try {
    const response = await fetch('http://localhost:3001/hospitalises');
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
  finally {
    setLoading(false);
  }
};

//FONCTION DE VUE mtransporte donnee anaty modal vue
const vuee = (hospitaise: HospitaliseData)=>{
  setSelectedHospitalise(hospitaise);
  setFormeValues(hospitaise) 
  setShowVue(true)
}

//FONCTION DE QR CODE mtransporte donnee anaty modal qr
const qrr = (e: HospitaliseData)=>{
  setSelectedHospitalise(e);
  setFormeValues(e)
  setShowQr(true)
}

//FONCTION DE MODI mtransporte donnee anaty modifiaction
const modd = (mod: HospitaliseData)=>{
  setSelectedHospitalise(mod);
  setFormeValues(mod)
  setShowModi(true)
}

//Fonction pourqu'on peut saisir dans l'input de modification
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
  const { name, value } = e.target;
    setFormeValues({
      ...formeValues,
      [name]: value
    });
}

 //recuperation dernier numero dans la base de donnée
 const [maxNum, setMaxNum] = useState<number | 0>(0);
 const fetchMaxNum  = async()=>{
   try {
     const response = await fetch('http://localhost:3001/hospitalises/max/num')
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

// FONCTION D'AJOUT
const save = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Mettre à jour le numéro de patient
    const newCount = maxNum + 1;
    const dateAnio = dayjs();
    const updatedFormValues = {...valueAjout, num: newCount.toString(), date_ajout: dayjs().format('DD-MM-YYYY')};
    setCount(newCount);

    try {
      const response = await fetch('http://localhost:3001/Hospitalises', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFormValues),
      });

      if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du nouvel hospitalisé');
      }

      const result = await response.json();
      console.log("Nouvel hospitalisé ajouté :", result);

      setDonnee([...donnee, result]);

      // Réinitialiser les valeurs du formulaire
      setValueAjout({
          num: "",
          nom: "",
          prenom: "",
          service: "",
          sexe: "",
          adresse: "",
          age: "",
          date_naiss: "",
          date_ajout: ""
      });
      setMaxNum(maxNum +1)
      setSelectedDate(null)
      message();
      fetchData(); 
  }
   catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      messageErreur();
  }
}

//FONCTION DE SUPPRESSION
const suppression = async (num: string) =>{
  const result = await Swal.fire({
    title: "Vous voullez supprimer le patient hospitalise numero: "+num,
    text: "Suppression de patient hospitalisé",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Supprimer'
  });
  if(result.isConfirmed){
    try {
      const response = await fetch(`http://localhost:3001/hospitalises/${num}`,{
        method: 'DELETE',
      });
      
      if(response.ok){
        Swal.fire(
          'Patient hospitalié numero: '+num +' supprimmé',
          'Suppression de patient hospitalisé',
          'success'
        );
      }
      setDonnee(donnee.filter(hospitalise=> hospitalise.num !== num));
      window.location.reload();
      fetchData()
    } 
    catch (error) {
      Swal.fire(
        'Erreur lors de la suppression!',
        'Suppression de patient hospitalisé',
        'error'
      );
    }
  }
}

//FONCTION MODIFICATION
const modification = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectedHospitalise) return;

  try {
    const response = await fetch(`http://localhost:3001/hospitalises/${selectedHospitalise.num}`, {
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
    console.log("Hospitalisé modifié: ", result);

    setDonnee(donnee.map(hospitalise => hospitalise.num === result.num ? result : hospitalise));

    setFormeValues({
      nom: "",
      prenom: "",
      service: "",
      sexe: "",
      adresse: "",
      age: "",
      date_naiss: ""
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

//TABEAUX
const columns = [
    {
      name: "N°",
      selector: (row: HospitaliseData) => row.num+"H",
      sortable: true,
      width: "100px",
    },
    {
      name: "Nom",
      selector: (row: HospitaliseData) => row.nom,
      sortable: true,
      width: "250px",
    },
    {
      name: "Prénom",
      selector: (row: HospitaliseData) => row.prenom,
    },
    {
      name: "Sexe",
      selector: (row: HospitaliseData) => row.sexe,
      width: "100px",
    },
    {
      name: "QR Code",
      cell: (row: HospitaliseData) => (
        <div className="bg-white w-[30px] ml-[10px] h-[30px] pt-[6px] pl-[6px] rounded hover:bg-slate-200 transition duration-150 cursor-pointer">
          <BsQrCode className="text-[18px]" onClick={() => qrr(row)} />
        </div>
      ),
    },
    {
      name: "Service",
      selector: (row: HospitaliseData) => row.service,
      width: "150px",
    },
    {
      name: "Date naissance",
      selector: (row: HospitaliseData) => row.date_naiss,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row: HospitaliseData) => (
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
            <MdDelete onClick={() => suppression(row.num)} className="text-red-500 text-[18px] mr-2" />
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

  //RECHERCHE
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearcht(e.target.value.toLowerCase());
};

const filterDonne = (donnee: HospitaliseData[]) => {
  if (!searchT.trim()) {
    return donnee; // Si le champ de recherche est vide, renvoyer toutes les données
  }

  return donnee.filter(hospitalise => {
    return hospitalise.adresse.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
           hospitalise.nom.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
           hospitalise.prenom.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
           hospitalise.service.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
           hospitalise.sexe.toLocaleLowerCase().includes(searchT.toLocaleLowerCase()) ||
           hospitalise.num.toString().includes(searchT);
  });
};

//REHCERHCE A PARTIR DE SELECT
const [selectData, setSelectData] = useState<string>('option3'); //par defaut androanY
const [filteredData, setFilteredData] = useState<HospitaliseData[]>([]);

const selecta = () => {
  const anio = dayjs().format('DD-MM-YYYY');
  let dataToDisplay = donnee;

  if (selectData === 'option2') {
    dataToDisplay = filterDonne(donnee);
  } 
  else if (selectData === 'option3') {
    dataToDisplay = donnee.filter(hospitalise => hospitalise.date_ajout === anio);
    dataToDisplay = filterDonne(dataToDisplay);
  }
  setFilteredData(dataToDisplay);
}

  //apesaina amn'ny donnee anaty selecta
  useEffect(() => {
    selecta();
  }, [selectData, searchT, donnee]);

  //EXPORTER EN EXCEL
  const exporte = () => {
    const ws = XLSX.utils.json_to_sheet(donnee);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient hospitalisé local");
    XLSX.writeFile(wb, "Patient_hospitalise.XLSX");
  };

  //ACTUAISE
  // if(loading){
  //   return(
  //     <>
  //       <Stack spacing={1} className="p-9">
  //         <div>
  //           <Skeleton variant="rounded" className="w-[100%]" height={100}/>
  //         </div>
  //       </Stack>
  //     </>
  //   )
  // }

  const [showEx, setShowEx] = useState(false);
  const pageEx = (id: number) => {
    setShowEx(!showEx);
    window.location.href = "/page/patient/externe";
  }

  return (
    <>
      <div className="flex bg-slate-50">
        <Navbar />

        <div className="w-full h-[100vh] p-2">

          
          {/* MENU AMBONY EO INY */}
          <div>
          <Menuu />
        </div>
         
          <div className="w-full h-[2%]"></div> {/*Tsa kitiana*/}
          <div className="w-full h-[91%] shadow-md bg-white rounded">
            {/*Contenu*/}
            {/* Lien amn voalohany */}
            <div className="pt-5">
              <ul className="flex">
                <li className="ml-3 mr-2">
                  <Link href="/page/patient/hospitalise">
                    <span className="border-b-2 border-blue-600 text-blue-600 mr-1 flex text-[14px] font-sans">
                      Hospitalisés
                    </span>
                  </Link>
                </li>
                <li className="mr-[72%]">
                <button onClick={() => pageEx(1)}>
                    <span className="border-b-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition duration-200 text-gray-600 mr-1 flex text-[14px] font-sans">
                      Externes
                    </span>
                  </button>
                </li>
                <li>
                  <Button
                    className="h-[35px] w-[200px] shadow-none mr-2 bg-green-700 hover:bg-green-600 text-white"
                    type="submit"
                    onClick={() => setShowModal(true)}
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
                Listes des patients hospitalisés:
              </p>
            </div>
            <div className="flex mt-4 ml-10">
              {
                isClient &&
                (
                <SelectComponent
                style={{ width: 200 }}
                placeholder=""
                className="w-[200px] h-[35px]"
                onChange={value => setSelectData(value)}
                value={selectData}
              >
                <option value="option2">Tous</option>
                <option value="option3">Aujourd'hui</option>
              </SelectComponent>
                )
              }


              <InputComponent
                placeholder="Recherche..."
                className="w-[200px] h-[35px] ml-2 search-input"
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
                  // data={searchT ? filterDonne : donneAnio}
                  // data={donneAnio}
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
        {
          showModal &&(
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={save}>
                <div className="bg-white w-[550px] h-[380px] rounded">
                    <button
                        type="button"
                        className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                        onClick={() =>{setShowModal(false), setValueAjout({
                          num: "",
                          nom: "",
                          prenom: "",
                          service: "",
                          sexe: "",
                          adresse: "",
                          age: "",
                          date_naiss: "",
                          date_ajout: ""
                      }), setSelectedDate(null)}}
                    >
                        X
                    </button>
                    <div className="flex ml-4">
                        <div className="bg-green-400 rounded-[20px] w-10 h-10">
                            <div className="mt-2 ml-[1px]">
                                <BsPersonFillAdd className="text-green-700 ml-[6px] text-[25px]" />
                            </div>
                        </div>
                        <p className="ml-2 mt-1 font-bold text-[22px]">Nouveau patient hospitalisé</p>
                    </div>
                    {/* INFORMATION DES PATIENTS */}
                    <div className="mt-3">
                        <div>
                          <p>{dernierNum}</p>
                            <TextField
                                label="Nom*"
                                name="nom"
                                value={valueAjout.nom}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-2 ml-10"
                            />
                            <TextField
                                label="Prénom"
                                name="prenom"
                                value={valueAjout.prenom}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-2 ml-10"
                            />
                            <TextField
                                label="Adresse"
                                name="adresse"
                                value={valueAjout.adresse}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <TextField
                                label="Service*"
                                name="service"
                                value={valueAjout.service}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <TextField
                                label="Sexe*"
                                name="sexe"
                                value={valueAjout.sexe}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    maxDate={currentDate}
                                    label="Date de naissance*"
                                    sx={{ width: '210px' }}
                                    className="mt-5 ml-10"
                                    value={selectDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            
                            <Button
                                type="submit"
                                className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]"
                            >
                                <MdSave className="text-[15px] ml-1 mr-1" />
                                <span className="text-[12px]">Enregistrer</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
          
        )}

        {/* MODAL DE MODIFICATION */}
        {showModi && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={modification}>
              <div className="bg-white w-[550px] h-[380px] rounded">
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
                    Mise à jour du patient hospitalisé
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      name="nom"
                      value={formeValues.nom}
                      onChange={handleInputChange}
                      label="Nom*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenom"
                      value={formeValues.prenom}
                      onChange={handleInputChange}
                      label="Prénom"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="adresse"
                      value={formeValues.adresse}
                      onChange={handleInputChange}
                      label="Adresse"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="service"
                      value={formeValues.service}
                      onChange={handleInputChange}
                      label="Service*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexe"
                      value={formeValues.sexe}
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
            </form>
            <ToastContainer />
          </div>
        )}

        {/* MODEL DE VUE */}
        {showVue && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form>
              <div className="bg-white w-[550px] h-[450px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() => setShowVue(false)}
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
                    A propos du patient hospitalisé
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-3">
                  <div>
                    <TextField
                      value={formeValues.num+"H"}
                      label="Numero*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      value={formeValues.nom}
                      label="Nom*"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      value={formeValues.prenom}
                      label="Prénom"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      value={formeValues.service}
                      label="Service*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      value={formeValues.sexe}
                      label="sexe*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      value={formeValues.adresse}
                      label="Adresse*"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      value={formeValues.age}
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
                    <Button
                      className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]"
                      onClick={() => {
                        setShowVue(false), setShowQr(true);
                      }}
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

        {/* MODAL QR CODE */}
        {showQr && (
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
                    Information sur le patient hospitalisé
                  </p>
                  <br />
                </div>
                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    <TextField
                      name="numero"
                      value={formeValues.num+"H"}
                      label="N°"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="nom"
                      value={formeValues.nom}
                      label="Nom"
                      variant="outlined"
                      className="mt-2 ml-10"
                    />
                    <TextField
                      name="prenom"
                      value={formeValues.prenom}
                      label="Prénom"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="adresse"
                      value={formeValues.adresse}
                      label="Adresse"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="service"
                      value={formeValues.service}
                      label="Service"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="sexe"
                      value={formeValues.sexe}
                      label="sexe"
                      variant="outlined"
                      className="mt-5 ml-10"
                    />
                    <TextField
                      name="age"
                      value={formeValues.age}
                      label="Age"
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
                    onClick={() => setShowQr(false)}
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

{showEx && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      </div>
    </>
  );
}