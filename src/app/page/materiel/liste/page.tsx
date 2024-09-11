"use client";
import { BiMessageAltError } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RiSlideshow4Fill } from "react-icons/ri";
import { useRouter } from "next/router";
import Menu from "../menu/page";
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false })

export default function listeMateriel() {

  // Gestion de compte
  const [count, setCount] = useState(null);

  const [count_bonne, setCount_bonne] = useState(null);

  const [count_mauvais, setCount_mauvais] = useState(null);

  const [count_moyen, setCount_moyen] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const myElementRef = useRef(null);

  // Définition de l'interface pour les données de les materiels
  interface MaterielData {
    id: string;
    nom_materiel: string;
    emplacement: string;
    date_arriver: Date;
    provenance: string;
    prix: number;
    etat: string
  }

  // 
  interface Recherche {
    searhTerm: string;
  }
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



  const [formValues, setFormValues] = useState({
    id: '',
    nom_materiel: '',
    etat: '',
    date_arriver: '',
    provenance: '',
    prix: '',
    emplacement: ''
  });

  // Composant de chargement personnalisé
  function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }



  // État pour stocker les valeurs du formulaire
  const today = new Date();

  // Formatage de la date selon vos besoins
  const daty = today.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  // Formes pour les historiques
  const [historiqueValues, setHistoriqueValues] = useState({
    date: daty,
    description: '',
    action: 'ajout de materiel',
    nombre: 1,
    quantite: 'sans',
    ajoute: 0,
    commentaire: 'sans'

  })



  // Formes pour les historiques
  const [historiqueModif, setHistoriqueModif] = useState({
    date: daty,
    description: formValues.nom_materiel,
    action: "modification d'etat",
    nombre: 1,
    quantite: 'sans',
    ajoute: 1,
    commentaire: ''

  })

  // Formes pour les historiques de suppression
  const table_id = formValues.nom_materiel + "_" + formValues.id;
  const [historiqueSup, setHistoriqueSup] = useState({
    date: daty,
    description: table_id,
    action: "suppression de materiel",
    nombre: 1,
    quantite: 'sans',
    ajoute: 1,
    commentaire: ''

  })

  // États pour stocker les données, les états de chargement, et la visibilité des modaux
  const [data, setData] = useState<MaterielData[]>([]);
  const [data_1, setData_1] = useState<HistoriqueData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Recherche :
  const filterData = data.filter(materiel => {
    return materiel.nom_materiel.toLocaleLowerCase().includes(searchTerm)
  })
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  }


  // countage :
  const total = filterData.length;
  const tambatra = data.length;
  const bonneTambatra = data.filter(materiel => materiel.etat === 'bonne').length;
  const moyenTambatra = data.filter(materiel => materiel.etat === 'moyen').length;
  const mauvaisTambatra = data.filter(materiel => materiel.etat === 'mauvais').length;

  const bonne = filterData.filter(materiel => materiel.etat === 'bonne').length;
  const moyen = filterData.filter(materiel => materiel.etat === 'moyen').length;
  const mauvais = filterData.filter(materiel => materiel.etat === 'mauvais').length;




  const [selectMateriel, setSelectMateriel] = useState<MaterielData | null>();

  // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleEdit = (materiel: MaterielData) => {
    setSelectMateriel(materiel);
    setFormValues(materiel);
    setHistoriqueModif({ ...historiqueModif, description: materiel.nom_materiel + "_" + materiel.id })
    setShow(true);
  };


  // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleSup = (materiel: MaterielData) => {
    setSelectMateriel(materiel);
    setFormValues(materiel);
    setHistoriqueSup({ ...historiqueSup, description: materiel.nom_materiel + "_" + materiel.id })
    setShow2(true);
  };



  // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleEditionEmplacement = (materiel: MaterielData) => {
    setSelectMateriel(materiel);
    setFormValues(materiel);
    setShow3(true);
  };

  // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleLien = (materiel: MaterielData) => {
    setSelectMateriel(materiel);
    setFormValues(materiel);
    setHistoriqueValues({ ...historiqueValues, description: materiel.nom_materiel })
    setShow4(true);
  };



  // Affichage des listes des materiels: 
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/materiel/liste');

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
  const [errors, setErrors] = useState('');
  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.length > 30) {

      setErrors('Le nom du materiel est trop long');
      return;
    }

    if (/\s/.test(value)) {
      setErrors("Remplacez les espaces par : '_' ");
      return;
    }

    if (!/^[a-zA-Z0-9||_]*$/.test(value)) {
      setErrors('Veuillez saisir seulement des caracteres sans accents');
      return;
    }

    if (value && parseFloat(value) < 0) {
      setErrors('Les chiffres négatifs ne sont pas autorisés.');
      return;
    }

    setErrors('');
    setHistoriqueValues({
      ...historiqueValues,
      [name]: value
    });
  };

  const [errors1, setErrors1] = useState('');
  const handleInputChangeNumeric = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.length > 3) {

      setErrors1('Le nombre du materiel est trop long');
      return;
    }



    if (value && parseFloat(value) < 1) {
      setErrors1('Le nombre du mteriel ajouté doit être supérieur ou égal à 1');
      return;
    }

    setErrors1('');
    setHistoriqueValues({
      ...historiqueValues,
      [name]: value
    });
  };

  const handleInputChangeNumeric1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.length > 3) {

      setErrors1('Le nombre du materiel est trop long');
      return;
    }



    if (value && parseFloat(value) < 1) {
      setErrors1('Le nombre du mteriel ajouté doit être supérieur ou égal à 1');
      return;
    }

    setErrors1('');
    setHistoriqueValues({
      ...historiqueValues,
      [name]: value
    });
  };


  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange_1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHistoriqueModif({
      ...historiqueModif,
      [name]: value
    });
  };

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange_2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHistoriqueSup({
      ...historiqueSup,
      [name]: value
    });
  };


  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange_4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues1({
      ...formValues1,
      [name]: value
    });
  };
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

  const handleClick = () => {
    Swal.fire({
      title: 'VOUS ETES SUR?',
      text: "De supprimer ce Materiel !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non, Annuler',
      confirmButtonText: 'Oui, Supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'SUPPRESSION REUSSIE!',
          text: "",
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Retour',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = ''
          }
        });
      }
    });
  };

  const columns = [
    {
      name: "ID",
      selector: (row: MaterielData) => row.id,
      sortable: true,
      width: "200px",
      cell: (row: MaterielData) => (
        <div style={{ backgroundColor: '#f0f0f0', padding: '5px' }}>
          {row.id}
        </div>
      ),
    },
    {
      name: "NOM",
      selector: (row: MaterielData) => row.nom_materiel,
      sortable: true,
      width: "250px",
    },
    {
      name: "EMPLACEMENT",
      selector: (row: MaterielData) => row.emplacement,
      sortable: true,
      width: "150px"
    },
    {
      name: "DATE D'ARRIVEE",
      selector: (row: MaterielData) => row.date_arriver,
      sortable: true,
      width: "200px"
    },
    {
      name: "PROVENANCE",
      selector: (row: MaterielData) => row.provenance,
      sortable: true,
      width: "200px"
    },
    {
      name: "ETAT",
      selector: (row: MaterielData) => row.etat,
      sortable: true,
      width: "150px"
    },
    {
      name: "ACTION",
      cell: (row: MaterielData) => (
        <div>
          <Tooltip title="Modification Etat" placement="left" arrow>
            <button className="cursor-pointers opacity-0.5 mr-3" >
              <Image
                onClick={() => handleEdit(row)}
                className=""
                src="/pic/services_50px.png"
                alt="Next.js Logo"
                width={22}
                height={30}
              />
            </button>

          </Tooltip>

          <Tooltip title="Suppression" placement="left" arrow>
            <button className="cursor-pointers opacity-0.5" >
              <Image
                onClick={() => handleSup(row)}
                className=""
                src="/pic/delete_bin_24px.png"
                alt="Next.js Logo"
                width={22}
                height={30}
              />
            </button>
          </Tooltip>

          <Tooltip title="Edition Emplacement" placement="left" arrow>
            <button className="cursor-pointers opacity-0.5" >
              <Image
                onClick={() => handleEditionEmplacement(row)}
                className="ml-2"
                src="/pic/pencil_24px.png"
                alt="Next.js Logo"
                width={22}
                height={30}
              />
            </button>
          </Tooltip>

          <Tooltip title="Nouveau quantité" placement="left" arrow>
            <button className="cursor-pointers opacity-0.5" >
              <Image
                onClick={() => handleLien(row)}
                className="ml-2"
                src="/pic/add_file_24px.png"
                alt="Next.js Logo"
                width={22}
                height={30}
              />
            </button>
          </Tooltip>


        </div>
      ),
      width: "200px"
    },
  ]

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    const Somme = async () => {
      try {
        const response = await fetch('http://localhost:3001/materiel/count');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nombre d\'enregistrements');
        }
        const data = await response.json();
        setCount(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


    const SommeBonne = async () => {
      try {
        const response = await fetch('http://localhost:3001/materiel/count-bonne');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nombre d\'enregistrements');
        }
        const data = await response.json();
        setCount_bonne(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const SommeMauvais = async () => {
      try {
        const response = await fetch('http://localhost:3001/materiel/count-mauvais');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nombre d\'enregistrements');
        }
        const data = await response.json();
        setCount_mauvais(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const SommeMoyen = async () => {
      try {
        const response = await fetch('http://localhost:3001/materiel/count-moyen');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nombre d\'enregistrements');
        }
        const data = await response.json();
        setCount_moyen(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 2000); // Délai de 2 secondes pour simuler le chargement des données


    Somme();
    SommeBonne();
    SommeMauvais();
    SommeMoyen();
    fetchData();

    if (myElementRef.current) {
      console.log('Élément trouvé:', myElementRef.current);
      myElementRef.current.style.color = 'blue';
    }

    // if (myElementRef.current) {
    //   console.log('Élément trouvé:', myElementRef.current);
    //   myElementRef.current.style.color = 'blue';
    // }
    setIsClient(true);
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
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);

  const tog = async (id) => {
    setShow(!show);
  }

  const tog1 = async (id) => {
    setShow1(!show1);
  }

  const tog2 = async (id) => {
    setShow2(!show2);
  }

  const tog3 = async (id) => {
    setShow3(!show3);
  }

  const tog4 = async (id) => {
    setShow4(!show4);
    //Remise à o :
  }

  const fermeture = async(id)=>{
    setShow4(!show4)
    setFormValues({
      id: '',
      nom_materiel: '',
      etat: '',
      date_arriver: '',
      provenance: '',
      prix: '',
      emplacement: ''
    });
    setHistoriqueValues({ ...historiqueValues, description: formValues.nom_materiel })
  }

  const ressourcePage = async (id) => {
    setShow5(!show5);
    window.location.href = '../ressource/liste'
  }

  const historiquePage = async (id) => {
    setShow5(!show5);
    window.location.href = '../materiel/histo'
  }




  const lien = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/historique/ajout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historiqueValues),
        });

      const result = await response.json();
      console.log("Historique ajoutée:", result);
      setData_1([...data_1, result]);
      setShow5(!show5);
      window.location.href = `../materiel/ajout/${historiqueValues.description}/${historiqueValues.nombre}`

    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }

  }

  const lien1 = async (e: React.FormEvent<HTMLFormElement>) => {
    // Formes pour les historiques
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/historique/ajout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historiqueValues),
        });

      const result = await response.json();
      console.log("Historique ajoutée:", result);

      setData_1([...data_1, result]);
      setShow5(!show5);
      window.location.href = `../materiel/ajout/${historiqueValues.description}/${historiqueValues.nombre}`
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }

  }

  // Fonction pour modification : 
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      title: 'VOUS ETES SUR?',
      text: "De passez ce materiel en " + " " + formValues.etat + " etat",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Retour',
      confirmButtonText: 'Oui, Confirmer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!formValues.id) return;
        try {
          const response = await fetch(`http://localhost:3001/materiel/modification/${formValues.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          });

          if (!response.ok) {
            throw new Error('Erreur lors de la modification du personnel');
          }

          const result = await response.json();    
          console.log("Materiel modifié :", result);
          setData(filterData.map(materiel => materiel.id === result.id ? result : materiel));
          setShow(!show);
          e.preventDefault();
          try {
            const response = await fetch('http://localhost:3001/historique/ajout',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(historiqueModif),
              });

            const result = await response.json();
            console.log("Historique ajoutée:", result);

            setData_1([...data_1, result]);

            // const newValue = formValues.nom_materiel;



            // window.location.href = ''
            // window.location.href = `../materiel/ajout/${historiqueValues.description}/${historiqueValues.nombre}`
          } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
          }


        } catch (error) {
          console.error("Erreur lors de la modification du materiel :", error);
        }


      }
    });



  };

  // Fonction de suppression
  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/materiel/supprimer/${formValues.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du materiel");
      }

      setData(filterData.filter(materiel => materiel.id !== formValues.id));
      setShow2(!show2);

      e.preventDefault();
      try {
        const response = await fetch('http://localhost:3001/historique/ajout',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historiqueSup),
          });

        const result = await response.json();
        console.log("Historique ajoutée:", result);

        setData_1([...data_1, result]);
        // window.location.href = `../materiel/ajout/${historiqueValues.description}/${historiqueValues.nombre}`
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }


    } catch (error) {
      console.error("Erreur lors de la suppression du personnel :", error);
    }
  };

  // Fonction pour modification : 
  const EditionEmplacement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/materiel/modification/${formValues.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du personnel');
      }

      const result = await response.json();
      console.log("Materiel modifié :", result);

      // setData(data.map(personnel => personnel.id === result.id ? result : personnel));
      setData(filterData.map(materiel => materiel.id === result.id ? result : materiel));
      setShow3(!show3)

    } catch (error) {
      console.error("Erreur lors de la modification du materiel :", error);
    }
  };
  return (
    <>
      <div className="flex">
        <Navbar />
        <div className="w-full h-[100vh] p-2">

          {/* tete */}
          <div>
            <Menu/>
          </div>

          {/* tsy kitihina */}
          <div className="w-full h-[2%]"></div>

          {/* contenu */}
          <div className="w-full h-[89%] shadow-md border border-gray-50 rounded">


            <div className=" text-start px-5 mt-7">
              {/* <Link href=""> */}
              <button className="border-green-800 w-[15%] border  px-5 py-1 rounded 
    hover:bg-gray-700  hover:text-white">
                <h1>MATERIEL</h1>
              </button>
              {/* </Link> */}

              {/* <Link href="../ressource/liste"> */}
              <button onClick={() => ressourcePage(id)} className="border w-[15%]  mx-4 px-5 py-1 text-gray-400 rounded bg-gray-100
    hover:bg-gray-700 hover:text-white">
                <h1>RESSOURCE</h1>
              </button>
              {/* </Link> */}

              {/* <Link href="../materiel/histo"> */}
              <button onClick={() => historiquePage(id)} className="border w-[15%]  mx-4 px-5 py-1 text-gray-400 rounded bg-gray-100
    hover:bg-gray-700 hover:text-white">
                <h1> HISTORIQUE </h1>
              </button>
              {/* </Link> */}
            </div>
            <div className="text-start rounded-lg  h-[10%] mt-7 mx-3 bg-white">
              <div className="border fixed bg-white ml-1.5 w-[13%] h-[10%] rounded-lg shadow-lg">
                <button className="">
                  <Image
                    className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-gray-300"
                    src="/pic/sigma_24px.png"
                    alt="Next.js Logo"
                    width={30}
                    height={30}
                  />
                </button>
                <button className="text-black font-extrabold ml-[50%] mt-1.5 text-[12px]">
                  Somme
                </button>
                <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                  {tambatra}
                </button>
              </div>
              <div className="border fixed bg-white ml-[20%] w-[13%] h-[10%] rounded-lg shadow-lg">
                <button className="">
                  <Image
                    className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-green-400"
                    src="/pic/thumbs_up_30px.png"
                    alt="Next.js Logo"
                    width={30}
                    height={30}
                  />
                </button>
                <button className="text-green-400 font-extrabold ml-[50%] mt-1.5 text-[12px]">
                  Bonne
                </button>
                <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                  {bonneTambatra}
                </button>
              </div>
              <div className="border fixed bg-white ml-[40%] w-[13%] h-[10%] rounded-lg shadow-lg">
                <button className="">
                  <Image
                    className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-yellow-500"
                    src="/pic/half_heart_30px.png"
                    alt="Next.js Logo"
                    width={30}
                    height={30}
                  />
                </button>
                <button className="text-yellow-500 font-extrabold ml-[50%] mt-1.5 text-[12px]">
                  Moyen
                </button>
                <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                  {moyenTambatra}
                </button>
              </div>
              <div className="border fixed bg-white ml-[60%] w-[13%] h-[10%] rounded-lg shadow-lg">
                <button className="">
                  <Image
                    className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-red-500"
                    src="/pic/thumbs_down_30px.png"
                    alt="Next.js Logo"
                    width={30}
                    height={30}
                  />
                </button>
                <button className="text-red-500 font-extrabold ml-[50%] mt-1.5 text-[12px]">
                  Mauvais
                </button>
                <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                  {mauvaisTambatra}
                </button>
              </div>
              <button onClick={() => tog1(id)} className="bg-blue-950 ml-[89%] mt-2  w-[10%] h-[75%] rounded-lg">
                <Image
                  className="fixed ml-3 mt-2"
                  src="/pic/plus_math_30px.png"
                  alt="Next.js Logo"
                  width={25}
                  height={30}
                />
                <h1 className="text-white ml-[30%] font-extrabold text-[10px]">Nouveau </h1>
                <h1 className="text-white ml-[30%] font-extrabold text-[15px]"> Materiel</h1>
              </button>
            </div>
            <div className="text-start h-[70%]  pt-[3%] my-5  mx-5 px-4">
              <div className="flex">
                <input className=" bg-white border-b-2 pl-2 text-[12px] text-black mb-5 mx-2 w-[40%] h-10"
                  placeholder="Nom du Materiel ..." name="searchTerm" value={searchTerm} onChange={handleSearchChange} />
                <button className="text-center">  <Image
                  className=" mx-4"
                  src="/pic/search_64px.png"
                  alt="Next.js Logo"
                  width={25}
                  height={30}
                /> </button>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (

                <div className="w-[95 %]  h-[90%]">




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
                  <h1 className="flex"><u> Effectifs</u>  : {total}  <Image
                    className="mx-4"
                    src="/pic/arrow_24px.png"
                    alt="Next.js Logo"
                    width={20}
                    height={30}
                  /> ♠ Bonne : {bonne} | ♠ Moyen : {moyen} | ♠ Mauvais : {mauvais} </h1>


                </div>

              )}


            </div>
          </div>
          {show && (
            <form onSubmit={handleEditSubmit}>
              <div id="information" className="h-[100%] w-[100%] fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
                <div id="modal" className="w-[30%] h-[82%] border-gray-400  rounded fixed bg-white">
                  <div>
                    <p className="border text-center  h-[35px]  font-extrabold bg-slate-300 text-[20px]"> Information Concernant ce Materiel :
                      <button>
                        <Image
                          className="ml-7  cursor-pointer"
                          onClick={() => tog(id)}
                          src="/pic/delete_48px.png"
                          alt="Next.js Logo"
                          width={25}
                          height={30}
                        />
                      </button>
                    </p>
                  </div>
                  <div className="mt-[2%]">
                    <TextField label=" * Nom_Id" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={table_id} name="description" onChange={handleInputChange_1} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Prix Unitaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.prix} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Arrivé(e) le" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.date_arriver} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label="* Commentaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" name="commentaire" value={historiqueModif.commentaire} onChange={handleInputChange_1} />
                  </div>
                  <div className="mt-[2%]">
                    <FormControl className="ml-[12%] mt-[5%] mb-3 w-[75%]">
                      <InputLabel>Etat du Materiel</InputLabel>
                      <Select required label="Etat du Materiel" onChange={e => setFormValues({ ...formValues, etat: e.target.value })}>
                        <MenuItem > <em><h1> <u> Etat actuel </u> : {formValues.etat} </h1>  </em> </MenuItem>
                        <MenuItem value="bonne"> Bonne Etat </MenuItem>
                        <MenuItem value="moyen"> Moyen Etat </MenuItem>
                        <MenuItem value="mauvais"> Mauvais Etat </MenuItem>
                      </Select>
                    </FormControl>
                    <br></br>
                    <button className="border mt-[10%] bg-green-600 text-white h-[35px] w-[100%]" type="submit"> Confirmer </button>
                  </div>
                </div>
              </div>
            </form>

          )
          }



          {show1 && (
            <div id="modal" className="h-[100%] w-[100%] fixed top-0 left-0 flex bg-black bg-opacity-25 justify-center items-center backdrop-blur-sm">
              <div className="w-[30%] h-[40%] border-gray-400  rounded fixed bg-white " id="info" >
                <div>
                  <p className="border  pt-1  h-[35px] flex text-center font-extrabold bg-slate-300"> <h1 className="ml-10"> Information Concernant ce Materiel:</h1>

                    <Image
                      onClick={() => tog1(id)}
                      className="fixed ml-[28%] cursor-pointer"
                      src="/pic/delete_48px.png "
                      alt="Next.js Logo"
                      width={20}
                      height={20}
                    />
                  </p>
                  {/* {daty} - {historiqueValues.description} - {historiqueValues.action} - {historiqueValues.ajoute} - {historiqueValues.commentaire} - {historiqueValues.quantite} */}
                </div>

                <form onSubmit={lien}>
                  <TextField required value={historiqueValues.description} onChange={handleInputChange} name="description" className="mx-[15%] mt-[10%] w-[65%]" label="Nom du Materiel" variant="outlined" />
                  {errors && (
                    <div id="errorTooltip" className="bg-none text-red-600 flex text-xs ml-10 pt-2 px-3 fixed">
                      <Image
                        onClick={() => tog1(id)}
                        className="mx-2"
                        src="/pic/high_priority_26px.png"
                        alt="Next.js Logo"
                        width={20}
                        height={10}
                      />  {errors}
                    </div>
                  )}

                  <TextField type="number" required value={historiqueValues.nombre} onChange={handleInputChangeNumeric} name="nombre" className="mx-[15%] mt-[10%] w-[65%]" label="Nombre du Materiel" variant="outlined" />
                  {errors1 && (
                    <div id="errorTooltip" className="bg-none text-red-600 flex text-xs ml-10 pt-2 px-3 fixed">
                      <Image
                        onClick={() => tog1(id)}
                        className="mx-2"
                        src="/pic/high_priority_26px.png"
                        alt="Next.js Logo"
                        width={20}
                        height={10}
                      />  {errors1}
                    </div>
                  )}
                  <button type="submit" className="border mt-[10%] bg-green-600 text-white h-[35px] w-[100%]"> Confirmer </button>
                </form>
                <ToastContainer />
              </div>
            </div>
          )
          }


          {show2 && (
            <form onSubmit={handleDeleteSubmit}>
              <div id="information" className="h-[100%] w-[100%] pt-2 fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
                <div id="modal" className="w-[30%] h-[82%] border-gray-400  rounded fixed bg-white">
                  <div>
                    <p className="border text-center  h-[35px]  font-extrabold bg-slate-300 text-[20px]"> Information Concernant ce Materiel :          </p>
                  </div>
                  <div className="mt-[2%]">
                    <TextField ref={myElementRef} label=" * Nom_Id" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.nom_materiel + "_" + formValues.id} name="description" onChange={handleInputChange_1} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Prix Unitaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.prix} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Arrivé(e) le" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.date_arriver} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label="* Etat actuel" className="ml-[12%] mt-[5%] mb-3 w-[75%]" name="etat" value={formValues.etat} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label="* Commentaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" name="commentaire" value={historiqueSup.commentaire} onChange={handleInputChange_2} />
                  </div>
                  <div className="mt-[2%] flex items-center">
                    <button className="border ml-[25%] py-2 px-3 bg-red-500 text-center text-white rounded" type="submit">Oui, Supprimer </button>
                    <button onClick={() => tog2(id)} className="border ml-2 py-2 px-3 bg-green-500 text-center text-white rounded" type="reset"> Annuler </button>


                  </div>
                </div>
              </div>
            </form>

          )
          }

          {show3 && (
            <form onSubmit={EditionEmplacement}>
              <div id="information" className="h-[100%] w-[100%] pt-2 fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
                <div id="modal" className="w-[30%] h-[82%] border-gray-400  rounded fixed bg-white">
                  <div>
                    <p className="border text-center  h-[35px]  font-extrabold bg-slate-300 text-[20px]"> Information Concernant ce Materiel :          </p>
                  </div>
                  <div className="mt-[2%]">
                    <TextField ref={myElementRef} label=" * Nom_Id" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.nom_materiel + "_" + formValues.id} name="description" onChange={handleInputChange_1} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Prix Unitaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.prix} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label=" * Arrivé(e) le" className="ml-[12%] mt-[5%] mb-3 w-[75%]" value={formValues.date_arriver} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label="* Commentaire" className="ml-[12%] mt-[5%] mb-3 w-[75%]" name="provenance" value={formValues.provenance} />
                  </div>
                  <div className="mt-[5%]">
                    <TextField label="* Emplacement" className="ml-[12%] mt-[5%] mb-3 w-[75%]" name="emplacement" value={formValues.emplacement} onChange={e => setFormValues({ ...formValues, emplacement: e.target.value })} />

                  </div>
                  <div className="mt-[2%] flex items-center">
                    <button className="border ml-[25%] py-2 px-3 bg-green-500 text-center text-white rounded" type="submit">Confirmer </button>
                    <button onClick={() => tog3(id)} className="border ml-2 py-2 px-3 bg-red-500 text-center text-white rounded" type="reset"> Annuler </button>


                  </div>
                </div>
              </div>
            </form>

          )
          }

          {show4 && (
            <div id="modal" className="h-[100%] w-[100%] fixed top-0 left-0 flex bg-black bg-opacity-25 justify-center items-center backdrop-blur-sm">
              <div className="w-[30%] h-[40%] border-gray-400  rounded fixed bg-white " id="info" >
                <div>
                  <p className="border  pt-1  h-[35px] flex text-center font-extrabold bg-slate-300"> <h1 className="ml-10"> Information Concernant ce Materiel:</h1>

                    <Image
                      onClick={() => fermeture(id)}
                      className="fixed ml-[28%] cursor-pointer"
                      src="/pic/delete_48px.png "
                      alt="Next.js Logo"
                      width={20}
                      height={20}
                    />
                  </p>
                  {/* {daty} - {historiqueValues.description} - {historiqueValues.action} - {historiqueValues.ajoute} - {historiqueValues.commentaire} - {historiqueValues.quantite} */}
                </div>

                <form onSubmit={lien1}>
                  <TextField required value={historiqueValues.description} name="description" className="mx-[15%] mt-[10%] w-[65%]" label="Nom du Materiel" variant="outlined" />
                  {errors && (
                    <div id="errorTooltip" className="bg-none text-red-600 flex text-xs ml-10 pt-2 px-3 fixed">
                      <Image
                        onClick={() => tog1(id)}
                        className="mx-2"
                        src="/pic/high_priority_26px.png"
                        alt="Next.js Logo"
                        width={20}
                        height={10}
                      />  {errors}
                    </div>
                  )}

                  <TextField type="number" value={historiqueValues.nombre} required onChange={handleInputChangeNumeric1}  name="nombre" className="mx-[15%] mt-[10%] w-[65%]" label="Nombre du Materiel" variant="outlined" />
                  {errors1 && (
                    <div id="errorTooltip" className="bg-none text-red-600 flex text-xs ml-10 pt-2 px-3 fixed">
                      <Image
                        onClick={() => tog4(id)}
                        className="mx-2"
                        src="/pic/high_priority_26px.png"
                        alt="Next.js Logo"
                        width={20}
                        height={10}
                      />  {errors1}
                    </div>
                  )}
                  <button type="submit" className="border mt-[10%] bg-green-600 text-white h-[35px] w-[100%]"> Confirmer </button>
                </form>
                <ToastContainer />
              </div>
            </div>
          )
          }

          {/* Chargement avant l'affichage du page suivant */}
          {show5 && (
            <div id="modal" className="h-[100%] w-[100%] fixed top-0 left-0 flex bg-white bg-opacity-25 justify-center items-center backdrop-blur-sm">
              {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div> */}
              {/* <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-500"  fill="none" viewBox="0 0 24 24">
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
      </div>
    </>



  );
};