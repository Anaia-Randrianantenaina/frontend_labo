"use client"
import { IoIosNotifications } from "react-icons/io"; 
import { AiOutlineUser } from "react-icons/ai"; 
import React, { useEffect, useState } from "react";
import { FaBox, FaFlask, FaTrash, FaUser } from "react-icons/fa";
import DataTable from "react-data-table-component";



export default function Menu () {

  interface NotifData {
    id: number;
    message: string;
  }

  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // État pour le modal de notification
 

  const openNotificationModal = () => setIsNotificationOpen(true);
  const closeNotificationModal = () => setIsNotificationOpen(false);

  // États pour stocker les données
  const [data, setData] = useState<NotifData[]>([]);

  // Fonction pour récuperer les données de notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/notifs');

        if(!response.ok) {
          throw new Error('Erreur réseau');
        }

        const result = await response.json();
        console.log("DOnnées récupérer :", result);
        setData(result);
      } catch (error) {
        console.error("Erreur lors de la récupérations de données:", error);
      }
    }
    fetchData();
  }, []);

  // Fonction pour supprimer une notification
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/notifs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppréssion de la notification");
      }

      setData(data.filter(notif => notif.id !== id));
    }catch (error) {
      console.error("Erreur lors de la suppression de la notification :", error);
    }
  };

  // SPIN ACCEUIL

  const [showHospi, setShowHospi] = useState(false);
  const hospipage = (id: number) => {
    setShowHospi(!showHospi);
    window.location.href = "/page/stat/patient/";
  };

  const [showExt, setShowExt] = useState(false);
  const extpage = (id: number) => {
    setShowExt(!showExt);
    window.location.href = "/page/stat/patientE/";
  };

  const [showTest, setShowTest] = useState(false);
  const statTest = (id: number) => {
    setShowTest(!showTest);
    window.location.href = "/page/stat/tests/";
  };

  const [showMat, setShowMat] = useState(false);
  const statMat = (id: number) => {
    setShowMat(!showTest);
    window.location.href = "/page/stat/materiel/";
  };

  const [showPerso, setShowPerso] = useState(false);
  const statPerso = (id: number) => {
    setShowPerso(!showTest);
    window.location.href = "/page/stat/perso/";
  };

  const [isOpen1, setIsOpen1] = useState(false);

  const toogleMenu1 = () => {
    setIsOpen1(!isOpen1);
  }

  const columns = [
    {
      name: '',
      selector: (row: NotifData) => row.message,
      sortable: true,
    },
    {
      name: '',
      cell: (row: NotifData) => (
        <div className="flex space-x-2">
            <button
            className="text-red-500 hover:text-red-700 ml-52"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
        ),
    }
  ]
// NOmbre de notification
  const Notif = data.length;
  
  
  
    
    return (
       
             <div className="w-full h-[9%] shadow-md bg-slate-50 border border-gray-300 rounded">

                <div className="flex justify-between mt-4">
                    {/* DATE  */}
                <div className="flex space-x-4 font-bold text-[15px]">
                   <div></div>
                   <button onClick={toogleMenu1}>
                    <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                   <FaUser className="text-lg" />
                <h1><u>Patients</u></h1>
                  </div>
                  </button>
                  <button onClick={() => statTest(1)}>
                   <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                  <FaFlask className="text-lg" />
                    <h1><u>Tests</u></h1>
                 </div>
                  </button>
                  <button onClick={() => statMat(1)}>
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaBox className="text-lg" />
                      <h1><u>Matériels</u></h1>
                     </div>
                  </button>
                  <button onClick={() => statPerso(1)}>
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaUser className="text-lg" />
                      <h1><u>Personnels</u></h1>
                     </div>
                  </button>
                </div>
                    <div>
                        <h1 className="font-bold text-[30px]">TABLEAU DE BORD ET RAPPORT ANALYTIQUE</h1>
                    </div>

                    <div className="flex space-x-2 w-[160px] items-center">
                    <button onClick={openNotificationModal} className="relative">
                        <IoIosNotifications className="text-[25px]" />
                        {/* Badge avec le nombre de notifications */}
                        <span className="absolute top-[-5px] right-[-3px] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                         {Notif}
                       </span>
                     </button>

                      <div className="flex items-center space-x-1 bg-gray-200 rounded-md px-2 py-1">
                      <AiOutlineUser className="text-[25px]" />
                      <span className="text-gray-700 font-semibold text-[14px]">Utilisateur</span>
                    </div>
                  </div>
                </div>

                 {/* MODAL */}

       {showHospi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
       

       {showExt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
       
      

       {showTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

        {showMat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

        {showPerso && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {
        isOpen1 && (
          <ul className="absolute left-0 justify-center ml-24 mt-2 w-30 bg-white shadow-lg rounded-3xl z-50 border border-gray-200">
             <li className="hover:bg-gray-100">
            <button onClick={() => hospipage(1)}>
              <span className="block py-2 px-4 font-bold text-center text-gray-800 hover:text-green-600">Hospitaliser</span>
            </button>
            </li>
            <li className="hover:bg-gray-100">
            <button onClick={() => extpage(1)}>
              <span className="block py-2 px-4 font-bold text-center text-gray-800 hover:text-green-600">Externe</span>
            </button>
            </li>
          </ul>
          
        )
      }

{isNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] h-[30%] overflow-y-auto">
           <div className="flex justify-between">
           <div><h2 className="text-xl font-bold mb-4 text-center">Notifications</h2></div>
          <div><button> <p className="text-red-600 font-bold text-[20px]  "  onClick={closeNotificationModal}>X</p></button></div>
           </div>
           
            <div className="flex justify-end mt-[-20px]">
            <DataTable
              columns={columns}
              data={data}
              />
             
            </div>
          </div>
        </div>
      )}
             </div>
      
    )
}