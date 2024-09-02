import Navbar from "@/app/navbar/navbar";
import React from "react";
import Menu from "../../menu/page";
import Selector from "../selector/page";


export default function Immunologie() {
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
                <h1 className="text-center font-bold flex-grow">TEST SERO-IMMUNOLOGIE</h1>
                <div className="ml-auto">
                    <Selector />
                </div>
            </div>
            <div className="flex">
            
            <div className="top-[50px] m-10  w-[830px] h-[400px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mb-[1px]">

                <h1 className="text-center bg-green-900 text-white text-[20px]" >BIOCHIMIE SANGUINE :</h1><br />
              <div className="flex space-x-60">
              <div className="space-y-2">
                    <div><span>Widal Félix :</span></div>
                    <div><span>ASLO :</span></div>
                    <div><span>TPHA :</span></div>
                    <div><span>RPR :</span></div>
                    <div><span>Facteur rhumatoide :</span></div>
                    <div><span>Cysticercose :</span></div>
                    <div><span>BIlharziose :</span></div>
                </div>
              </div>

               
            </div>

            <div className="top-[50px] m-10  w-[830px] h-[400px] bg-slate-50 shadow-lg rounded z-10 p-4 overflow-auto mb-[1px]">
            <h1 className="text-center bg-green-900 text-white text-[20px]" >BIOCHIMIE URINAIRE ET LIQUIDE BIOLOGIQUE :</h1><br />
            
               <div className="flex space-x-60">
               <div className="space-y-2">
                    <div><span>Hépatite A:</span></div>
                    <div><span>Hépatite B:</span></div>
                    <div><span>Hépatite C:</span></div>
                    <div><span>T3 :</span></div>
                    <div><span>T4 :</span></div>
                    <div><span>TSH:</span></div>
                    <div><span>HCG plasmatique :</span></div>
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