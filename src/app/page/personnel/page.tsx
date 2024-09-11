"use client";
import Navbar from "@/app/navbar/navbar";
import React, { useEffect, useState } from "react";
import Menu from "./menu/page";
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaFileExcel } from 'react-icons/fa';
import Modal from "./modal/modal";
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"



// Composant principal pour afficher et gérer les personnels
export default function Personnel() {

  const anaia = () => toast.success("Nouveau personnel ajouter", {
    position: "top-center",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    onClose: () => setIsAddModalVisible(false)
  })

  // Définition de l'interface pour les données des personnels
  interface PersonnelData {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    adresse: string;
    contacte: string;
  }

  interface NotifData {
    message: string ;
  }

  // États pour stocker les données, les états de chargement, et la visibilité des modaux
  const [data, setData] = useState<PersonnelData[]>([]);
  const [dataN, setDataN] = useState<NotifData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour récupérer les données des personnels depuis le serveur
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/personnels');
        
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }

        const result = await response.json();
        console.log("Données récupérées :", result);
        setData(result);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour supprimer un personnel
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")) {
      try {
        const response = await fetch(`http://localhost:3001/personnels/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du personnel");
        }

        setData(data.filter(personnel => personnel.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression du personnel :", error);
      }
    }
  };

  // Fonction pour ouvrir le modal d'édition avec les informations du personnel sélectionné
  const handleEdit = (personnel: PersonnelData) => {
    setSelectedPersonnel(personnel);
    setFormValues(personnel);
    setIsEditModalVisible(true);
  };

  // Fonction pour ouvrir le modal d'ajout
  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  // Fonction pour mettre à jour le terme de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filtrage des données en fonction du terme de recherche
  const filteredData = data.filter(personnel =>
    personnel.matricule.toLowerCase().includes(searchTerm) ||
    personnel.nom.toLowerCase().includes(searchTerm) ||
    personnel.prenom.toLowerCase().includes(searchTerm) ||
    personnel.poste.toLowerCase().includes(searchTerm) ||
    personnel.adresse.toLowerCase().includes(searchTerm) ||
    personnel.contacte.toLowerCase().includes(searchTerm)
  );

  // Définition des colonnes pour le tableau
  const columns = [
    
    {
      name: 'Matricule',
      selector: (row: PersonnelData) => row.matricule,
      sortable: true,
    },
    {
      name: 'Nom',
      selector: (row: PersonnelData) => row.nom,
      sortable: true,
    },
    {
      name: 'Prénoms',
      selector: (row: PersonnelData) => row.prenom,
      sortable: true,
    },
    {
      name: 'Poste',
      selector: (row: PersonnelData) => row.poste,
      sortable: true,
    },
    {
      name: 'Adresse',
      selector: (row: PersonnelData) => row.adresse,
      sortable: true,
    },
    {
      name: 'Contacte',
      selector: (row: PersonnelData) => row.contacte,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: PersonnelData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // État pour stocker les valeurs du formulaire
  const [formValues, setFormValues] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    poste: '',
    adresse: '',
    contacte: ''
  });

  // Etat pour stocker les valeurs du formulaire 
  const [formValues1, setFormValues1] = useState({
    message: 'Un nouveau personnel ajouté',
  });

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleAddSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/personnels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du personnel');
      }
  
      const result = await response.json();
      console.log("Personnel ajouté :", result);
  
      setData([...data, result]);
  
      setFormValues({
        matricule: '',
        nom: '',
        prenom: '',
        poste: '',
        adresse: '',
        contacte: ''
      });
  
      anaia();
    } catch (error) {
      console.error("Erreur lors de l'ajout du personnel :", error);
    }
  };
  // Ajout de notification
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
    await Promise.all([handleAddSubmit(), handleAddSubmit1()]);
  };
  


  // Fonction pour soumettre le formulaire de modification
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPersonnel) return;

    try {
      const response = await fetch(`http://localhost:3001/personnels/${selectedPersonnel.id}`, {
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
      console.log("Personnel modifié :", result);

      setData(data.map(personnel => personnel.id === result.id ? result : personnel));

      setFormValues({
        matricule: '',
        nom: '',
        prenom: '',
        poste: '',
        adresse: '',
        contacte: ''
      });

      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la modification du personnel :", error);
    }
  };

  // Fonction pour exporter les données en format Excel 
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personnels");

    // Crée un blob avec le fichier Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Convertir en tableau d'octets (Conversion en Fichier Excel)
    function s2ab(s: string) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personnels.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  

  return (
    <div className="flex">
      {/* NAVBAR */}
      <div>
        <Navbar />
      </div>

      <div className="w-full h-[100vh] p-2">
        {/* MENU */}
        <div>
          <Menu />
        </div>
        <div className="w-full h-[2%]"></div>
        {/* CONTENU PRINCIPAL */}
        <div className="w-full h-[89%] shadow-md bg-white border border-gray-300 rounded p-4 ">

          {/* EN TÊTE DU CONTENU PRINCIPAL */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-lg">
            <div>
              <input 
                type="search" 
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Rechercher..."
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Liste des personnels</h2>
            </div>
            <div className="flex space-x-3">
              <div>
                <button 
                  onClick={handleAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Ajout des personnels
                </button>
              </div>
              <div>
                <button 
                  onClick={exportToExcel}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <FaFileExcel className="inline ml-2" /> Exporter
                </button>
              </div>
            </div>
          </div>

          {/* TABLEAU POUR AFFICHER LES DONNÉES */}
          {loading ? (
            <p className="text-center text-gray-500 text-xl font-semibold mt-4">
              Chargement des données...
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              customStyles={{
                cells: {
                  style: {
                    padding: '10px',
                    fontSize: '16px', // Augmenter la taille de la police des cellules
                  },
                },
                headCells: {
                  style: {
                    padding: '10px',
                    fontSize: '18px', // Augmenter la taille de la police des en-têtes
                    fontWeight: 'bold',
                  },
                },
                rows: {
                  style: {
                    fontSize: '16px', // Augmenter la taille de la police des lignes
                  },
                },
              }}
            />
          )}

          {/* MODAL POUR AJOUTER UN PERSONNEL */}
          <Modal isVisible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
            <h3 className="text-lg font-bold mb-4">Ajouter un personnel</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Matricule :</label>
                <input 
                  type="text" 
                  name="matricule"
                  value={formValues.matricule}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nom :</label>
                <input 
                  type="text" 
                  name="nom"
                  value={formValues.nom}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                  required  // Champ obligatoire
                  
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Prénom :</label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formValues.prenom}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Poste :</label>
                <input 
                  type="text" 
                  name="poste"
                  value={formValues.poste}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Adresse :</label>
                <input 
                  type="text" 
                  name="adresse"
                  value={formValues.adresse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contacte :</label>
                <input 
                  type="text" 
                  name="contacte"
                  value={formValues.contacte}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"  required 
                />
              </div>
              <div className="mb-4">
  
              {/* AJOUT DU NOTIFICATION */}
             <input 
              type="text" 
              name="contacte" 
              value={formValues1.message}
              className="w-full border border-gray-300 p-2 rounded-md"
              style={{ display: 'none' }} // Cacher l'input
              required 
             />
            </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Enregistrer
                </button>
              </div>
            </form>
            <ToastContainer/>
          </Modal>

          {/* MODAL POUR MODIFIER UN PERSONNEL */}
          <Modal isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)}>
            <h3 className="text-lg font-bold mb-4">Modifier le personnel</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Matricule :</label>
                <input 
                  type="text" 
                  name="matricule"
                  value={formValues.matricule}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nom :</label>
                <input 
                  type="text" 
                  name="nom"
                  value={formValues.nom}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Prénom :</label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formValues.prenom}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Poste :</label>
                <input 
                  type="text" 
                  name="poste"
                  value={formValues.poste}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Adresse :</label>
                <input 
                  type="text" 
                  name="adresse"
                  value={formValues.adresse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contacte :</label>
                <input 
                  type="text" 
                  name="contacte"
                  value={formValues.contacte}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md" 
                />
              </div>
             
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Enregistrer
                </button>
              </div>
            </form>
            
          </Modal>
        </div>
      </div>
    </div>
  );
}
