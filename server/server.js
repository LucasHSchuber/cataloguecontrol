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
app.get('/api/net_orders', (req, res) => {

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

// API endpoint to fetch neo_activities from MySQL
app.get('/api/neo_activities', (req, res) => {

  const query = 'SELECT * FROM neo_activities';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching neo_activities:', err);
      res.status(500).send('Error fetching neo_activities');
    } else {
      res.json(results);
    }
  });
});

// API endpoint to fetch neo_projects from MySQL
app.get('/api/neo_projects', (req, res) => {

  const query = 'SELECT * FROM neo_projects';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching neo_projects:', err);
      res.status(500).send('Error fetching neo_projects');
    } else {
      res.json(results);
    }
  });
});

// API endpoint to fetch net_catalogue_orders from MySQL
app.get('/api/net_catalogue_orders', (req, res) => {

  const query = 'SELECT * FROM net_catalogue_orders';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching net_catalogue_orders:', err);
      res.status(500).send('Error fetching net_catalogue_orders');
    } else {
      res.json(results);
    }
  });
});

// API endpoint to fetch net_catalogue_projects from MySQL
app.get('/api/net_catalogue_projects', (req, res) => {

  const query = 'SELECT * FROM net_catalogue_projects';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching net_catalogue_projects:', err);
      res.status(500).send('Error fetching net_catalogue_projects');
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
