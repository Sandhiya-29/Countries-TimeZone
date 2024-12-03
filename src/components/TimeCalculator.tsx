import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';


import {
  Table,
  TableHead,
  TableBody,
  TablePagination,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Typography,
  MenuItem,
  Select,
  Button,
} from '@mui/material';
import { RootState } from '../redux/Store';
import './Country.css';

const TimeCalculator: React.FC = () => {
  const { addedCountries } = useSelector((state: RootState) => state.country);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [calculatedTimes, setCalculatedTimes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loading = useSelector((state: RootState) => state.country.loading);


  const handleCalculate = () => {
    if (!selectedCountry || !currentTime) {
      setError('Please select a country and set the current time.');
      return;
    }

    const baseCountry = addedCountries.find(
      (c) => c.name.toLowerCase() === selectedCountry.toLowerCase()
    );
  
    if (!baseCountry) {
      setError('Selected country not found.');
      return;
    }
  
    try {
      const baseDateTime = DateTime.fromFormat(currentTime, 'HH:mm', {
        zone: `UTC${baseCountry.timezone}`,
      });
  
      if (!baseDateTime.isValid) {
        setError('Invalid time format or timezone. Use HH:mm and a valid timezone.');
        return;
      }
      const times: Record<string, string> = {};
      addedCountries.forEach((country) => {
        const countryDateTime = baseDateTime.setZone(`UTC${country.timezone}`);
        times[country.name] = countryDateTime.toFormat('HH:mm');
      });
  
      setCalculatedTimes(times);
      setError('');
    } catch (e) {
      setError('Error calculating time. Please check the inputs.');
    }
  };

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
      <h2 className="head-title"> Set Current Time</h2>
      <div className="dropdown-input">
        <Select sx={{marginBottom:"10px"}}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Select Country
          </MenuItem>
          {addedCountries.map((country, index) => (
            <MenuItem key={index} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
        <TextField sx={{marginLeft:"10px"}}
          label="Set Current Time (HH:MM)"
          variant="outlined"
          value={currentTime}
          placeholder="HH:MM"
          onChange={(e) => setCurrentTime(e.target.value)}
        />
        <Button variant='contained' sx={{backgroundColor:"#7c68a0", marginLeft:"10px"}} className='cal-time' onClick={handleCalculate}>
          Calculate
        </Button>
      </div>

      {error && <Typography className="error-msg">{error}</Typography>}
      
      <TableContainer className="table-container" >
        <Table className="table" sx={{maxWidth:800, border:1,}}>
          <TableHead className="table-head">
            <TableRow>
              <TableCell>Countries</TableCell>
              <TableCell>Flag</TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>Current Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addedCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country, index) => (
              <TableRow key={index}>
                <TableCell>{country.name}</TableCell>
                <TableCell>
                  <img src={country.flag} alt="Flag" width="70" height="50" />
                </TableCell>
                <TableCell>{country.timezone}</TableCell>
                <TableCell>{calculatedTimes[country.name] || '--:--'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[ 10,25, 50]}
        component="div"
        count={addedCountries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}  
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>
    </div>
  );
};

export default TimeCalculator;

