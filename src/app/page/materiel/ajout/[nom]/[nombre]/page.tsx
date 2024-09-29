"use client";
import { BiMessageAltError } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import'react-toastify/dist/ReactToastify.css';

export default function listeRessource() {

  const [historique, setHistorique] = useState({
    id: '',
    date: '',
    description: '',
    action: '',
    nombre: 1,
    quantite: '',
    ajoute: '',
    commentaire: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let [maxId, setMaxId] = useState(0);

  const [total, setTotal] = useState(0);
  let [numero, setNumero] = useState(1);

  const {nom} = useParams();

   // Etat pour stocker les valeurs du formulaire 
   const [formValues1, setFormValues1] = useState({
    message: 'Un nouveau matériels ajouté',
  });

  // Definition de l'interface pour les données de l'historique
  interface HistoriqueData {
    id : number;
    date: Date;
    description: string;
    action: string;
    nombre: number;
    quantite: string;
    ajoute: number;
    commentaire: string;
  }

  // Formes pour les historiques
  let isa = historique.nombre;
  let izy = isa - 1;

  interface NotifData {
    message: string ;
  }

  // États pour stocker les données, les états de chargement, et la visibilité des modaux
  const [dataN, setDataN] = useState<NotifData[]>([]);
  

  
  useEffect(() => {
    setIsClient(true);
    // Afficahage du dernier id du historique
    fetchMaxId();
    fetchMaxIdHistorique();
    setCurrentDate(date);
  }, [])

  // Dernier id 
  const fetchMaxIdHistorique = async () => {
    try {
      const response = await fetch('http://localhost:3001/historique/max-id');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique avec l\'ID maximal');
      }
      const data = await response.json();
      setHistorique(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    const nom = historique.description;
  };

  // Dernier valeur du materiel : 
  const fetchMaxId = async () => {
    try {
      const response = await fetch('http://localhost:3001/materiel/max');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique avec l\'ID maximal');
      }
      const data = await response.json();
      setMaxId(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  
  };
  const numer = maxId + 1;
  


  const [currentDate, setCurrentDate] = useState('');


  interface MaterielData {
    nom_materiel: string;
    emplacement: string;
    date_arriver: Date;
    provenance: string;
    prix: number;
    etat: string
  }

  const aseho = () => toast.success('Nouveau matériel ajouté!',
    {
      position: "top-center",
      autoClose: 1000,
       // Temps avant la fermeture automatique (en millisecondes)
    });



  // États pour stocker les données, les états de chargement, et la visibilité des modaux
  const [data, setData] = useState<MaterielData[]>([]);
  const [data_1, setData_1] = useState<HistoriqueData[]>([]);

  // État pour stocker les valeurs du formulaire
  const today = new Date();

  // Formatage de la date selon vos besoins
  const date = today.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });





  // const ide = nom + "_" + numero;
 // Forme pour les valeurs
 const [formValues, setFormValues] = useState({
  nom_materiel: nom,
  etat: 'bonne',
  date_arriver: date,
  provenance: '',
  prix: '',
  emplacement: ''
});
  

  // Fonction d'ajout des nouveaux materiels : 
  const ajoutMateriel = async (e: React.FormEvent<HTMLFormElement>) => {
    fetchMaxIdHistorique();
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/materiel/ajout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });

      const result = await response.json();
      console.log("Materiel ajoutée:", result);

      setData([...data, result]);

      setFormValues({
        nom_materiel: nom,
        etat: 'bonne',
        date_arriver: date,
        provenance: '',
        prix: '',
        emplacement: ''
      });

      setMaxId(maxId + 1);
      setTotal(total + 1);
      setNumero(numero + 1);

      if (izy === total) {
        Swal.fire({
          title: 'Ajout Terminé',
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Retour',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../../liste'
          }
          else {
            window.location.href = '../../liste'
          }
        });
      }

      aseho();
    }
    catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleAddSubmit1 = async () => {
    console.log("Données de notification envoyées :", formValues1);
    try {
        const response = await fetch('http://localhost:3001/notifs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues1),
        });

        const responseText = await response.text(); // Lire la réponse sous forme de texte brut pour inspection
        console.log("Réponse brute:", responseText);

        if (!response.ok) {
            console.error('Erreur dans la requête de notification:', response.status, response.statusText);
            throw new Error(`Erreur lors de l'ajout de la notification : ${response.statusText}`);
        }

        const result = JSON.parse(responseText);
        console.log("Notification ajoutée avec succès:", result);
        setDataN([...dataN, result]);

        setFormValues1({
            message: '',
        });
    } catch (error) {
        console.error('Erreur capturée lors de l\'ajout de la notification:', error);
    }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  await Promise.all([ajoutMateriel(e), handleAddSubmit1()]);
};



  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const [errors, setErrors] = useState('');
  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (value && parseFloat(value) < 0) {
      setErrors('Les chiffres négatifs ne sont pas autorisés.');
      return;
    }

    if (!/^\d*$/.test(value)) {
      setErrors('Veuillez saisir seulement des chiffres.');
      return false; // Validation échouée
    }

    setErrors('');
    setFormValues({
      ...formValues,
      [name]: value
    });
  };




  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    if (total === 0) {
      Swal.fire({
        title: 'VOUS ETES SUR?',
        text: "Vous annuler cette ajout !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Retour',
        confirmButtonText: 'Oui, Annuler'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`http://localhost:3001/historique/supprimer/${historique.id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
             
               window.location.href = '../../liste'
            }
            
          } catch (error) {
            
          }
        
        }
      });
    }
    else {
      Swal.fire({
        title: 'AJOUT INCOMPLETE!',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Retour',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = ''
        }
      });
    }
  };

  const [isClient, setIsClient] = useState(false);

  return (
    <>
      <div className="flex">
        {/* <Navbar /> */}
        <div className="w-full h-[100vh] p-2">

          {/* tete */}
          <div className="w-full h-[9%] shadow-md  border-gray-200 rounded">

            <p className="text-[15px]v pt-5 text-center"> NOUVEAUX MATERIELS
              <button className=" fixed mx-[20%]"><BiMessageAltError /></button>
              <button className=" fixed mx-[22%]"><IoMdNotificationsOutline /></button>
              <button className="fixed mx-[24%]"><AiOutlineUser /></button>
              <button className="fixed mx-[26%] font-medium">  Utilisateur  </button></p>

          </div>

          {/* tsy kitihina */}
          <div className="w-full h-[2%]"></div>

          {/* contenu */}
          <div className="w-full h-[87%]  border-gray-200 rounded">

            <div className="mt-5 border mx-7 rounded shadow-sm h-[10%]">
              <button className="ml-[1%] mt-6 text-[15px] fixed">  Ajout des nouveaux : {historique.description}(s) </button>
              <div className="ml-[70%] mt-2 text-[15px] fixed">
                <h1 className="mb-1 text-blue-700"> Effectifs à ajouter : {isa}</h1>
                <hr className="mb-1"></hr>
                <h1> Effectifs ajouté(es) : {total}</h1>
              </div>
              <button className="bg-none ml-[82%] mt-5 px-5 text-[20px]  rounded text-white fixed" >
                <Image
                  onClick={() => handleClick(maxId)}
                  className=""
                  src="/pic/delete_48px.png "
                  alt="Next.js Logo"
                  width={22}
                  height={30}
                /> </button>
            </div>
            {
              isClient && (
                <div className="mt-5 border pt-4 mx-7 rounded shadow-xl h-[85%] overflow-auto">

                  <form onSubmit={handleSubmit}>
                    <div className="mx-[25%]  pt-4  w-[50%] pb-4 p-3 ">
                      <div className="flex justify-center items-center pb-5">
                      <TextField className="mx-[5%] mt-[10%] mb-3 w-[80%] tet-[10px]" label="Identifiant du Materiel" value={numer} name="id" variant="outlined" />
                      </div>

                      <div className="flex justify-center items-center pb-5">
                      <TextField className="mx-[5%] mt-[15%] mb-3 w-[80%] tet-[10px]" label="Nom du Materiel" value={formValues.nom_materiel} name="nom_materiel" variant="outlined" /> <br></br>
                      </div>

                      <div className="flex justify-center items-center mt-5 pb-5">
                        <div className="flex justify-center mx-3 w-[100%]" >
                        <TextField className=" mb-3 " value={formValues.emplacement} onChange={handleInputChange} name="emplacement" label="Emplacement" variant="outlined" />
                        </div>
                        <div className="flex justify-center mx-3 w-[100%]">
                        <TextField className=" mt-[5%] mb-3" label="Date d'arriver" value={formValues.date_arriver} name="date_arriver" variant="outlined" /> <br></br>
                        </div>
                      </div>

                      <div className="flex justify-center items-center mt-5 pb-5">
                        <div className="flex justify-center items-center w-[100%]">
                        <TextField  className=" mb-3 " label="Provenance" value={formValues.provenance} onChange={handleInputChange} name="provenance" variant="outlined" />
                        </div>
                        <div className="flex justify-center items-center w-[100%]">
                        <TextField  required  className=" mb-3 " value={formValues.prix} onChange={handleInputChange1} name="prix" label="Prix Unitaire en Ariary" variant="outlined" />
                        </div>
                      </div>
                      {errors && (
                    <div id="errorTooltip" className="bg-none text-red-600 flex text-xs ml-10 pt-2 px-3 fixed">
                      <Image
                        className="mx-2"
                        src="/pic/high_priority_26px.png"
                        alt="Next.js Logo"
                        width={20}
                        height={10}
                      />  {errors}
                    </div>
                  )}
                      <div className="flex justify-center items-center">
                        <button type="submit" className=" mt-[5%]  bg-green-600 px-5 py-1 rounded text-white font-medium">  Confirmer </button>
                        <button type="reset" className=" mt-[5%] ml-[5%] bg-red-600 px-5 py-1 rounded text-white font-medium"> Annuler </button>
                      </div>
                    </div>

                  </form>
                  <ToastContainer />
                </div>
              )
            }
          </div>

        </div>
      </div>
    </>
  );
};