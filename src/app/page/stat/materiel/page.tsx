import React from "react";
import Navbar from "@/app/navbar/navbar";
import Menu from "../menu/page";
import Selector from "./selector/page";

export default function Materiel () {
    return (
        <div className="flex">
            <Navbar/>
            <div className="w-full h-[100vh] p-2">
            <Menu/>
            <div className="w-full h-[2%]"></div>

            {/* CONTENU PRINCIPALE */}
            <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">

            <div className="flex items-center">
            <div className="ml-5 mt-1">DATE : 
                <input type="date" className="border border-gray-300 rounded p-2"/></div>
                <h1 className="text-center font-bold flex-grow ml-4">STATISTIQUE GENERAL DES MATÉRIELS</h1>
             <div className="mr-6 mt-1">
                 <Selector />
            </div>
           </div>

            <div className="top-[50px] m-10  w-[1740px] h-[380px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                <h1 className="text-center bg-blue-900 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
            </div>

           <div className="flex ]">
           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[525px] h-[260px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
           </div>

           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[525px] h-[260px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
           </div>

           <div className="top-[50px] m-10 left-[1.5cm] right-[35cm] w-[525px] h-[250px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto flex items-center justify-center">
           </div>
           </div>
            </div>
            </div>
        </div>
    )
}