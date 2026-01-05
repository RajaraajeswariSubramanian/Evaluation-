const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",          // change if needed
  password: "root",
  database: "mphasis"
});

module.exports = db;
