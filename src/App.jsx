import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './App.css';

function App() {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://bajaj-assesment-api.onrender.com/bfhl'; // Updated URL

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const parsedData = JSON.parse(inputData);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData.data }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const responseData = await res.json();
      setResponse(responseData);
    } catch (error) {
      setError(error.message || 'Invalid JSON input or API error');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleDelete = (optionToDelete) => () => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((option) => option !== optionToDelete)
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    let renderedResponse = '';

    if (selectedOptions.includes('is_success')) {
      renderedResponse += `Is Success: ${response.is_success}\n`;
    }
    if (selectedOptions.includes('user_id')) {
      renderedResponse += `User ID: ${response.user_id || 'N/A'}\n`;
    }
    if (selectedOptions.includes('email')) {
      renderedResponse += `Email: ${response.email || 'N/A'}\n`;
    }
    if (selectedOptions.includes('roll_number')) {
      renderedResponse += `Roll Number: ${response.roll_number || 'N/A'}\n`;
    }
    if (selectedOptions.includes('numbers')) {
      renderedResponse += `Numbers: ${response.numbers.length ? response.numbers.join(', ') : 'N/A'}\n`;
    }
    if (selectedOptions.includes('alphabets')) {
      renderedResponse += `Alphabets: ${response.alphabets.length ? response.alphabets.join(', ') : 'N/A'}\n`;
    }
    if (selectedOptions.includes('highest_alphabet')) {
      renderedResponse += `Highest Alphabet: ${response.highest_alphabet.length ? response.highest_alphabet.join(', ') : 'N/A'}\n`;
    }

    return (
      <Box mt={2}>
        <Typography variant="h6">Filtered Response:</Typography>
        <pre>{renderedResponse}</pre>
      </Box>
    );
  };

  return (
    <Box className="App">
      <Typography variant="h4" mb={2}>BFHL App</Typography>
      <Typography variant="h6" mb={1}>API Input</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder='Enter valid JSON (e.g., {"data": ["A","1","B","2","C","3"]})'
        variant="outlined"
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      {response && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Options</InputLabel>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleOptionChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={handleDelete(value)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem value="is_success">Is Success</MenuItem>
            <MenuItem value="user_id">User ID</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="roll_number">Roll Number</MenuItem>
            <MenuItem value="numbers">Numbers</MenuItem>
            <MenuItem value="alphabets">Alphabets</MenuItem>
            <MenuItem value="highest_alphabet">Highest Alphabet</MenuItem>
          </Select>
        </FormControl>
      )}

      {renderResponse()}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
        
      </Snackbar>
    </Box>
  );
}

export default App;
