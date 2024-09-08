import { MdSave } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import React from "react";
import { Button, Select, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function AjoutExtene({ isVisible, onClose }) {
    if (!isVisible) return null;
    const currentDate = dayjs();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form>
                <div className="bg-white w-[550px] h-[380px] rounded">
                    <button className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100" onClick={() => onClose()}>X</button>
                    <div className="flex ml-4">
                        <div className="bg-green-400 rounded-[20px] w-10 h-10">
                            <div className="mt-2 ml-[1px]">
                                <BsPersonFillAdd className="text-green-700 ml-[6px] text-[25px]" />
                            </div>
                        </div>
                        <p className="ml-2 mt-1 font-bold text-[22px]">Nouveau patient Externe</p><br />
                    </div>
                    {/* INFORMATION DES PATIENTS */}
                    <div className="mt-3">
                        <div>
                            <TextField label="Numero*" variant="outlined" className="mt-2 ml-10" />
                            <TextField label="Nom*" variant="outlined" className="mt-2 ml-10" />
                            <TextField label="Prénom" variant="outlined" className="mt-5 ml-10" />
                            <TextField label="Adresse*" variant="outlined" className="mt-5 ml-10" />
                            <TextField label="sexe*" variant="outlined" className="mt-5 ml-10" />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    label="Date de naissance*"
                                    maxDate={currentDate} 
                                    sx={{ width: '210px' }} 
                                    className="mt-5 ml-10" />
                            </LocalizationProvider><br />
                            <Button className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]"><MdSave className="text-[15px] ml-1 mr-1" /><span className="text-[12px]">Enregistrer</span></Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}