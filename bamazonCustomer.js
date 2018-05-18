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
  connection.query("SELECT * FROM products", function(err, result) {
    inquirer
      .prompt([
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
    ])
    .then(function(answers) {
      console.log(typeof answers.productId);
      var chosenId;
      for(var i = 0; i < result.length; i++) {
        if(result[i].id === parseInt(answers.productId)) {
          console.log("We have a match! " + result[i].id + " " + answers.productId);
        }
      }
      connection.end();
    });
  })
}




function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    console.log(res);
    connection.end();
  });
}