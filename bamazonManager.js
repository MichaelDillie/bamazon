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
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ],
      message: "Select an option."
    }
  ])
    .then(function (answers) {
      switch (answers.choice) {
        case "View Products for Sale":
          productsForSale();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          newProduct();
          break;
      }
    });
}

// Setting themes for colors that will be used in the table
colors.setTheme({
  headder: ["cyan", "bold"],
  logged: ["green", "bold"]
});

// productsForSale will display all products in the DB
function productsForSale() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    // Creating a new table
    var table = new Table({
      head: ["Product ID".headder, "Product Name".headder, "Product Price".headder, "Units in Stock".headder],
      colWidths: [12, 25, 15, 20]
    });
    for(var i = 0; i < res.length; i++) {
      // Pushing all info from the DB into the new table
      table.push(
        [res[i].product_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
      );
    }
    // Displaying the table to the user
    console.log(table.toString());
    // Ending connection
    connection.end();
  });
}

// The lowInventory function will display any item with a stock lower than 5
function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Create new table
    var table = new Table({
      head: ["Product ID".headder, "Product Name".headder, "Product Price".headder, "Units in Stock".headder],
      colWidths: [12, 25, 15, 20]
    });
    for(var i = 0; i < res.length; i++) {
      if(res[i].stock_quantity < 5) {
        // Pushing all info from the DB into the new table
        table.push(
          [res[i].product_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
        );
      }
    }
    // Displaying the table to the user
    console.log(table.toString());
    // Ending connection
    connection.end();
  });
}

// The addInventory function will add inventory to the DB
function addInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    // Asks user the ID of the product to add stock to and how much stock to add
    inquirer
      .prompt([
        {
          type: "input",
          name: "addToId",
          message: "ID of Product"
        },
        {
          type: "input",
          name: "numberToAdd",
          message: "Units to Add"
        }
      ]).then(function(answers) {
        // Setting newUnitAmount to the users input (answers.numberToAdd)
        var newUnitAmount = parseInt(answers.numberToAdd);
        for(i = 0; i < res.length; i++) {
          // Checking if the uers input ID (answers.addToId) is in the DB
          if(res[i].product_id === parseInt(answers.addToId)) {
            // If so add the stock that is in the DB to newUnitAmount
            newUnitAmount += res[i].stock_quantity;
          }
        }
        var query = connection.query(
          // Updating the DB
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newUnitAmount
            },
            {
              product_id: answers.addToId
            }
          ],
          function(err) {
            if (err) throw err;
            // Display to the user that DB has been updated 
            console.log("Units Have Been Added.".logged);
          }
        );
        // Ending connection
        connection.end();
      });
  })
}

// The newProduct function will add a new product to the products table in the DB
function newProduct() {
  // An array to hold the departments that exist already
  departmentArrays = [];
  // Looping through departments
  connection.query("SELECT DISTINCT department_name FROM departments", function(err, res) {
    for(var i = 0; i < res.length; i++) {
      departmentArrays.push(res[i].department_name);
    }
  });
  // Asks the user for info to create new product
  inquirer
    .prompt([
      {
        type: "input",
        name: "productName",
        message: "Product Name"
      },
      {
        type: "list",
        name: "departmentName",
        choices: departmentArrays,
        message: "Department Name"
      },
      {
        type: "input",
        name: "productPrice",
        message: "Product Price"
      },
      {
        type: "input",
        name: "stockQuantity",
        message: "Units in Stock"
      }
    ]).then(function(answers) {
      // Inserting the users input into the products table in the DB
      var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.productName,
          department_name: answers.departmentName,
          price: answers.productPrice,
          stock_quantity: answers.stockQuantity
        },
        function(err) {
          if (err) throw err;
          // Display to user that the product was added
          console.log("Product Added.".logged);
        }
      );
      // Ending the connection
      connection.end();
  })
}