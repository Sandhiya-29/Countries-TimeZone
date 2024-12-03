import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { addCountry } from '../redux/CountrySlice';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from "@mui/material/InputAdornment";
import {
  Table,
  TableHead,
  TableBody,
  TablePagination,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import './Country.css';

const CountryList: React.FC = () => {
  const { addedCountries } = useSelector((state: RootState) => state.country);
  const [countryName, setCountryName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();

  const { allCountries } = useSelector((state: RootState) => state.country);
  const loading = useSelector((state: RootState) => state.country.loading);

  const handleAddCountry = () => {
    const country = allCountries.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
    if (!country) {
      setError('Country not found!');
      return;
    }
    dispatch(addCountry({ ...country, timezone }));
    alert("Country Added Successfully")
    setCountryName('');
    setTimezone('');
    setError('');
  };

  const filteredCountries = addedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="head-title">Add Country & Time Zone</h2>
      <div className="input">
        <TextField
          label="Enter Country Name"
          variant="outlined"
          value={countryName}
          placeholder="Country Name"
          className="text-input"
          onChange={(e) => setCountryName(e.target.value)}
        />
        <TextField
          label="Enter Time Zone"
          variant="outlined"
          value={timezone}
          placeholder="+/- HH:MM"
          className="text-input"
          onChange={(e) => setTimezone(e.target.value)}
        />
      </div>
      <Button variant='contained' sx={{backgroundColor:"#7c68a0", marginTop:"20px", marginBottom:"10px", marginRight:"100px"}} className='add-btn' onClick={handleAddCountry}>
          Add Country
        </Button>
      {error && <Typography className="error-msg">{error}</Typography>}
<br />
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
      <TableContainer className="table-container" >
        <Table className="table" sx={{maxWidth: 800,  border:1}}>
          <TableHead className="table-head">
            <TableRow>
              <TableCell>Countries</TableCell>
              <TableCell>Flag</TableCell>
              <TableCell>Time Zone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country, index) => (
              <TableRow key={index}>
                <TableCell>{country.name}</TableCell>
                <TableCell>
                  <img src={country.flag} alt="Flag" width="70" height="50" />
                </TableCell>
                <TableCell>{country.timezone}</TableCell>
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
        onPageChange={handleChangePage}  // No error now
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>
    </div>
  );
};

export default CountryList;
