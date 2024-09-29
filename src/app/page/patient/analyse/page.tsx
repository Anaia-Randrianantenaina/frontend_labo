"use client";

import { MdCancel } from "react-icons/md"; 
import { BsFillPrinterFill } from "react-icons/bs";
import { IoMdRefreshCircle } from "react-icons/io";
import { MdPaid } from "react-icons/md";
import { TbBrandProducthunt } from "react-icons/tb";
import { BsFillEyeFill, BsListNested } from "react-icons/bs";
import { BiRedo } from "react-icons/bi";
import { MdDelete, MdSave } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";
import {
  IoIosRefreshCircle,
  IoMdEye,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { FaUserMd } from "react-icons/fa";
import { GiHypodermicTest, GiMicroscope } from "react-icons/gi";
import { FaFileExport } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import MenuItem from "@mui/material/MenuItem";
import { IoMdNotificationsOutline } from "react-icons/io";
import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import {
  Input,
  FormControl,
  InputLabel,
  styled,
  InputBase,
  Theme,
  TextField,
  OutlinedInput,
  useTheme,
  SelectChangeEvent,
  Select,
  Avatar,
  Chip,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import dynamic from "next/dynamic";
import AjoutMed from "../medecin/ajoutMed";
import Navbar from "@/app/navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import Swal from "sweetalert2";

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

const Button = dynamic(
  () => import("@mui/material").then((mod) => mod.Button),
  {
    ssr: false,
  }
);

//style afahana mscrool any select
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8, // le 48: height , 8 padding top
      width: 250,
    },
  },
};

//Donnée ao anaty select
const hematologie = [
  "Fibrinogène",
  "Hémogramme",
  "Taux de Prothrombie",
  "Temps de Saignement",
  "Test d Emmel",
  "Réticulocttes",
];

const biosang = [
  "Acide urique",
  "Amylasémie",
  "Albumine",
  "ALAT",
  "ASAT",
  "Bilirubine directe",
  "Bilirubine totale",
  "Calcémie",
  "Cholestérol",
  "Créatinine",
  "CRP",
  "Gamma GT",
  "Glycémie",
  "HBA,C",
  "HDL cholestérol",
  "HGPO",
  "Ionogramme",
  "LDH",
  "LDL Cholestérol",
  "Magnésémie",
  "Protéine total",
  "Phostphates alcalines",
  "Phosphorémie",
  "triglycérides",
  "troponine l",
  "Urée",
];

const biouri = ["Ionogramme urinaire", "Protéinurie de 24H", "Urine ASA"];

const liquide = [
  "Ascite",
  "Etude chimique",
  "Etude cytologique",
  "LRC",
  "Pleural",
];

const sero = [
  "ASLO",
  "Bilharzioze",
  "Cysticercose",
  "Facteur rhumatoïde",
  "HCG plasmatique",
  "Hépatite A",
  "Hépatite B",
  "Hépatite C",
  "RPR",
  "TPHA",
  "TSH",
  "T3",
  "T4",
  "Widal Félix",
];

const bact = [
  "Culot urinaire",
  "ECBU",
  "FCV",
  "Frotitis de gorge",
  "FU",
  "HLM",
  "Liquide à priciser",
  "Pus superficiel",
  "Pus profonde",
];

const para = ["Recherches d hematoeaire", "Selles KAOP"];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Analyse() {
  //ilaina amny tsa mampihetsika anle page refa actualisena
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // NumHospi();
    matriMedecinL();
    // numExterne();
    medecinEx();
    vueH();
    vueE();
    setShowTableH(true);
    maxnum();
    maxnumE()

    setTimeout(()=> {
      setLoading(false);
    }, 1000)
  }, []);

  //ilaina amn select io ty declaration de variable
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    
    setValueAjout(prevValues => ({
      ...prevValues,
      examen: value.toString()
    }));

    setFormeValues(prevValues => ({
      ...prevValues,
      examen: value.toString()
    }));
  };

  const anio = dayjs().format("DD-MM-YYYY");

  //modal
  const [showModal, setShowModal] = useState(false);
  const [showModale, setShowModale] = useState(false);
  const [showModalee, setShowModalee] = useState(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showTableH, setShowTableH] = useState<boolean>(false)

  //modal de modification
  const [showModi, setShowModi] = useState(false);
  //modal de vue
  const [showVue, setShowVue] = useState(false);
  //modal de Poursuivre
  const [showPour, setShowPour] = useState(false);
  //modal d'ASP HOSPITALISE
  const [showAsp, setShowAsp] = useState(false);
  //MODA D ASP EXTERNE
  const [showAspE, setShowAspE] = useState(false)

  // Pagination amn tableaux
  const paginationOptions = {
    rowsPerPageText: "Lignes par page:",
    rangeSeparatorText: "de",
    selectAllRowsItem: false,
    selectAllRowsItemText: "Tous",
  };

  ////////////////////////////////////////////MODAL D'AOUT HOSPITALISE///////////////////////////////////////////////////////
  // fonction pour mettre les numeros de tous les patients hospitalises dans un select
  interface HospitaliseData {
    num: string;
  }

  const [hospi, setHospi] = useState<HospitaliseData[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | "">(""); //value asina ny numero
  const [name, setName] = useState<string>("");
  const [service, setService] = useState<string>("");

  //TY NO MIASA AMNZAO
  const [max, setMax] = useState<number | null>(null);
  const maxnum = async  () => {
    try {
      const response = await fetch("http://localhost:3001/hospitalises/max/num");
      const result = await response.json();
      console.log("valeur num max hospi recuperer: ", result)
      setMax(result)
      fetchName(result)
    } 
    catch (error) {
      console.log("errur lors d'affichage max num ", error)
    }
  }

  //HIRECUPERENA NY NUMERO REHETRA HOSPI
  const NumHospi = async () => {
    try {
      const response = await fetch("http://localhost:3001/hospitalises");
      if (!response.ok) {
        throw new Error("Error de reseau");
      }

      const resultt = await response.json();
      console.log("Donnees recuperes: ", resultt);

      //recuperation numero
      const numeros = resultt.map((item: { num: number }) => item.num);
      console.log("Numéros extraits :", numeros);

      // Tri des numéros en ordre décroissant
      const sortedNumeros = numeros.sort((a, b) => b - a);
      console.log("Numéros triés (décroissants) :", sortedNumeros);

      setHospi(sortedNumeros); // Stocker les numéros triés
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  //Recherche sur les numero selectionnées
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const handleSelectChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const num = event.target.value as number;
    setSelectedNumber(num);
    if (num === "") {
      setName(""); // Réinitialiser le nom si aucune sélection
      setService("");
    } else {
      await fetchName(num); // Rechercher le nom basé sur le numéro sélectionné
    }
  };

  const fetchName = async (num: number) => {
    try {
      const response = await fetch(`http://localhost:3001/hospitalises/${num}`);
      if (!response.ok) {
        throw new Error("Erreur de réseau");
      }

      const result = await response.json();
      console.log("Données du nom récupérées :", result);

      setValueAjout(prevValues => ({
        ...prevValues,
        num_hospi: num,
        date_analyse: dayjs().format('DD/MM/YYYY')
      }));

      // Supposons que la réponse contient une propriété `nom`
      setName(result.nom);
      setService(result.service);
    } catch (error) {
      console.error("Erreur lors de la récupération du nom :", error);
    }
  };

  // PRESCRIPTEUR LOCAL
  interface MedecinData {
    matricule: string;
    nomP: string;
    contact: string;
    serviceP: string;
  }

  const [medecinL, setMedecinL] = useState<MedecinData[]>([]);
  const [matri, setMatri] = useState<string>("");
  const [serviceM, setServiceM] = useState<string>("");

  //affichage de matricule de prescripteur
  const matriMedecinL = async () => {
    try {
      const response = await fetch("http://localhost:3001/Medecinlocals");
      if (!response.ok) {
        throw new Error("Error de reseau");
      }

      const result = await response.json();
      console.log("Donnee recuperee: ", result);

      const matricule = result.map(
        (item: { matricule: string }) => item.matricule
      );
      console.log("Numéros extraits :", matricule);

      // Tri des numéros en ordre décroissant
      const sortedNumeros = matricule.sort((a, b) => b - a);
      console.log("Numéros triés (décroissants) :", sortedNumeros);

      setMedecinL(sortedNumeros); // Stocker les numéros triés
    } catch (error) {
      console.log(
        "Erreur lors d'affichage de donnee prescripteur local: ",
        error
      );
    }
  };

  //recherche a partir de matricule
  const [selectedMatri, setSelectedMatri] = useState<string | null>(null);
  const handleSelectChangeM = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const matricule = event.target.value as string;
    setSelectedMatri(matricule);

    if (matricule === "") {
      setMatri(""); // Réinitialiser le nom si aucune sélection
      setServiceM("");
    } 
    else {
      await fetchMatri(matricule); // Rechercher le nom basé sur le numéro sélectionné
      setValueAjout(prevValues => ({
        ...prevValues,
        id_medecinL: matricule.toString()
      }));
    }
  };

  const fetchMatri = async (matricule: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/Medecinlocals/${matricule}`
      );
      if (!response.ok) {
        throw new Error("Erreur de réseau");
      }

      const result = await response.json();
      console.log("Données du nom récupérées :", result);

      // Supposons que la réponse contient une propriété `nom`
      setMatri(result.nomP);
      setServiceM(result.serviceP);
    } catch (error) {
      console.error("Erreur lors de la récupération du nom :", error);
    }
  };

   // Notification de succès hospitalisé
   const message = () => toast.success('Nouvel analyse enregistré', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: ()=> {setShowModal(false), setShowModalee(false), setShowAsp(true);}
});

  //message de succes externe
  const messageEx = () => toast.success('Nouvel analyse enregistré', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: ()=> {setShowModal(false), setShowModalee(false), setShowAspE(true);}
});

// Notification d'erreur
const messageErreur = () => toast.error("Analyse non enregistré", {
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
  const messageMod = () => toast.success('Analyse modifié', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
});

// message de modification echec
const messageErreurr = () => toast.error("Analyse non modifié", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

//message poursuivre
const messageP = () => toast.success('Numero quittance enregistré', {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  onClose: ()=> {setShowPour(false), setShowModalee(false), setShowTableH(true);}
});

//Message erreur porusuivre
const messageErreurP = () => toast.error("Numero quittance non enregistré", {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
});

  ////////////////////////////////////////////MODAL D'AOUT EXTERNE///////////////////////////////////////////////////////
  // Information pour les données des hospitalisés
  interface ExterneData {
    numE: string;
  }

  const [externe, setExterne] = useState<ExterneData[]>([]);
  const [nomE, setNomE] = useState("");
  const [adressE, setAdresseE] = useState("");

  //TY NO MIASA AMNZAO
  const [maxE, setMaxE] = useState<number | null>(null);
  const maxnumE = async ()=>{
    const response = await fetch("http://localhost:3001/externes/max/numE");
    const result = await response.json();
    setMaxE(result);
    fetchNameE(result)
  }

  //affichage de numero externe rehetra
  const numExterne = async () => {
    try {
      const response = await fetch("http://localhost:3001/externes");
      if (!response.ok) {
        throw new Error("Error de reseau");
      }

      const resultt = await response.json();
      console.log("Donnees recuperes: ", resultt);

      //recuperation numero
      const numeros = resultt.map((item: { numE: number }) => item.numE);
      console.log("Numéros externes extraits :", numeros);

      // Tri des numéros en ordre décroissant
      const sortedNumeros = numeros.sort((a, b) => b - a);
      console.log("Numéros triés (décroissants) :", sortedNumeros);

      setExterne(sortedNumeros); // Stocker les numéros triés
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  //recherche a partir de numero et affichage dans le select
  const [selectedNumberE, setSelectedNumberE] = useState<number | null>(null);
  const handleSelectChangeE = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const numE = event.target.value as number;
    setSelectedNumberE(numE);

    if (numE === "") {
      setNomE(""); // Réinitialiser le nom si aucune sélection
      setAdresseE("");
    } else {
      await fetchNameE(numE); // Rechercher le nom basé sur le numéro sélectionné
      setFormeValues(prevValues => ({
        ...prevValues,
        num_externe: numE
      }));
    }
  };

  const fetchNameE = async (numE: number) => {
    try {
      const response = await fetch(`http://localhost:3001/externes/${numE}`);
      if (!response.ok) {
        throw new Error("Erreur de réseau");
      }

      const result = await response.json();
      console.log("Données du nom récupérées :", result);

      setFormeValues(prevValues => ({
        ...prevValues,
        num_externe: numE
      }));

      // Supposons que la réponse contient une propriété `nom`
      setNomE(result.nomE);
      setAdresseE(result.adresseE);
    } catch (error) {
      console.error("Erreur lors de la récupération du nom :", error);
    }
  };

  //PRESCRIPTEUR EXTERNE
  interface MedecinDataE{
    id: string,
    nomME: string,
    contact: string,
    adresseME: string
  }

  const [medecinE, setMedecinE] = useState<MedecinDataE[]>([]);
  const [nomME, setNomME] = useState("");
  const [contactE, setContactE] = useState("");

  //FONCTION D'AFFICHAGE
  const medecinEx = async () => {
    try {
      const response = await fetch("http://localhost:3001/Medecinexternes");
      if (!response.ok) {
        throw new Error("Error de reseau");
      }

      const result = await response.json();
      console.log("Donnee recuperee medecin externe : ", result);

      //recuperation nom du prescripteur externe
      const numeros = result.map((item: { id: string }) => item.id);
      console.log("Nom externes extraits :", numeros);

      // Tri des numéros en ordre décroissant
      const sortedNumeros = numeros.sort((a, b) => b - a);
      console.log("Numéros triés (décroissants) :", sortedNumeros);

      setMedecinE(sortedNumeros); // Stocker les numéros triés
    } catch (error) {
      console.log(
        "Erreur lors d'affichage de donnee prescripteur externe: ",
        error
      );
    }
  };

  //recherche a partir de numero et affichage dans le select
  const [selectedNomE, setSelectedNomE] = useState<string | null>(null);
  const handleSelectChangeME = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const id = event.target.value as string;
    setSelectedNomE(id);

    if (id === "") {
      setNomME(""); // Réinitialiser le nom si aucune sélection
      setContactE("");
    } else {
      await fetchNameME(id); // Rechercher le nom basé sur le numéro sélectionné
      setFormeValues(prevValues => ({
        ...prevValues,
        id_medecinE: id.toString(),
        date_analyse: dayjs().format('DD/MM/YYYY')
      }));
    }
  };

  const fetchNameME = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/Medecinexternes/${id}`);
      if (!response.ok) {
        throw new Error("Erreur de réseau");
      }

      const result = await response.json();
      console.log("Données du nom récupérées :", result);

      // Supposons que la réponse contient une propriété `nom`
      setNomME(result.nomME);
      setContactE(result.contact);
    } catch (error) {
      console.error("Erreur lors de la récupération du nom :", error);
    }
  };

  ////////////////////////////////////////////////// ZAY VO AJOUT ANALYSE /////////////////////////////////////////////////
  interface AnalyseData{
    id: number,
    examen: string,
    num_quit: number,
    rc: string,
    payement: string,
    resultat: string,
    date_analyse: string,
    //CLE ETRANGER
    num_hospi: HospitaliseData,
    num_externe: ExterneData,
    id_medecinE: MedecinDataE,
    id_medecinL: MedecinDataE
  }

  const [AnalyseDonnee, setAnalyseDonnee] = useState<AnalyseData[]>([]);

  const [valueAjout, setValueAjout] = useState({
    examen: "",
    num_quit: 0,
    rc: "",
    payement: "non payé",
    resultat: "en attente",
    date_analyse: "",
    //CLE ETRANGER
    num_hospi: 0,
    id_medecinL: "",
    num_externe: null,
    id_medecinE: null
  });

  const [formeValues, setFormeValues] = useState({
    examen: "",
    num_quit: 0,
    rc: "",
    payement: "non payé",
    resultat: "en attente",
    date_analyse: "",
    //CLE ETRANGER
    num_externe: 0,
    id_medecinE: "",
    id_medecinL: null,
    num_hospi: null,
  })

  const inputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValueAjout({
        ...valueAjout,
        [name]: value
    });
  }

  const inputchangeE = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormeValues({
        ...formeValues,
        [name]: value
    });
  }

  //FONCTION AJOUTER
  const enregistre = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  
      try {
        const response = await fetch('http://localhost:3001/Analyses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(valueAjout),
        });
  
        if (!response.ok) {
            console.log(valueAjout)
            throw new Error('Erreur lors de l\'ajout du nouvel analyse');
        }
        const result = await response.json();
        console.log("Nouvel hospitalisé ajouté :", result);
  
        setAnalyseDonnee([...AnalyseDonnee, result]);
  
        // Réinitialiser les valeurs du formulaire
        setValueAjout({
          examen: "",
          num_quit: 0,
          rc: "",
          payement: "non payé",
          resultat: "en attente",
          date_analyse: "",
        //CLE ETRANGER
          num_externe: null,
          id_medecinE: null
        })
        setSelectedMatri("")
        // asph(result.num_hospi)
        setMatri(""); 
        setServiceM("");
        vueH();
        message();
        if(result.id){
          ASP(result.id);
          ex(result.id)
        }
    }
     catch (error) {
        console.error("Erreur lors de l'ajout d'analyse :", error);
        messageErreur()
        if (!valueAjout.num_hospi || isNaN(Number(valueAjout.num_hospi))) {
          console.error("Le champ num_hospi est invalide ou vide.");
          return;
        }else{
          console.log("Misy valeur nombre ao")
        }
    }
  }
  
  const enregistreE = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  
      try {
        const response = await fetch('http://localhost:3001/Analyses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formeValues),
        });
  
        if (!response.ok) {
            console.log(valueAjout)
            throw new Error('Erreur lors de l\'ajout du nouvel analyse');
        }
        const result = await response.json();
        console.log("Nouvel hospitalisé ajouté :", result);
  
        setAnalyseDonnee([...AnalyseDonnee, result]);
        setFormeValues({
          examen: "",
          num_quit: 0,
          rc: "",
          payement: "non payé",
          resultat: "en attente",
          date_analyse: "",
          //CLE ETRANGER
          id_medecinL: null,
          num_hospi: null,
        })

        if(result.id){
          ASPE(result.id)
          ex(result.id)
        }
        // Réinitialiser les valeurs du formulaire
        setSelectedNomE("")
        setNomME(""); 
        setContactE("");
        messageEx();
        vueE();
    }
     catch (error) {
        console.error("Erreur lors de l'ajout d'analyse :", error);
        messageErreur()
        if (!valueAjout.num_hospi || isNaN(Number(valueAjout.num_hospi))) {
          console.error("Le champ num_hospi est invalide ou vide.");
          return;
        }else{
          console.log("Misy valeur nombre ao")
        }
    }
  }

  //FONCTION DE SUPPRESSION
const suppression = async (id: number) =>{
  const result = await Swal.fire({
    title: "Vous voullez supprimer l anlyse",
    text: "Suppression d analyse",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Supprimer'
  });
  if(result.isConfirmed){
    try {
      const response = await fetch(`http://localhost:3001/Analyses/${id}`,{
        method: 'DELETE',
      });
      
      if(response.ok){
        Swal.fire(
          "Analyses supprimmé",
          'Suppression d analyse',
          'success'
        );
      }
      vueH();
      vueE();
      setAnalyseDonnee(AnalyseDonnee.filter(analyse=> analyse.id !== id));
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

  //FONCTION VUE
  const [selectDonnee, setSelectdonnee] = useState<AnalyseData | null>(null);
  const vuee = (externe: AnalyseData)=>{
    setSelectdonnee(externe);
    setFormeValues(externe) 
    setShowVue(true)
  }

  //AFFICHAGE ANATY VUE HOSPITALISE
  interface vueH{
    num: number,
    nom: string,
    age: string,
    service: string,
    resultat: string,
    num_quit: number,
    payement: string,
    date_analyse: string,
    nomP: string,
    id: number,
    prenom: string,
    rc: string
  }

  const[donneevue, setDonneevue] = useState<vueH[]>([]);
  const vueH = async()=>{
    try {
      const response = await fetch('http://localhost:3001/viewanalyses');
      if(!response.ok){
          throw new Error("Error de reseau")
      }
      const resultt = await response.json();
      console.log("Donnees recuperes", resultt)
      setDonneevue(resultt)
    } 
    catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
    finally{
        setLoading(false);
    }
  }

  //AFFICHAGE EXTERNES ANALYSES
  interface vueE{
    numE: number,
    nomE: string,
    ageE: string,
    adresseE: string,
    resultat: string,
    num_quit: number,
    payement: string,
    date_analyse: string,
    nomME: string,
    id: string,
    prenomE: string,
    rc: string
  }

  const [donneevueE, setDonneevueE] = useState<vueE[]>([]);
  const vueE = async()=>{
    try {
      const response = await fetch('http://localhost:3001/viewanalyseexs');
      if(!response.ok){
          throw new Error("Error de reseau")
      }
      const resultt = await response.json();
      console.log("Donnees recuperes", resultt)
      setDonneevueE(resultt)
    } 
    catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  //ASP HOSPITALISE
  const [recherche, setRecherche] = useState<any>(null);
  const ASP = async (id: number) =>{
    try {
        const response = await fetch(`http://localhost:3001/viewanalyses/${id}`)
        const result = await response.json();
        console.log("Donnee recuperes", result)
        setRecherche(result)
    }
    
    catch (error) {
      console.log("Erreur lors de recuperation ID", error)
    }
  }

   //ASP EXTERNE
   const [rechercheE, setRechercheE] = useState<any>(null);
   const ASPE = async (id: number) =>{
     try {
       const response = await fetch(`http://localhost:3001/viewanalyseexs/${id}`)
       const result = await response.json();
       console.log("Donnee recuperes", result)
       setRechercheE(result)
     } 
     catch (error) {
       console.log("Erreur lors de l'affichage ASPE", error)
     }
   }

  const [examena, setExamen] = useState<any>(null);
  const [exa, setExa] = useState("")
  const ex = async (id: number) =>{
    try {
      const response = await fetch(`http://localhost:3001/analyses/exam/${id}`)
      if(!response.ok){
        throw new Error("Error de reseau")
      }
      const result = await response.json();
      console.log("Donnee recuperes TYY", result)
      setExamen(result)
      setExa(result.examen)
    } 
    catch (error) {
      console.log("Erreur lors de affichage exam par id", error)
    }
  }

  // TABLEAUX 
  const getColor = (result) =>{
    switch(result){
      case 'en cours':
        return 'bg-blue-600 rounded-2xl w-[100px] h-[30px] opacity-55 text-center text-white pt-1';
      case 'validé':
        return 'bg-green-600 rounded-2xl w-[100px] h-[30px] opacity-55 text-center text-white pt-1';
      case 'en attente':
        return 'bg-yellow-600 rounded-2xl w-[100px] h-[30px] opacity-55 text-center text-white pt-1';
    } 
  }

  const columns = [
    {
      name: "N°",
      selector: (row: vueH) => row.num+"H",
      sortable: true,
      width: "100px",
    },
    {
      name: "Nom",
      selector: (row: vueH) => row.nom,
      width: "250px",
    },
    {
      name: "Age",
      selector: (row: vueH) => row.age,
    },
    {
      name: "Service",
      selector: (row: vueH) => row.service,
      width: "100px",
    },
    {
      name: "Resultat",
      selector: (row: vueH) => row.resultat,
      cell: row => (
          <div className={getColor(row.resultat)}>
            {row.resultat}
          </div>
      ),
      width:"150px",
      sortable: true,
    },
    {
      name: "Préscripteur",
      selector: (row: vueH) => row.nomP,
      width: "150px",
    },
    {
      name: "Observation",
      cell: (row: vueH) => (
        <div className="">
          <Button
            onClick={() =>{poursuivre(row), setShowTable(false), setShowTableH(false)}}
            disabled ={row.resultat === "en cours" || row.resultat ==="validé"}
            className="flex text-[10px] bg-slate-600 text-white hover:bg-slate-500"
          >
            <BiRedo className="text-[20px] mr-1" />
            <span>Suivre</span>
          </Button>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row: vueH) => (
        <div className="flex">
          <div className="bg-white mr-[6px] w-[25px] ml-1 h-[25px] pt-1 pl-1 rounded hover:bg-sky-200 transition duration-150 cursor-pointer">
            <IoMdEye
              className="text-sky-700 text-[18px] mr-2"
              onClick={() =>{showV(row), setShowTable(false), setShowTableH(false)}}
            />
          </div>
          <div className="bg-white mr-[6px] w-[25px] h-[25px] pt-1 pl-[6px] rounded hover:bg-gray-200 transition duration-150 cursor-pointer">
            <BsFillPencilFill
              className="text-[15px] mr-2"
              onClick={() =>{modi(row), setShowTable(false), setShowTableH(false) }}
            />
          </div>
          <div className="bg-white w-[25px] h-[25px] pt-1 pl-1 rounded hover:bg-red-100 transition duration-150 cursor-pointer">
            <MdDelete 
              onClick={() => suppression(row.id)}
              className="text-red-500 text-[18px] mr-2"
             />
          </div>
        </div>
      ),
    },
  ];

  const columnsE = [
    {
      name: "N°",
      selector: (row: vueE) => row.numE+"E",
      sortable: true,
      width: "100px",
    },
    {
      name: "Nom",
      selector: (row: vueE) => row.nomE,
      width: "200px",
    },
    {
      name: "Age",
      selector: (row: vueE) => row.ageE,
    },
    {
      name: "Adresse",
      selector: (row: vueE) => row.adresseE,
      width: "100px",
    },
    {
      name: "Resultat",
      selector: (row: vueH) => row.resultat,
      cell: row => (
          <div className={getColor(row.resultat)}>
            {row.resultat}
          </div>
      ),
      width:"150px",
      sortable: true,
    },
    {
      name: "Préscripteur",
      selector: (row: vueE) => row.nomME,
      width: "150px",
    },
    {
      name: "Observation",
      cell: (row: vueH) => (
        <div className="">
          <Button
            onClick={() =>{poursuivreE(row), setShowTable(false), setShowTableH(false)}}
            disabled ={row.resultat === "en cours" || row.resultat ==="validé"}
            className="flex text-[10px] bg-slate-600 text-white hover:bg-slate-500"
          >
            <BiRedo className="text-[20px] mr-1" />
            <span>Suivre</span>
          </Button>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row: vueE) => (
        <div className="flex">
          <div className="bg-white mr-[6px] w-[25px] ml-1 h-[25px] pt-1 pl-1 rounded hover:bg-sky-200 transition duration-150 cursor-pointer">
            <IoMdEye
              className="text-sky-700 text-[18px] mr-2"
              onClick={() =>{showVE(row), setShowTable(false), setShowTableH(false)}}
            />
          </div>
          <div className="bg-white mr-[6px] w-[25px] h-[25px] pt-1 pl-[6px] rounded hover:bg-gray-200 transition duration-150 cursor-pointer">
            <BsFillPencilFill
              className="text-[15px] mr-2"
              onClick={() =>{setShowModi(true), setShowTable(false), setShowTableH(false)}}
            />
          </div>
          <div className="bg-white w-[25px] h-[25px] pt-1 pl-1 rounded hover:bg-red-100 transition duration-150 cursor-pointer">
            <MdDelete 
              onClick={() => suppression(row.id)}
              className="text-red-500 text-[18px] mr-2"
             />
          </div>
        </div>
      ),
    },
  ];

  //AFFICHAGE MODAL VUE
  const [selectvue, setSelectvue] = useState<vueH | null>(null);
  const showV = (externe: vueH)=>{
    setSelectvue(externe);
    setValueAjout(externe) 
    setShowVue(true)
  }

  //POURSUIVRE
  const poursuivre = (pour: vueH)=>{
    setSelectvue(pour);
    console.log("ty le zvtra tedivinah",selectvue)
    setShowPour(true)
  }

  const [selectVueE, setSelectvueE] = useState<vueE | null>(null);
  const showVE = (ex: vueE) => {
    setSelectvueE(ex)
    setShowVue(true);
  }

  const poursuivreE = (ex: vueE) => {
    setSelectvueE(ex)
    setShowPour(true);
  }

  //MLOADING
  function LoadingSpiner(){
    return(
      <div className="text-center mt-24">
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black border-opacity-75"></div>
        </div>
        <p className="mt-5">Chargement du donnée</p>
      </div>
    )
  }

  //AFFICHAGE SELECT
  const [selectData, setSelectData] = useState<string>('hospi');
  const different = ()=>{
    if(selectData === "hospi"){
      setShowTableH(false);
      setShowTable(true)
    }
    else if(selectData === "externe"){
      setShowTable(false);
      setShowTableH(true)
    }
  }

  const [modiPour, setmodiPour] = useState({
    num_quit: 0,
    payement: "Payé",
    resultat: "en cours",
  })

  //POURSUIVRE NUMERO QUITTANCE
  const pour = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectvue) return;
    try {
      const response = await fetch(`http://localhost:3001/analyses/${selectvue?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modiPour),
      });
  
      if (!response.ok) {
        console.log(modiPour);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Externe modifié: ", result);
  
      setAnalyseDonnee(AnalyseDonnee.map(analyse => analyse.id === result.id ? result : analyse));
      setmodiPour({
        num_quit: 0,
        payement: "non payé",
        resultat: "en attente"
      });
      messageP();
      vueH();
    }
    catch (error) {
      messageErreurP();
      console.error("Erreur lors de la modification: ", error);
    }
  };

  const inputchangePour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setmodiPour({
        ...modiPour,
        [name]: value
    });
  }

  //MODIFICATION HOSPITALISE LU HATRETO
  const [selectAnalyse, setSelectAnalyse] = useState<vueH | null>(null);
  const modi = (mod: vueH)=>{
    setSelectAnalyse(mod);
    setShowModi(true);

    if(mod !== null){
      console.log(mod.id);
      rechid(mod.id)
      ex(mod.id);
    }else{
      console.log('valeur null')
    }
  }

  const[valiny, setValiny] = useState("")
  const rechid = async (id: number)=>{
      try {
        const response = await fetch(`http://localhost:3001/analyses/id/${id}`)
        if(!response.ok){
          throw new Error("Error de reseau")
        }
        const result = await response.json();
        console.log("Donnee recuperes", result)
        setValiny(result.id_medecinL)
        servisy(result.id_medecinL)
      } 
      catch (error) {
        console.log("Erreur lors de affichage exam par id", error)
      }
  }

  const [mod, setMod] = useState({
    examen: "",
    num_quit: 0,
    rc: "",
    payement: "",
    resultat: "",
    //CLE ETRANGER
    id_medecinL: "",
    num_externe: null,
    id_medecinE: null
  })

  const modification = async(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if (!selectAnalyse) return;

    try {
      const response = await fetch(`http://localhost:3001/Analyses/${mod.id}`,{
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

      setAnalyseDonnee(AnalyseDonnee.map(analyse => analyse.id === result.id ? result : analyse));

      setMod({
        examen: "",
        num_quit: 0,
        rc: "",
        payement: "",
        resultat: "",
        //CLE ETRANGER
        id_medecinL: "",
        num_externe: null,
        id_medecinE: null
      });
      messageMod()
    } 
    catch (error) {
      console.log("Erreur lors de modification de analyse : ", error)
      messageErreurr();
    }
  }

  const inputchangeModi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMod({
        ...mod,
        [name]: value
    });
  }

  //AFFICHAGE SERVICE MEDECINL
  const [serv, setServ] = useState("")
  const servisy = async (matricule: string)=>{
    try {
      const response = await fetch(`http://localhost:3001/medecinlocals/matri/${matricule}`)
      if(!response.ok){
        throw new Error("Error de reseau")
      }
      const result = await response.json();
      console.log("Donnee recuperes TYY", result)
      setServ(result.serviceP)
    } 
    catch (error) {
      console.log("Erreur lors d'affichage service medecinLocal", error)
    }
  }

  return (
    <>
      <div className="bg-slate-50 flex">
        <Navbar />

        <div className="w-full h-[100vh] p-2">
          <div className="w-full h-[7%] mt-[-0.5%] shadow-md bg-white rounded">
            {/* LE EN TETE */}
            <ul className="flex pt-3">
              <li className="bg-green-50 rounded-md bg-opacity-45 w-[100px] hover:bg-green-100 hover:scale-110 transition duration-150  ml-3 text-center mr-2">
                <Link href="/page/patient/hospitalise">
                  <span className="font-medium text-[12px] text-green-950">
                    Patients
                  </span>
                </Link>
              </li>
              <li className="bg-green-500 rounded-md bg-opacity-45 w-[100px] text-center mr-2">
                <Link href="/page/patient/analyse" className="">
                  <span className="font-medium text-[12px] text-emerald-800">
                    Analyses
                  </span>
                </Link>
              </li>
              <li className="bg-green-50 rounded-md bg-opacity-45 w-[100px] hover:bg-green-100 hover:scale-110 transition duration-150  text-center mr-2">
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
            {/* Lien amn voalohany */}
            <div className="pt-5">
              <ul className="flex">
                <li className="ml-3 mr-2">
                  <Link href="/page/patient/analyse">
                    <span className="border-b-2 border-blue-600 text-blue-600 mr-1 flex text-[14px] font-sans">
                      Analyse
                    </span>
                  </Link>
                </li>
                <li className="mr-2">
                  <Link href="/page/patient/resultat">
                    <span className="border-b-2 hover:border-blue-500 hover:text-blue-500 transition duration-200 border-gray-300 text-gray-600 mr-1 flex text-[14px] font-sans">
                      Résultat
                    </span>
                  </Link>
                </li>
                <li className="mr-[60%]">
                  <Link href="/page/patient/non_livre">
                    <span className="border-b-2 hover:border-blue-500 hover:text-blue-500 transition duration-200 border-gray-300 text-gray-600 mr-1 flex text-[14px] font-sans">
                      Livraison
                    </span>
                  </Link>
                </li>
                <li>
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <>
                        <Button
                          variant="contained"
                          {...bindTrigger(popupState)}
                          className="h-[35px] shadow-none mr-2 text-white bg-green-500 hover:bg-green-600"
                        >
                          <GiMicroscope className="mr-2 text-[18px]" />
                          <span className="text-[12px] pt-1 font-semibold">
                            Analyse
                          </span>
                        </Button>
                        <Menu {...bindMenu(popupState)} className="mt-1">
                          <MenuItem
                            onClick={() => {
                              setShowModal(true),
                              popupState.close(),
                              setShowTable(false),
                              setShowTableH(false)
                            }}
                          >
                            Hospitalisé
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setShowModalee(true),
                              popupState.close(),
                              setShowTable(false),
                              setShowTableH(false)
                            }}
                          >
                            Externe
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </PopupState>
                </li>
                <li>
                  <Button
                    className="bg-blue-500 w-[130px] h-[35px] hover:bg-blue-600 text-white font-semibold"
                    type="submit"
                    onClick={() => setShowModale(true)}
                  >
                    <FaUserMd className="mr-2 text-[18px]" />
                    <span className="text-[12px] pt-1 font-semibold">
                      Préscripteur
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
              <p className="ml-2 mt-2 font-sans">Listes des analyses:</p>
            </div>

            <div className="flex mt-4 ml-10">
              <SelectComponent 
                className="w-[200px] h-[35px] ml-3"
                >
                  <option value="option1">Tous</option>
                  <option value="option2">Ajourd'hui</option>
              </SelectComponent>

              <SelectComponent className="w-[200px] h-[35px] ml-3" 
                value={selectData} 
                onChange={(value) => {
                  setSelectData(value);
                  different();
                }}
              >
                <option value="hospi">Patients hospitalisés</option>
                <option value="externe">Patients externes</option>
              </SelectComponent>

              <InputComponent
                type="text"
                className="ml-3 block w-[200px] h-[35px]"
                placeholder="Recherche..."
              />

              <Button className="w-[100px] h-[35px] ml-3 bg-orange-800 hover:bg-orange-900 text-white" onClick={()=> setShowTable(true)}>
                <FaFileExport className="text-[18px]" />
                <span className="ml-1 text-[11px]">Exporter</span>
              </Button>
            </div>
          </div>
        </div>

        {/* MODAL D'AJOUT HOSPITALISE */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={enregistre}>
              <div className="bg-white w-[720px] h-[610px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[690px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowModal(false),setShowTableH(true), setSelectData("hospi")}}
                >
                  X
                </button>
                <div className="flex ml-4 mb-6">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <GiMicroscope className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Examen démandé
                  </p>
                  <br />
                </div>

                <hr className="w-[300px] ml-[200px] mt-2" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    {/* PATIENT */}
                    <p className="flex ml-9 font-semibold">
                      <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                      Information du patient hospitalisé
                    </p>

                    {/* REHEFA SELECTENA ANATY INPUT NY NUMERO REHETRA */}
                    {/* <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>N°patient*</InputLabel>
                      <Select
                        label="N°patient*"
                        value={selectedNumber}
                        onChange={handleSelectChange}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>

                        {hospi.map((num) => (
                          <MenuItem key={num} value={num}>
                            {num}H
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}

                    <TextField
                      id="outlined-basic"
                      label="Num du patient"
                      value={max+"H"}
                      variant="outlined"
                      className="mt-4 ml-10 w-[200px]"
                    />

                    <TextField
                      id="outlined-basic"
                      label="Nom du patient"
                      value={name}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <TextField
                      id="outlined-basic"
                      label="Service"
                      value={service}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Id prescripteur*</InputLabel>
                      <Select
                        label="Id prescripteur*"
                        value={selectedMatri}
                        onChange={handleSelectChangeM}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {medecinL.map((matricule) => (
                          <MenuItem key={matricule} value={matricule}>
                            {matricule}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      id="outlined-basic"
                      label="Nom precripteur"
                      value={matri}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />
                    <TextField
                      id="outlined-basic"
                      label="Service prescripteur"
                      value={serviceM}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    /> <br />

                    <TextField
                      name="rc"
                      value={valueAjout.rc}
                      onChange={inputchange}
                      id="residence clinique"
                      label="residence clinique"
                      variant="outlined"
                      className="mt-4 ml-10 w-[640px]"
                    /> 

                    {/* ANALYSE */}
                    <p className="flex ml-9 mt-5 font-semibold">
                      <GiHypodermicTest className="mt-1 ml-1 mr-1" />
                      Analyse demandés
                    </p>
                    <FormControl className="w-[200px] ml-10 mt-2">
                      <InputLabel>Hématologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Hématologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {hematologie.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Biochimie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Biochimie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Sanguine</em>
                        </MenuItem>
                        {biosang.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}

                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Urinaire</em>
                        </MenuItem>
                        {biouri.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                        <MenuItem value="" disabled className="font-bold">
                          <em>Liquide Biologique</em>
                        </MenuItem>
                        {liquide.map((name) => (
                          <MenuItem
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Sero-immunologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Sero-immunologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {sero.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Bacteriologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Bacteriologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {bact.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-4">
                      <InputLabel>Parastologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Parastologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {para.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      id="outlined-basic"
                      label="Autre"
                      name="examen"
                      value={valueAjout.examen}
                      onChange={inputchange}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    /> <br />

                    <div className="flex float-right">
                      <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 mr-2 mt-5 w-[150px] h-[35px]">
                        <MdSave className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Enregistrer</span>
                      </Button>

                      <Button className="text-white bg-gray-500 hover:bg-gray-700 float-right mr-[12%] mt-5 w-[150px] h-[35px]">
                        <MdCancel className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Annuler</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer/>
            </form>
          </div>
        )}

        {/* MODAL D'AJOUT EXTERNE */}
        {showModalee && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={enregistreE}>
              <div className="bg-white w-[720px] h-[610px] rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[690px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowModalee(false), setShowTable(true), setSelectData("externe")}}
                >
                  X
                </button>
                <div className="flex ml-4 mb-6">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <GiMicroscope className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Examen démandé
                  </p>
                  <br />
                </div>

                <hr className="w-[300px] ml-[200px] mt-2" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    {/* PATIENT */}
                    <p className="flex ml-9 font-semibold">
                      <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                      Information du patient externe
                    </p>

                    {/* <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>N°patient*</InputLabel>
                      <Select
                        label="N°patient*"
                        value={selectedNumberE}
                        onChange={handleSelectChangeE}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {externe.map((numE) => (
                          <MenuItem key={numE} value={numE}>
                            {numE}E
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}

                    <TextField
                      id="outlined-basic"
                      label="Num du patient"
                      value={maxE+"E"}
                      variant="outlined"
                      className="mt-4 ml-10 w-[200px]"
                    />

                    <TextField
                      id="outlined-basic"
                      label="Nom du patient"
                      value={nomE}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <TextField
                      id="outlined-basic"
                      label="Adresse"
                      value={adressE}
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Id prescripteur*</InputLabel>
                      <Select label="Id prescripteur*" 
                        value={selectedNomE} 
                        onChange={handleSelectChangeME}
                        MenuProps={MenuProps}
                        >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {medecinE.map((nomE) => (
                          <MenuItem key={nomE} value={nomE}>
                            {nomE}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      value={nomME}
                      id="outlined-basic"
                      label="Nom precripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />
                    <TextField
                      value={contactE}
                      id="outlined-basic"
                      label="Contact prescripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    /> <br />

                    <TextField
                      name="rc"
                      value={formeValues.rc}
                      onChange={inputchangeE}
                      id="residence clinique"
                      label="residence clinique"
                      variant="outlined"
                      className="mt-4 ml-10 w-[640px]"
                    /> 

                    {/* ANALYSE */}
                    <p className="flex ml-9 mt-5 font-semibold">
                      <GiHypodermicTest className="mt-1 ml-1 mr-1" />
                      Analyse demandés
                    </p>
                    <FormControl className="w-[200px] ml-10 mt-2">
                      <InputLabel>Hématologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Hématologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {hematologie.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Biochimie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Biochimie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Sanguine</em>
                        </MenuItem>
                        {biosang.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}

                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Urinaire</em>
                        </MenuItem>
                        {biouri.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                        <MenuItem value="" disabled className="font-bold">
                          <em>Liquide Biologique</em>
                        </MenuItem>
                        {liquide.map((name) => (
                          <MenuItem
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Sero-immunologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Sero-immunologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {sero.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Bacteriologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Bacteriologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {bact.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-4">
                      <InputLabel>Parastologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Parastologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {para.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      name="examen"
                      value={valueAjout.examen}
                      onChange={inputchangeE}
                      id="outlined-basic"
                      label="Autre"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    /><br />

                    <div className="flex float-right">
                      <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 mr-2 mt-5 w-[150px] h-[35px]">
                        <MdSave className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Enregistrer</span>
                      </Button>

                      <Button className="text-white bg-gray-500 hover:bg-gray-700 float-right mr-[12%] mt-5 w-[150px] h-[35px]">
                        <MdCancel className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Annuler</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer/>
            </form>
          </div>
        )}

        {/* MODAL MODIFICATION */}
        {showModi && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form className="flex">
              <div className="bg-white w-[720px] h-[550px] rounded">
                <div className="flex ml-4 mb-6 mt-6">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <GiMicroscope className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    Mise à jour d'examen démandé
                  </p>
                  <br />
                </div>

                <hr className="w-[300px] ml-[200px] mt-2" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    {/* PATIENT */}
                    <p className="flex ml-9 font-semibold">
                      <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                      Information du patient externe
                    </p>

                    <TextField
                      value={selectAnalyse?.num+"H"}
                      id="outlined-basic"
                      label="Num du patient"
                      variant="outlined"
                      className="mt-4 ml-10 w-[200px]"
                    />

                    <TextField
                      value={selectAnalyse?.nom}
                      id="outlined-basic"
                      label="Nom du patient"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />
                    <TextField
                      value={selectAnalyse?.service}
                      id="outlined-basic"
                      label="Service"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Id prescripteur*</InputLabel>
                      <Select label="Id prescripteur*" value={valiny}>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {medecinL.map((matricule) => (
                          <MenuItem key={matricule} value={matricule}>
                            {matricule}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      value={selectAnalyse?.nomP}
                      id="outlined-basic"
                      label="Nom precripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />
                    <TextField
                      value={serv}
                      id="outlined-basic"
                      label="Contact prescripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    {/* ANALYSE */}
                    <p className="flex ml-9 mt-5 font-semibold">
                      <GiHypodermicTest className="mt-1 ml-1 mr-1" />
                      Analyse demandés
                    </p>
                    <FormControl className="w-[200px] ml-10 mt-2">
                      <InputLabel>Hématologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Hématologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {hematologie.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Biochimie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Biochimie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Sanguine</em>
                        </MenuItem>
                        {biosang.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}

                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Urinaire</em>
                        </MenuItem>
                        {biouri.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                        <MenuItem value="" disabled className="font-bold">
                          <em>Liquide Biologique</em>
                        </MenuItem>
                        {liquide.map((name) => (
                          <MenuItem
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Sero-immunologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Sero-immunologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {sero.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Bacteriologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Bacteriologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {bact.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-4">
                      <InputLabel>Parastologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Parastologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {para.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      value={exa}
                      id="outlined-basic"
                      label="Autre"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />

                    <Button className="text-white bg-green-800 hover:bg-green-700 float-right mr-[290px] mt-5 w-[150px] h-[35px]">
                      <IoIosRefreshCircle className="text-[20px] ml-1 mr-1" />
                      <span className="text-[12px]">Modifier</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-[250px] h-[550px] bg-white ml-3 rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm ml-[220px] mt-1 text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowModi(false), setShowTableH(true), setSelectData("hospi")}}
                >
                  X
                </button>
                <span className="flex ml-3">
                  <BsListNested className="text-[30px]" />
                  <p className="ml-2 font-bold text-[22px]">ASP</p>
                  <br />
                </span>
                <hr className="w-[100px] ml-[70px] mt-5" /> <br />
                <p className="flex ml-5 font-semibold">
                  <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                  Quittance
                </p>
                <TextField
                  name="num_quit"
                  value={selectAnalyse?.num_quit}
                  onChange={inputchangeModi}
                  id="outlined-basic"
                  label="N° quittance"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />
                <TextField
                  name="rc"
                  value={selectAnalyse?.rc}
                  onChange={inputchangeModi}
                  id="outlined-basic"
                  label="RC"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />
                <p className="flex mt-5 ml-5 font-semibold">
                  <TbBrandProducthunt className="mt-1 ml-1 mr-1" /> Autre
                </p>

                <TextField
                  value={selectAnalyse?.payement}
                  id="outlined-basic"
                  label="Net à payé"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />

                <FormControl className="mt-4 ml-6 w-[200px]">
                  <InputLabel>Resultat</InputLabel>
                  <Select label="Resultat">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="2H">En attente</MenuItem>
                    <MenuItem value="1H">En cours</MenuItem>
                    <MenuItem value="1H">Validé</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </form>
          </div>
        )}

        {/* MODAL VUE */}
        {showVue && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form className="flex">
              <div className="bg-white w-[720px] h-[490px] rounded">
                <div className="flex ml-4 mb-6 mt-6">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <BsFillEyeFill className="text-green-700 ml-[7px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">
                    A propos d' examen démandé
                  </p>
                  <br />
                </div>

                <hr className="w-[300px] ml-[200px] mt-2" />

                {/* INFORMATION DES PATIENTS */}
                <div className="mt-5">
                  <div>
                    {/* PATIENT */}
                    <p className="flex ml-9 font-semibold">
                      <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                      Information du patient externe
                    </p>
                    <TextField
                      name="num"
                      value={selectvue?.num+"H" || selectVueE?.numE+"E"}
                      id="outlined-basic"
                      label="Numero du patient"
                      variant="outlined"
                      className="mt-2 ml-10 w-[200px]"
                    />

                    <TextField
                      name="nom"
                      value={selectvue?.nom || selectVueE?.nomE}
                      id="outlined-basic"
                      label="Nom du patient"
                      variant="outlined"
                      className="mt-2 ml-5 w-[200px]"
                    />

                    <TextField
                      name="service"
                      value={selectvue?.service}
                      id="outlined-basic"
                      label="Service"
                      variant="outlined"
                      className="mt-2 ml-5 w-[200px]"
                    />

                    <TextField
                      name="Matricule"
                      id="outlined-basic"
                      label="Service"
                      variant="outlined"
                      className="mt-4 ml-10 w-[200px]"
                    />

                    <TextField
                      id="outlined-basic"
                      label="Nom precripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                      disabled
                    />
                    <TextField
                      id="outlined-basic"
                      label="Contact prescripteur"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                      disabled
                    />

                    {/* ANALYSE */}
                    <p className="flex ml-9 mt-5 font-semibold">
                      <GiHypodermicTest className="mt-1 ml-1 mr-1" />
                      Analyse demandés
                    </p>
                    <FormControl className="w-[200px] ml-10 mt-2">
                      <InputLabel>Hématologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Hématologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {hematologie.map((name) => (
                          <MenuItem value={formeValues.examen}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Biochimie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Biochimie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Sanguine</em>
                        </MenuItem>
                        {biosang.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}

                        <MenuItem value="" disabled className="font-bold">
                          <em>Biochimie Urinaire</em>
                        </MenuItem>
                        {biouri.map((name) => (
                          <MenuItem value={name}>{name}</MenuItem>
                        ))}
                        <MenuItem value="" disabled className="font-bold">
                          <em>Liquide Biologique</em>
                        </MenuItem>
                        {liquide.map((name) => (
                          <MenuItem
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-2">
                      <InputLabel>Sero-immunologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Sero-immunologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {sero.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <br />

                    <FormControl className="w-[200px] ml-10 mt-4">
                      <InputLabel>Bacteriologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Bacteriologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {bact.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl className="w-[200px] ml-5 mt-4">
                      <InputLabel>Parastologie</InputLabel>
                      <Select
                        multiple // ty le matonga anazy selectena maro
                        value={personName} // le valeur ao anatiny
                        onChange={handleChange}
                        input={<OutlinedInput label="Parastologie" />} // karazana
                        MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                      >
                        {para.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      id="outlined-basic"
                      label="Autre"
                      variant="outlined"
                      className="mt-4 ml-5 w-[200px]"
                    />
                  </div>
                </div>
              </div>

              <div className="w-[250px] h-[490px] bg-white ml-3 rounded">
                <button
                  className="bg-white w-6 h-6 rounded-sm ml-[220px] mt-1 text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowVue(false), setShowTableH(true), setSelectData("hospi")}}
                >
                  X
                </button>
                <span className="flex ml-3">
                  <BsListNested className="text-[30px]" />
                  <p className="ml-2 font-bold text-[22px]">Son ASP</p>
                  <br />
                </span>
                <hr className="w-[100px] ml-[70px] mt-5" /> <br />
                <p className="flex ml-5 font-semibold">
                  <IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" />{" "}
                  Quittance
                </p>
                <TextField
                  id="outlined-basic"
                  label="N° quittance"
                  variant="outlined"
                  className="mt-2 ml-6 w-[200px]"
                />
                <TextField
                  id="outlined-basic"
                  label="RC"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />
                <p className="flex mt-5 ml-5 font-semibold">
                  <TbBrandProducthunt className="mt-1 ml-1 mr-1" /> Autre
                </p>
                <TextField
                  id="outlined-basic"
                  label="Net à payer"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />
                <TextField
                  id="outlined-basic"
                  label="Resultat"
                  variant="outlined"
                  className="mt-4 ml-6 w-[200px]"
                />
              </div>
            </form>
          </div>
        )}

        {/* MODAL POURSUIVRE */}
        {showPour && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center transition-opacity duration-500 ease-out">
            <form onSubmit={pour}>
              <div id="modal" className="bg-white w-[480px] h-[330px] rounded ">
                <button
                  className="bg-white w-6 h-6 rounded-sm mt-1 mx-[450px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                  onClick={() =>{setShowPour(false), setShowTableH(true), setSelectData("hospi")}}
                >
                  X
                </button>
                <div className="flex ml-4">
                  <div className="bg-green-400 rounded-[20px] w-10 h-10">
                    <div className="mt-2 ml-[1px]">
                      <MdPaid className="text-green-700 ml-[6px] text-[25px]" />
                    </div>
                  </div>
                  <p className="ml-2 mt-1 font-bold text-[22px]">Payement</p>
                </div>
                <hr className="w-[200px] ml-[140px] mt-4 mb-2" />
                <div className="mt-8">
                  {/* INFORMATION DES PATIENTS */}
                  <TextField
                    name="numE" 
                    value={selectvue?.num+"H" || selectVueE?.numE+"E"}
                    // value={selectVueE?.numE+"E" || selectvue?.num+"H"}
                    id="outlined-basic"
                    label="N° patient"
                    variant="outlined"
                    className=" ml-7 w-[200px]"
                  />

                  <TextField
                    name="nom"
                    value={selectvue?.nom || selectVueE?.nomE}
                    id="outlined-basic"
                    label="Nom"
                    variant="outlined"
                    className=" ml-6 w-[200px]"
                  />
                  <TextField
                    name="num_quit"
                    id="outlined-basic"
                    label="N° quittance"
                    variant="outlined"
                    value={modiPour?.num_quit}
                    onChange={inputchangePour}
                    className="mt-5 ml-7 w-[423px]"
                  />
                  
                  {/* <FormControl className="mt-3 ml-7 w-[200px]">
                    <InputLabel>Net à payé</InputLabel>
                    <Select label="Net à payé*">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1H">Payé</MenuItem>
                      <MenuItem value="2H">Non payé</MenuItem>
                    </Select>
                  </FormControl> */}

                  <div className="flex float-right">
                      <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 mr-2 mt-5 w-[150px] h-[35px]">
                        <IoMdRefreshCircle className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Poursuivre</span>
                      </Button>

                      <Button className="text-white bg-gray-500 hover:bg-gray-700 float-right mr-[10%] mt-5 w-[150px] h-[35px]">
                        <MdCancel className="text-[15px] ml-1 mr-1" />
                        <span className="text-[12px]">Annuler</span>
                      </Button>
                  </div>
                </div>
              </div>
              <ToastContainer/>
            </form>
          </div>
        )}

        {/* MODAL D ASP Hospitalise*/}
        {showAsp && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[550px] h-[620px] bg-white rounded">
              <button
                className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100 "
                onClick={() =>{setSelectData("hospi"),setShowTableH(true), setShowAsp(false)}}
              >
                X
              </button>
              <form className="w-[480px] h-[520px] border-2 ml-9">
                <div className="text-center">
                  <h1 className="font-medium font-serif text-[12px] mt-2">
                    CHU TAMBOHOBE FIANARANTSOA
                  </h1>
                  <h1 className="font-medium font-serif text-[12px] mt-1">
                    SERVICE LABORATOIRE
                  </h1>
                  <h1 className="font-bold font-serif text-[15px] mt-2">
                    FICHE DE PAYEMENT
                  </h1>
                </div>
                <div className="text-[13px] ml-2">
                  <p className="mt-1">Quittance N°: </p>
                  <p className="mt-1">Nom et prénom: {recherche?.nom} {recherche?.prenom}</p>
                  <span className="flex mt-1">
                    <p className="mr-20">Age: {recherche?.age}</p>
                    <p>Sexe: {recherche?.sexe}</p>
                  </span>
                  <p className="mt-1">RC: {recherche?.rc}</p>
                  <p className="mt-1">Précripteur: {recherche?.nomP}</p>

                  <table className="border-2 border-black mt-2 w-[460px] text-center">
                    <tr className="border">
                      <th className="border">ANALYSES PRESCRITES</th>
                      <th className="border">COUTS</th>
                    </tr>
                    <tr>
                      <td className="border"> {examena?.examen}</td>
                      <td className="border">d</td>
                    </tr>
                    <tr>
                      <td className="border font-semibold">ACCESSOIRES</td>
                      <td className="border font-semibold">Ar 2000</td>
                    </tr>
                    <tr>
                      <td className="border font-semibold">NET A PAYER</td>
                      <td className="border font-semibold">Ar</td>
                    </tr>
                  </table>
                  <p className="font-serif mt-2">Tambohobe le,  {anio}</p>
                </div>
              </form>
              <Button onClick={()=>{setShowTableH(true), setShowAsp(false)}} className="bg-cyan-800 float-right mr-8 hover:bg-cyan-700 text-white mt-[15px]">
                <BsFillPrinterFill className="mr-1" /> Imprimer
              </Button>
            </div>
          </div>
        )}

        {/* MODAL D ASP externe*/}
        {showAspE && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[550px] h-[620px] bg-white rounded">
              <button
                className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100 "
                onClick={() =>{setSelectData("externe"),setShowTable(true), setShowAspE(false)}}
              >
                X
              </button>
              <form className="w-[480px] h-[520px] border-2 ml-9">
                <div className="text-center">
                  <h1 className="font-medium font-serif text-[12px] mt-2">
                    CHU TAMBOHOBE FIANARANTSOA
                  </h1>
                  <h1 className="font-medium font-serif text-[12px] mt-1">
                    SERVICE LABORATOIRE
                  </h1>
                  <h1 className="font-bold font-serif text-[15px] mt-2">
                    FICHE DE PAYEMENT
                  </h1>
                </div>
                <div className="text-[13px] ml-2">
                  <p className="mt-1">Quittance N°: </p>
                  <p className="mt-1">Nom et prénom: {rechercheE?.nomE} {rechercheE?.prenomE}</p>
                  <span className="flex mt-1">
                    <p className="mr-20">Age: {rechercheE?.ageE}</p>
                    <p>Sexe: {rechercheE?.sexeE}</p>
                  </span>
                  <p className="mt-1">RC: {rechercheE?.rc}</p>
                  <p className="mt-1">Précripteur: {rechercheE?.nomME}</p>

                  <table className="border-2 border-black mt-2 w-[460px] text-center">
                    <tr className="border">
                      <th className="border">ANALYSES PRESCRITES</th>
                      <th className="border">COUTS</th>
                    </tr>
                    <tr>
                      <td className="border"> {examena?.examen}</td>
                      <td className="border">d</td>
                    </tr>
                    <tr>
                      <td className="border font-semibold">ACCESSOIRES</td>
                      <td className="border font-semibold">Ar 2000</td>
                    </tr>
                    <tr>
                      <td className="border font-semibold">NET A PAYER</td>
                      <td className="border font-semibold">Ar</td>
                    </tr>
                  </table>
                  <p className="font-serif mt-2">Tambohobe le, <span className="font-sans">{anio} </span></p>
                </div>
              </form>
              <Button onClick={()=>{setShowTable(true),setSelectData("externe"), setShowAspE(false)}} className="bg-cyan-800 float-right mr-8 hover:bg-cyan-700 text-white mt-[15px]">
                <BsFillPrinterFill className="mr-1" /> Imprimer
              </Button>
            </div>
          </div>
        )}

      </div>

        {/* MODAL AFFICHAGE TABLEAUX EXTERNE */}
        {
          showTable && (
            <div>
                <div className="w-[90%] h-[50%] ml-[8%] mt-[-33%]">
                  {isClient && (
                  <DataTable
                    columns={columnsE} 
                    data={donneevueE}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5]}
                    paginationComponentOptions={paginationOptions}
                  />
                 )}
              </div>
            </div>
          )
        }

        {/* MODAL AFFICHAGE TABLEAUX HOSPITALISE */}
        {
          showTableH && (
            <div>
                {loading ? (
                <LoadingSpiner/>
            ): (
                  <div className="w-[90%] h-[50%] ml-[8%] mt-[-33%]">
                {isClient && (
                  <DataTable
                    columns={columns}
                    data={donneevue}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5]}
                    paginationComponentOptions={paginationOptions}
                  />
               )}
            </div>
            )}
            </div>
          )
        }

      {isClient && (
        <AjoutMed isVisible={showModale} onClose={() => setShowModale(false)} />
      )}
    </>
  );
}