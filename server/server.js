require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Domain = require('./models/Domain');
const Order = require('./models/Order');
const PORT = process.env.PORT;

const MINTY_BASE_URL = process.env.MINTY_BASE_URL;
const MINTY_AUTH = process.env.MINTY_AUTH;

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is running' });
});

app.post('/api/domains/search', async (req, res) => {
  try {
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

    const domains = response.data;

    for (let domainData of domains) {
        const price = domainData?.price?.product?.price || null;

        if (price !== null) {
            const domain = new Domain({
                name: domainData.domain,
                status: domainData.status,
                price: price,
            });

            await domain.save();
        }
    }

    res.json(domains);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch domain data', details: error.message });
  }
});

app.post('/api/domains/suggestions', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.json([]);
  }

  try {
    const extensions = ['com', 'nl', 'net', 'eu', 'dev'];
    const suggestions = extensions.map(ext => ({
      domain: `${query}.${ext}`,
      status: "onbekend", 
      price: { product: { price: null } }, 
    }));
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions', details: error.message });
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    const { domains, subtotal, tax, total } = req.body;

    const newOrder = new Order({
      domains,
      subtotal,
      tax,
      total,
      date: new Date(),
    });

    await newOrder.save();

    res.status(200).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Error placing the order', details: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
