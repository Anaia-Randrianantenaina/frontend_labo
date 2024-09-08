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

export default function AjoutHospi({ isVisible, onClose }) {
    if (!isVisible) return null;

    useEffect(() => {
        afficheNum()
      }, []);

    // Date actuelle
    const currentDate = dayjs();

    // État pour la sélection de la date et l'âge calculé
    const [selectDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [Age, setAge] = useState<string | null>(null);

    // État pour les données hospitalisées
    const [donnee, setDonnee] = useState<HospitaliseData[]>([]);

    //recuperation de derniere numero
    const [lastNum, setLastNum] = useState<string | null>(null);

    // Fonction pour calculer l'âge
    const calculateAge = (date: dayjs.Dayjs) => {
        const today = dayjs();
        return today.year() - date.year();
    }

    // Mise à jour de la date sélectionnée et calcul de l'âge
    const handleDateChange = (newValue: dayjs.Dayjs | null) => {
        setSelectedDate(newValue);
        if (newValue) {
            const age = calculateAge(newValue);
            setAge(age.toString());
            setFormeValues(prevValues => ({
                ...prevValues,
                age: age.toString(),
                date_naiss: newValue.format('YYYY-MM-DD') // Met à jour l'état du formulaire avec la date de naissance
            }));
        }
    }

    // Calcul du numéro de patient
    const [count, setCount] = useState(0);

    // Notification de succès
    const message = () => toast.success('Patient hospitalisé enregistré', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: onClose
    });

    // Notification d'erreur
    const messageErreur = () => toast.error("Patient hospitalisé non enregistré", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    // Information pour les données des hospitalisés
    interface HospitaliseData {
        num: string,
        nom: string,
        prenom: string,
        service: string,
        sexe: string,
        adresse: string,
        age: string,
        date_naiss: string
    }

    // État pour les valeurs du formulaire
    const [formeValues, setFormeValues] = useState({
        num: "",
        nom: "",
        prenom: "",
        service: "",
        sexe: "",
        adresse: "",
        age: "",
        date_naiss: ""
    });

    // Fonction pour le changement de l'input
    const InputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormeValues({
            ...formeValues,
            [name]: value
        });
    }

    // Fonction pour ajouter un nouvel hospitalisé
    const save = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mettre à jour le numéro de patient
        const newCount = count + 1;
        const updatedFormValues = { ...formeValues, num: newCount.toString() };
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
            console.log("Nouvel hospitalisé ajouté :", result);

            setDonnee([...donnee, result]);

            // Réinitialiser les valeurs du formulaire
            setFormeValues({
                num: "",
                nom: "",
                prenom: "",
                service: "",
                sexe: "",
                adresse: "",
                age: "",
                date_naiss: ""
            });
            message();
        } catch (error) {
            console.error("Erreur lors de l'ajout du patient :", error);
            messageErreur();
        }
    }

    //affichage de dernier numero dans la base de donnéé
      const afficheNum = async () =>{
        try {
            const response = await fetch("http://localhost:3001/hospitalises/last-num");
            if(!response.ok){
                throw new Error("Erreur d'affichage de derniere numero")
            }

            const resultt = await response.json();
            console.log("Donnees recuperes: ", resultt)
            setDonnee(resultt)
        }
        catch (error) {
            console.log("erreur lors de l'affichage de dernier numero", error)
        }
      }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={save}>
                <div className="bg-white w-[550px] h-[380px] rounded">
                    <button
                        type="button"
                        className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                        onClick={() => onClose()}
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
                    {/* INFORMATION DES PATIENTS */}
                    <div className="mt-3">
                        <div>
                            <TextField
                                label="Nom*"
                                name="nom"
                                value={formeValues.nom}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-2 ml-10"
                            />
                            <TextField
                                label="Prénom"
                                name="prenom"
                                value={formeValues.prenom}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-2 ml-10"
                            />
                            <TextField
                                label="Adresse"
                                name="adresse"
                                value={formeValues.adresse}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <TextField
                                label="Service*"
                                name="service"
                                value={formeValues.service}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <TextField
                                label="Sexe*"
                                name="sexe"
                                value={formeValues.sexe}
                                onChange={InputeChange}
                                variant="outlined"
                                className="mt-5 ml-10"
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    maxDate={currentDate}
                                    label="Date de naissance*"
                                    sx={{ width: '210px' }}
                                    className="mt-5 ml-10"
                                    value={selectDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            
                            <Button
                                type="submit"
                                className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]"
                            >
                                <MdSave className="text-[15px] ml-1 mr-1" />
                                <span className="text-[12px]">Enregistrer</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
