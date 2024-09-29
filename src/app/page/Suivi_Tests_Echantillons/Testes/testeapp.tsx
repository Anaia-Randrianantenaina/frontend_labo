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
  Select,
  MenuItem,
} from "@mui/material";
import { CgClose, CgAdd } from "react-icons/cg";
import { Button, Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import TablePaginationActions from "./TablePaginationActions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface TestItem {
  id: number;
  unite: string;
  sous_unite: string;
  parametre: string;
  echantillon: {
    id: number;
  } | null;
}

interface EchantillonItem {
  id: number;
}

const API_BASE_URL = "http://localhost:3001/teste";
const ECHANTILLON_API_BASE_URL = "http://localhost:3001/echantillon";

export default function Testapp() {
  const [data, setData] = useState<TestItem[]>([]);
  const [filteredData, setFilteredData] = useState<TestItem[]>([]);
  const [echantillons, setEchantillons] = useState<EchantillonItem[]>([]);
  const [modalHemato, setmodalHemato] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItem, setCurrentItem] = useState<TestItem | null>(null);

  const [selectedEchantillon, setSelectedEchantillon] =
    useState<EchantillonItem | null>(null);
  const [unite, setUnite] = useState("");
  const [sousunite, setSousunite] = useState("");
  const [typeTeste, setTypeTeste] = useState("");

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

  const fetchEchantillons = async () => {
    try {
      const response = await axios.get(`${ECHANTILLON_API_BASE_URL}/listes`);
      setEchantillons(response.data);
    } catch (error) {
      setError("Failed to fetch echantillons");
    }
  };

  useEffect(() => {
    fetchData();
    fetchEchantillons();
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

  const ouvrirModalHematologie = (item?: TestItem) => {
    setCurrentItem(item || null);
    setUnite(item?.unite || "");
    setSousunite(item?.sous_unite || "");
    setTypeTeste(item?.parametre || "");
    setSelectedEchantillon(item?.echantillon || null);
    setmodalHemato(true);
  };

  const fermerModalHemato = () => {
    setmodalHemato(false);
    setCurrentItem(null);
    setSelectedEchantillon(null);
    setUnite("");
    setSousunite("");
    setTypeTeste("");
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

  const ajoutEtMiseajoursHemato = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const testData = {
      unite: unite,
      sous_unite: sousunite,
      parametre: typeTeste,
      echantillon: selectedEchantillon ? { id: selectedEchantillon.id } : null,
    };

    try {
      if (!testData.parametre.trim()) {
        setError("Le type de test ne peut pas être vide.");
        return;
      }

      if (currentItem) {
        // Update (PUT)
        await axios.put(
          `${API_BASE_URL}/misajours/${currentItem.id}`,
          testData
        );
      } else {
        // Create (POST)
        await axios.post(`${API_BASE_URL}/creer`, testData);
      }
      fetchData();
      fermerModalHemato();
    } catch (error: any) {
      setError(
        `Failed to save data: ${error.response?.data?.message || error.message}`
      );
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
  // hematologie cellulaire
  const NFS = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)");
    setTypeTeste("NFS ou Hémogramme");
  };

  const Reticulocytes = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)");
    setTypeTeste("Réticulocytes");
  };

  const VSH = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)");
    setTypeTeste("VSH");
  };

  const TestdeEmmel = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)");
    setTypeTeste("Test d'Emmel");
  };

  // Hemostase
  const TempsdeSaignement = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMOSTASE(sur tube BLEU-CITRATE)");
    setTypeTeste("Temps de Saignement ");
  };

  const TCA = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMOSTASE(sur tube BLEU-CITRATE)");
    setTypeTeste("Temps de Céphaline Activé(TCA)");
  };

  const TauxdeProthrombine = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMOSTASE(sur tube BLEU-CITRATE)");
    setTypeTeste("Taux de Prothrombine(TP, TQ, INR)");
  };

  const Fibrinogene = () => {
    setUnite("HEMATOLOGIE");
    setSousunite("HEMOSTASE(sur tube BLEU-CITRATE)");
    setTypeTeste("Fibrinogène");
  };

  return (
    <>
      <div className="p-5 shadow">
        <h1>Listes des Tests</h1>
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
              onClick={() => ouvrirModalHematologie()}
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
                  <TableCell className="font-bold">UNITE</TableCell>
                  <TableCell className="font-bold">SOUS UNITE</TableCell>
                  <TableCell className="font-bold">PARAMETRE</TableCell>
                  <TableCell className="font-bold">ECHATILLON ID</TableCell>
                  <TableCell className="font-bold" align="center">
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(
                    page * rowsPerPage,
                    rowsPerPage === -1
                      ? filteredData.length
                      : page * rowsPerPage + rowsPerPage
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-1 text-[10px]">
                        {row.unite}
                      </TableCell>
                      <TableCell className="py-1 text-[10px]">
                        {row.sous_unite}
                      </TableCell>
                      <TableCell className="py-1 text-[10px]">
                        {row.parametre}
                      </TableCell>
                      <TableCell className="py-1 text-[10px]">
                        {row.echantillon?.id ?? "N/A"}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="flex justify-center space-x-2 py-1"
                      >
                        <Tooltip title="Editer" placement="top" arrow>
                          <button
                            onClick={() => ouvrirModalHematologie(row)}
                            className="bg-Gris text-Bleu p-2 rounded"
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

      {modalHemato && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-25 space-x-2 backdrop-blur-sm">
          <div className="bg-Gris rounded shadow-lg pt-0 px-6 overflow-auto h-[433px]">
            <h2 className="py-5 font-bold sticky top-0 px-4 bg-Gris bg-opacity-85 backdrop-blur-sm">
              Choix du Teste
            </h2>
            <hr className="mx-4" />
            {/* Hematologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1 className="text-[15px] font-bold p-2 bg-Bleu rounded-md shadow ">
                HEMATOLOGIE
              </h1>
              <div className="flex space-x-2">
                <div className="">
                  <h2 className="text-[11px] font-bold shadow-md my-2 p-3 rounded-md">
                    HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)
                  </h2>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => NFS()}
                  >
                    NFS ou Hémogramme
                  </p>

                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => Reticulocytes()}
                  >
                    Réticulocytes
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => VSH()}
                  >
                    VSH
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => TestdeEmmel()}
                  >
                    Test d'Emmel
                  </p>
                </div>
                <div className="">
                  <h2 className="text-[11px] font-bold shadow-md my-2 p-3 rounded-md">
                    HEMOSTASE(sur tube BLEU-CITRATE)
                  </h2>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => TempsdeSaignement()}
                  >
                    Temps de Saignement
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => TCA()}
                  >
                    Temps de Céphaline Activé(TCA)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => TauxdeProthrombine()}
                  >
                    Taux de Prothrombine(TP, TQ, INR)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => Fibrinogene()}
                  >
                    Fibrinogène
                  </p>
                </div>
              </div>
            </div>

            {/* Biochimie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1 className="text-[15px] font-bold p-2 bg-Bleu rounded-md shadow ">
                BIOCHIMIE
              </h1>
              <div className="">
                <div className="flex space-x-2">
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      BIOCHIMIE SANGUINE(sur tube VERT-HEPARINE)
                    </h2>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Urée");
                      }}
                    >
                      Urée
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Créatinine");
                      }}
                    >
                      Créatinine
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Acide urique");
                      }}
                    >
                      Acide urique
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("CRP");
                      }}
                    >
                      CRP
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Ionogramme");
                      }}
                    >
                      Ionogramme
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Protéine totales");
                      }}
                    >
                      Protéine totales
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Calcémie");
                      }}
                    >
                      Calcémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Phosphorémie");
                      }}
                    >
                      Phosphorémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Magnésémie");
                      }}
                    >
                      Magnésémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Albumine");
                      }}
                    >
                      Albumine
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Glucémie");
                      }}
                    >
                      Glucémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("HGPO");
                      }}
                    >
                      HGPO
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("HBA1C");
                      }}
                    >
                      HBA1C
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Bilirubine total");
                      }}
                    >
                      Bilirubine total
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Bilirubine directe");
                      }}
                    >
                      Bilirubine directe
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("ALAT");
                      }}
                    >
                      ALAT
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("ASAT");
                      }}
                    >
                      ASAT
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Gamma GT");
                      }}
                    >
                      Gamma GT
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("LDH");
                      }}
                    >
                      LDH
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Phosphatases alcalines");
                      }}
                    >
                      Phosphatases alcalines
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Amylasémie");
                      }}
                    >
                      Amylasémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Lipasémie");
                      }}
                    >
                      Lipasémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Cholestérol total");
                      }}
                    >
                      Cholestérol total
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Triglycérides");
                      }}
                    >
                      Triglycérides
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("HDL Cholestérol");
                      }}
                    >
                      HDL Cholestérol
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("LDL Chplestérol");
                      }}
                    >
                      LDL Chplestérol
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite("BIOCHIMIE SANGUINE");
                        setTypeTeste("Troponine I");
                      }}
                    >
                      Troponine I
                    </p>
                  </div>
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      BIOCHIMIE URINAIRE (sur récipient propre)
                    </h2>
                    <p>Sur urines recueillies à la volée</p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite(
                          "BIOCHIMIE URINAIRE (sur récipient propre)"
                        );
                        setTypeTeste("Urine ASA");
                      }}
                    >
                      Urine ASA
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite(
                          "BIOCHIMIE URINAIRE (sur récipient propre)"
                        );
                        setTypeTeste("BU");
                      }}
                    >
                      BU
                    </p>
                    <p>Sur urines de 24 heures</p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite(
                          "BIOCHIMIE URINAIRE (sur récipient propre)"
                        );
                        setTypeTeste("Protéinurie de 24h");
                      }}
                    >
                      Protéinurie de 24h
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("BIOCHIMIE");
                        setSousunite(
                          "BIOCHIMIE URINAIRE (sur récipient propre)"
                        );
                        setTypeTeste("Ionogramme urinaire");
                      }}
                    >
                      Ionogramme urinaire
                    </p>
                    <p>Autres à préciser :</p>
                  </div>
                </div>

                <div className="">
                  <h2 className="text-[11px] font-bold shadow-md my-2 p-3 rounded-md">
                    LIQUIDE BIOLOGIQUE (sur tube ROUGE-SEC)
                  </h2>
                  <p>Type d'examen:</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BIOCHIMIE");
                      setSousunite("LIQUIDE BIOLOGIQUE");
                      setTypeTeste("Etude cytologique");
                    }}
                  >
                    Etude cytologique
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BIOCHIMIE");
                      setSousunite("LIQUIDE BIOLOGIQUE");
                      setTypeTeste("Etude chimique");
                    }}
                  >
                    Etude chimique
                  </p>
                  <p>Type de liquide:</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BIOCHIMIE");
                      setSousunite("LIQUIDE BIOLOGIQUE");
                      setTypeTeste("Pleural");
                    }}
                  >
                    Pleural
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BIOCHIMIE");
                      setSousunite("LIQUIDE BIOLOGIQUE");
                      setTypeTeste("LCR");
                    }}
                  >
                    LCR
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BIOCHIMIE");
                      setSousunite("LIQUIDE BIOLOGIQUE");
                      setTypeTeste("Ascite");
                    }}
                  >
                    Ascite
                  </p>
                  <p>Autres à preciser</p>
                </div>
              </div>
            </div>

            {/* Sero-immunologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1 className="text-[15px] font-bold p-2 bg-Bleu rounded-md shadow ">
                SERO-IMMINOLOGIE (sur tube ROUGE-SEC)
              </h1>
              <div className="space-y-7">
                <div className="flex space-x-4">
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      BACTERIENNE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("BACTERIENNE");
                        setTypeTeste("Widal Félix (TO/TH)");
                      }}
                    >
                      Widal Félix (TO/TH)
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("BACTERIENNE");
                        setTypeTeste("ASLO");
                      }}
                    >
                      ASLO
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("BACTERIENNE");
                        setTypeTeste("TPHA");
                      }}
                    >
                      TPHA
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("BACTERIENNE");
                        setTypeTeste("RPR");
                      }}
                    >
                      RPR
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("BACTERIENNE");
                        setTypeTeste("Facteur rhumatoide");
                      }}
                    >
                      Facteur rhumatoide
                    </p>
                  </div>
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      VIRALE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("VIRALE");
                        setTypeTeste("Hépatite A(Anti-HAV)");
                      }}
                    >
                      Hépatite A(Anti-HAV)
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("VIRALE");
                        setTypeTeste("Hépatite B(AgHBs)");
                      }}
                    >
                      Hépatite B(AgHBs)
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("VIRALE");
                        setTypeTeste("Hépatite C(Anti-HCV)");
                      }}
                    >
                      Hépatite C(Anti-HCV)
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("VIRALE");
                        setTypeTeste("VIH");
                      }}
                    >
                      VIH
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("VIRALE");
                        setTypeTeste("RUBEOL");
                      }}
                    >
                      RUBEOL
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      PARASITAIRE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("PARASITAIRE");
                        setTypeTeste("Cysticercose");
                      }}
                    >
                      Cysticercose
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("PARASITAIRE");
                        setTypeTeste("Bilharziose");
                      }}
                    >
                      Bilharziose
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("PARASITAIRE");
                        setTypeTeste("TOXOPLASMOSE");
                      }}
                    >
                      TOXOPLASMOSE
                    </p>
                  </div>
                  <div className="">
                    <h2 className="text-[11px] font-bold">
                      HORMONOLOGIE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("HORMONOLOGIE");
                        setTypeTeste("T3");
                      }}
                    >
                      T3
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("HORMONOLOGIE");
                        setTypeTeste("T4");
                      }}
                    >
                      T4
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("HORMONOLOGIE");
                        setTypeTeste("TSH");
                      }}
                    >
                      TSH
                    </p>
                    <p
                      className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                      onClick={() => {
                        setUnite("SERO-IMMINOLOGIE");
                        setSousunite("HORMONOLOGIE");
                        setTypeTeste("HCG plasmatique");
                      }}
                    >
                      HCG plasmatique
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bacteriologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1 className="text-[15px] font-bold p-2 bg-Bleu rounded-md shadow ">
                BACTERIOLOGIE(sur tube stérile)
              </h1>
              <div className="space-x-4">
                <div className="">
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("FCV(FROTTIS CERVICO-VAGINAL)");
                    }}
                  >
                    FCV(FROTTIS CERVICO-VAGINAL)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("FU(FORTTIS URETRAL)");
                    }}
                  >
                    FU(FORTTIS URETRAL)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("FROTTIS DE GORGE(FG)");
                    }}
                  >
                    FROTTIS DE GORGE(FG)
                  </p>
                  <p>----------------</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("LCR");
                    }}
                  >
                    LCR
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("LA/LP");
                    }}
                  >
                    LA/LP
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("ECBU(EXAMEN BACTERIOLOGIEQUE DES URINES)");
                    }}
                  >
                    ECBU(EXAMEN BACTERIOLOGIEQUE DES URINES)
                  </p>
                  <p className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu">
                    Liquide à préciser
                  </p>
                  <p>----------------</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("Culot urinaire");
                    }}
                  >
                    Culot urinaire
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste(
                        "HLM(Hématies leucocytes minute sur urine de 3 heures)"
                      );
                    }}
                  >
                    HLM(Hématies leucocytes minute sur urine de 3 heures)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("Pus superficiel(localisation à préciser)");
                    }}
                  >
                    Pus superficiel(localisation à préciser)
                  </p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("BACTERIOLOGIE(sur tube stérile");
                      setSousunite("");
                      setTypeTeste("Pus profonde(localisation à précider)");
                    }}
                  >
                    Pus profonde(localisation à précider)
                  </p>
                </div>
              </div>
            </div>

            {/* Parasitologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1 className="text-[15px] font-bold p-2 bg-Bleu rounded-md shadow ">
                PARASITOLOGIE
              </h1>
              <div className="space-x-4">
                <div className="">
                  <p>(sur récipient propre)</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("PARASITOLOGIE");
                      setSousunite("");
                      setTypeTeste("Salles KAOP");
                    }}
                  >
                    Salles KAOP
                  </p>
                  <p>(Sur tube violet EDTA)</p>
                  <p
                    className="cursor-pointer text-[11px] shadow-md my-2 p-1 rounded-md hover:bg-Bleu"
                    onClick={() => {
                      setUnite("PARASITOLOGIE");
                      setSousunite("");
                      setTypeTeste(
                        "Recherches d'hématozoaires(Goutte épaisse + frottis)"
                      );
                    }}
                  >
                    Recherches d'hématozoaires(Goutte épaisse + frottis)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* formulaire */}
          <div className="bg-Gris rounded shadow-lg p-2 px-6 overflow-auto h-[433px]">
            <div className="w-full rounded">
              <span
                className="float-end m-2 cursor-pointer rounded-[50%] bg-gray-400 bg-opacity-35 p-2"
                onClick={fermerModalHemato}
              >
                <CgClose />
              </span>
            </div>
            <h2 className="my-5 font-bold sticky top-0 mx-4 mt-8">
              {currentItem ? "Modifier" : "Insertion d'un"} Teste
            </h2>
            <hr className="mx-4" />
            <form
              onSubmit={ajoutEtMiseajoursHemato}
              className="modal-form space-x-4 flex"
            >
              <div>
                <div className="mb-4 flex space-x-1">
                  <TextField
                    id="outlined-basic"
                    label="Unite"
                    variant="outlined"
                    name="unite"
                    className="w-[250px] my-4"
                    value={unite} // Utilisation de la valeur d'état
                    onChange={(e) => setUnite(e.target.value)} // Pour que l'utilisateur puisse aussi saisir manuellement
                    size="small"
                    required
                  />
                  <TextField
                    id="outlined-basic"
                    label="Sous_unite"
                    variant="outlined"
                    name="sousunite"
                    className="w-[250px] my-4"
                    value={sousunite} // Utilisation de la valeur d'état
                    onChange={(e) => setSousunite(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="mb-4 flex space-x-1">
                  <TextField
                    id="outlined-basic"
                    label="Paramètre"
                    variant="outlined"
                    name="typeTeste"
                    className="w-[250px] my-4"
                    value={typeTeste} // Utilisation de la valeur d'état
                    onChange={(e) => setTypeTeste(e.target.value)}
                    size="small"
                    required
                  />

                  {/* Autocomplete pour l'échantillon */}
                  <Autocomplete
                    options={echantillons}
                    getOptionLabel={(option) => option.id.toString()}
                    value={selectedEchantillon ?? null}
                    onChange={(event, value) => {
                      setSelectedEchantillon(value || null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        label="Id echatillon"
                        variant="outlined"
                        {...params}
                        name="echantillon_id"
                        required
                        className="w-[250px] my-4"
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
                    {currentItem ? "Mettre à jour" : "Sauvegarder"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
