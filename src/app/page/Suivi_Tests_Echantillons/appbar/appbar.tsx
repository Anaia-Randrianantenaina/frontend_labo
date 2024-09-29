"use client";

import { GrDocumentTest } from "react-icons/gr";
import Link from "next/link";
import React from "react";
import { BiCommentError, BiUserCircle } from "react-icons/bi";
import { GiDrippingTube } from "react-icons/gi";
import { IoMdNotifications } from "react-icons/io";
import { TbTestPipe2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Button } from "antd";

const appbar = () => {
  // const Daty = DateActuel();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between">
        {/* navigation */}
        <div className="w-[33%] space-x-4 flex justify-start">
          <Button
            type="text"
            size="middle"
            className="bg-Vert text-white"
            onClick={() =>
              router.push("/page/Suivi_Tests_Echantillons/Echantillons")
            }
          >
            <GiDrippingTube />
            Echantillons
          </Button>

          <Button
            type="text"
            size="middle"
            className="bg-Vert text-white"
            onClick={() => router.push("/page/Suivi_Tests_Echantillons/Testes")}
          >
            <TbTestPipe2 /> Testes
          </Button>

          <Button
            type="text"
            size="middle"
            className="bg-Vert text-white"
            onClick={() =>
              router.push("/page/Suivi_Tests_Echantillons/Resultats")
            }
          >
            <GrDocumentTest /> Resultats
          </Button>
        </div>
        {/* .ithr>h1+p+a.button{clic!} */}

        {/* titre */}
        <div className="w-[33%] ">
          <h1 className="text-center ">Suivi des tests et des échantillons</h1>
        </div>

        {/* icons */}
        <div className="w-[33%]">
          <div className="float-end space-x-4 flex">
            <BiCommentError />
            <IoMdNotifications />
            <BiUserCircle />
          </div>
        </div>
      </div>
    </>
  );
};

export default appbar;
