"use client";
import { AiOutlineMenu } from "react-icons/ai"; 
import React, { useState } from "react";
import Link from "next/link";

export default function Selector() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative ml-[20px] bg-slate-800 font-bold float-end">
            <button
                onClick={toggleMenu}
                className="py-2 px-4 bg-gray-700 text-white rounded-xl"
            >
                <div className="flex space-x-3  justify-center">
                    <div> <AiOutlineMenu className="text-[20px]"/></div>
                    <div><p>     Liste des testes</p></div>
                </div>
          
            </button>
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <li className="hover:bg-gray-200">
                        <Link href="/page/stat/tests/hematologie">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Hématologie</span>
                        </Link>
                    </li>
                    <li className="hover:bg-gray-200">
                        <Link href="/page/stat/tests/biochimie">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Biochimie</span>
                        </Link>
                    </li>
                    <li className="hover:bg-gray-200">
                    <Link href="/page/stat/tests/immunologie">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Séro-Immunologie</span>
                        </Link>
                    </li>
                    <li className="hover:bg-gray-200">
                    <Link href="/page/stat/tests/parasitologie">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Parasitologie</span>
                        </Link>
                    </li>
                    <li className="hover:bg-gray-200">
                    <Link href="/page/stat/tests/bacteriologie">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">Bactériologie</span>
                        </Link>
                    </li>
                </ul>
            )}
        </div>
    );
}
