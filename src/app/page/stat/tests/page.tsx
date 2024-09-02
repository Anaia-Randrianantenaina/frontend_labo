"use client"
import Navbar from "@/app/navbar/navbar";
import React, { useState } from "react";
import Menu from "../menu/page";
import { FaEye, FaMicroscope } from "react-icons/fa";
import Selector from "./selector/page";

export default function Tests() {

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);

  const openModal1 = () => setIsOpen1(true);
  const closeModal1 = () => setIsOpen1(false);

  const openModal2 = () => setIsOpen2(true);
  const closeModal2 = () => setIsOpen2(false);

  const openModal3 = () => setIsOpen3(true);
  const closeModal3 = () => setIsOpen3(false);

  const openModal4 = () => setIsOpen4(true);
  const closeModal4 = () => setIsOpen4(false);

  const openModal5 = () => setIsOpen5(true);
  const closeModal5 = () => setIsOpen5(false);

  const openModal6 = () => setIsOpen6(true);
  const closeModal6 = () => setIsOpen6(false);

  return (
    <div className="flex">
      {/* NAVBAR */}
      <div><Navbar /></div>

      <div className="w-full h-[100vh] p-2">
        {/* MANU */}
        <div><Menu /></div>
        <div className="w-full h-[2%]"></div>

        {/* CONTENU PRINCIPAL */}
        <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">

          {/* SELECT DATE */}
          <div className="flex items-center">
            <div className="flex space-x-1 ml-[10px]"><p>DATE :</p><input type="date" /></div>
            <h1 className="text-center font-bold flex-grow">TEST LIQUIDE BIOLOGIQUE</h1>
            <div className="mr-[10px] mt-1">
              <Selector />
            </div>
          </div>

          {/* NOMBRE */}
          <div className="flex justify-between">
            <div className="space-y-[-60px]">
            <div className="flex space-x-2 ">
              {/* NOMBRE DE TESTS 1 */}
              <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <FaMicroscope className="text-blue-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-blue-700 medium">Parasitologie</p>
                  </div>
                </div>
                <button
                  className="mt-2 text-blue-700 hover:underline flex items-center"
                  onClick={openModal1}
                >
                  <FaEye className="mr-2" /> Voir Plus
                </button>
              </div>

              {isOpen1 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal1}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <FaMicroscope className="text-blue-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-blue-700 medium">Parasitologie</p>
                  </div>
                </div>
                <button className="mt-2 text-blue-700 hover:underline flex items-center" onClick={openModal2}>
                  <FaEye className="mr-2" /> Voir Plus
                </button>
              </div>

              {isOpen2 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal2}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

             <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
             <div className="flex items-center">
             <FaMicroscope className="text-blue-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-blue-700 medium">Parasitologie</p>
                  </div>   
             </div>
             <button className="mt-2 text-blue-700 hover:underline flex items-center" onClick={openModal3}>
                  <FaEye className="mr-2" /> Voir Plus
            </button>
             </div>

             {isOpen3 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal3}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NOMBRE DE TEST 2 */}

            <div className="flex space-x-2">
              {/* NOMBRE DE TESTS 1 */}
              <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <FaMicroscope className="text-gray-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-gray-700 medium">Parasitologie</p>
                  </div>
                </div>
                <button
                  className="mt-2 text-gray-700 hover:underline flex items-center"
                  onClick={openModal4}
                >
                  <FaEye className="mr-2" /> Voir Plus
                </button>
              </div>

              {isOpen4 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal4}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <FaMicroscope className="text-gray-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-gray-700 medium">Parasitologie</p>
                  </div>
                </div>
                <button className="mt-2 text-gray-700 hover:underline flex items-center" onClick={openModal5}>
                  <FaEye className="mr-2" /> Voir Plus
                </button>
              </div>

              {isOpen5 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal5}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

             <div className="top-[50px] m-10 w-[300px] h-[150px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex flex-col items-center justify-center">
             <div className="flex items-center">
             <FaMicroscope className="text-gray-700 text-[50px] mr-4" />
                  <div className="text-center">
                    <h2 className="font-bold text-[30px]">5</h2>
                    <p className="text-gray-700 medium">Parasitologie</p>
                  </div>   
             </div>
             <button className="mt-2 text-gray-700 hover:underline flex items-center" onClick={openModal6}>
                  <FaEye className="mr-2" /> Voir Plus
            </button>
             </div>

             {isOpen6 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[50%] overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">Détails de Parasitologie</h2>
                    {/* Contenu du modal vide */}
                    <button
                      className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                      onClick={closeModal6}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>

            <div>
                
            </div>

            {/* TENDANCE DE TEST */}
            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[750px] h-[320px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
              <p className="text-center">Tendance de test</p>
            </div>
          </div>

          <div className="flex space-x-1 mt-[-40px]">
          <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[960px] h-[300px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
              <p className="text-center">Tendance de test</p>
            </div>

            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[750px] h-[300px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
              <p className="text-center">Tendance de test</p>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
