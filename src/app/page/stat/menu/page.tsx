import { IoIosNotifications } from "react-icons/io"; 
import { AiOutlineUser } from "react-icons/ai"; 
import React from "react";
import Link from "next/link";
import { FaBox, FaFlask, FaUser } from "react-icons/fa";

export default function Menu () {
    
    return (
       
             <div className="w-full h-[9%] shadow-md bg-slate-50 border border-gray-300 rounded">

                <div className="flex justify-between mt-4">
                    {/* DATE  */}
                <div className="flex space-x-4 font-bold text-[15px]">
                   <div></div>
                   <Link href="/page/stat/patient/">
                    <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                   <FaUser className="text-lg" />
                <h1><u>Patients</u></h1>
                  </div>
                  </Link>
                  <Link href="/page/stat/tests/">
                   <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                  <FaFlask className="text-lg" />
                    <h1><u>Tests</u></h1>
                 </div>
                  </Link>
                    <Link href="/page/stat/materiel/">
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaBox className="text-lg" />
                      <h1><u>Matériels</u></h1>
                     </div>
                  </Link>
                  <Link href="/page/stat/perso/">
                     <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md">
                      <FaUser className="text-lg" />
                      <h1><u>Personnels</u></h1>
                     </div>
                  </Link>
                </div>
                    <div>
                        <h1 className="font-bold text-[30px]">TABLEAU DE BORD ET RAPPORT ANALYTIQUE</h1>
                    </div>

                    <div className="flex space-x-2 w-[160px] items-center">
                      <IoIosNotifications className="text-[25px]" />
                      <div className="flex items-center space-x-1 bg-gray-200 rounded-md px-2 py-1">
                      <AiOutlineUser className="text-[25px]" />
                      <span className="text-gray-700 font-semibold text-[14px]">Utilisateur</span>
                    </div>
                  </div>



                </div>

             </div>
      
    )
}