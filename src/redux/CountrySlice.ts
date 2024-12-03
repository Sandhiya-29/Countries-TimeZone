import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

 interface Country {
  name: string;
  flag: string;
  timezone: string;
}
interface CountryState {
  allCountries: Country[];
  addedCountries: Country[];
  loading: boolean;
  error: string | null;
}
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('addedCountries');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.error('Could not load from localStorage:', e);
    return [];
  }
};

const initialState: CountryState = {
  allCountries: [],
  addedCountries: loadFromLocalStorage(),
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk('country/fetchCountries', async () => {
  const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags');
  return response.data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
  }));
});

const saveToLocalStorage = (countries: Country[]) => {
  try {
    const serializedState = JSON.stringify(countries);
    localStorage.setItem('addedCountries', serializedState);
  } catch (e) {
    console.error('Could not save to localStorage:', e);
  }
};

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    addCountry: (state, action: PayloadAction<Country>) => {
      const exists = state.addedCountries.find(
        (c) => c.name.toLowerCase() === action.payload.name.toLowerCase()
      );
      if (!exists) {
        state.addedCountries.push(action.payload);
        saveToLocalStorage(state.addedCountries);
      }
    },
   
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.allCountries = action.payload;
        state.loading = false;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.error = action.error.message || 'Error fetching countries';
        state.loading = false;
      });
  },
});

export const { addCountry } = countrySlice.actions;
export default countrySlice.reducer;
