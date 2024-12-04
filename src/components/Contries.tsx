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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div>
    <TextField
  sx={{
    marginBottom: "20px",
    marginTop: "10px",
    width: {
      xs: "90%", 
      sm: "80%", 
      md: "60%", 
      lg: "50%", 
    },
    marginLeft: {
      xs: "5%", 
      sm: "10%",
      md: "20%",
      lg: "30%", 
    },
    alignItems: "center",
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
    {/* <TextField
      sx={{
        marginBottom: "20px",
        alignItems: "left",
        width: "250px",
        marginLeft:"70%",
        marginTop:"10px"
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
    />  */}
    <h3>Available Country List</h3>
    </div>
    <TableContainer className='table-container' sx={{borderRadius:2, boxShadow:3, }} >
      <Table className="table"sx={{ maxWidth: 900,  }}>
        <TableHead className='table-head' sx={{fontWeight:"bold"}}>
          <TableRow>
            <TableCell sx={{fontWeight:"bold" , fontSize:18}}>Country</TableCell>
            <TableCell sx={{fontWeight:"bold", fontSize:18}}>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country) => (
            <TableRow key={country.name} className='table-row'>
              <TableCell>{country.name}</TableCell>
              <TableCell>
                <img src={country.flag} alt="Flag" width="70" height="50" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[ 5,10,25, 50]}
        component="div"
        count={filteredCountries.length}
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
