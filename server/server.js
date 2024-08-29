const express = require("express");
const mysql = require("mysql");
const formidable = require('formidable');
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./DbConfig.js");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

// Load environment variables
require('dotenv').config();
// Access environment variables
const BASE_DIR = process.env.BASE_DIR || 'C:';
const RESOURCES_DIR = process.env.RESOURCES_DIR || 'Resources_ebss';

// Example usage
console.log(`Base Directory: ${BASE_DIR}`);
console.log(`Resources Directory: ${RESOURCES_DIR}`);


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Increase the payload limit to 10MB 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MySQL Connection Pool
const pool = mysql.createPool(dbConfig);




// ------------- ROUTES ------------



// Route to hanlde storing files
app.post('/api/savefiles', (req, res) => {
  const form = new formidable.IncomingForm();

  // Set the directory where files will be temporarily stored
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  form.uploadDir = tempDir;
  form.keepExtensions = true; // Keep the file extensions

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(400).json({ error: 'Error parsing form data' });
    }

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const responseFiles = [];
    const directoryNames = fields.name; // This should be an array of directory names

    if (!directoryNames || directoryNames.length === 0) {
      return res.status(400).json({ error: 'No directory names provided' });
    }

    // Ensure we have an equal number of directory names and files
    if (files.files.length !== directoryNames.length) {
      return res.status(400).json({ error: 'Number of files and directory names do not match' });
    }

    // Track if any errors occur
    let errorOccurred = false;
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    
    fileArray.forEach((file, index) => {
      // Validate file
      if (!file || !file.filepath) {
        console.error(`Invalid file or filepath for key: files`);
        errorOccurred = true;
        return;
      }

      const directoryName = directoryNames[index]; // Get directory name corresponding to this file
      // const targetDir = path.join('C:', 'Resources_ebss', directoryName);
      const targetDir = path.join(process.env.BASE_DIR, process.env.RESOURCES_DIR, directoryName);

      // Create target directory if it does not exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const originalFilePath = file.filepath;
      const targetPath = path.join(targetDir, file.originalFilename);
      
      console.log(`Moving file from ${originalFilePath} to ${targetPath}`);

      // Move the file from temporary to final destination
      fs.rename(originalFilePath, targetPath, err => {
        if (err) {
          console.error(`Error moving file ${originalFilePath} to ${targetPath}:`, err);
          errorOccurred = true;
          // Continue processing other files even if one fails
          return;
        }

        // Clean and format the path for response
        let responseTargetPath = path.relative(path.join(BASE_DIR, RESOURCES_DIR), targetPath);
        responseTargetPath = responseTargetPath.replace(/\\/g, '/'); // Ensure using forward slashes


        responseFiles.push({
          filename: file.originalFilename,
          path: responseTargetPath,
          name: directoryName
        });

        console.log(`File saved to ${targetPath}`);
      });
    });

    // Respond once all files are processed
    // Delay response to ensure all files are moved
    setTimeout(() => {
      if (errorOccurred) {
        res.status(500).json({
          error: 'Error processing some files',
          status: 500,
        });
      } else {
        res.status(200).json({
          message: 'Files uploaded successfully',
          status: 200,
          files: responseFiles
        });
      }
    }, 1000); // Adjust the delay if necessary
  });
});


  // // Define storage configuration for multer
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //       // Retrieve the directory name from the request body
  //       // const directoryName = req.body.name; 
  //       const directoryName = "catalog_file";
  //       if (!directoryName) {
  //           return cb(new Error('No directory name provided'), null);
  //       }

  //       // Construct the upload directory based on the directoryName
  //       const baseDir = path.join('C:', 'Resources_ebss', directoryName);

  //     // Ensure the directory exists; create it if it doesn't
  //     if (!fs.existsSync(baseDir)) {
  //       fs.mkdirSync(baseDir, { recursive: true });
  //     }

  //     cb(null, baseDir); 
  //   },
  //   filename: function (req, file, cb) {
  //       cb(null, file.originalname);
  //   }
  // });

  // const upload = multer({ storage: storage });

  // app.post('/api/savefiles', upload.array('files'), (req, res) => {
  //   try {
  //     console.log('Request Body:', req.body);
  //     console.log('Uploaded Files:', req.files);
  
  //     // Check if the request body does not contain the expected 'name' field
  //     if (!req.body.name) {
  //       return res.status(400).json({
  //         error: 'No directory name provided',
  //         status: 400
  //       });
  //     }
  
  //     const name = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
  
  //     // Add the correct `fileNames` to each file object based on the index
  //     const filesWithNames = req.files.map((file, index) => ({
  //       ...file,
  //       name: name[index] || name[0] 
  //     }));
  
  //     // If everything goes well, send a success response
  //     res.status(200).json({
  //       message: 'Files uploaded successfully',
  //       status: 200,
  //       files: filesWithNames
  //     });
  
  //   } catch (error) {
  //     console.error('Error occurred during file upload:', error);
  
  //     res.status(500).json({
  //       error: 'An error occurred during file upload',
  //       status: 500,
  //       details: error.message
  //     });
  //   }
  // });
  




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


  // GET - API endpoint to fetch net_catalogue_projects from MySQL
  app.get("/api/net_catalogue_projects", (req, res) => {
    const query = "SELECT portaluuid, uuid FROM net_catalogue_projects";
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching net_catalogue_projects:", err);
        res.status(500).send("Error fetching net_catalogue_projects");
      } else {
        res.json(results); 
      }
    });
});


  // POST - API endpoint to update D2 and stauts in net_catalogue_projects
  app.post("/api/net_catalogue_projects", (req, res) => {
    const { project_id } = req.body;
    // console.log("project_id:", project_id);
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
        console.log("Updating net_catalouge_projects D2 and status field");
        res.status(200).json({ message: "Record updated successfully", affectedRows: results.affectedRows });
      }
    });
  });


  // GET - API endpoint to fetch subjectuuids from net_catalogue_orders from MySQL
  app.get("/api/net_catalogue_orders", (req, res) => {
    const project_id = req.query.project_id;
    if (!project_id) {
      return res.status(400).send("Missing project_id parameter");
    }
    const query = "SELECT * FROM net_catalogue_orders WHERE project_id = ?";
    pool.query(query, [project_id], (err, results) => {
      if (err) {
        console.error("Error fetching subjectuuids from net_catalogue_orders:", err);
        res.status(500).send("Error fetching subjectuuids from net_catalogue_orders");
      } else {
        res.json(results); 
      }
    });
  });

  // GET - API endpoint to fetch subjectuuids from net_catalogue_orders from MySQL
  app.get("/api/net_catalogue_orders/livonia", (req, res) => {
    const project_id = req.query.project_id;
    if (!project_id) {
      return res.status(400).send("Missing project_id parameter");
    }
    const query = "SELECT * FROM net_catalogue_orders WHERE status = 1 AND project_id = ?";
    pool.query(query, [project_id], (err, results) => {
      if (err) {
        console.error("Error fetching subjectuuids from net_catalogue_orders:", err);
        res.status(500).send("Error fetching subjectuuids from net_catalogue_orders");
      } else {
        res.json(results); 
      }
    });
  });

  // POST - API endpoint to add tupples in net_orders by LIVONIA btn
  app.post("/api/net_orders", (req, res) => {
    const orderData = req.body.orderData;
    console.log("recieved orderData: ", orderData);
    if (!orderData || typeof orderData !== 'object') {
      return res.status(400).send("Invalid: Expected orderData object");
    }
    const query = `
      INSERT INTO net_orders (
        orderuuid, portaluuid, externalid, co, invoicenumber, countrycode, 
        originating, override_sum, baseprice, discount, deliveryprice, fee, 
        paid, vatprocent, vatvalue, deliveryname, deliveryaddress, 
        deliverypostalcode, deliverycity, deliverytype, paymenttype, 
        socialnumber, subjectuuid, subjectname, subjectemail, subjectphone, 
        project, project_id, team, username, useremail, usermobile, sheet_count, 
        printed, posted, post_weight, cancelled, expiration_days, debtfeedate, 
        debtfeedate2, collection, tags, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      orderData.orderuuid, orderData.portaluuid, orderData.externalid, orderData.co, 
      orderData.invoicenumber, orderData.countrycode, orderData.originating, 
      orderData.override_sum, orderData.baseprice, orderData.discount, orderData.deliveryprice, 
      orderData.fee, orderData.paid, orderData.vatprocent, orderData.vatvalue, 
      orderData.deliveryname, orderData.deliveryaddress, orderData.deliverypostalcode, 
      orderData.deliverycity, orderData.deliverytype, orderData.paymenttype, 
      orderData.socialnumber, orderData.subjectuuid, orderData.subjectname, 
      orderData.subjectemail, orderData.subjectphone, orderData.project, 
      orderData.project_id, orderData.team, orderData.username, orderData.useremail, 
      orderData.usermobile, orderData.sheet_count, orderData.printed, orderData.posted, 
      orderData.post_weight, orderData.cancelled, orderData.expiration_days, 
      orderData.debtfeedate, orderData.debtfeedate2, orderData.collection, 
      orderData.tags, orderData.notes
    ];
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Error inserting into net_orders:", err);
        return res.status(500).send("Error inserting into net_orders");
      }
      console.log("Record inserted into net_orders", results);
      res.status(200).json({ message: "Record inserted successfully", affectedRows: results.affectedRows });
    });
  });

  // POST - API endpoint to add tupples in net_products by LIVONIA btn
  app.post("/api/net_products", (req, res) => {
    const productData = req.body.productData;
    console.log("recieved productData: ", productData);
    if (!productData || typeof productData !== 'object') {
      return res.status(400).send("Invalid: Expected productData object");
    }
    const query = `
      INSERT INTO net_products (
        orderuuid, packagedescription, description, price, quantity, vatprocent, vatvalue, return_factor, package_num, deleted, created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      productData.orderuuid, productData.packagedescription, productData.description, productData.price, productData.quantity, productData.vatprocent, productData.vatvalue, productData.return_factor, productData.package_num, productData.deleted, productData.created
    ];
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Error inserting into net_products:", err);
        return res.status(500).send("Error inserting into net_products");
      }
      console.log("Record inserted into net_products", results);
      res.status(200).json({ message: "Record inserted successfully", affectedRows: results.affectedRows });
    });
  });

  // POST - API endpoint to update status in net_catalogue_orders
  app.post("/api/net_catalogue_orders/statusupdate", (req, res) => {
    const { orderuuid } = req.body;
    if (!orderuuid) {
      return res.status(400).send("Invalid: orderuuid expected in request");
    }
    const query = "UPDATE net_catalogue_orders SET status = 2 WHERE orderuuid = ?";
    const value = orderuuid;
    pool.query(query, value, (err, results) => {
      if (err) {
        console.error("Error updating status in net_catalogue_orders:", err);
        res.status(500).send("Error updating status in net_catalogue_orders");
      } else {
        console.log("Successfullly updated staus in net_catalogue_orders");
        res.status(200).json({ message: "Status updated successfully in net_catalogue_orders", affectedRows: results.affectedRows });
      }
    });
  })


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
        order.catalogues[0].vatvalue.toFixed(2),
        order.data_2,
        order.deliveryaddress,
        order.deliverycity,
        order.deliveryname,
        order.deliverypostalcode,
        order.orderuuid,
        order.portaluuid,
        "Catalog Control",
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
        null
      ]);

      console.log(`Number of new orders to insert: ${values.length}`);

      const insertQuery = `
      INSERT INTO net_catalogue_orders (
        price, vatvalue,
        status, deliveryaddress, deliverycity, deliveryname,
        deliverypostalcode, orderuuid, portaluuid, originating,
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

  //Endpoint to create a reservation in cs_ocr_reservations table
  app.post("/api/create_reservation", (req, res) => {
    const { group_id, user_id } = req.body;
    const getMaxIdQuery = "SELECT MAX(id) + 1 AS id FROM cs_ocr_reservations LIMIT 1";

    pool.query(getMaxIdQuery, (err, result) => {
      if (err) {
        console.error("Error fetching max ID from cs_ocr_reservations:", err);
        return res.status(500).send("Error creating reservation");
      }

      const newId = result[0].id || 1;
      // Insert the new reservation
      const insertReservationQuery = "INSERT INTO cs_ocr_reservations (group_id, user_id, date) VALUES (?, ?, NOW())";
      const values = [group_id, user_id];

      pool.query(insertReservationQuery, values, (err, results) => {
        if (err) {
          console.error("Error inserting new reservation into cs_ocr_reservations:", err);
          return res.status(500).send("Error creating reservation");
        }
        res.status(200).json({ message: "Reservation created successfully", reservationId: newId, result: results });
      });
    });
  });

  // Generating invoice number 
  app.post('/api/get_invoice_number', (req, res) => {
    const { portaluuid } = req.body;
    const year = new Date().getFullYear();

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection:", err);
        return res.status(500).send("Failed to get database connection");
      }

      connection.beginTransaction(async (err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          return res.status(500).send("Failed to start transaction");
        }

        let query = `
          SELECT * FROM neo_invoice_data 
          WHERE portaluuid = ? AND year = ? 
          FOR UPDATE
        `;

        connection.query(query, [portaluuid, year], (err, rows) => {
          if (err) {
            console.error("Error fetching invoice data:", err);
            connection.rollback(() => connection.release());
            return res.status(500).send("Error fetching invoice data");
          }

          let invoicenumber = rows.length === 0 ? 1 : rows[0].value + 1;

          let insertQuery = `
            INSERT INTO neo_invoice_data (portaluuid, year, value) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE value = ?
          `;

          connection.query(insertQuery, [portaluuid, year, invoicenumber, invoicenumber], (err) => {
            if (err) {
              console.error("Error inserting/updating invoice data:", err);
              connection.rollback(() => connection.release());
              return res.status(500).send("Error updating invoice data");
            }

            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => connection.release());
                return res.status(500).send("Failed to commit transaction");
              }

              connection.release();
              res.json({ invoicenumber: `${year}-${invoicenumber}` });
            });
          });
        });
      });
    });
  });


  // API-endpoint to save CSV-file on server
  app.post("/api/save-csv", (req, res) => {
    const { csvContent, project_id } = req.body; 

    const timestamp = Date.now();
    const fileName = `csv-backup-time-${timestamp}.csv`;
    const filePath = path.join(__dirname, "backups", fileName);

    // Spara CSV-innehållet som en fil

    if (!fs.existsSync(path.join(__dirname, "backups"))) {
      fs.mkdirSync(path.join(__dirname, "backups"));
    }

    fs.writeFile(filePath, csvContent, (err) => {
      if (err) {
        console.error("Error saving CSV file:", err);
        return res.status(500).send("Error saving CSV file.");
      }
      console.log(`CSV file saved at ${filePath}`);
      res.status(200).json({ message: "CSV file saved successfully", filePath });
    });
  });


  // ------------------ EBSS -------------------

    //Endpoint to add data to pdfgen_ebss table
    app.post("/api/pdfgen_ebss", (req, res) => {
        const data = req.body;
        console.log("recieved data: ", data);
      if (!data || typeof data !== 'object') {
        return res.status(400).send("Invalid: Expected data object");
      }
      if (!data.project_uuid) {
        return res.status(400).send("Invalid: Expected project_uuid");
      }
          
      const query = `
      INSERT INTO pdfgen_ebss (
        project_uuid, product_type, production_active, production_type, template_name, data
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        product_type = VALUES(product_type),
        production_active = VALUES(production_active),
        production_type = VALUES(production_type),
        template_name = VALUES(template_name),
        data = VALUES(data),
        updated_at = NOW()
    `;
      const values = [
        data.project_uuid, data.product_type, data.production_active, data.production_type, data.template_name, JSON.stringify(data.data)
      ];
      pool.query(query, values, (err, results) => {
        if (err) {
          console.error("Error inserting into pdfgen_ebss:", err);
          // return res.status(500).send("Error inserting into pdfgen_ebss");
          res.status(500).json({ error: err.sqlMessage || 'Database insertion failed' });
        }
        console.log("Data inserted into pdfgen_ebss", results);
        res.status(200).json({ message: "Data inserted successfully", result: results });
      });
    });

  
// Start server
app.listen(port, () => {
  console.log("----------------------------------------");
  console.log("Ready!");
  console.log("Control Cataglog server successfully started...");
  console.log(`Server running on http://localhost:${port}`);
});
