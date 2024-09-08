import { GiHypodermicTest } from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Select, SelectChangeEvent, TextField, Theme, useTheme } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";
import React from "react";
import { GiMicroscope } from "react-icons/gi";
import { MdSave } from "react-icons/md";

//style afahana mscrool any select
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8, // le 48: height , 8 padding top
            width: 250,
        },
    },
};

//Donnée ao anaty select 
const hematologie = [
    'Fibrinogène',
    'Hémogramme',
    'Taux de Prothrombie',
    'Temps de Saignement',
    'Test d Emmel',
    'Réticulocttes'
];

const biosang = [
    'Acide urique',
    'Amylasémie',
    'Albumine',
    'ALAT',
    'ASAT',
    'Bilirubine directe',
    'Bilirubine totale',
    'Calcémie',
    'Cholestérol',
    'Créatinine',
    'CRP',
    'Gamma GT',
    'Glycémie',
    'HBA,C',
    'HDL cholestérol',
    'HGPO',
    'Ionogramme',
    'LDH',
    'LDL Cholestérol',
    'Magnésémie',
    'Protéine total',
    'Phostphates alcalines',
    'Phosphorémie',
    'triglycérides',
    'troponine l',
    'Urée'
]

const biouri = [
    'Ionogramme urinaire',
    'Protéinurie de 24H',
    'Urine ASA'
]

const liquide = [
    'Ascite',
    'Etude chimique',
    'Etude cytologique',
    'LRC',
    'Pleural'
]

const sero = [
    'ASLO',
    'Bilharzioze',
    'Cysticercose',
    'Facteur rhumatoïde',
    'HCG plasmatique',
    'Hépatite A',
    'Hépatite B',
    'Hépatite C',
    'RPR',
    'TPHA',
    'TSH',
    'T3',
    'T4',
    'Widal Félix'
]

const bact = [
    'Culot urinaire',
    'ECBU',
    'FCV',
    'Frotitis de gorge',
    'FU',
    'HLM',
    'Liquide à priciser',
    'Pus superficiel',
    'Pus profonde'
]

const para = [
    'Recherches d hematoeaire',
    'Selles KAOP'
]

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function AjoutAnalyse({miseho, mikatona}) {
    //afahana mana  o modal
    if(!miseho) return null

    //ilay amn input date
    const currentDate = dayjs();

    //ilaina amn select io ty
    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <form>
                <div className="bg-white w-[720px] h-[550px] rounded">
                        <button className="bg-white w-6 h-6 rounded-sm mt-1 mx-[690px] text-red-600 text-[18px] font-semibold hover:bg-slate-100 transition duration-100" onClick={()=>mikatona()}>X</button>
                        <div className="flex ml-4 mb-6">
                            <div className="bg-green-400 rounded-[20px] w-10 h-10">
                                <div className="mt-2 ml-[1px]">
                                    <GiMicroscope className="text-green-700 ml-[6px] text-[25px]" />
                                </div>
                            </div>
                            <p className="ml-2 mt-1 font-bold text-[22px]">Examen démandé</p><br />
                        </div>

                        <hr className="w-[300px] ml-[200px] mt-2" />

                    {/* INFORMATION DES PATIENTS */}
                    <div className="mt-5">
                        <div>
                            {/* PATIENT */}
                            <p className="flex ml-9 font-semibold"><IoMdInformationCircleOutline className="mt-1 ml-1 mr-1" /> Information du patient hospitalisé</p>
                            <FormControl className="w-[200px] ml-10 mt-2">
                                <InputLabel>N°patient*</InputLabel>
                                <Select label="N°patient*">
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="1H">1H</MenuItem>
                                    <MenuItem value="2H">2H</MenuItem>
                                    <MenuItem value="3H">3H</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField id="outlined-basic" label="Nom du patient" variant="outlined" className="mt-2 ml-5 w-[200px]" disabled />
                            <TextField id="outlined-basic" label="Service" variant="outlined" className="mt-2 ml-5 w-[200px]" disabled />

                            <FormControl className="w-[200px] ml-10 mt-4">
                                <InputLabel>Id prescripteur*</InputLabel>
                                <Select label="Id prescripteur*">
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="1H">1H</MenuItem>
                                    <MenuItem value="2H">2H</MenuItem>
                                    <MenuItem value="3H">3H</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField id="outlined-basic" label="Nom precripteur" variant="outlined" className="mt-4 ml-5 w-[200px]" disabled />
                            <TextField id="outlined-basic" label="Contact prescripteur" variant="outlined" className="mt-4 ml-5 w-[200px]" disabled />

                            {/* ANALYSE */}
                            <p className="flex ml-9 mt-5 font-semibold"><GiHypodermicTest className="mt-1 ml-1 mr-1" />Analyse demandés</p>
                            <FormControl className="w-[200px] ml-10 mt-2">
                                <InputLabel>Hématologie</InputLabel>
                                <Select
                                    multiple // ty le matonga anazy selectena maro
                                    value={personName} // le valeur ao anatiny
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Hématologie" />} // karazana 
                                    MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                                >
                                    {hematologie.map((name) => (
                                        <MenuItem value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="w-[200px] ml-5 mt-2">
                                <InputLabel>Biochimie</InputLabel>
                                <Select
                                    multiple // ty le matonga anazy selectena maro
                                    value={personName} // le valeur ao anatiny
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Biochimie" />} // karazana 
                                    MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                                >
                                <MenuItem value="" disabled className="font-bold"><em>Biochimie Sanguine</em></MenuItem>
                                    {biosang.map((name) => (
                                        <MenuItem value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}

                                    <MenuItem value="" disabled className="font-bold"><em>Biochimie Urinaire</em></MenuItem>
                                    {biouri.map((name) => (
                                        <MenuItem value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="" disabled className="font-bold"><em>Liquide Biologique</em></MenuItem>
                                    {liquide.map((name) => (
                                        <MenuItem value={name}
                                            style={getStyles(name, personName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="w-[200px] ml-5 mt-2">
                                <InputLabel>Sero-immunologie</InputLabel>
                                <Select
                                    multiple // ty le matonga anazy selectena maro
                                    value={personName} // le valeur ao anatiny
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Sero-immunologie" />} // karazana 
                                    MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                                >
                                    {sero.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(name, personName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl><br />

                            <FormControl className="w-[200px] ml-10 mt-4">
                                <InputLabel>Bacteriologie</InputLabel>
                                <Select
                                    multiple // ty le matonga anazy selectena maro
                                    value={personName} // le valeur ao anatiny
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Bacteriologie" />} // karazana 
                                    MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                                >
                                    {bact.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(name, personName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="w-[200px] ml-5 mt-4">
                                <InputLabel>Parastologie</InputLabel>
                                <Select
                                    multiple // ty le matonga anazy selectena maro
                                    value={personName} // le valeur ao anatiny
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Parastologie" />} // karazana 
                                    MenuProps={MenuProps} // hireglena ny height mscrool sy padding top
                                >
                                    {para.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(name, personName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField id="outlined-basic" label="Autre" variant="outlined" className="mt-4 ml-5 w-[200px]" />

                            <Button onClick={()=>mikatona()} className="text-white bg-green-800 hover:bg-green-700 float-right mr-[285px] mt-5 w-[150px] h-[35px]">
                                <MdSave className="text-[15px] ml-1 mr-1" /><span className="text-[12px]">Enregistrer</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}