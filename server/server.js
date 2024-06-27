const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as per your requirement
  host: 'mysql512.loopia.se',
  user: 'expbil01@e361369',
  password: 'm!1pJiZWW6GPo&',
  database: 'expressbild_org_db_14',
  port: '3306'
});

// API endpoint to fetch data by orderuuid from MySQL
app.get('/api/data', (req, res) => {

  const query = 'SELECT * FROM net_orders';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// API endpoint to fetch data by orderuuid from MySQL
app.get('/api/data/uuid', (req, res) => {
  const { orderuuid } = req.query;

  if (!orderuuid) {
    return res.status(400).json({ error: 'orderuuid parameter is required' });
  }

  const query = 'SELECT * FROM net_orders WHERE orderuuid = ?';
  pool.query(query, [orderuuid], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
