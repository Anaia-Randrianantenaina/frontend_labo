import Navbar from "@/app/navbar/navbar";
import React from "react";
import Menu from "../menu/page";
import Selector from "./selector/page";


export default function Resource (){
    return (
        <div className="flex">
            {/* NAVBAR */}
            <div><Navbar/></div>
            {/* MENU */}
            <div className="w-full h-[100vh] p-2">
            <Menu/>
            <div className="w-full h-[2%]"></div>
             {/* CONTENU PRINCIPALE */}
            <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">

            <div className="flex items-center">
            <div className="ml-5 mt-1">DATE : 
                <input type="date" className="border border-gray-300 rounded p-2"/></div>
                <h1 className="text-center font-bold flex-grow ml-4">STATISTIQUES GENERAL DES INTRANT</h1>
             <div className="mr-6 mt-1">
                 <Selector />
            </div>
           </div>

                {/* PARTIE 1 */}
              <div className="flex">
              <div className="top-[50px] m-10  w-[525px] h-[260px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
             </div>

             <div className="top-[50px] m-10  w-[525px] h-[260px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
             </div>

             <div className="top-[50px] m-10  w-[525px] h-[260px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
             </div>
              </div>

              {/* PARTIE 2 */}
              <div className="flex">
                <div>
                <div className="top-[50px] m-10  w-[525px] h-[450px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                  <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
                </div>
                </div>

                <div className="space-y-1">
                    <div className="flex">
                    <div className="top-[50px] m-10  w-[525px] h-[200px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                      <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
                    </div>
                    <div className="top-[50px] m-10  w-[525px] h-[200px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                      <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
                    </div>
                    </div>

                    <div className="flex">
                    <div className="top-[50px] m-10  w-[525px] h-[200px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                      <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
                    </div>
                    <div className="top-[50px] m-10  w-[525px] h-[200px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mt-[8px] mb-[1px]">
                      <h1 className="text-center bg-gray-700 text-white text-[20px] rounded" >QUANTITÉ DES MATÉRIELS :</h1><br /> 
                    </div>
                    </div>

                </div>
              </div>
            </div>

            </div>
        </div>
    )
}