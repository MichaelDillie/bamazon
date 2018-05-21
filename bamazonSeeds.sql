DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

-- PRODUCTS TABLE --
CREATE TABLE products(
  product_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(30),
  price INT NULL,
  stock_quantity INT NULL,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (product_id)
);

-- DEPARTMENTS TABLE --
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30),
  over_head_cost INT NULL,
  PRIMARY KEY (department_id)
);

-- PRODUCTS --
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Goldfish", "Animals", 2, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Soccer Ball", "Sports", 15, 500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Football", "Sports", 10, 900);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Ping Pong Balls", "Sports", 8, 600);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Electronics", 1300, 5000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Electronics", 30, 1500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Phone", "Electronics", 500, 3000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Golf Ball", "Sports", 20, 10000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Tablet", "Electronics", 350, 1000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Lawn Darts Set", "Sports", 35, 200);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Shoes", "Clothing", 200, 4);

-- DEPARTMENTS --
INSERT INTO departments(department_name, over_head_cost)
VALUES ("Electronics", 10000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("Clothing", 60000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("Sports", 9000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("Animals", 1000);