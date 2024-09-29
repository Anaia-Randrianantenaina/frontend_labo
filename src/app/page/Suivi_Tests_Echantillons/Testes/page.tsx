import React from "react";
import Navbar from "@/app/navbar/navbar";
import Testeapp from "./testeapp";
import Aappbar from "../appbar/appbar";

const page = () => {
  return (
    <>
      <div className="flex">
        <Navbar />
        <div className="w-full h-[100vh] p-2">
          {/* bar horizontal */}
          <div className="w-full h-[9%] shadow-md  border border-gray-200 rounded px-4 py-2">
            <Aappbar />
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
