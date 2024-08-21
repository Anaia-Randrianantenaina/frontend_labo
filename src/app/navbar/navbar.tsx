import { MdExitToApp } from "react-icons/md";
import { GiHistogram } from "react-icons/gi";
import { FaUserInjured } from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { GiTestTubes } from "react-icons/gi";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function navbar() {
  return (
    <div className="bg-slate-50">
      <div className="w-[80px] h-[100vh] bg-white drop-shadow-md rounded">
        <img src="/Images/laboratoryy_32.png" className="pl-5 pt-4" />
        <p className="text-[12px] pl-[6px] pt-2 font-bold text-green-900">
          Laboratoire
        </p>
        <hr className="w-14 ml-[10px] mt-2" />

        <div className="text-center mt-6">
          <Tooltip title="Hospitalisé / Externe" placement="right" arrow>
            <Link href="/page/patient/hospitalise">
              <button>
                <FaUserInjured className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Patient</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Testes / Echantillons" placement="right" arrow>
            <Link href="/page/Suivi_Tests_Echantillons/Accueill_Testes">
              <button>
                <GiTestTubes className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Test</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Ressource / Matériel" placement="right" arrow>
            <Link href="/page/materiel/liste">
              <button>
                <MdMedicalServices className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Materiel</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip title="Personnels de Laboratoire" placement="right" arrow>
            <Link href="/page/personnel">
              <button>
                <FaUserMd className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Personnel</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-6">
          <Tooltip
            title="Tableau de bord et rapport analytique"
            placement="right"
            arrow
          >
            <Link href="/page/stat/patient">
              <button>
                <GiHistogram className="text-[25px]" />
              </button>
              <p className="text-[10px] font-semibold">Statistique</p>
            </Link>
          </Tooltip>
        </div>

        <div className="text-center mt-4 absolute bottom-3 left-0 w-20">
          <hr className="w-14 ml-[10px] mb-2" />
          <Tooltip title="se deconnecter" placement="right" arrow>
            <Link href="/login">
              <button>
                <MdExitToApp className="text-[25px] text-red-600" />
              </button>
              <p className="text-[10px] font-semibold text-red-600">Quitter</p>
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
