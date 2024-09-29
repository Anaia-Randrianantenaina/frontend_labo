import React from "react";
import Navbar from "@/app/navbar/navbar";
import Appbar from "../appbar/appbar";

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
          <div className="w-full h-[89%] shadow-md  border border-gray-200 rounded flex">
            <div className="h-full rounde-[55px] w-[50%]"></div>
            <img
              src="/Images/testimage.jpeg"
              className="rounded-full rounded-r-none rounded-t-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
