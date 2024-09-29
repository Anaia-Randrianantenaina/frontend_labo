import React from "react";
import Navbar from "@/app/navbar/navbar";
import Appbar from "../appbar/appbar";
import Patientapp from "./patientapp";

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
            <Patientapp />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
