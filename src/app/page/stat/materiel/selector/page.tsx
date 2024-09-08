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
        <div className="relative ml-[20px]  font-bold float-end">
            <button
                onClick={toggleMenu}
                className="py-2 px-4 bg-gray-700 text-white rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:bg-gray-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer flex items-center space-x-3"

            >
                <AiOutlineMenu className="text-[20px] ml-6"/>
                <p>Select</p>
            </button>
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <li className="hover:bg-gray-200">
                        <Link href="/page/stat/materiel">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">MATÉRIELS</span>
                        </Link>
                    </li>
                    <li className="hover:bg-gray-200">
                        <Link href="/page/stat/resource">
                            <span className="block py-2 px-4 text-gray-800 hover:text-green-600">INTRANTS</span>
                        </Link>
                    </li>
                </ul>
            )}
        </div>
    );
}
