var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        choices: [
          "View Product Sales by Department",
          "Create New Department"
        ],
        message: "Select an Option."
      }
    ]).then(function(answers) {
      switch(answers.choice) {
        case "View Product Sales by Department":
          viewSalesByDepartment();
          break;
        case "Create New Department":
          createNewDepartment();
          break;
      }
      connection.end();
  });
}

colors.setTheme({
  headder: ["cyan", "bold"],
  logged: ["green", "bold"]
});

function viewSalesByDepartment() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    var table = new Table({
      head: ["Department ID".headder, "Department Name".headder, "Over Head Cost".headder],
      colWidths: [15, 25, 15, 20]
    });
    for(var i = 0; i < res.length; i++) {
      table.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_cost]
      );
    }
    console.log(table.toString());
    connection.end();
  });
}

function createNewDepartment() {
  console.log("this is Create New Department function");
}