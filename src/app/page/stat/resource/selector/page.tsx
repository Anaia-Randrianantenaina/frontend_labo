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
                className="py-2 px-4 w-[100px] bg-gray-700 text-white rounded-xl "
            >
                <AiOutlineMenu className="text-[20px] ml-6"/>
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
