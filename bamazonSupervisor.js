// Requiring
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');

// Connecting to DB
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

// If connected run the start function
connection.connect(function(err) {
  if (err) throw err;
  start();
});

// The start function will start everything off in the CLI
// Houses a switch statement that will run functions
// related to the choice the user makes
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
  });
}

// Setting themes for colors that will be used in the table
colors.setTheme({
  headder: ["cyan", "bold"],
  logged: ["green", "bold"]
});

// The viewSalesByDepartment function will diplay everthing in the DB in the
// departments table to the user
function viewSalesByDepartment() {
  connection.query("SELECT department_id, departments.department_name, over_head_cost, SUM(product_sales) AS product_sales, (SUM(product_sales) - over_head_cost)  AS total_profit FROM departments RIGHT JOIN products ON departments.department_name = products.department_name GROUP BY department_id", function(err, res) {
    if (err) throw err;
    // Creating a new table
    var table = new Table({
      head: ["Department ID".headder, "Department Name".headder, "Over Head Cost".headder, "Product Sales".headder, "Total Profit".headder],
      colWidths: [15, 20, 20, 15, 15]
    });
    for(var i = 0; i < res.length; i++) {
      // Pushing all the data from the departments table in the DB to the new table
      table.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_cost, res[i].product_sales, res[i].total_profit]
      );
    }
    // Displaying to the user in the CLI
    console.log(table.toString());
    // Ending the connection
    connection.end();
  });
}

// ***** STILL UNDER TESTING *****
function createNewDepartment() {
  inquirer
    .prompt([
     {
       type: "input",
       name: "departmentName",
       message: "Department Name"
     },
     {
       type: "input",
       name: "overHeadCost",
       message: "Over Head Cost"
     }
    ]).then(function(answers) {
      connection.query("SELECT department_name FROM departments", function(err, res) {
        if (err) throw err;
        var departmentExists = false;
        for(var i = 0; i < res.length; i++) {
          if(res[i].department_name.toUpperCase() === answers.departmentName.toUpperCase()) {
            departmentExists = true;
          }
        }
        if (!departmentExists) {
          
        }
        console.log(departmentExists);
        connection.end();
      });
  });
}