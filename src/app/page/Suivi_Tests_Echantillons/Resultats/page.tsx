import { GiDrippingTube } from "react-icons/gi";
import { TbTestPipe2 } from "react-icons/tb";
import { BiUserCircle } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { BiCommentError } from "react-icons/bi";
import React from "react";
import Navbar from "@/app/navbar/navbar";
import Link from "next/link";
import Appbar from "../appbar/appbar";
import Testeapp from "./resultatsapp";

const page = () => {
  return (
    <>
      <div className="flex">
        <Navbar />
        <div className="w-full h-[100vh] p-2">
          {/* bar horizontal */}
          <div className="w-full h-[9%] shadow-md  border border-gray-200 rounded px-4 py-2">
            <Appbar />
          </div>
          {/* intouchable */}
          <div className="w-full h-[2%]"></div>
          {/* contenu */}
          <div className="w-full h-[89%] shadow-md  border border-gray-200 rounded">
            <Testeapp />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
