DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NULL,
	department_name VARCHAR(100) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL,
	PRIMARY KEY (item_id)
);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Jeep Wrangler", "Automotive", 30299.99, 30);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Macbook Pro", "Electronics", 1299, 130);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("iPhone XR", "Electronics", 799, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("LG OLED 55\" TV", "Electronics", 689, 21);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Broncos New Era Hat", "Clothing", 21.99, 4);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Beats Bluetooth Headset", "Electronics", 299, 130);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Cofee Mug - Game of Thrones", "Home", 18.99, 130);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Google Home Mini", "Electronics", 49.99, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Sperry Mens Shoes", "Shoe", 49.99, 13);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("XBOX One", "Electronics", 399, 24);

SELECT * FROM products;
