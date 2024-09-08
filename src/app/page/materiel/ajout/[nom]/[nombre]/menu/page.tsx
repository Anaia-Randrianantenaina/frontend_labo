"use client"
import { IoIosNotifications } from "react-icons/io"; 
import { AiOutlineUser } from "react-icons/ai"; 
import React from "react";

export default function Menu () {

 
  
  
  
    
    return (
       
             <div className="w-full h-[9%] shadow-md bg-white border border-gray-300 rounded">

                <div className="flex justify-between mt-4">
                    <div>

                    </div>
              
                    <div>
                        <h1 className="font-bold text-[30px]">AJOUT NOUVEAUX MATÉRIELS</h1>
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