"use client";
import { AiOutlineMenu } from "react-icons/ai"; 
import React, { useState } from "react";


export default function Selector() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

     // SPIN PATIENT
  const [showHema, setShowHema] = useState(false);
  const hema = (id: number) => {
    setShowHema(!showHema);
    window.location.href = "/page/stat/tests/hematologie";
  };

  const [showBio, setShowBio] = useState(false);
  const bio = (id: number) => {
    setShowBio(!showBio);
    window.location.href = "/page/stat/tests/biochimie";
  };

  const [showSero, setShowSero] = useState(false);
  const sero = (id: number) => {
    setShowSero(!showSero);
    window.location.href = "/page/stat/tests/immunologie";
  };

  const [showPara, setShowPara] = useState(false);
  const para = (id: number) => {
    setShowPara(!showPara);
    window.location.href = "/page/stat/tests/parasitologie";
  };

  const [showbact, setShowBact] = useState(false);
  const bact = (id: number) => {
    setShowBact(!showbact);
    window.location.href = "/page/stat/tests/bacteriologie";
  };

  


    return (
        <div className="relative ml-[20px] font-bold float-end p-2 rounded-lg">
    <button
        onClick={toggleMenu}
        className="py-2 px-4 bg-gray-700 text-white rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:bg-gray-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer flex items-center space-x-3"
    >
        <AiOutlineMenu className="text-[20px]" />
        <p>Liste des tests</p>
    </button>
    {isOpen && (
        <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-3xl z-50 border border-gray-200">
            <li className="hover:bg-gray-100">
            <button onClick={() => hema(1)}>
                    <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Hématologie</span>
                </button>
            </li>
            <li className="hover:bg-gray-100">
            <button onClick={() => bio(1)}>
                    <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Biochimie</span>
                </button>
            </li>
            <li className="hover:bg-gray-100">
            <button onClick={() => sero(1)}>
                    <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Séro-Immunologie</span>
                </button>
            </li>
            <li className="hover:bg-gray-100">
            <button onClick={() => para(1)}>
                    <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Parasitologie</span>
                </button>
            </li>
            <li className="hover:bg-gray-100">
                <button onClick={() => bact(1)}>
                    <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Bactériologie</span>
                </button>
            </li>
        </ul>
    )}

     {/* MODAL */}
     {showHema && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

{showBio && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

{showSero && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

{showPara && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

{showbact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Spinner Animation */}
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
</div>

    );
}
