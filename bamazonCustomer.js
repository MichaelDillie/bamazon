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
      message: "Welcome to Bamazon!\n Select an Option.",
      choices:[
        "List Products",
        "Buy A Product"
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
        if(result[i].product_id === parseInt(answers.productId)) {
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
              product_id: chosenId.product_id
            }
          ],
          function(err) {
            if (err) throw err;
            console.log("Purchase Successful!\n Total cost of purchase $" + chosenId.price * answers.unitsToBuy + "\n" + "Thank You for Choosing Bamazon!");
          }
        );
        var productSale;
        productSale = chosenId.price * answers.unitsToBuy;
        var newProductSale = productSale;
        for(var i = 0; i < result.length; i++) {
          if(result[i].product_id === parseInt(answers.productId)) {
            newProductSale += result[i].prodcut_sales;
          }
        }
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              prodcut_sales: newProductSale
            },
            {
              product_id: chosenId.product_id
            }
          ],
          function(err) {
            if (err) throw err;
          }
        );
      } else {
        var unitsLeft;
        for(var i = 0; i < result.length; i++) {
          if(result[i].product_id === parseInt(answers.productId)) {
            unitsLeft = result[i].stock_quantity;
          }
        }
        console.log("Sorry! There are only " + unitsLeft + " units left in stock.");
      }
      connection.end();
    });
  })
}

function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    for(var i = 0; i < res.length; i++) {
      console.log("---------------------------------");
      console.log("Product ID - " + res[i].product_id);
      console.log("Product Name - " + res[i].product_name);
      console.log("Product Price - $" + res[i].price);
      console.log("Units in Stock - " + res[i].stock_quantity);
    }
    connection.end();
  });
}