const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConfig = require('./DbConfig.js'); 

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool(dbConfig);
// const pool = mysql.createPool({
//   connectionLimit: 10, // Adjust as per your requirement
//   host: 'mysql512.loopia.se',
//   user: 'expbil01@e361369',
//   password: 'm!1pJiZWW6GPo&',
//   database: 'expressbild_org_db_14',
//   port: '3306'
// });

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


// // API endpoint to fetch data by orderuuid from MySQL
// app.get('/api/data/uuid', (req, res) => {
//   const { orderuuid } = req.query;

//   if (!orderuuid) {
//     return res.status(400).json({ error: 'orderuuid parameter is required' });
//   }

//   const query = 'SELECT * FROM net_orders WHERE orderuuid = ?';
//   pool.query(query, [orderuuid], (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       res.status(500).send('Error fetching data');
//     } else {
//       res.json(results);
//     }
//   });
// });

// // API endpoint to fetch neo_activities from MySQL
// app.get('/api/neo_activities', (req, res) => {

//   const query = 'SELECT * FROM neo_activities';
//   pool.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching neo_activities:', err);
//       res.status(500).send('Error fetching neo_activities');
//     } else {
//       res.json(results);
//     }
//   });
// });

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

// API endpoint to insert records into net_catalogue_orders
app.post('/api/net_catalogue_orders', (req, res) => {
  const orders = req.body; // Expecting an array of order objects

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).send('Invalid input data');
  }

  const values = orders.map(order => [
    order.order_id,
    order.project_id,
    order.status,
    order.created_at,
    order.updated_at,
    // add other fields as necessary
  ]);

  const query = `
    INSERT INTO net_catalogue_orders (order_id, project_id, status, created_at, updated_at)
    VALUES ?
  `;

  pool.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting into net_catalogue_orders:', err);
      res.status(500).send('Error inserting into net_catalogue_orders');
    } else {
      res.status(201).json({ message: 'Records inserted successfully', insertId: results.insertId });
    }
  });
});


// // API endpoint to fetch net_catalogue_projects from MySQL
// app.get('/api/net_catalogue_projects', (req, res) => {

//   const query = 'SELECT * FROM net_catalogue_projects';
//   pool.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching net_catalogue_projects:', err);
//       res.status(500).send('Error fetching net_catalogue_projects');
//     } else {
//       res.json(results);
//     }
//   });
// });

// // API endpoint to fetch net_catalogue_projects from MySQL
// app.get('/api/neo_catalog_data', (req, res) => {

//   const query = 'SELECT * FROM neo_catalog_data';
//   pool.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching neo_catalog_data:', err);
//       res.status(500).send('Error fetching neo_catalog_data');
//     } else {
//       res.json(results);
//     }
//   });
// });

// fetch relevant project data for catalog control
app.get('/api/projects', (req, res) => {
  const { year, country, status, isUnorderedList, searchString } = req.query;
  console.log("req.query from client", req.query);

  let query = `
    SELECT p1.uuid, p1.portaluuid, p1.status, p1.D2, p2.name, d.production_type, p1.last_updated, 
      IF(p1.D2 IS NOT NULL, SUM(IF(o.status = 1, 1, 0)), p1.num_orders) AS new_orders, 
      p1.num_orders 
    FROM net_catalogue_projects AS p1 
    JOIN neo_projects AS p2 ON p1.uuid = p2.uuid 
    LEFT JOIN net_catalogue_orders AS o ON p1.uuid = o.project_id 
    LEFT JOIN neo_catalog_data AS d ON d.project_uuid = p1.uuid 
    WHERE 1=1
  `;

  if (year) {
    query += ` AND p2.name LIKE '%${pool.escape(year).replace(/'/g, '')}%'`;
  }

  if (country) {
    query += ` AND p2.portaluuid = ${pool.escape(country)}`;
  }

  if (status) {
    query += ` AND p1.status = ${pool.escape(status)}`;
  }

  if (isUnorderedList === "true" || isUnorderedList === true) {
    query += ` AND p1.num_orders > 0`;
    console.log("QUERY WITH p1.num_orders > 0");
  }

  if (searchString) {
    query += ` AND p2.name LIKE '%${pool.escape(searchString).replace(/'/g, '')}%'`;
  }

  // query += ` GROUP BY p1.uuid ORDER BY p1.last_updated DESC LIMIT 2000`;
  query += ` GROUP BY p1.uuid, p1.portaluuid, p1.status, p1.D2, p2.name, d.production_type, p1.last_updated, p1.num_orders 
  ORDER BY p1.last_updated DESC 
  LIMIT 2000`;

  console.log("FINAL QUERY:", query);

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching /api/projects:', err);
      res.status(500).send('Error fetching /api/projects');
    } else {
      res.json(results);
    }
  });
});



// Start server
app.listen(port, () => {
  console.log("----------------------------------------")
  console.log("Ready!")
  console.log("Control Cataglog server successfully started...")
  console.log(`Server running on http://localhost:${port}`);
});
