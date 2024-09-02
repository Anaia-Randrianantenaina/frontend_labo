import Navbar from "@/app/navbar/navbar";
import React from "react";
import Menu from "../../menu/page";
import Selector from "../selector/page";


export default function Biochimie() {
    return (
        <div className="flex">
        {/* NAVBAR */}
        <div><Navbar/></div>

        <div className="w-full h-[100vh] p-2">
        {/* MANU */}
        <div><Menu/></div>
        <div className="w-full h-[2%]"></div>

        <div className="w-full h-[89%] shadow-md bg-gray-200 border border-gray-300 rounded">
            <div className="flex items-center">
                <h1 className="text-center font-bold flex-grow">TEST BIOCHIMIE</h1>
                <div className="ml-auto">
                    <Selector />
                </div>
            </div>
            <div className="flex">
            
            <div className="top-[50px] m-10  w-[830px] h-[400px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mb-[1px]">

                <h1 className="text-center bg-green-900 text-white text-[20px]" >BIOCHIMIE SANGUINE :</h1><br />
              <div className="flex space-x-60">
              <div className="space-y-0">
                    <div><span>Urée :</span></div>
                    <div><span>Créatine :</span></div>
                    <div><span>Acide urique :</span></div>
                    <div><span>CRP :</span></div>
                    <div><span>Ionograme :</span></div>
                    <div><span>Protéine totales :</span></div>
                    <div><span>Calcémie :</span></div>
                    <div><span>Phosphorémié :</span></div>
                    <div><span>Magnésemie :</span></div>
                    <div><span>Albumine :</span></div>
                    <div><span>Glycémie :</span></div>
                    <div><span>HGPO :</span></div>
                    <div><span>HBA,C :</span></div>
                    </div>
                    <div className="space-y-0">
                    <div><span>Bilirubine totales :</span></div>
                    <div><span>Bilirubine directe :</span></div>
                    <div><span>ALAT :</span></div>
                    <div><span>ASAT :</span></div>
                    <div><span>Gamma GT :</span></div>
                    <div><span>LDH :</span></div>
                    <div><span>Phosphate alcalines :</span></div>
                    <div><span>Amylasémie :</span></div>
                    <div><span>Lipasémie :</span></div>
                    <div><span>Tryglycérides :</span></div>
                    <div><span>Cholestérol total:</span></div>
                    <div><span>HDL Cholestérol :</span></div>
                    <div><span>LDL Cholestérol :</span></div>
                </div>
              </div>

               
            </div>

            <div className="top-[50px] m-10  w-[830px] h-[400px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mb-[1px]">
            <h1 className="text-center bg-green-900 text-white text-[20px]" >BIOCHIMIE URINAIRE ET LIQUIDE BIOLOGIQUE :</h1><br />
            
               <div className="flex space-x-60">
               <div className="space-y-0">
                    <div className="font-bold"><u>Biochimie Urinaire</u> :</div><br />
                    <div><span>Urine ASA :</span></div>
                    <div><span>Protéinurie de 24H :</span></div>
                    <div><span>Ionogramme urinaire :</span></div>
                    <div><span>Autre  :</span></div>
                </div>
               
                <div className="space-y-0">
                    <div className="font-bold"><u>Liquide Biologique</u> :</div><br />
                    <div><span>Pleural :</span></div>
                    <div><span>LCR:</span></div>
                    <div><span>Ascite :</span></div>
                </div>
               
               </div>
              
            </div>
            </div>

           <div className="flex justify-between ">
           <div className="top-[50px] m-10  w-[450px] h-[230px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
                
                </div>
                <div className="top-[50px] m-10  w-[1150px] h-[230px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto">
                    <p className="text-center">Taux de réalisation de test par Mois</p>
                </div>
           </div>
            </div>

        </div>
        </div>
    )
}