"use client"
import { IoIosNotifications } from "react-icons/io"; 
import { AiOutlineUser } from "react-icons/ai"; 
import React, { useState } from "react";
import Link from "next/link";
import { FaBox, FaFlask, FaUser } from "react-icons/fa";

export default function Menu () {

  // SPIN ACCEUIL
  const [showPatient, setShowPatient] = useState(false);
  const statPatient = (id: number) => {
    setShowPatient(!showPatient);
    window.location.href = "/page/patient/hospitalise";
  };

  const [showTest, setShowTest] = useState(false);
  const statTest = (id: number) => {
    setShowTest(!showTest);
    window.location.href = "/page/patient/analyse";
  };

  const [showMat, setShowMat] = useState(false);
  const statMat = (id: number) => {
    setShowMat(!showTest);
    window.location.href = "/page/patient/medecin";
  };

  const [showPerso, setShowPerso] = useState(false);
  const statPerso = (id: number) => {
    setShowPerso(!showTest);
    window.location.href = "/page/stat/perso/";
  };


    
    return (
       
             <div className="w-full h-[9%] shadow-md bg-slate-50 border border-gray-300 rounded">

                <div className="flex justify-between mt-4">
                    {/* DATE  */}
                <div className="flex space-x-4 font-bold text-[15px]">
                   <div></div>
                   <button onClick={() => statPatient(1)}>
                    <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                   <FaUser className="text-lg" />
                <h1><u>Patients</u></h1>
                  </div>
                  </button>
                  <button onClick={() => statTest(1)}>
                   <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                  <FaFlask className="text-lg" />
                    <h1><u>Analyses</u></h1>
                 </div>
                  </button>
                  <button onClick={() => statMat(1)}>
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaBox className="text-lg" />
                      <h1><u>Préscripteurs</u></h1>
                     </div>
                  </button>
                  <button onClick={() => statPerso(1)}>
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaUser className="text-lg" />
                      <h1><u>Archives</u></h1>
                     </div>
                  </button>
                </div>
                    <div>
                        <h1 className="font-bold text-[20px]">PATIENTS HOSPITALISER ET EXTERNE</h1>
                    </div>

                    <div className="flex space-x-2 w-[160px] items-center">
                      {/* <IoIosNotifications className="text-[25px]" /> */}
                      <div className="flex items-center space-x-1 bg-gray-200 rounded-md px-2 py-1">
                      <AiOutlineUser className="text-[25px]" />
                      <span className="text-gray-700 font-semibold text-[14px]">Utilisateur</span>
                    </div>
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


             </div>
      
    )
}