require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT;

const MINTY_BASE_URL = process.env.MINTY_BASE_URL; 
const MINTY_AUTH = process.env.MINTY_AUTH; 

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Testing testing testing' });
});

app.post('/api/domains/search', async (req, res) => {
  try {
      console.log('Request Body:', req.body); 
      console.log('Headers:', {
          Authorization: MINTY_AUTH,
          'Content-Type': 'application/json',
      });

      const response = await axios.post(
          `${MINTY_BASE_URL}/domains/search?with_price=true`,
          req.body,
          {
              headers: {
                  Authorization: MINTY_AUTH,
                  'Content-Type': 'application/json',
              },
          }
      );
      console.log('API Response:', response.data); 

      res.json(response.data);
  } catch (error) {
      console.error('Error fetching domain data:', error.message);
      res.status(500).json({ error: 'Failed to fetch domain data', details: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
