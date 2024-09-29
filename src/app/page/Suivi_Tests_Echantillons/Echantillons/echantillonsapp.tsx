"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import {
  Box,
  LinearProgress,
  TextField,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { CgClose, CgAdd } from "react-icons/cg";
import { Button, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import TablePaginationActions from "./TablePaginationActions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface EchantillonItem {
  id: number;
  type: string;
  date_prelevement: string;
  patient: {
    id: number;
  } | null;
}

interface PatientItem {
  num: string,
}

interface PatientE {
  numE: string,
}

const API_BASE_URL = "http://localhost:3001/echantillon";
const PATIENT_API_BASE_URL = "http://localhost:3001";
const PATIENTExt_API_BASE_URL = "http://localhost:3001";

export default function EchantillonsApp() {
  const [data, setData] = useState<EchantillonItem[]>([]);
  const [filteredData, setFilteredData] = useState<EchantillonItem[]>([]);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [patientsE, setPatientsE] = useState<PatientE[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItem, setCurrentItem] = useState<EchantillonItem | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(
    null
  );
  const [selectedPatientE, setSelectedPatientE] = useState<PatientE | null>(
    null
  );
  const [defaultDate, setDefaultDate] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listes`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${PATIENT_API_BASE_URL}/hospitalises`);
      setPatients(response.data);
    } catch (error) {
      setError("Failed to fetch patients");
    }
  };

  const fetchPatientsExt = async () => {
    try {
      const response = await axios.get(`${PATIENTExt_API_BASE_URL}/Externes`);
      setPatientsE(response.data);
    } catch (error) {
      setError("Failed to fetch patients");
    }
  };

  useEffect(() => {
    fetchData();
    fetchPatients();
    fetchPatientsExt();
    setDefaultDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchTerm, data]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as yyyy-mm-dd for input type="date"
  };

  const handleOpenModal = (item?: EchantillonItem) => {
    setCurrentItem(item || null);
    setSelectedPatient(item?.patient || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setSelectedPatient(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Crée un FormData à partir du formulaire soumis
    const formData = new FormData(event.currentTarget);
    
    // Structure les données à envoyer
    const echantillonData = {
      type: formData.get("type") as string,
      date_prelevement: formData.get("date_prelevement") as string,
      patient: {
        num: selectedPatient?.num || selectedPatientE?.numE // Correction ici
      },
    };
  
    try {
      // Si un élément existe, on effectue une mise à jour
      if (currentItem) {
        await axios.put(
          `${API_BASE_URL}/misajours/${currentItem.id}`,
          echantillonData
        );
      } else {
        // Sinon, on crée un nouvel élément
        await axios.post(`${API_BASE_URL}/creer`, echantillonData);
      }
  
      // Recharge les données après soumission
      fetchData();
      handleCloseModal();
    } catch (error: any) {
      // Affiche un message d'erreur plus détaillé
      setError(error.response?.data?.message || "Failed to save data");
    }
  };
  

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/supprimer/${id}`);
        toast.success("L'élément a été supprimé.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          className: "mt-[98px] border",
        });
        fetchData();
      } catch (error) {
        setError("Failed to delete item");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
        <div className="w-full absolute top-0 left-0">
          <h3 className="flex items-center justify-center my-96">
            <Spin size="large" />
            <span className="mx-10">Loading...</span>
          </h3>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="p-5 shadow">
        <h1>Listes des échantillons</h1>
        <div className="my-3">
          <TextField
            type="search"
            placeholder="Recherche..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
          <div className="float-end">
            <Button
              type="text"
              size="middle"
              className="bg-Vert text-white"
              onClick={() => handleOpenModal()}
            >
              <CgAdd />
              Nouveau
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-3">
        <Paper className="w-full">
          <TableContainer className="h-[300px]">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">TYPE</TableCell>
                  <TableCell className="font-bold">
                    DATE DE PRELEVEMENT
                  </TableCell>
                  <TableCell className="font-bold">ID PATIENT</TableCell>
                  <TableCell className="font-bold" align="center">
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-1 text-[10px]">
                        {row.type}
                      </TableCell>
                      <TableCell className="py-1 text-[10px]">
                        {row.date_prelevement}
                      </TableCell>
                      <TableCell className="py-1 text-[10px]">
  {row.patient?.num 
    ? `${row.patient.num} H` // Ajoute "H" pour les patients avec `num`
    : row.patient?.numE 
      ? `${row.patient.numE} E` // Ajoute "E" pour les patients avec `numE`
      : "N/A" // Si aucun numéro n'est trouvé
  }
</TableCell>

                      <TableCell
                        align="center"
                        className="flex justify-center space-x-2 py-1"
                      >
                        <Tooltip title="Editer" placement="top" arrow>
                          <button
                            onClick={() => handleOpenModal(row)}
                            className="bg-Gris text-Bleu p-2 rounded "
                          >
                            <BiEdit />
                          </button>
                        </Tooltip>

                        <Tooltip title="Supprimer" placement="top" arrow>
                          <button
                            className="bg-Gris text-Rouge p-2 rounded"
                            onClick={() => handleDelete(row.id)}
                          >
                            <AiTwotoneDelete />
                          </button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "Tout", value: -1 }]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Paper>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-25 backdrop-blur-sm">
          <div className="bg-Gris rounded shadow-lg p-2 px-6 overflow-auto">
            <div className="w-full rounded">
              <span
                className="float-end m-2 cursor-pointer rounded-[50%] bg-gray-400 bg-opacity-35 p-2"
                onClick={handleCloseModal}
              >
                <CgClose />
              </span>
            </div>
            <h2 className="my-5 font-bold sticky top-0 mx-4 mt-8">
              {currentItem ? "Modifier" : "Insertion d'un"} échantillon
            </h2>
            <hr className="mx-4" />
            <form className="my-4" onSubmit={handleSubmit}>
              <div className="flex justify-center space-x-3">
                <div className="mb-4">
                  <TextField
                    label="Type"
                    name="type"
                    id="outlined-size-small"
                    className="w-[250px] my-4"
                    defaultValue={currentItem?.type ?? ""}
                    size="small"
                  />
                </div>

                <div className="mb-4 text-transparent">
                  <TextField
                    id="outlined-size-small"
                    name="date_prelevement"
                    label="Date Prélèvement"
                    type="date"
                    className="w-[250px] my-4"
                    defaultValue={currentItem?.date_prelevement ?? defaultDate}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
  <Autocomplete
    options={patients}
    getOptionLabel={(option) => `${option.num.toString()} H`} // Ajoute "H" après le numéro
    value={selectedPatient ?? null}
    onChange={(event, value) => {
      setSelectedPatient(value || null);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Patient"
        name="patient_id"
        
        size="small"
      />
    )}
  />
</div>

<div className="mb-4">
  <Autocomplete
    options={patientsE}
    getOptionLabel={(option) => `${option.numE.toString()} E`} // Ajoute "E" après le numéro
    value={selectedPatientE ?? null}
    onChange={(event, value) => {
      setSelectedPatientE(value || null);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Patient (NumE)"
        name="patientE_id"
        
        size="small"
      />
    )}
  />
</div>



              <div className="flex justify-center float-end">
                <button
                  type="submit"
                  className="bg-Bleu p-2 my-3 rounded-md px-4 text-white"
                >
                  {currentItem ? `Mettre à jours` : `Sauvegarder`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
