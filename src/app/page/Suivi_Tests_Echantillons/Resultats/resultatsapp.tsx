"use client";

import { useState, useEffect, useRef } from "react";
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
import { Button, message, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import TablePaginationActions from "./TablePaginationActions";

interface ResultatItem {
  id: number;
  teste: {
    id: number;
  } | null;
}

interface TesteItem {
  id: number;
}

const API_BASE_URL = "http://localhost:3001/resultat";
const TESTE_API_BASE_URL = "http://localhost:3001/teste";

export default function ResultatsApp() {
  const [data, setData] = useState<ResultatItem[]>([]);
  const [filteredData, setFilteredData] = useState<ResultatItem[]>([]);
  const [resultat, setResultat] = useState<TesteItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItem, setCurrentItem] = useState<ResultatItem | null>(null);
  const [selectedResultat, setSelectedResultat] = useState<TesteItem | null>(
    null
  );
  const [ouvrirModal, setOuvrirModal] = useState(false);

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

  const fetchResultat = async () => {
    try {
      const response = await axios.get(`${TESTE_API_BASE_URL}/listes`);
      setResultat(response.data);
    } catch (error) {
      setError("Failed to fetch resultat");
    }
  };

  useEffect(() => {
    fetchData();
    fetchResultat();
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

  const handleOpenModal = (item?: ResultatItem) => {
    setCurrentItem(item || null);
    setSelectedResultat(item?.teste || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setSelectedResultat(null);
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

    const formData = new FormData(event.currentTarget);
    const resultatData = {
      id: currentItem ? currentItem.id : undefined, // Utiliser l'ID existant pour la mise à jour
      teste: {
        id: selectedResultat?.id || 0, // Lier avec le `teste`
      },
    };

    try {
      if (currentItem && currentItem.id) {
        // Si `currentItem` existe et contient un `id`, faire une mise à jour
        await axios.put(
          `${API_BASE_URL}/misajours/${currentItem.id}`,
          resultatData
        );
        // Swal.fire("Mis à jour !", "L'élément a été mis à jour.", "success");
        toast.success("L'élément a été mis à jour.", {
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
      } else {
        // Sinon, créer un nouvel élément
        await axios.post(`${API_BASE_URL}/creer`, resultatData);
        // Swal.fire("Créé !", "L'élément a été créé.", "success");
        toast.success("L'élément a été créé.", {
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
      }

      fetchData(); // Recharger les données après mise à jour ou création
      handleCloseModal(); // Fermer la modal après soumission
    } catch (error) {
      console.error("Erreur lors de l'enregistrement : ", error);
      setError("Échec de l'enregistrement des données");
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
        // Swal.fire("Supprimé !", "L'élément a été supprimé.", "success");
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
        setError("Échec de la suppression de l'élément");
      }
    }
  };

  // modale de resultats
  const fonctionOpenModal = () => {
    setOuvrirModal(true);
  };

  const fermerModal = () => {
    setOuvrirModal(false);
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Document A4",
    onAfterPrint: () => console.log("Impression terminée"),
  });

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
    // return <div className="text-center">Error: <span className="text-Rouge my-96">{error}</span></div>;
    return (
      <>
        <div className="w-full absolute top-0 left-0">
          <h3 className="flex items-center justify-center my-96">
            <span className="mx-10">{error}</span>
          </h3>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-5 shadow">
        <h1>Listes des résultats</h1>
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
                  <TableCell className="font-bold">ID TESTE</TableCell>
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
                      <TableCell>{row.teste?.id ?? "N/A"}</TableCell>{" "}
                      {/* Safe access with default value */}
                      <TableCell
                        align="center"
                        className="flex justify-center space-x-2"
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

                        <Tooltip title="Détails" placement="top" arrow>
                          <button
                            className="bg-Gris text-Bleu p-2 rounded"
                            onClick={() => fonctionOpenModal()}
                          >
                            <AiOutlineEye />
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
        <div className="fixed inset-0 bg-white bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-Gris p-4 rounded-lg">
            <div className="w-full rounded mb-8">
              <span
                className="float-end m-2 mb-7 cursor-pointer rounded-[50%] bg-gray-400 bg-opacity-35 p-2"
                onClick={handleCloseModal}
              >
                <CgClose />
              </span>
            </div>
            <h2 className="my-8 mb-3 font-bold sticky top-0 mx-4 mt-8">
              {currentItem ? "Modifier" : "Insertion d'un"} Resultat
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 w-[250px]">
                <Autocomplete
                  options={resultat}
                  getOptionLabel={(option) => option.id.toString()}
                  value={selectedResultat}
                  onChange={(_, newValue) => setSelectedResultat(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teste"
                      variant="outlined"
                      required
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
                  {currentItem ? "Mettre à jours" : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ouvrirModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-Gris bg-opacity-60 pt-4 backdrop-blur-sm">
          <div className="w-[70%] h-[95%] overflow-auto p-2 pb-0 ">
            <div className="w-full rounded sticky top-3">
              <span
                className="float-end m-2 cursor-pointer rounded-[50%] bg-gray-400 bg-opacity-90 p-2"
                onClick={fermerModal}
              >
                <CgClose />
              </span>
            </div>

            <div className="p-4 pb-0">
              <div
                ref={printRef}
                className="w-[210mm] h-[297mm] bg-white shadow-lg mx-auto p-8 box-border"
                style={{
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div className="border w-full p-1 flex space-x-1">
                  <div className="w-[10%] rounded-sm p-1 border"></div>
                  <div className="w-[40%] rounded-sm p-1 text-center border">
                    <p>
                      CHU-TAMOHOBE <br /> FIANRANTSOA
                    </p>
                    <p>SERVICES LABORATOIRE</p>
                    <p>* * * * * * * *</p>
                  </div>
                  <div className="w-[50%] rounded-sm p-1 text-center">
                    <p>REPOBLIKAN'I MADAGASIKARA</p>
                    <p>Fitiavana - Tanindrazana - Fandrosoana</p>
                    <p>* * * * * * * *</p>
                    <p>Ministère de la Santé Publique</p>
                  </div>
                </div>

                <div className="border w-full p-1 flex space-x-1 my-1">
                  <div className="w-[50%]  p-1 space-x-1">
                    <p>Nom: </p>
                    <p>Age: </p>
                    <p>RC: </p>
                    <p>Adresse :</p>
                  </div>
                  <div className="w-[50%]  p-1 space-y-2 pt-4">
                    <p>Sexe: </p>
                    <p>Préscripteur: </p>
                  </div>
                  <div className="w-[50%]  p-1 ">
                    <p>N ° Patient: </p>
                    <p>Service: </p>{" "}
                  </div>
                </div>
              </div>
              <div className="text-right sticky bottom-0 mt-6 bg-Gris bg-opacity-25 p-4">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-Bleu text-white hover:bg-blue-600 transition-colors rounded"
                >
                  Exporter en PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
