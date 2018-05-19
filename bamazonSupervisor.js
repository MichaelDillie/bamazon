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
  if (err) throw err;
  start();
})

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

function viewSalesByDepartment() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    for(var i = 0; i < res.length; i++) {
      console.log("---------------------------------");
      console.log("Department ID - " + res[i].department_id);
      console.log("Department Name - " + res[i].department_name);
      console.log("Overhead Cost - $" + res[i].over_head_cost);
    }
  });
}

function createNewDepartment() {
  console.log("this is Create New Department function");
}