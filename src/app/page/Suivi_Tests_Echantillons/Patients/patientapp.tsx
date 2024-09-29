"use client";

import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Spin } from "antd";
import { Box, LinearProgress, TextField, Tooltip } from "@mui/material";
import { CgAdd, CgClose } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import axios from "axios";

interface TestItem {
  id: number;
  numero: string;
  nom: string;
  adresse: string;
}

const API_BASE_URL = "http://localhost:3024/patient";

export default function TesteApp() {
  const [data, setData] = useState<TestItem[]>([]);
  const [filteredData, setFilteredData] = useState<TestItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItem, setCurrentItem] = useState<TestItem | null>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchTerm, data]);

  const handleOpenModal = (item?: TestItem) => {
    setCurrentItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
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
    const testeData = {
      numero: formData.get("numero") as string,
      nom: formData.get("nom") as string,
      adresse: formData.get("adresse") as string,
    };

    try {
      if (currentItem) {
        await axios.put(
          `${API_BASE_URL}/misajours/${currentItem.id}`,
          testeData
        );
      } else {
        await axios.post(`${API_BASE_URL}/creer`, testeData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      setError("Failed to save data");
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
        <h1>Listes des Patients</h1>
        <div className="my-3">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="float-end">
            <button
              onClick={() => handleOpenModal()}
              className="border border-b-0 rounded-[6px] flex bg-Vert"
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
                <TableRow className="bg-Gris">
                  <TableCell className="font-bold">Numero</TableCell>
                  <TableCell className="font-bold">Nom</TableCell>
                  <TableCell className="font-bold">Adresse</TableCell>
                  <TableCell className="font-bold" align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-[10px] font-bold">
                        {row.numero}
                      </TableCell>
                      <TableCell className="text-[10px] font-bold">
                        {row.nom}
                      </TableCell>
                      <TableCell className="text-[10px] font-bold">
                        {row.adresse}
                      </TableCell>
                      <TableCell align="center" className="flex justify-center">
                        <Tooltip title="Editer" placement="bottom" arrow>
                          <button
                            onClick={() => handleOpenModal(row)}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                          >
                            <BiEdit />
                          </button>
                        </Tooltip>
                        <Tooltip title="Supprimer" placement="bottom" arrow>
                          <button
                            className="bg-red-500 text-white p-2 rounded"
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-85">
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
              {currentItem ? "Modifier" : "Insertion d'un"} donnée
            </h2>
            <hr className="mx-4" />
            <form className="my-4" onSubmit={handleSubmit}>
              <div className="flex justify-center space-x-3">
                <div className="mb-4">
                  <TextField
                    id="numero"
                    name="numero"
                    label="Numero"
                    variant="standard"
                    className="w-[250px] my-4"
                    defaultValue={currentItem?.numero}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    id="nom"
                    name="nom"
                    label="Nom"
                    variant="standard"
                    className="w-[250px] my-4"
                    defaultValue={currentItem?.nom}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <div className="mb-4">
                  <TextField
                    id="adresse"
                    name="adresse"
                    label="Adresse"
                    variant="standard"
                    className="w-[250px] my-4"
                    defaultValue={currentItem?.adresse}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-3 w-[250px]">
                
              </div>

              <div className="flex justify-center space-x-3">
                <div className="mb-4 w-[250px] my-4">
                  <div className="flex justify-end sticky bottom-0 bg-Gris">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
