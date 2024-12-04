import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import './Country.css';

const CountryList: React.FC = () => {
  const { addedCountries } = useSelector((state: RootState) => state.country);
  const [countryName, setCountryName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
   const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sign, setSign]=useState('');
  const [hoursError, setHoursError] = useState<string | boolean>(false);
  const [minutesError, setMinutesError] = useState<string | boolean>(false);
  const dispatch = useDispatch();

  const { allCountries } = useSelector((state: RootState) => state.country);
  const loading = useSelector((state: RootState) => state.country.loading);

  useEffect(()=>{
    const handler = setTimeout(()=>{
      if(countryName.trim() !== ''){
        const isvalid = allCountries.some((country)=>
        country.name.toLowerCase() === countryName.toLowerCase()
      );
      setError(!isvalid);
      }else{
        setError(false);
      }
    }, 500);

    return ()=>{
      clearTimeout(handler);
    }
  }, [countryName, allCountries]);
  useEffect(() => {
    const savedCountries = JSON.parse(localStorage.getItem('countries') || '[]');
      if (savedCountries.length > 0) {
        const currentCountryName = addedCountries.map((country)=>country.name)
      savedCountries.forEach((country: any) => {
        if(!currentCountryName.includes(country.name)){
        dispatch(
          addCountry({
            name: country.name,
            flag: country.flag,
            timezone: country.timezone,
          })
        );
      }});
    }
  },[addedCountries, dispatch]);

  const handleBlur = ( type:string) => {
   
    if (type === 'hours' && (!/^\d{1,2}$/.test(hours) || parseInt(hours) > 14)) {
      setHoursError("Hours must be between 00 and 14");
    } else {
      setHoursError(false);
    }

    if (type === 'minutes' && (!/^\d{2}$/.test(minutes) || ![0, 30].includes(parseInt(minutes)))) {
      setMinutesError("Minutes must be '00' or '30'");
    } else {
      setMinutesError(false);
    }

  };

  const timeZone = `${sign}${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if(countryName === '' || sign === '' || hours === '' || minutes === ''){
      alert("All fields are required");
    }
    else{
    const Country = allCountries.find((country: { name: string }) => country.name.toLowerCase() === countryName.toLowerCase());
   
    if (!Country) {
      alert('Country not found');
      setError(false)
      return;
    }
      
      const addedCountries = JSON.parse(localStorage.getItem('countries') || '[]');
    
    if (!addedCountries.some((existingCountry: { name: string }) => existingCountry.name === Country.name)) {
      const updatedCountries = [
        { name: Country.name, flag: Country.flag, timezone: timeZone },
        ...addedCountries, 
      ];
      localStorage.setItem('countries', JSON.stringify(updatedCountries));
      alert("Country Added Successfully")
      dispatch(
        addCountry({
          name: Country.name,
          flag: Country.flag,
          timezone: timeZone,
        })
      
      );
    }
    setCountryName('');
    setSign('');
    setHours('');
    setMinutes('');
  }
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
     <div>
     <TextField
      sx={{
        marginBottom: "20px",
        alignItems: "left",
        width: "250px",
        marginLeft:"60%",
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
    /> 
     </div>
      <div className="input">
      <TextField  sx={{ maxWidth: 250, marginLeft: 10 }}
            required
            name="countryName"
            label="Enter Country Name"
            value={countryName}
            error={!!error}
            helperText={error ?"Country Not Found": ""}
            onChange={(e)=>setCountryName(e.target.value)}
            placeholder="Enter Country Name"
            fullWidth
            autoComplete="off"
          />
     
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
          <FormControl sx={{ minWidth: 70 }}>
            <Select sx={{marginLeft:10}}
              value={sign}
              onChange={(e) => setSign(e.target.value)}
            >
              <MenuItem value="+">+</MenuItem>
              <MenuItem value="-">-</MenuItem>
            </Select>
          </FormControl>
          <TextField
              required
              name="timezone-hours"
              label="Hours"
              placeholder="00"
              autoComplete="off"
              value={hours}
              error={!!hoursError}
              helperText={hoursError && (
                <Typography  variant="body2" color="error" sx={{ whiteSpace: 'nowrap' , }}>
                  {hoursError}
                </Typography>
  )} onChange={(e) => setHours(e.target.value)}
  onBlur={()=>handleBlur('hours')} 
  // inputProps={{ maxLength: 2 }}
  sx={{ maxWidth: 70,marginLeft:2 }}
/>
<TextField
              required
              name="timezone-minutes"
              label="Minutes"
              placeholder="00"
              value={minutes}
              error={!!minutesError}
              helperText={minutesError && (
                <Typography variant="body2" color="error" sx={{ whiteSpace: 'nowrap' }}>
                  {minutesError}
                </Typography>
              )}
              autoComplete="off"
              onChange={(e) => setMinutes(e.target.value)}
              onBlur={()=>handleBlur("minutes")} 
              inputProps={{ maxLength: 2 }}
              sx={{ maxWidth: 70, marginLeft: 2 }}
            />

            {error && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                {error}
              </p>
            )}
          
          </div>
      </div>
      <Button variant='contained' sx={{backgroundColor:"#7c68a0", marginTop:"30px", marginBottom:"10px", marginRight:"100px"}} className='add-btn' onClick={handleAddCountry}>
          Add Country
        </Button>
      {error && <Typography sx={{marginRight:10}} className="error-msg">{error}</Typography>}

      <TableContainer className="table-container" sx={{boxShadow:5, borderRadius:2}}>
        <Table className="table" sx={{maxWidth: 800,  }}>
          <TableHead className="table-head" sx={{fontWeight:800, fontSize:20}}>
            <TableRow>
              <TableCell sx={{fontWeight:"bold" , fontSize:18}}>Countries</TableCell>
              <TableCell sx={{fontWeight:"bold" , fontSize:18}}>Flag</TableCell>
              <TableCell sx={{fontWeight:"bold" , fontSize:18}}>Time Zone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((country, index) => (
    <TableRow key={index} className="table-row">
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
        rowsPerPageOptions={[5, 10,25, 50]}
        component="div"
        count={allCountries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}  
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>
    </div>
  );
};

export default CountryList;
