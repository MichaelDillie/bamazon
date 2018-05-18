var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  prot: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

