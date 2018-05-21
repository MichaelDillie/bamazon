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
  var greeting = [
    {
      type: "list",
      name: "choice",
      message: "Welcome to Bamazon!\n Select an Option.",
      choices:[
        "List Products",
        "Buy A Product"
      ]
    }
  ];
  // Prompts the user with the greeting
  inquirer.prompt(greeting).then(function(answers) {
    // Swithc statement that will take the users input (answers)
    switch (answers.choice) {
      case "List Products":
        readProducts();
        break;
      case "Buy A Product":
        buyProduct();
        break;
    }
  });
}

// Setting themes for colors that will be used in the table
colors.setTheme({
  headder: ["cyan", "bold"],
  logged: ["green", "bold"]
});

// The buyProduct function will handel the buying process
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
      // Declaring chosenId to be empty until it is replaced with the product_id
      var chosenId;
      for(var i = 0; i < result.length; i++) {
        // Checking if the users input (product_id) is in the DB
        if(result[i].product_id === parseInt(answers.productId)) {
          chosenId = result[i]
        }
      }
      // This will check if there is enough in stock for the user to buy
      if(chosenId.stock_quantity - answers.unitsToBuy >= 0) {
        // If there is it will update the DB
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
            // This is letting the user know that the purchase went through
            // how much the purchase was
            // an a nice message
            console.log("Purchase Successful!\n Total cost of purchase $" + chosenId.price * answers.unitsToBuy + "\n" + "Thank You for Choosing Bamazon!");
          }
        );
        // Here we are getting everthing declared to add to product_sales
        var productSale;
        productSale = chosenId.price * answers.unitsToBuy;
        var newProductSale = productSale;
        for(var i = 0; i < result.length; i++) {
          // If the users input (answers.productId) is in the DB (result[i].product_id)
          // it will update the product_sales in the DB
          if(result[i].product_id === parseInt(answers.productId)) {
            newProductSale += result[i].product_sales;
          }
        }
        // Updating product_sales in products DB
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              product_sales: newProductSale
            },
            {
              product_id: chosenId.product_id
            }
          ],
          function(err) {
            if (err) throw err;
          }
        );
        // This else is for when the user orders more than bamazon has in stock
      } else {
        // This variable will hold the number of units left in stock
        var unitsLeft;
        for(var i = 0; i < result.length; i++) {
          // Once again checking if the users input (answers.productId) is in the DB (result[i].product_id)
          if(result[i].product_id === parseInt(answers.productId)) {
            // If so set unitsLeft to the units left in stock (stock_quantity)
            unitsLeft = result[i].stock_quantity;
          }
        }
        // Display to user that there are only x units left in stock
        console.log("Sorry! There are only " + unitsLeft + " units left in stock.");
      }
      // Ending the connection
      connection.end();
    });
  })
}

// The readProducts function will display everything in the DB
function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    // Creating a new table
    var table = new Table({
      head: ["Product ID".headder, "Product Name".headder, "Product Price".headder, "Units in Stock".headder],
      colWidths: [12, 25, 15, 20]
    });
    if(err) throw err;
    for(var i = 0; i < res.length; i++) {
      // Pushing all the info from the DB into the new table
      table.push(
        [res[i].product_id, res[i].product_name, res[i].price, res[i].stock_quantity]
      );
    }
    // Displaying the table
    console.log(table.toString());
    // Ending the connection
    connection.end();
  });
}