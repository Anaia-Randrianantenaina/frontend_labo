import { MdSave } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';

interface AjoutHospiProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function AjoutHospi({ isVisible, onClose }: AjoutHospiProps) {
    if (!isVisible) return null;

    useEffect(() => {
        afficheNum(); // Récupérer le dernier numéro de patient au montage du composant
    }, []);

    interface NotifData {
        message: string;
    }

    interface HospitaliseData {
        num: string;
        nom: string;
        prenom: string;
        service: string;
        sexe: string;
        adresse: string;
        age: string;
        date_naiss: string;
    }

    const [formValues1, setFormValues1] = useState({
        message: 'Un nouveau patient ajouté',
    });

    const [dataN, setDataN] = useState<NotifData[]>([]);
    const [donnee, setDonnee] = useState<HospitaliseData[]>([]);
    const [lastNum, setLastNum] = useState<string | null>(null);

    const [selectDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [age, setAge] = useState<string | null>(null);
    const [count, setCount] = useState(0);

    const calculateAge = (date: dayjs.Dayjs) => {
        const today = dayjs();
        return today.year() - date.year();
    };

    const handleDateChange = (newValue: dayjs.Dayjs | null) => {
        setSelectedDate(newValue);
        if (newValue) {
            const calculatedAge = calculateAge(newValue);
            setAge(calculatedAge.toString());
            setFormValues(prevValues => ({
                ...prevValues,
                age: calculatedAge.toString(),
                date_naiss: newValue.format('YYYY-MM-DD'),
            }));
        }
    };

    const message = () => toast.success('Patient hospitalisé enregistré', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClose: onClose,
    });

    const messageErreur = () => toast.error("Patient hospitalisé non enregistré", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });

    const [formValues, setFormValues] = useState({
        num: "",
        nom: "",
        prenom: "",
        service: "",
        sexe: "",
        adresse: "",
        age: "",
        date_naiss: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const savePatient = async () => {
        const newCount = count + 1;
        const updatedFormValues = { ...formValues, num: newCount.toString() };
        setCount(newCount);

        try {
            const response = await fetch('http://localhost:3001/Hospitalises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormValues),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du nouvel hospitalisé');
            }

            const result = await response.json();
            setDonnee([...donnee, result]);

            setFormValues({
                num: "",
                nom: "",
                prenom: "",
                service: "",
                sexe: "",
                adresse: "",
                age: "",
                date_naiss: ""
            });

            message(); // Afficher un message de succès
        } catch (error) {
            messageErreur(); // Afficher un message d'erreur
        }
    };

    const handleAnaia = async () => {
        try {
            const responsee = await fetch('http://localhost:3001/notifs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues1),
            });

            if (!responsee.ok) {
                throw new Error('Erreur lors de l ajout de la notification');
            }

            const result1 = await responsee.json();
            console.log("Notification ajoutée:", result1);
            setDataN([...dataN, result1]);

            setFormValues1({
                message: '',
            });
        } catch (error) {
            console.error('Erreur lors de l ajout de la notification:', error);
        }
    };

    const afficheNum = async () => {
        try {
            const response = await fetch("http://localhost:3001/hospitalises/last-num");
            if (!response.ok) {
                throw new Error("Erreur d'affichage du dernier numéro");
            }
            const result = await response.json();
            setDonnee(result);
        } catch (error) {
            console.error("Erreur lors de l'affichage du dernier numéro:", error);
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await savePatient();
        await handleAnaia();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={handleSave}>
                <div className="bg-white w-[550px] h-[380px] rounded">
                    <button
                        type="button"
                        className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                        onClick={onClose}
                    >
                        X
                    </button>
                    <div className="flex ml-4">
                        <div className="bg-green-400 rounded-[20px] w-10 h-10">
                            <div className="mt-2 ml-[1px]">
                                <BsPersonFillAdd className="text-green-700 ml-[6px] text-[25px]" />
                            </div>
                        </div>
                        <p className="ml-2 mt-1 font-bold text-[22px]">Nouveau patient hospitalisé</p>
                    </div>

                    <div className="mt-3">
                        <TextField
                            label="Nom*"
                            name="nom"
                            value={formValues.nom}
                            onChange={handleInputChange}
                            variant="outlined"
                            className="mt-2 ml-10"
                        />
                        <TextField
                            label="Prénom"
                            name="prenom"
                            value={formValues.prenom}
                            onChange={handleInputChange}
                            variant="outlined"
                            className="mt-2 ml-10"
                        />
                        <TextField
                            label="Adresse"
                            name="adresse"
                            value={formValues.adresse}
                            onChange={handleInputChange}
                            variant="outlined"
                            className="mt-5 ml-10"
                        />
                        <TextField
                            label="Service*"
                            name="service"
                            value={formValues.service}
                            onChange={handleInputChange}
                            variant="outlined"
                            className="mt-5 ml-10"
                        />
                        <TextField
                            label="Sexe*"
                            name="sexe"
                            value={formValues.sexe}
                            onChange={handleInputChange}
                            variant="outlined"
                            className="mt-5 ml-10"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                maxDate={dayjs()}
                                label="Date de naissance*"
                                value={selectDate}
                                onChange={handleDateChange}
                                className="mt-5 ml-10"
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="mt-5 ml-10">
                        <Button variant="contained" color="primary" type="submit">
                            <MdSave className="mr-2" /> Enregistrer
                        </Button>
                    </div>
                </div>
                <ToastContainer />
            </form>
        </div>
    );
}
