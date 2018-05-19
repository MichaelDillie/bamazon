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
      console.log(answers.choice);
      connection.end();
  });
}