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
import { Spin } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";

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

const API_BASE_URL = "http://localhost:3024/teste";
const ECHANTILLON_API_BASE_URL = "http://localhost:3024/echantillon";

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
    try {
      await axios.delete(`${API_BASE_URL}/supprimer/${id}`);
      fetchData();
    } catch (error) {
      setError("Failed to delete item");
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
        <h1>Listes des Tests</h1>
        <div className="my-3">
          <input
            type="search"
            placeholder="Search..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="float-end">
            <button
              onClick={() => ouvrirModalHematologie()}
              className="border border-b-0 rounded-[6px] flex bg-Vert text-white"
            >
              <span className="p-1 border-opacity-90 rounded-[6px]">
                <CgAdd />
              </span>
              <p className="text-sm p-1 mx-1">Nouveau</p>
            </button>
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
                    Actions
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
          />
        </Paper>
      </div>

      {modalHemato && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-85 space-x-2">
          <div className="bg-Gris rounded shadow-lg p-2 px-6 overflow-auto h-[433px]">
            <h2 className="my-5 font-bold sticky top-0 mx-4 mt-8 bg-Gris bg-opacity-70">
              Choix du Teste
            </h2>
            <hr className="mx-4" />
            {/* Hematologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1
                className="cursor-pointer text-[15px] font-bold p-2 bg-Bleu"
                onClick={() => setUnite("HEMATOLOGIE")}
              >
                HEMATOLOGIE
              </h1>
              <div className="flex space-x-2">
                <div className="">
                  <h2
                    className="cursor-pointer text-[11px] font-bold"
                    onClick={() => setSousunite("HEMATOLOGIE CELLULARE")}
                  >
                    HEMATOLOGIE CELLULARE(sur tube VIOLET-EDTA)
                  </h2>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Hémogramme ou NFS")}
                  >
                    Hémogramme ou NFS
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Réticulocytes")}
                  >
                    Réticulocytes
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("VSH")}
                  >
                    VSH
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Test déEmmel")}
                  >
                    Test déEmmel
                  </p>
                </div>
                <div className="">
                  <h2
                    className="cursor-pointer text-[11px] font-bold"
                    onClick={() => setSousunite("HEMOSTASE")}
                  >
                    HEMOSTASE(sur tube BLEU-CITRATE)
                  </h2>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Temps de Saignement")}
                  >
                    Temps de Saignement
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste("Temps de Céphaline Activé(TCA)")
                    }
                  >
                    Temps de Céphaline Activé(TCA)
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste("Taux de Prothrombine(TP, TQ, INR)")
                    }
                  >
                    Taux de Prothrombine(TP, TQ, INR)
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Fibrinogène")}
                  >
                    Fibrinogène
                  </p>
                </div>
              </div>
            </div>

            {/* Biochimie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1
                className="cursor-pointer text-[15px] font-bold p-2 bg-Bleu"
                onClick={() => setUnite("BIOCHIMIE")}
              >
                BIOCHIMIE
              </h1>
              <div className="">
                <div className="flex space-x-2">
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("BIOCHIMIE SANGUINE")}
                    >
                      BIOCHIMIE SANGUINE(sur tube VERT-HEPARINE)
                    </h2>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Urée")}
                    >
                      Urée
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Créatinine")}
                    >
                      Créatinine
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Acide urique")}
                    >
                      Acide urique
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("CRP")}
                    >
                      CRP
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Ionogramme")}
                    >
                      Ionogramme
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Protéine totales")}
                    >
                      Protéine totales
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Calcémie")}
                    >
                      Calcémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Phosphorémie")}
                    >
                      Phosphorémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Magnésémie")}
                    >
                      Magnésémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Albumine")}
                    >
                      Albumine
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Glucémie")}
                    >
                      Glucémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("HGPO")}
                    >
                      HGPO
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("HBA1C")}
                    >
                      HBA1C
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Bilirubine total")}
                    >
                      Bilirubine total
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Bilirubine directe")}
                    >
                      Bilirubine directe
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("ALAT")}
                    >
                      ALAT
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("ASAT")}
                    >
                      ASAT
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Gamma GT")}
                    >
                      Gamma GT
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("LDH")}
                    >
                      LDH
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Phosphatases alcalines")}
                    >
                      Phosphatases alcalines
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Amylasémie")}
                    >
                      Amylasémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Lipasémie")}
                    >
                      Lipasémie
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Cholestérol total")}
                    >
                      Cholestérol total
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Triglycérides")}
                    >
                      Triglycérides
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("HDL Cholestérol")}
                    >
                      HDL Cholestérol
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("LDL Chplestérol")}
                    >
                      LDL Chplestérol
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Troponine I")}
                    >
                      Troponine I
                    </p>
                  </div>
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("BIOCHIMIE URINAIRE")}
                    >
                      BIOCHIMIE URINAIRE (sur récipient propre)
                    </h2>
                    <p>Sur urines recueillies à la volée</p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Urine ASA")}
                    >
                      Urine ASA
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("BU")}
                    >
                      BU
                    </p>
                    <p>Sur urines de 24 heures</p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Protéinurie de 24h")}
                    >
                      Protéinurie de 24h
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Ionogramme urinaire")}
                    >
                      Ionogramme urinaire
                    </p>
                    <p>Autres à préciser :</p>
                  </div>
                </div>

                <div className="">
                  <h2
                    className="cursor-pointer text-[11px] font-bold"
                    onClick={() => setSousunite("LIQUIDE BIOLOGIQUE")}
                  >
                    LIQUIDE BIOLOGIQUE (sur tube ROUGE-SEC)
                  </h2>
                  <p>Type d'examen:</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Etude cytologique")}
                  >
                    Etude cytologique
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Etude chimique")}
                  >
                    Etude chimique
                  </p>
                  <p>Type de liquide:</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Pleural")}
                  >
                    Pleural
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("LCR")}
                  >
                    LCR
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Ascite")}
                  >
                    Ascite
                  </p>
                  <p>Autres à preciser</p>
                </div>
              </div>
            </div>

            {/* Sero-immunologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1
                className="cursor-pointer text-[15px] font-bold p-2 bg-Bleu"
                onClick={() => setUnite("SERO-IMMINOLOGIE")}
              >
                SERO-IMMINOLOGIE (sur tube ROUGE-SEC)
              </h1>
              <div className="space-y-7">
                <div className="flex space-x-4">
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("BACTERIENNE")}
                    >
                      BACTERIENNE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Widal Félix (TO/TH)")}
                    >
                      Widal Félix (TO/TH)
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("ASLO")}
                    >
                      ASLO
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("TPHA")}
                    >
                      TPHA
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("RPR")}
                    >
                      RPR
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Facteur rhumatoide")}
                    >
                      Facteur rhumatoide
                    </p>
                  </div>
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("VIRALE")}
                    >
                      VIRALE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Hépatite A(Anti-HAV)")}
                    >
                      Hépatite A(Anti-HAV)
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Hépatite B(AgHBs)")}
                    >
                      Hépatite B(AgHBs)
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Hépatite C(Anti-HCV)")}
                    >
                      Hépatite C(Anti-HCV)
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("VIH")}
                    >
                      VIH
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("RUBEOL")}
                    >
                      RUBEOL
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("PARASITAIRE")}
                    >
                      PARASITAIRE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Cysticercose")}
                    >
                      Cysticercose
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("Bilharziose")}
                    >
                      Bilharziose
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("TOXOPLASMOSE")}
                    >
                      TOXOPLASMOSE
                    </p>
                  </div>
                  <div className="">
                    <h2
                      className="cursor-pointer text-[11px] font-bold"
                      onClick={() => setSousunite("HORMONOLOGIE")}
                    >
                      HORMONOLOGIE
                    </h2>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("T3")}
                    >
                      T3
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("T4")}
                    >
                      T4
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("TSH")}
                    >
                      TSH
                    </p>
                    <p
                      className="cursor-pointer text-[11px]"
                      onClick={() => setTypeTeste("HCG plasmatique")}
                    >
                      HCG plasmatique
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bacteriologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1
                className="cursor-pointer text-[15px] font-bold p-2 bg-Bleu"
                onClick={() => setUnite("BACTERIOLOGIE(sur tube stérile)")}
              >
                BACTERIOLOGIE(sur tube stérile)
              </h1>
              <div className="space-x-4">
                <div className="">
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("FCV")}
                  >
                    FCV
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("FU")}
                  >
                    FU
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Frottis de gorge")}
                  >
                    Frottis de gorge
                  </p>
                  <p>----------------</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("LCR")}
                  >
                    LCR
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("LA/LP")}
                  >
                    LA/LP
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("ECBU")}
                  >
                    ECBU
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Liquide à préciser")}
                  >
                    Liquide à préciser
                  </p>
                  <p>----------------</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Culot urinaire")}
                  >
                    Culot urinaire
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste(
                        "HLM(Hématies leucocytes minute sur urine de 3 heures)"
                      )
                    }
                  >
                    HLM(Hématies leucocytes minute sur urine de 3 heures)
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste("Pus superficiel(localisation à préciser)")
                    }
                  >
                    Pus superficiel(localisation à préciser)
                  </p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste("Pus profonde(localisation à précider)")
                    }
                  >
                    Pus profonde(localisation à précider)
                  </p>
                </div>
              </div>
            </div>

            {/* Parasitologie */}
            <div className="space-y-3 shadow-md rounded p-3">
              <h1
                className="cursor-pointer text-[15px] font-bold p-2 bg-Bleu"
                onClick={() => setUnite("PARASITOLOGIE")}
              >
                PARASITOLOGIE
              </h1>
              <div className="space-x-4">
                <div className="">
                  <p>(sur récipient propre)</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() => setTypeTeste("Salles KAOP")}
                  >
                    Salles KAOP
                  </p>
                  <p>(Sur tube violet EDTA)</p>
                  <p
                    className="cursor-pointer text-[11px]"
                    onClick={() =>
                      setTypeTeste(
                        "Recherches d'hématozoaires(Goutte épaisse + frottis)"
                      )
                    }
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
                    name="unite"
                    className="w-[250px] my-4"
                    value={unite} // Utilisation de la valeur d'état
                    onChange={(e) => setUnite(e.target.value)} // Pour que l'utilisateur puisse aussi saisir manuellement
                    size="small"
                    required
                  />
                  <TextField
                    name="sousunite"
                    className="w-[250px] my-4"
                    value={sousunite} // Utilisation de la valeur d'état
                    onChange={(e) => setSousunite(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="mb-4 flex space-x-1">
                  <TextField
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
                        {...params}
                        label="ECHANTILLON ID"
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
