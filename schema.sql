CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
item_id integer auto_increment primary key not null,
product_name varchar(150) not null,
department_name varchar(150) not null,
price decimal(10,2) null
stock_quantity integer not null
);

SELECT * FROM products;