"use client"
import React, { useState } from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import { FaCalculator, FaEye, FaUser } from "react-icons/fa";

export default function Patient() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
    return (
      <div className="flex">
      {/* NAVBAR */}
      <div><Navbar/></div>

      <div className="w-full h-[100vh] p-2">
      {/* MANU */}
      <div><Menu/></div>
      <div className="w-full h-[2%]"></div>
 
          {/* CONTENU PRINCIPALE */}
          <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">

            <h1 className="text-center mt-1 font-bold">STATISTIQUES GÉNÉRALE DU GESTION DES PATIENTS</h1>

            {/* NOMBRE DE PATIENTS */}
            <div className="flex justify-between">
                {/* NOMBRE HOSPITALISÉ */}
            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[100px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
                <div className="flex items-center">
                <FaUser className="text-green-700 text-[50px] mr-4" />
                <div className="text-center">
                <h2 className="font-bold text-[30px]">100</h2>
                <p className="text-gray-700 medium">Hospitalisé</p>
                </div>
                </div>
            </div>
                {/* NOMBRE EXTERNE */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[100px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
             <div className="flex items-center">
             <FaUser className="text-blue-700 text-[50px] mr-4" />
             <div className="text-center">
             <h2 className="font-bold text-[30px]">100</h2>
             <p className="text-gray-700 medium">Externe</p>
             </div>
            </div>
           </div>
                {/* TOTAL */}
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[500px] h-[100px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
              <div className="flex items-center">
              <FaCalculator className="text-gray-700 text-[50px] mr-4" />
              <div className="text-center">
              <h2 className="font-bold text-[30px]">200</h2>
              <p className="text-gray-700 medium">Total</p>
              </div>
              </div>
          </div>

            </div> 

            {/* TABLEAU DE BORD */}
            <div className="flex justify-center">
                {/* Tableau de bord hosipitalisé */}
            <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-green-700 text-[30px] mr-4" />
    <h2 className="text-center font-bold text-[30px]">Hospitalisé</h2>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Sexe</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Hommes :</td>
            <td className="font-bold">40</td>
          </tr>
          <tr className="flex justify-between">
            <td>Femmes :</td>
            <td className="font-bold">60</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Génération</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Enfants (-12ans):</td>
            <td className="font-bold">20</td>
          </tr>
          <tr className="flex justify-between">
            <td>Jeunes (13 - 24ans):</td>
            <td className="font-bold">40</td>
          </tr>
          <tr className="flex justify-between">
            <td>Adultes (25 - 64ans):</td>
            <td className="font-bold">30</td>
          </tr>
          <tr className="flex justify-between">
            <td>Vieux (+65ans):</td>
            <td className="font-bold">10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="ml-[180px]">
  <button
    className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center "
    onClick={openModal}
  >
    <FaEye className="mr-2" /> Voir Détails
  </button>
  </div>
             </div>

             {isOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[80%] overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Détails des Hospitalisés</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center">Par Sexe</h3>
          <table className="w-full mt-2 border-separate border-spacing-2">
            <tbody>
              <tr className="flex justify-between">
                <td>Hommes :</td>
                <td className="font-bold">40</td>
              </tr>
              <tr className="flex justify-between">
                <td>Femmes :</td>
                <td className="font-bold">60</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center">Par Génération</h3>
          <table className="w-full mt-2 border-separate border-spacing-2">
            <tbody>
              <tr className="flex justify-between">
                <td>Enfants (-12ans):</td>
                <td className="font-bold">20</td>
              </tr>
              <tr className="flex justify-between">
                <td>Jeunes (13 - 24ans):</td>
                <td className="font-bold">40</td>
              </tr>
              <tr className="flex justify-between">
                <td>Adultes (25 - 64ans):</td>
                <td className="font-bold">30</td>
              </tr>
              <tr className="flex justify-between">
                <td>Vieux (+65ans):</td>
                <td className="font-bold">10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">

        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={() => window.print()}
        >
          Imprimer
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          onClick={closeModal}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}


             {/* Tableau de bord externe */}
             <div className="top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[550px] h-[300px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
  <div className="flex items-center justify-center mb-4">
    <FaUser className="text-blue-700 text-[30px] mr-4" />
    <h2 className="text-center font-bold text-[30px]">Externe</h2>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Sexe</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Hommes :</td>
            <td className="font-bold">40</td>
          </tr>
          <tr className="flex justify-between">
            <td>Femmes :</td>
            <td className="font-bold">60</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-center">Par Génération</h3>
      <table className="w-full mt-2">
        <tbody>
          <tr className="flex justify-between">
            <td>Enfants (-12ans):</td>
            <td className="font-bold">20</td>
          </tr>
          <tr className="flex justify-between">
            <td>Jeunes (13 - 24ans):</td>
            <td className="font-bold">40</td>
          </tr>
          <tr className="flex justify-between">
            <td>Adultes (25 - 64ans):</td>
            <td className="font-bold">30</td>
          </tr>
          <tr className="flex justify-between">
            <td>Vieux (+65ans):</td>
            <td className="font-bold">10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="ml-[180px]">
  <button
    className="mt-1 px-4 py-2 border border-green-700 text-green-700 rounded hover:bg-green-50 flex items-center "
    onClick={openModal}
  >
    <FaEye className="mr-2" /> Voir Détails
  </button>
  </div>
             </div>

             {isOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[80%] overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Détails des Hospitalisés</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center">Par Sexe</h3>
          <table className="w-full mt-2 border-separate border-spacing-2">
            <tbody>
              <tr className="flex justify-between">
                <td>Hommes :</td>
                <td className="font-bold">40</td>
              </tr>
              <tr className="flex justify-between">
                <td>Femmes :</td>
                <td className="font-bold">60</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center">Par Génération</h3>
          <table className="w-full mt-2 border-separate border-spacing-2">
            <tbody>
              <tr className="flex justify-between">
                <td>Enfants (-12ans):</td>
                <td className="font-bold">20</td>
              </tr>
              <tr className="flex justify-between">
                <td>Jeunes (13 - 24ans):</td>
                <td className="font-bold">40</td>
              </tr>
              <tr className="flex justify-between">
                <td>Adultes (25 - 64ans):</td>
                <td className="font-bold">30</td>
              </tr>
              <tr className="flex justify-between">
                <td>Vieux (+65ans):</td>
                <td className="font-bold">10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
      
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={() => window.print()}
        >
          Imprimer
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          onClick={closeModal}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}

            {/* Graphe generationnel */}
            <div className=" top-[50px] mx-10 left-[1.5cm] right-[35cm] w-[400px] h-[300px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
              <p className="text-center">Géneration</p>
            </div>

            </div>

            {/* GRAPHE TOTAL */}
            <div className="flex justify-center mt-[0.1px]">

            <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[1180px] h-[210px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
             <p className="text-center">GRAPHE GENERATIONNEL</p>
           </div>

            <div className=" top-[50px] m-10 left-[1.5cm] right-[35cm] w-[400px] h-[210px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
              <p className="text-center">Sexe</p>
           </div>

            </div>


          </div>
        </div>
      </div>
    
    )
}