const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./DbConfig.js");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Increase the payload limit to 10MB 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MySQL Connection Pool
const pool = mysql.createPool(dbConfig);

// API endpoint to fetch data by orderuuid from MySQL
app.get("/api/neo_projects", (req, res) => {
  const query = "SELECT uuid, name, catalogues FROM neo_projects";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from neo_projects:", err);
      return res.status(500).send("Error fetching data from neo_projects");
    } else {
      res.json(results);
    }
  });
});

// API endpoint to fetch net_catalogue_projects from MySQL
app.get("/api/net_catalogue_projects", (req, res) => {
  const query = "SELECT portaluuid, uuid FROM net_catalogue_projects";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching net_catalogue_projects:", err);
      res.status(500).send("Error fetching net_catalogue_projects");
    } else {
      res.json(results); // Correct the response format
    }
  });
});

// API endpoint to update D2 and statys in net_catalogue_projects
app.post("/api/net_catalogue_projects", (req, res) => {
  const { project_id } = req.body;
  console.log("project_id:", project_id);
  if (!project_id) {
    return res.status(400).send("Missing project_id in request body");
  }
  const query = "UPDATE net_catalogue_projects SET D2 = NOW(), status = 2 WHERE uuid = ?";
  const values = [project_id]; 
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating net_catalogue_projects:", err);
      res.status(500).send("Error updating net_catalogue_projects");
    } else {
      res.status(200).json({ message: "Record updated successfully", affectedRows: results.affectedRows });
    }
  });
});


// API endpoint to insert records into net_catalogue_orders
app.post("/api/net_catalogue_orders", (req, res) => {
  const orders = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).send("Invalid input data: Expected non-empty array of orders");
  }

  const existingSubjectUuidsQuery =
    "SELECT subjectuuid FROM net_catalogue_orders WHERE subjectuuid IN (?)";

  const subjectUuids = orders.map((order) => order.subjectuuid);

  pool.query(existingSubjectUuidsQuery, [subjectUuids], (err, result) => {
    if (err) {
      console.error("Error checking existing subjectuuids:", err);
      return res.status(500).send("Error checking existing subjectuuids");
    }

    const existingSubjectUuids = new Set(
      result.map((result) => result.subjectuuid),
    );

    const newOrders = orders.filter(
      (order) => !existingSubjectUuids.has(order.subjectuuid),
    );

    if (newOrders.length === 0) {
      return res.status(200).json({ message: "No new orders to insert" });
    }

    const values = newOrders.map((order) => [
      order.catalogues[0].price,
      order.catalogues[0].vatvalue,
      order.data_2,
      order.deliveryaddress,
      order.deliverycity,
      order.deliveryname,
      order.deliverypostalcode,
      order.orderuuid,
      order.portaluuid,
      order.project_id,
      order.projectname,
      order.socialnumber,
      order.subjectname,
      order.subjectuuid,
      order.team,
      order.useremail,
      order.usermobile,
      order.username,
      "NO ORDER",
      "NULL"
    ]);

    console.log(`Number of new orders to insert: ${values.length}`);

    const insertQuery = `
    INSERT INTO net_catalogue_orders (
      price, vatvalue,
      status, deliveryaddress, deliverycity, deliveryname,
      deliverypostalcode, orderuuid, portaluuid,
      project_id, project, socialnumber, subjectname,
      subjectuuid, team, useremail, usermobile, username, original_orderuuid, order_created
    )
    VALUES ?
    `;
    pool.query(insertQuery, [values], (err, results) => {
      if (err) {
        console.error("Error inserting into net_catalogue_orders:", err);
        res.status(500).send("Error inserting into net_catalogue_orders");
      } else {
        const insertedOrders = newOrders.map((order, index) => ({
          ...order,
          insertId: results.insertId + index 
        }));
        res.status(201).json({
          message: "Records inserted successfully",
          insertedOrders: insertedOrders
        });
      }
    });
  });
});

// fetch relevant project data for catalog control
app.get("/api/projects", (req, res) => {
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
    query += ` AND p2.name LIKE '%${pool.escape(year).replace(/'/g, "")}%'`;
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
    query += ` AND p2.name LIKE '%${pool.escape(searchString).replace(/'/g, "")}%'`;
  }

  // query += ` GROUP BY p1.uuid ORDER BY p1.last_updated DESC LIMIT 2000`;
  query += ` GROUP BY p1.uuid, p1.portaluuid, p1.status, p1.D2, p2.name, d.production_type, p1.last_updated, p1.num_orders 
  ORDER BY p1.last_updated DESC 
  `;

  console.log("FINAL QUERY:", query);

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching /api/projects:", err);
      res.status(500).send("Error fetching /api/projects");
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log("----------------------------------------");
  console.log("Ready!");
  console.log("Control Cataglog server successfully started...");
  console.log(`Server running on http://localhost:${port}`);
});
