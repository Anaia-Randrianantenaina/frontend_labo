"use client";
import { BiMessageAltError } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaUserInjured } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LocaleProvider from "antd/es/locale";
import { DatePicker } from "antd";
import Menu from "../menu/page";

export default function listeRessource() {
    // Composant de chargement personnalisé
    const [loading, setLoading] = useState(true);
    function LoadingSpinner() {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
            </div>
        );
    }

    function Indice() {
        return(
            <div>
                <Tooltip title="Niveau de stock Basse" placement="right" arrow >
                    <button className="cursor-pointers opacity-0.5" >
                        <Image
                            src="/pic/exclamation_mark_32px.png"
                            alt="Next.js Logo"
                            width={22}
                            height={30}
                        />
                    </button>
                </Tooltip>
            </div>
        )
    }


    // Définition de l'interface pour les données de les materiels
    interface RessourceData {
        id: number;

        presentation : string;

        designation: string;

        forme: string;

        dosage_forme: number;

        unite_dosage: string;

        unite: string;

        contenu: number;

        prix: number;

        date_prescription: Date;

        numero_lot: number;

        quantite: number;

        unite_mesure: string;

        dosage: number;

        utilise: number
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

    // État pour stocker les valeurs du formulaire
    const today = new Date();

    // Formatage de la date selon vos besoins
    const date = today.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const [ident,setIdent] = useState("")

    const [formValues, setFormValues] = useState({
        presentation: "",
        designation: "",
        forme: "pièce",
        dosage_forme: 1,
        unite_dosage: "",
        unite: "",
        contenu: null,
        prix: null,
        date_prescription: null,
        numero_lot: null,
        quantite: 0,
        unite_mesure: "pièce",
        dosage: 1,
        utilise: 0,
        date_ajout: null, // Ajout de date_ajout ici
    });
    
    let [plus, setPlus] = useState(0);
    
    
    // Formes pour les historiques
    const daty = date;
    const [historiqueValues, setHistoriqueValues] = useState({
        date: daty,
        description: formValues.presentation,
        action: 'ajout de ressource',
        nombre: 1,
        quantite: formValues.quantite + " " + formValues.unite,
        ajoute: 0,
        commentaire: 'sans'

    })

    // États pour stocker les données, les états de chargement, et la visibilité des modaux
    const [data, setData] = useState<RessourceData[]>([]);

    const [searchTerm, setSearchTerm] = useState("");

    const filterData = data.filter(ressource => {
        return ressource.presentation.toLocaleLowerCase().includes(searchTerm)
    })

    const nfmaxData = data.filter(ressource => {
        return ((ressource.contenu * ressource.dosage_forme * ressource.quantite * ressource.dosage) > (3 * ressource.utilise))
    })

    const nfminData = data.filter(ressource => {
        return ((ressource.contenu * ressource.dosage_forme * ressource.quantite * ressource.dosage) < (3 * ressource.utilise))
    })

    const nfegData = data.filter(ressource => {
        return ((ressource.contenu * ressource.dosage_forme * ressource.quantite * ressource.dosage) === (3*ressource.utilise))
    })

 const nfmax = nfmaxData.length;

 const nfeg = nfegData.length;

 const nfplusmin = nfminData.length;

 const nfmin = nfplusmin + nfeg;
    // isa

    const [indice, setIndice] = useState('');
    const tambatra = data.length;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    }

    // Affichage des listes des ressources: 
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/intrant/liste');

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


    // Toatify aseeho amin'ny notification
    const aseho = () => toast.success('Nouveau Intrant ajouté!',
        {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            // Temps avant la fermeture automatique (en millisecondes)
        });
    const asehoErreur = () => toast.error('Intrant non ajouté!',
        {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            // Temps avant la fermeture automatique (en millisecondes)
        });


    // Fonction d'ajout des nouveaux ressources : 
    const ajoutRessource = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       // Obtenir la date actuelle au format YYYY-MM-DD
    const today = new Date();
    const dateOnly = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Ajouter la date actuelle à formValues
    const formDataWithDate = {
        ...formValues,
        date_ajout: dateOnly, // Ajouter la date d'ajout sans l'heure
    };
        try {
            const response = await fetch('http://localhost:3001/intrant/ajout',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataWithDate),
                });

            const result = await response.json();

            if (response.ok) {
                console.log("Ressource ajoutée avec succès:", result);
                setData([...data, result]);
                aseho();
                setFormValues({
                    presentation: "",
                    designation: "",
                    forme: "pièce",
                    dosage_forme: 1,
                    unite_dosage: "",
                    unite: "",
                    contenu: null,
                    prix: null,
                    date_prescription: null,
                    numero_lot: null,
                    quantite: 0,
                    unite_mesure: "pièce",
                    dosage: 1,
                    utilise: 0,
                    date_ajout: null, // Réinitialiser date_ajout
                });

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
                    window.location.href = ''
                } catch (error) {
                    console.error("Erreur lors de la récupération des données :", error);
                }
            }
            else {
                // Si le succès n'est pas true
                console.error("Erreur lors de l'ajout de la ressource : ", result.message);
                asehoErreur();
              
            }
        }
        catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }

        // mampiditra any amin'ny historique
       
    };


    // Modification des ressources :
    const modificationRessource = async (e : React.FormEvent<HTMLFormElement>) => {
        try {
            const response = await fetch(`http://localhost:3001/intrant/modification/${ident}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
              });
    
         
               setShow1(!show1);
        } catch (error) {
            
        }
    }



    // Fonction pour gérer les changements dans les champs du formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    // Fonction pur gèrer les changements dans les champs numérics
    const [errors1, setErrors1] = useState('');
    const handleInputChangeNumeric = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value && parseFloat(value) < 1) {
            setErrors1("Le nombre inférieur à 1 n'est pas accépté");
            return;
        }

        if (!/^[Z0-9]*$/.test(value)) {
            setErrors('Veuillez saisir seulement des Chiffres');
            return;
        }

        setErrors1('');
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    // Fonction pour gérer les changements dans les champs du formulaire
    const [errors, setErrors] = useState('');
    const handleInputChangeId = () => {
        setFormValues({ ...formValues, presentation: formValues.designation + "/" + formValues.forme + "*" + formValues.dosage_forme + formValues.unite_dosage })
        const descri = formValues.designation + "/" + formValues.forme + "*" + formValues.dosage_forme + formValues.unite_dosage;
        setHistoriqueValues({
            date: daty,
            description: descri,
            action: 'ajout de ressource',
            nombre: 1,
            quantite: formValues.quantite + " " + formValues.unite + " de " + formValues.contenu + " " + formValues.forme,
            ajoute: 0,
            commentaire: 'sans'
        });
    };

    // Nouveau qunantité
    const Change_0 = () => {
        
        if (formValues.quantite < plus) {

        }
        else {
            let a = formValues.quantite;
            setFormValues({ ...formValues, quantite: a - plus })
            setPlus(0)
        }
    };
    const Change_1 = () => {
        if (plus < 1) {

        }
        else {
            setPlus(plus - 1)
            let a = formValues.quantite;
            setFormValues({ ...formValues, quantite: a - 1 })
        }
        
      
    };
    const Change_2 = () => {
        setPlus(plus + 1)
        let a = formValues.quantite;
        setFormValues({ ...formValues, quantite: a + 1 })
     };
     const Change_3 = () => {
        setPlus(plus + 10)
        let a = formValues.quantite;
        setFormValues({ ...formValues, quantite: a + 10 })
     };

    
    // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleEdit = (ressource: RessourceData) => {
    setFormValues(ressource);
    setIdent(ressource.id)
    //setHistoriqueModif({ ...historiqueModif, description: materiel.nom_materiel + "_" + materiel.id })
    setShow1(true);
  };

  const columns = [  
    {
        name: "N°",
        selector: (row: RessourceData) => row.id,
        sortable: true,
        width: "80px",
        cell: row => (
            <div>
                {row.id} 
            </div>
        )
    },
    {
        name: "Designation/Forme*Dosage",
        selector: (row: RessourceData) => row.presentation,
        sortable: true,
        width: "250px",
        cell: row => (
            <div style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
                {row.presentation}
            </div>
        ),
    },
    {
        name: "Unite",
        selector: (row: RessourceData) => row.unite,
        sortable: true,
        width: "150px",
        cell: row => (
            <div>
                {row.unite} / {row.contenu}
            </div>
        )
    },
    {
        name: "Prix Unitaire ",
        selector: (row: RessourceData) => row.prix,
        sortable: true,
        width: "150px",
        cell: row => (
            <div>
                {row.prix} Ariary /{row.unite}
            </div>
        )
    },
    {
        name: "Préscription",
        selector: (row: RessourceData) => row.date_prescription,
        sortable: true,
        width: "150px"
    },
    {
        name: "N° Lot",
        selector: (row: RessourceData) => row.numero_lot,
        sortable: true,
        width: "150px"
    },
    {
        name: "Qt Physique",
        selector: (row: RessourceData) => row.quantite,
        sortable: true,
        width: "150px",
        cell: row => (
            <div>
                    • {Math.round((row.contenu * row.dosage_forme * row.quantite * row.dosage - row.utilise)/(row.dosage * row.dosage_forme))} {row.forme}<br></br>
                    • {Math.round((row.contenu * row.dosage_forme * row.quantite * row.dosage - row.utilise)/(row.dosage * row.dosage_forme * row.contenu))} {row.unite} <br></br>
                
            </div>
        )
    },
    {
        name: "Qt Théorique",
        selector: (row: RessourceData) => row.quantite,
        sortable: true,
        width: "160px",
        cell: row => {
            const quantiteTheorique = row.contenu * row.dosage_forme * row.quantite * row.dosage - row.utilise;
            const alerte = quantiteTheorique < (3 * row.utilise);
            return (
                <div>
                    {/* Affichage de la quantité théorique */}
                    {alerte && <span className="flex text-red-600 text-2xs animate-blink-fast rounded-ful">  <Image
                            onClick={() => handleEdit(row)}
                            class="animationBlink" 
                            src="/pic/exclamation_mark_32px.png"
                            alt="Next.js Logo"
                            width={15}
                            height={17}
                        /> <h1 class="animationBlink"> Quantité critique </h1> </span>}
                   
                    {/* Calcul arrondi */}
                    • {quantiteTheorique} {row.unite_mesure}<br/>  
                    • {Math.round(quantiteTheorique / row.dosage)} {row.unite_dosage}<br/>
                    {/* Affichage de l'alerte si la condition est remplie */}               
                  
                </div>
            );
        }
    },
    
    {
        name: "",
        selector: row => row.action,
        sortable: true,
        width: "80px",
        cell: row => (
            <div>
                <Tooltip title="Nouveau quantité" placement="right" arrow >
                    <button className="cursor-pointers opacity-0.5" >
                        <Image
                            onClick={() => handleEdit(row)}
                            src="/pic/add_list_24px.png"
                            alt="Next.js Logo"
                            width={22}
                            height={30}
                        />

                    </button>
                </Tooltip>
            </div>
        )
    },
]
    // const data = [
    //     {
    //         id: "Lipase flacon*60ml", unite: "Boite/100", date: "10/11/2025", num: "17042", quantite_p: "12 Boite ", quantite_t: "72000 ul", prix: "10000 Ariary ",
    //         action: <Tooltip title="Nouveau quantité" placement="right" arrow >
    //             <button className="cursor-pointers opacity-0.5" >
    //                 <Image
    //                     onClick={() => tog1(id)}
    //                     src="/pic/add_list_24px.png"
    //                     alt="Next.js Logo"
    //                     width={22}
    //                     height={30}
    //                 />

    //             </button>
    //         </Tooltip>
    //     }
    // ]

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);

        fetchData();

        setTimeout(() => {
            setLoading(false);
        }, 1000); // Délai de 2 secondes pour simuler le chargement des données
    }, [])

    //Pagination
    const page = {
        rowsPageText: 'Lignes par pages : ',
        rangesSeparatorText: 'de',
        selectAllRowsItem: false,
        selectAllRowsItemText: 'Tous'
    }

    const id = ""
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);


    const tog = async (id) => {
        setShow(!show);
    }

    const tog1 = async (id) => {
        setShow1(!show1);
    }

    const fermeture = async (id) => {
        setShow(!show);
        setFormValues({
            presentation : "",

            designation: "",

            forme: "pièce",

            dosage_forme: 1,

            unite_dosage: "",

            unite: "",

            contenu: null,

            prix: null,

            date_prescription: null,

            numero_lot: null,

            quantite: null,

            unite_mesure: "pièce",

            dosage: 1,

            utilise : 0

        });
    }

    const fermeture1 = async (id: number) => {
        setShow1(!show1);
        setFormValues({
            presentation: "",

            designation: "",

            forme: "pièce",

            dosage_forme: 1,

            unite_dosage: "",

            unite: "",

            contenu: null,

            prix: null,

            date_prescription: null,

            numero_lot: null,

            quantite: 0,

            unite_mesure: "pièce",

            dosage: 1,

            utilise : 0

        });
        setPlus(0)
    }

    const [show5, setShow5] = useState(false);

    const materielPage = async (id) => {
        setShow5(!show5);
        window.location.href = '../materiel/liste'
    }

    const historiquePage = async (id) => {
        setShow5(!show5);
        window.location.href = '../materiel/histo'
    }

    return (
        <>

            <div className="flex">

                <Navbar />
                <div className="w-full h-[100vh] p-2">

              
                    <div><Menu/></div>
                    {/* tsy kitihina */}
                    <div className="w-full h-[2%]"></div>
                    <div className="w-full h-[89%] shadow-md border border-gray-50 rounded">

                        {/* <div className="bg-gray-500 mt-5 mx-4 rounded h-[3px]"> </div> */}

                        <div className=" text-start px-5 mt-7">
                            {/* <Link href="../materiel/liste"> */}
                            <button onClick={() => materielPage(id)} className=" w-[15%] border  px-5 py-1 rounded text-gray-300 bg-gray-100
   hover:bg-gray-700  hover:text-white">
                                <h1>MATERIEL</h1>
                            </button>
                            {/* </Link>
                    <Link href=""> */}
                            <button className="border border-green-800 w-[15%]  mx-4 px-5 py-1  rounded 
   hover:bg-gray-700 hover:text-white">
                                <h1>RESSOURCE</h1>
                            </button>
                            {/* </Link>
                    <Link href="../materiel/histo"> */}
                            <button onClick={() => historiquePage(id)} className=" w-[15%] border  px-5 py-1 rounded text-gray-300 bg-gray-100
   hover:bg-gray-700  hover:text-white">
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

                            <Tooltip title="Niveau de Stock Maximale" placement="left" arrow>
                                <div className="border fixed bg-white ml-[30%] w-[13%] h-[10%] rounded-lg shadow-lg">
                                    <button className="">
                                        <Image
                                            className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-green-400"
                                            src="/pic/time_card_30px.png"
                                            alt="Next.js Logo"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                    <button className="text-green-400 font-extrabold ml-[50%] mt-1.5 text-[12px]">
                                        N.S.Max
                                    </button>
                                    <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                                        {nfmax}
                                    </button>
                                </div>
                            </Tooltip>


                            <Tooltip title="Niveau de Stock Minimale" placement="left" arrow>
                                <div className="border fixed bg-white ml-[60%] w-[13%] h-[10%] rounded-lg shadow-lg">
                                    <button className="">
                                        <Image
                                            className="fixed ml-2 border rounded-full p-2 w-[3%] h-[6%] bg-red-500"
                                            src="/pic/expired_30px.png"
                                            alt="Next.js Logo"
                                            width={30}
                                            height={30}
                                        />
                                    </button>
                                    <button className="text-red-500 font-extrabold ml-[50%] mt-1.5 text-[12px]">
                                        N.S.Min
                                    </button>
                                    <button className="text-black ml-[50%] mt-1 font-extrabold text-[30px]">
                                        {nfmin}
                                    </button>
                                </div>
                            </Tooltip>


                            <button onClick={() => tog(id)} className="bg-blue-950 ml-[89%] mt-2  w-[10%] h-[75%] rounded-lg">
                                <Image
                                    className="fixed ml-3 mt-2"
                                    src="/pic/plus_math_30px.png"
                                    alt="Next.js Logo"
                                    width={25}
                                    height={30}
                                />
                                <h1 className="text-white ml-[30%] font-extrabold text-[10px]"> Nouveau </h1>
                                <h1 className="text-white ml-[30%] font-extrabold text-[15px]"> Ressource</h1>
                            </button>

                        </div>



                        <div className="text-start h-[70%] overflow-auto my-5 border mx-5 pt-4 px-4">
                            <input className=" bg-white border-b-2 pl-2 text-[12px] text-black  mx-2 w-[20%] h-10" placeholder="Nom du Ressource ..." value={searchTerm} onChange={handleSearchChange}></input>
                            <button className="text-center">  <Image
                                className="fixed mx-0"
                                src="/pic/search_64px.png"
                                alt="Next.js Logo"
                                width={25}
                                height={30}
                            />  <h2  className="opacity-0">Trouver</h2> </button>
                            {loading ? (
                                <LoadingSpinner />
                            ) : (


                                <div className="w-[95 %] h-[90%]">
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
                            )}
                        </div>

                    </div>

                    {show && (
                        <div id="information" className="h-[100%] w-[100%] fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
                            {
                                isClient && (
                                    <div id="modal" className="bg-white border shadow mt-[2%]  pb-4 p-3 justify-center items-center">
                                        <form onSubmit={ajoutRessource}>
                                            <div className="flex justify-center items-center text-green-900">
                                                INFORMATIONS CONCERNANT CE RESSOURCE : Id <input className="border-none bg-none text-center" value={formValues.presentation} required />
                                            </div>
                                            <hr className="mx-[10%]"></hr>
                                            {/* <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.id} name="designation" label="Désignation" variant="outlined" />
                                            </div> */}
                                            <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.designation} onChange={handleInputChange} name="designation" label="Désignation" variant="outlined" />
                                                <TextField className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.forme} onChange={handleInputChange} name="forme" label="Forme" variant="outlined" /> <br></br>
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[30%]" value={formValues.dosage_forme} onChange={handleInputChangeNumeric} type="number" name="dosage_forme" label="Dosage" variant="outlined" /> <br></br>
                                                <TextField className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[35%]" value={formValues.unite_dosage} onChange={handleInputChange} name="unite_dosage" label="Unité Dosage" variant="outlined" /> <br></br>
                                                {/* <h1 className="cursor-pointer px-3 py-2 bg-blue-700 text-white border rounded w-[30%] mt-[5%] mb-3" onClick={() => handleInputChangeId()}>Donner l'Id</h1> */}
                                            </div>

                                            <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.unite} onChange={handleInputChange} name="unite" label="Unité Commande" variant="outlined" />
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.contenu} onChange={handleInputChangeNumeric} type="number" name="contenu" label="Contenu par Unité" variant="outlined" /> <br></br>
                                                <TextField required className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.prix} onChange={handleInputChangeNumeric} name="prix" label="Prix par Unité" variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">

                                                
                                                <input 
                                                aria-label = "Date de prescription"
                                                    type="date"
                                                    className="ml-[5%] mt-[5%] mb-3 w-[35%] py-4 pl-3 border-gray-500 rounded"
                                                    name="date_prescription"
                                                    onChange={handleInputChange}
                                                />
                                                <h4 className="mx-3 mt-2 text-sm text-gray-500"> * Date de prescription</h4>
                                               {/* <TextField className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.date_prescription} name="date_prescription" label="Date de Préscription" variant="outlined" /> */}
                                                <TextField className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[60%]" value={formValues.numero_lot} onChange={handleInputChangeNumeric} type="number" name="numero_lot" label="N° Lot" variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.quantite} onChange={handleInputChangeNumeric} name="quantite" label="Quantité" variant="outlined" />
                                                <TextField className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Unité de Mesure * U.M" value={formValues.unite_mesure} onChange={handleInputChange} name="unite_mesure" variant="outlined" /> <br></br>
                                                <TextField required type="number" className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.dosage} onChange={handleInputChangeNumeric} name="dosage" label="1 Dosage = ... x U.M" variant="outlined" /> <br></br>
                                            </div>
                                            <div className="fixed h-4">
                                                {errors1 && (
                                                    <div id="errorTooltip" className="bg-none text-red-600  flex text-sm ml-10 pt-2 px-3 animate-bounce animation-delay-100">
                                                        <Image
                                                            onClick={() => tog1(id)}
                                                            class="animationBlink"
                                                            className="mx-2"
                                                            src="/pic/high_priority_26px.png"
                                                            alt="Next.js Logo"
                                                            width={20}
                                                            height={10}
                                                        />  <h1> {errors1} </h1> 
                                                    </div>
                                                )}

                                            </div>
                                            <div className="flex justify-center items-center">
                                                <button type="submit" onClick={() => handleInputChangeId()} className=" mt-[5%]  bg-green-600 px-5 py-1 rounded text-white font-medium">  Confirmer </button>
                                                <button type="reset" onClick={() => fermeture(id)} className=" mt-[5%] ml-[5%] bg-red-600 px-5 py-1 rounded text-white font-medium"> Annuler </button>
                                            </div>

                                        </form>
                                        <ToastContainer />
                                    </div>

                                )
                            }
                        </div>
                    )

                    }

                    {show1 && (
                        <div id="information" className="h-[100%] w-[100%] fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
                            {
                                isClient && (
                                    <div id="modal" className="bg-white border shadow mt-[2%]  pb-4 p-3 justify-center items-center">
                                        <form onSubmit={modificationRessource}>
                                            <div className="flex justify-center items-center text-green-900">
                                                INFORMATIONS CONCERNANT CE RESSOURCE : ID • {ident}
                                            </div>
                                            <hr className="mx-[10%]"></hr>
                                            <div className="flex justify-center items-center">

                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Désignation" value={formValues.designation} variant="outlined" />
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Forme" value={formValues.forme} variant="outlined" /> <br></br>
                                                <TextField required className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[35%]" label="Dosage" value={formValues.dosage_forme} variant="outlined" /> <br></br>
                                                <TextField className="mr-[5%] mt-[5%] mb-3 w-[70%]" value={formValues.unite_dosage} name="unite_dosage" label="Unité Dosage" variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Unité" value={formValues.unite} variant="outlined" />
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Contenu" value={formValues.contenu} variant="outlined" /> <br></br>
                                                <TextField required className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" label="Prix Unitaire" value={formValues.prix} variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <TextField  className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Date de Préscription" value={formValues.date_prescription} variant="outlined" />
                                                <TextField  className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" label="N° Lot" value={formValues.numero_lot} variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Quantié actuel" value={formValues.quantite}  variant="outlined" />
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Quantié Venue" value={plus} variant="outlined" />
                                                <TextField required className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Unité de Mesure * U.M" value={formValues.unite_mesure} variant="outlined" /> <br></br>
                                                <TextField required type="number" className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" label="1 Dosage = ... U.M" value={formValues.dosage} variant="outlined" /> <br></br>
                                            </div>
                                            <hr className="mx-[10%] my-[1%] bg-black"></hr>
                                            <div className="flex justify-center items-center">
                                                <div className="ml-[5%] mt-[5%] mb-3 w-[70%] justify-center">
                                                    <h4 className="mt-2 text-sm text-gray-500 w-[100%] text-center">Quantite venue</h4>
                                                    <div className="flex justify-center">
                                                    
                                                        <h1 onClick={() => Change_0()} className="border cursor-pointer bg-red-600 text-white rounded px-1 py-1 mr-2"> <Image
                                                            className="mx-2"
                                                            src="/pic/refresh_24px.png"
                                                            alt="Next.js Logo"
                                                            width={20}
                                                            height={10}
                                                        />  </h1>
                                                        <h1 onClick={() => Change_1()} className="border cursor-pointer bg-red-600 text-white rounded px-2 py-1 mr-2"> - 1 </h1>
                                                        <h1 onClick={() => Change_2()} className="border cursor-pointer bg-blue-600 text-white rounded px-2 py-1 mr-3"> + 1 </h1>
                                                        <h1 onClick={() => Change_3()} className="border cursor-pointer bg-green-600 text-white rounded px-2 py-1"> + 10 </h1>
                                                    </div>

                                                </div>
                                                {/* <TextField required type="number" name="ajoute" className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Quantié arrivé(e)" variant="outlined" /> */}
                                                <TextField  className="ml-[5%] mt-[5%] mb-3 w-[70%]" label="Date Préscription" variant="outlined" /> <br></br>
                                                <TextField  className="ml-[5%] mr-[5%] mt-[5%] mb-3 w-[70%]" label="Numero Lot" variant="outlined" /> <br></br>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <button type="submit" className=" mt-[5%]  bg-green-600 px-5 py-1 rounded text-white font-medium">  Confirmer </button>
                                                <button type="reset" onClick={() => fermeture1(id)} className=" mt-[5%] ml-[5%] bg-red-600 px-5 py-1 rounded text-white font-medium"> Annuler </button>
                                            </div>
                                        </form>
                                    </div>

                                )
                            }
                        </div>
                    )

                    }


                    {/* Chargement avant l'affichage du page suivant */}
                    {show5 && (
                        <div id="modal" className="h-[100%] w-[100%] fixed top-0 left-0 flex bg-white bg-opacity-25 justify-center items-center backdrop-blur-sm">
                            {/*  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
                            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-500"  fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="40" cy="40" r="38" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg> */}

                            {/* <div className="flex justify-center items-center space-x-1">
  <div className="w-1 h-6 bg-blue-500 animate-pulse"></div>
  <div className="w-1 h-6 bg-blue-500 animate-pulse animation-delay-200"></div>
  <div className="w-1 h-6 bg-blue-500 animate-pulse animation-delay-400"></div>
</div> */}
                            <div className="flex justify-center items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                                <div className="w-4 h-4 bg-blue-500 rounded-full mx-8 animate-ping animation-delay-200"></div>
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-ping animation-delay-400"></div>
                            </div>
                        </div>

                    )
                    }
                </div>
            </div>
        </>
    )
}

function isAfter(date: string, today: Date) {
    throw new Error("Function not implemented.");
}



