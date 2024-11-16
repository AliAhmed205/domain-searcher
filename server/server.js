const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 1212;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Testing testing testing' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
