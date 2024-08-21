import { BsKey } from "react-icons/bs"; 
import { FaRegUser } from "react-icons/fa"; 
import { GiHospitalCross } from "react-icons/gi";
import TextField from '@mui/material/TextField';
import { Button, Select, Input } from "@mui/material";
import React from "react";

export default function Login() {
    return (
        <div className="bg-slate-50 w-full h-[100vh] pt-24">
            {/* LOGO */}
            <div className="flex justify-center mb-5">
                <GiHospitalCross className="text-green-800 w-10 h-10" />
            </div>

            {/* CONTENU */}
            <div className="relative inset-0 flex justify-center items-center text-emerald-950">
                <div className="w-[450px] h-[350px] text-center bg-white shadow-xl px-20 relative rounded-xl" >
                    <h1 className=" text-[28px] font-semibold mt-8">CHU Tambohobe</h1>
                    <p className="text-[14px] font-serif">Access et systèm laboratoire</p>
                    <ul className="flex">
                        <li><FaRegUser className="text-[20px] mt-10 mr-2"/></li>
                        <li><TextField id="outlined-basic" label="Email" variant="standard" className="w-[250px] mt-4" /></li>
                    </ul> <br />
                    <ul className="flex">
                        <li><BsKey className="text-[20px] mt-7 mr-2"/></li>
                        <li><TextField id="standard-basic" label="Mot de passe" variant="standard" className="w-[250px]"/></li>
                    </ul>
                    <Button className="bg-green-800 hover:bg-green-700 transition duration-300 text-white font-medium w-[275px] py-2 px-4 rounded-2xl my-6">Valider</Button>
                </div>
            </div>
        </div>
    )
}