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
  prodcut_sales INT DEFAULT 0,
  PRIMARY KEY (product_id)
);

-- DEPARTMENTS TABLE --
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30),
  over_head_cost INT NULL,
  prodcut_sales INT DEFAULT 0,
  PRIMARY KEY (department_id)
);

-- PRODUCTS --
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("goldfish", "animals", 2, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("soccer ball", "sports", 15, 500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("football", "sports", 10, 900);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("ping pong balls", "spots", 8, 600);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("laptop", "electronics", 1300, 5000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("headphones", "electronics", 30, 1500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("google pixel", "electronics", 500, 3000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("golf ball", "sports", 20, 10000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("tablet", "electronics", 350, 1000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("lawn darts set", "sports", 35, 200);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("shoes", "clothing", 200, 4);

-- DEPARTMENTS --
INSERT INTO departments(department_name, over_head_cost)
VALUES ("electronics", 10000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("clothing", 60000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("sports", 9000);

INSERT INTO departments(department_name, over_head_cost)
VALUES ("animals", 1000);