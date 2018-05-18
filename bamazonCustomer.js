var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if(err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    console.log(res);
    connection.end();
  });
}