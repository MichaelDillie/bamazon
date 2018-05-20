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

connection.connect(function (err) {
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

colors.setTheme({
  headder: ["cyan", "bold"],
  logged: ["green", "bold"]
});

function productsForSale() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    var table = new Table({
      head: ["Product ID".headder, "Product Name".headder, "Product Price".headder, "Units in Stock".headder],
      colWidths: [12, 25, 15, 20]
    });
    for(var i = 0; i < res.length; i++) {
      table.push(
        [res[i].product_id, res[i].product_name, res[i].price, res[i].stock_quantity]
      );
    }
    console.log(table.toString());
    connection.end();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var table = new Table({
      head: ["Product ID".headder, "Product Name".headder, "Product Price".headder, "Units in Stock".headder],
      colWidths: [12, 25, 15, 20]
    });
    for(var i = 0; i < res.length; i++) {
      if(res[i].stock_quantity < 5) {
        table.push(
          [res[i].product_id, res[i].product_name, res[i].price, res[i].stock_quantity]
        );
      }
    }
    console.log(table.toString());
    connection.end();
  });
}

function addInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
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
        var newUnitAmount = parseInt(answers.numberToAdd);
        for(i = 0; i < res.length; i++) {
          if(res[i].product_id === parseInt(answers.addToId)) {
            newUnitAmount += res[i].stock_quantity;
          }
        }
        var query = connection.query(
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
            console.log("Units Have Been Added.".logged);
          }
        );
        connection.end();
      });
  })
}

function newProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "productName",
        message: "Product Name"
      },
      {
        type: "input",
        name: "departmentName",
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
          console.log("Product Added.".logged);
        }
      );
      connection.end();
  })
}

// function testing() {
//   connection.query("SELECT SUM(product_sales), department_name FROM products GROUP BY department_name", function(err, res) {
//     if (err) throw err;
//       for(var i = 0; i < res.length; i++) {
//         console.log(res[i]);
//       }
//     connection.end();
//   });
// }