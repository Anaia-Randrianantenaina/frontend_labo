"use client";
import { FaCommentAlt } from "react-icons/fa";
import { Tooltip } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { FaInfoCircle, FaUserInjured, FaUserMd } from "react-icons/fa";
import { GiHistogram, GiTestTubes } from "react-icons/gi";
import { MdMedicalServices } from "react-icons/md";

export default function Accueil() {
  // SPIN PATIENT
  const [showPatient, setShowPatient] = useState(false);
  const pagePatient = (id: number) => {
    setShowPatient(!showPatient);
    window.location.href = "/page/patient/hospitalise";
  };

 // SPIN MATÉRIELS
 const [showMat, setShowMat] = useState(false);
 const pageMat = (id: number) => {
   setShowMat(!showMat);
   window.location.href = "/page/materiel/liste";
 };

  // SPIN TEST
  const [showTest, setShowTest] = useState(false);
  const pageTest = (id: number) => {
    setShowTest(!showTest);
    window.location.href = "/page/Suivi_Tests_Echantillons/Testes";
  };

  // SPIN PERSONNEL
  const [showPerso, setShowPerso] = useState(false);
  const pagePerso = (id: number) => {
    setShowPerso(!showPerso);
    window.location.href = "/page/personnel";
  };

  // SPIN STATISTIQUES
  const [showStat, setShowStat] = useState(false);
  const pageStat = (id: number) => {
    setShowStat(!showStat);
    window.location.href = "/page/stat/patient";
  }


  return (
    <div>
      {/* MENU GENERALE */}
      <div className="w-full h-[100px] bg-gray-700 shadow-lg z-10 p-4 overflow-auto flex items-center justify-between">
    {/* Titre à gauche */}
    <div className="flex space-x-1 text-white text-left">
        <div>
            <img src="/Images/mainty_48.png" className="pl-3 pt-2 w-[36px] h-[36px] md:w-[48px] md:h-[48px]" />
        </div>
        <div>
            <h2 className="text-[20px] pl-[6px] pt-2 font-bold text-white md:text-[30px]">
                Lab E-Tech
            </h2>
        </div>
    </div>

    {/* Éléments à droite */}
    <div className="flex space-x-2 md:space-x-4">
        {/* Patients */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Hospitalisé / Externe" placement="bottom" arrow>
                <button onClick={() => pagePatient(1)}>
                    <div className="flex space-x-1">
                        <FaUserInjured className="text-[12px] md:text-[15px]" />
                        <p className="text-[12px] md:text-[15px] font-semibold">Patients</p>
                    </div>
                </button>
            </Tooltip>
        </div>

        {/* Testes */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Testes / Échantillons" placement="bottom" arrow>
                <button onClick={() => pageTest(1)}>
                    <div className="flex space-x-1">
                        <GiTestTubes className="text-[12px] md:text-[15px]" />
                        <p className="text-[12px] md:text-[15px] font-semibold">Testes</p>
                    </div>
                </button>
            </Tooltip>
        </div>

        {/* Matériels */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Matériels / Intrants" placement="bottom" arrow>
                <button onClick={() => pageMat(1)}>
                    <div className="flex space-x-1">
                        <MdMedicalServices className="text-[12px] md:text-[15px]" />
                        <p className="text-[12px] md:text-[15px] font-semibold">Matériels</p>
                    </div>
                </button>
            </Tooltip>
        </div>

        {/* Personnels */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Personnels du laboratoire" placement="bottom" arrow>
                <button onClick={() => pagePerso(1)}>
                    <div className="flex space-x-1">
                        <FaUserMd className="text-[12px] md:text-[15px]" />
                        <p className="text-[12px] md:text-[15px] font-semibold">Personnels</p>
                    </div>
                </button>
            </Tooltip>
        </div>

        {/* Statistiques */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Tableau de bord / Rapport Analytique" placement="bottom" arrow>
                <button onClick={() => pageStat(1)}>
                    <div className="flex space-x-1">
                        <GiHistogram className="text-[12px] md:text-[15px]" />
                        <p className="text-[12px] md:text-[15px] font-semibold">Statistiques</p>
                    </div>
                </button>
            </Tooltip>
        </div>

        {/* Commentaires */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="Commentaire et Suggestions" placement="bottom" arrow>
                <a href="mailto:votre.anaiarandrianantenaina@gmail.com?subject=Commentaire et Suggestions">
                    <FaCommentAlt className="text-[16px] md:text-[20px]" />
                </a>
            </Tooltip>
        </div>

        {/* À propos */}
        <div className="text-white p-2 bg-gray-600 rounded">
            <Tooltip title="À propos" placement="bottom" arrow>
                <Link href="/page/stat/patient">
                    <div className="flex space-x-1">
                        <button>
                            <FaInfoCircle className="text-[16px] md:text-[20px]" />
                        </button>
                    </div>
                </Link>
            </Tooltip>
        </div>
    </div>
</div>

{/* GRAND TITRE */}
<div className="relative w-full h-[300px] md:h-[450px] shadow-sm z-10 p-4 overflow-auto flex items-center justify-center">
    {/* Image de fond floutée */}
    <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
            backgroundImage: "url('/Images/fond.png')",
            filter: "blur(3px)", // Ajoute un effet de flou
            zIndex: -1, // Place l'image derrière le contenu
        }}
    ></div>

    {/* Contenu par-dessus */}
    <div className="relative z-50 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Système de Gestion du Laboratoire
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-800 mt-4">
            Centre Hospitalier Universitaire Tambohobe Fianarantsoa
        </h2>
    </div>
</div>

{/* PARTIE 3 */}
<div className="w-full h-auto md:h-[298px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shadow-lg z-30 p-4 md:p-8 overflow-auto rounded-lg">
    <div className="flex flex-col md:flex-row justify-center items-start space-x-0 md:space-x-8">
        {/* Première section */}
        <div className="space-y-3 h-auto md:h-[253px] max-w-full md:max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
                Gestion des Patients et du Personnel
            </h2>
            <p className="text-[14px] text-gray-600">
                Optimisez la gestion des patients et du personnel dans votre
                laboratoire. Centralisez les informations médicales et personnelles
                des patients, tout en assurant un suivi rigoureux des personnels, y
                compris la gestion des plannings, des formations, et des ressources
                humaines.
            </p>
        </div>

        {/* Deuxième section */}
        <div className="space-y-3 h-auto md:h-[253px] max-w-full md:max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
                Gestion des Tests, Échantillons et Matériels
            </h2>
            <p className="text-[14px] text-gray-600">
                Gérez efficacement les tests de laboratoire, les échantillons, et
                les matériels. Organisez et suivez les tests, assurez la gestion des
                échantillons, et garantissez une gestion rigoureuse des équipements
                et des ressources, incluant les stocks et la maintenance.
            </p>
        </div>

        {/* Troisième section */}
        <div className="space-y-3 h-auto md:h-[253px] max-w-full md:max-w-sm text-center bg-white p-6 rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
                Tableaux de Bord et Rapports Analytiques
            </h2>
            <p className="text-[14px] text-gray-600">
                Visualisez les performances globales de votre laboratoire avec nos
                tableaux de bord personnalisés et générez des rapports analytiques
                détaillés. Analysez les tendances, suivez les indicateurs clés, et
                améliorez la prise de décision pour une gestion plus efficace.
            </p>
        </div>
    </div>
</div>

{/* PARTIE EN BAS */}
<div className="mt-1 h-auto md:h-[35px] bg-gray-700 text-white p-4">
    <div className="w-full flex justify-between items-center text-center">
        <div className="text-sm">&copy; CHU TAMBOHOBE FIANARA 2024</div>
        <div className="text-sm">Découvrez plus sur notre solution pour améliorer votre laboratoire.</div>
        <div className="text-sm">Développé par E-Tech Groupe</div>
    </div>
</div>


      {/* MODAL */}
      {showPatient && (
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

      {showStat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      
    </div>
  );
}
