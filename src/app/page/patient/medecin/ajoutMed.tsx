import { FaUserMd } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Switch } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AjoutMed({ isVisible, onClose }) {
    if (!isVisible) return null;

    const handleClose = (event) => {
        event.preventDefault();
        onClose();
    };

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [isInput, setInput] = useState(false);
    const chandeSwitch = (checked) => {
        setInput(checked);
    };

    const message = () => toast.success('Préscripteur local', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: handleClose
    });

    const messageM = () => toast.success('Préscripteur externe', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const [donnee, setDonnee] = useState<MedecinDataL[]>([]);
    const [data, setData] = useState<MedecinDataE[]>([]);

    interface MedecinDataL {
        matricule: string;
        nomP: string;
        contact: string;
        serviceP: string;
    }

    interface MedecinDataE {
        id: string;
        nomME: string;
        contact: string;
        adresseME: string;
    }

    const [ajoutM, setAjoutM] = useState({
        matricule: "",
        nomP: "",
        contact: "",
        serviceP: ""
    });

    const [ajoutE, setAjoutE] = useState({
        id: "",
        nomME: "",
        contact: "",
        adresseME: ""
    });

    const InputeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAjoutM({
            ...ajoutM,
            [name]: value
        });
      }
    
      const InputeChangeE = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAjoutE({
            ...ajoutE,
            [name]: value
        });
      }

    // Fonction de gestion des changements des champs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'nom':
                if (isInput) {
                    setAjoutE((prev) => ({ ...prev, nomME: value }));
                } else {
                    setAjoutM((prev) => ({ ...prev, nomP: value }));
                }
                break;
            case 'contact':
                if (isInput) {
                    setAjoutE((prev) => ({ ...prev, contact: value }));
                } else {
                    setAjoutM((prev) => ({ ...prev, contact: value }));
                }
                break;
            default:
                break;
        }
    };

    const save = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/Medecinlocals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ajoutM),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du nouvel hospitalisé');
            }

            const result = await response.json();
            setDonnee([...donnee, result]);

            setAjoutM({
                matricule: "",
                nomP: "",
                contact: "",
                serviceP: ""
            });
            message();
        } catch (error) {
            console.log("Erreur lors de l'enregistrement de prescripteur local", error);
        }
    };

    const ajout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/Medecinexternes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ajoutE),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du nouvel hospitalisé');
            }

            const result = await response.json();
            setData([...data, result]);

            setAjoutE({
                id: "",
                nomME: "",
                contact: "",
                adresseME: ""
            });
            messageM()
        } catch (error) {
            console.log("Erreur lors de l'enregistrement de prescripteur externe", error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isInput) {
            ajout(e);  // Fonction pour prescripteur externe
        } else {
            save(e);   // Fonction pour prescripteur local
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form onSubmit={handleSubmit}>
                <div className="bg-white w-[550px] h-[400px] rounded">
                    <button
                        className="bg-white w-6 h-6 rounded-sm mt-1 mx-[520px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100"
                        onClick={handleClose}
                    >
                        X
                    </button>
                    <div className="flex ml-4">
                        <div className="bg-green-400 rounded-[20px] w-10 h-10">
                            <div className="mt-2 ml-[1px]">
                                <FaUserMd className="text-green-700 ml-[6px] text-[25px]" />
                            </div>
                        </div>
                        <p className="ml-2 mt-1 font-bold text-[22px]">Nouveau prescripteur</p>

                        <Switch
                            checked={isInput}
                            onChange={chandeSwitch}
                            checkedChildren="Préscripteur externe"
                            unCheckedChildren="Préscripteur local"
                            className="mt-[11px] ml-3 bg-success"
                            style={{ backgroundColor: isInput ? '#0000FF' : '#28a745' }} 
                        />
                    </div>

                    <hr className="w-[200px] ml-[170px] mt-5" />

                    <div className="mt-3">
                        <TextField
                            label="Nom*"
                            variant="outlined"
                            className="mt-3 ml-10"
                            name="nom"
                            value={isInput ? ajoutE.nomME : ajoutM.nomP}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Contact*"
                            variant="outlined"
                            className="mt-3 ml-10"
                            name="contact"
                            value={isInput ? ajoutE.contact : ajoutM.contact}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Matricule*"
                            name="matricule"
                            value={ajoutM.matricule}
                            onChange={InputeChange}
                            variant="outlined"
                            className="mt-5 ml-10"
                            disabled={isInput}
                        />
                        <TextField
                            label="Id externe*"
                            name="id"
                            value={ajoutE.id}
                            onChange={InputeChangeE}
                            variant="outlined"
                            className="mt-5 ml-10"
                            disabled={!isInput}
                        />
                        <TextField
                            label="Service*"
                            name="serviceP"
                            value={ajoutM.serviceP}
                            onChange={InputeChange}
                            variant="outlined"
                            className="mt-5 ml-10"
                            disabled={isInput}
                        />
                        <TextField
                            label="Adresse*"
                            name="adresseME"
                            value={ajoutE.adresseME}
                            onChange={InputeChangeE}
                            variant="outlined"
                            className="mt-5 ml-10"
                            disabled={!isInput}
                        />
                        <Button type="submit" className="text-white bg-green-800 hover:bg-green-700 float-right mr-[210px] mt-5 w-[150px] h-[35px]">
                            <MdSave className="text-[15px] ml-1 mr-1" />
                            <span className="text-[12px]">Enregistrer</span>
                        </Button>
                    </div>
                </div>
                <ToastContainer/>
            </form>
        </div>
    );
}
