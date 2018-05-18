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
      var chosenId;
      for(var i = 0; i < result.length; i++) {
        if(result[i].id === parseInt(answers.productId)) {
          chosenId = result[i]
        }
      }
      if(chosenId.stock_quantity - answers.unitsToBuy >= 0) {
        var newAmountInStock;
        newAmountInStock = chosenId.stock_quantity - answers.unitsToBuy;
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newAmountInStock
            },
            {
              id: chosenId.id
            }
          ],
          function(err) {
            if (err) throw err;
            console.log("Purchase Successful");
          }
        );
      } else {
        console.log("Not enough to buy");
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