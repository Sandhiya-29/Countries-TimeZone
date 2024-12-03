import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
import { fetchCountries } from '../redux/CountrySlice';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from "@mui/material/InputAdornment";
import './Country.css'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';

const Countries = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.country.loading);
  const { allCountries } = useSelector((state: RootState) => state.country);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0); 
  };

  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) return <div>Loading...</div>;

  return (
    <>
    <h2>Countries</h2>
    <TextField
      sx={{
        marginBottom: "20px",
        alignItems: "left",
        width: "300px",
        marginLeft:"40%"
      }}
      label="Search Countries"
      value={searchTerm}
      placeholder="Search by country name"
      className="text-input search-bar"
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    /> 
    <TableContainer >
      <Table className="table"sx={{ maxWidth: 1000, height: 100 , marginLeft:20, border:1, }}>
        <TableHead className='table-head'>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country) => (
            <TableRow key={country.name}>
              <TableCell>{country.name}</TableCell>
              <TableCell>
                <img src={country.flag} alt="Flag" width="70" height="50" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[ 10,25, 50]}
        component="div"
        count={allCountries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}  
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
    </>
  );
};

export default Countries;
