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
  var greeting = [
    {
      type: "list",
      name: "test",
      message: "What do you want to do",
      choices:[
        "List Products",
        "Buy Product"
      ]
    }
  ];
  inquirer.prompt(greeting).then(function(answers) {
    if(answers.test === "List Products") {
      readProducts();
    } else {
      buyProduct();
    }
  });
}

function buyProduct() {
  var buyProductQuestions = [
    {
      type: "input",
      name: "productId",
      message: "What is the ID of the product you would like to buy?"
    },
    {
      type: "input",
      name: "unitsToBuy",
      message: "How many units would you like to buy?"
    }
  ];
  inquirer.prompt(buyProductQuestions).then(function(answers) {
    console.log(answers.productId + " " + answers.unitsToBuy);
    connection.end();
  });
}




function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    console.log(res);
    connection.end();
  });
}