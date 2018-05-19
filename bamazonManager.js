var mysql = require('mysql');
var inquirer = require('inquirer');

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
})

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
      message: "Select an option"
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
          // newProduct();
          break;
      }
    });
}

function productsForSale() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    for(var i = 0; i < res.length; i++) {
      console.log("---------------------------------");
      console.log("Product ID - " + res[i].id);
      console.log("Product Name - " + res[i].product_name);
      console.log("Product Price - $" + res[i].price);
      console.log("Units in Stock - " + res[i].stock_quantity);
    }
    connection.end();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    for(var i = 0; i < res.length; i++) {
      if(res[i].stock_quantity < 5) {
        console.log("----------LOW INVENTORY----------");
        console.log("Product ID - " + res[i].id);
        console.log("Product Name - " + res[i].product_name);
        console.log("Product Price - $" + res[i].price);
        console.log("Units in Stock - " + res[i].stock_quantity);
      }
    }
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
          if(res[i].id === parseInt(answers.addToId)) {
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
              id: answers.addToId
            }
          ],
          function(err) {
            if (err) throw err;
            console.log("Units Have Been Added");
          }
        );
        connection.end();
      });
  })
}