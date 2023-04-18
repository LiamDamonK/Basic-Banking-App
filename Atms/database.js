const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const exp = require("constants");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cors = require("cors");
const { error } = require("console");

const app = express();
const port = 8000;

//Database reciving data from DB
const pool = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Liamdkotze123",
  database: "users",
});

pool.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL Connected");
  }
});
app.set("view engine", "hbs");
app.use(express.static("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  res.render("index");
});
var values = [];
app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  values = [username, password];
  pool.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        console.log("Ja");
        app.get("/home", (req, res) => {
          res.render("home");
        });
        res.status(200).json({ message: "Yes" });
      } else {
        // Invalid username or password
        res.status(401).json({ message: "Invalid username or password" });
        console.log("Nee");
      }
    }
  });
});

//Server Code For Home.hbs

//Function To Make The Logout Button Work
app.post("/logout", (req, res) => {
  req = true;

  if ((req = true)) {
    app.get("/login", (req, res) => {
      res.render("index");
    });
    res.status(200).json({ message: "Yes" });
  }
});

//Function To Display the users name
app.post("/name", (req, res) => {
  if (req) {
    res.send({ name: values[0] });
  }
});

//Function To Display the Users Balance
var balance;
app.post("/balance", (req, res) => {
  const username = values[0];
  const query = "SELECT balance FROM users WHERE username = ?";

  pool.query(query, [username], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        balance = results[0].balance;
        res.status(200).json({ balance });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    }
  });
});

app.post("/pay", (req, res) => {
  const username = values[0];
  const amount = req.body.amount;
  const UpdatedAmount = balance - amount;
  console.log(balance);
  console.log(amount);
  console.log(UpdatedAmount);
  console.log(username);
  const query = "UPDATE users SET balance = ? WHERE username = ? LIMIT 1";

  pool.query(query, [UpdatedAmount, username], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        const balance = results[0].balance;
        res.status(200).json({ balance });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    }
  });
});

//Code To Generate PDF
app.post("/generate-pdf", (req, res) => {
  const doc = new PDFDocument();
  doc.fontSize(20);
  doc.font("Helvetica-Bold");
  // Add the title
  doc.text("Your Bank", { align: "center" });
  doc.moveDown();
  // Set the font size and style for the main content
  doc.fontSize(16);
  doc.font("Helvetica");
  // Add a welcome message with the username
  const user = values[0];
  doc.text(`Welcome ${user}`, { align: "center" });
  doc.moveDown();
  // Set the font size and style for the balance
  doc.fontSize(18);
  doc.font("Helvetica-Bold");
  doc.text(`Your Available Balance is R${balance}`, { align: "center" });
  doc.moveDown();
  // Set the font size and style for the date and time
  doc.fontSize(12);
  doc.font("Helvetica");
  // Add the date and time information
  const dateTime = new Date().toLocaleString();
  doc.text(`This Document was created on ${dateTime}`, { align: "center" });
  // Save the PDF to a file
  const pdfPath = path.join(__dirname, "welcome_letter.pdf"); // Use path module to construct absolute file path
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.end();

  // Send the generated PDF file to the client side
  res.sendFile(pdfPath);
});

//End of Server Code for Home.hbs
app.listen(port, () => console.log("Server has started on port: " + port));

app.set("view engine", "hbs");

// pool.query("SELECT * FROM users", function (err, results) {
//   console.log(results);
// });
