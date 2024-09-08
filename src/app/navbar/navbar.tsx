"use client"
import { MdExitToApp } from "react-icons/md";
import { GiHistogram } from "react-icons/gi";
import { FaUserInjured } from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { GiTestTubes } from "react-icons/gi";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";

export default function navbar() {

  // SPIN ACCEUIL
  const [showAccueil, setShowAccueil] = useState(false);
  const pageAccueil = (id: number) => {
    setShowAccueil(!showAccueil);
    window.location.href = "/page/accueil/";
  };

  // SPIN PATIENTS
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

   // SPIN PERSONNEL
   const [showPerso, setShowPerso] = useState(false);
   const pagePerso = (id: number) => {
     setShowPerso(!showPerso);
     window.location.href = "/page/personnel";
   };

   // SPIN STAT
   const [showStat, setShowStat] = useState(false);
   const pageStat = (id: number) => {
     setShowStat(!showStat);
     window.location.href = "/page/stat/patient";
   };
  return (
    <div className="bg-slate-50">
      <div className="w-[80px] h-[100vh] bg-white drop-shadow-md rounded">
      <button onClick={() => pageAccueil(1)}>
        <img src="/Images/laboratoryy_32.png" className="pl-5 pt-4" />
        <p className="text-[12px] pl-[6px] pt-2 font-bold text-green-900">
          Laboratoire
        </p>
        </button>
        <hr className="w-14 ml-[10px] mt-2" />

        <div className="text-center mt-6">
          <Tooltip title="Hospitalisé / Externe" placement="right" arrow>
          <button onClick={() => pagePatient(1)}>
                <FaUserInjured className="text-[25px] ml-2" />
            <p className="text-[10px] mt-1 font-semibold">Patient</p>
            </button>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Testes / Echantillons" placement="right" arrow>
            <Link href="/page/Suivi_Tests_Echantillons/Accueill_Testes">
              <button>
                <GiTestTubes className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Test</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Ressource / Matériel" placement="right" arrow>
          <button onClick={() => pageMat(1)}>
                <MdMedicalServices className="text-[25px] ml-2" />
              <p className="text-[10px] mt-1 font-semibold">Materiel</p>
            </button>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Personnels de Laboratoire" placement="right" arrow>
          <button onClick={() => pagePerso(1)}>
                <FaUserMd className="text-[25px] ml-2" />
              <p className="text-[10px] mt-1 font-semibold">Personnel</p>
            </button>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip
            title="Tableau de bord et rapport analytique"
            placement="right"
            arrow
          >
             <button onClick={() => pageStat(1)}>
              <p>
                <GiHistogram className="text-[25px] ml-2" />
                </p>
              <p className="text-[10px] mt-1 font-semibold">Statistique</p>
            </button>
          </Tooltip>
        </div>

        <div className="text-center mt-4 absolute bottom-3 left-0 w-20">
          <hr className="w-14 ml-[10px] mb-2" />
          <Tooltip title="se deconnecter" placement="right" arrow>
            <Link href="/login">
              <button>
                <MdExitToApp className="text-[25px] text-red-600" />
              </button>
              <p className="text-[10px] font-semibold text-red-600">Quitter</p>
            </Link>
          </Tooltip>
        </div>
      </div>

       {/* MODAL */}
       {showAccueil && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {showPatient && (
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
