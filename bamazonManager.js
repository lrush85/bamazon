// Dependancies
var inquirer = require('inquirer');
var mysql = require('mysql');
require('dotenv').config();

// Connection to SQL bamazon database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DEFAULT_MYSQL_ADMIN_PASSWORD,
    database: 'bamazon'
});

// Creates a connection
connection.connect(function (error) {
    if(error) throw error;
    displayQuestion();
});
        
function displayQuestion() {
    inquirer
        .prompt(
            {
                name: 'doSomething',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT'],
            }
        ).then(function(answer) {
            if(answer.doSomething === "View Products for Sale") {
                displayProducts();
            } else if (answer.doSomething === "View Low Inventory"){
                displayLowInventory();
            } else if(answer.doSomething === "Add to Inventory") {
                addToInventory();
            } else if(answer.doSomething === "Add New Product") {
                addNewProduct();
            } else if (answer.doSomething === "EXIT") {
                connection.end();
            }
        });
}

    function displayProducts() {
        console.log(`
            Bamazon's Current Inventory
        `);
        // Display all products
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            res.forEach(product => {
                console.log(`Item#: ${product.item_id}, Product: ${product.product_name}, Department: ${product.department_name}, Price: ${product.price}, Quantity: ${product.stock_quantity} `);
            });
            displayQuestion();
        });
    }

    function displayLowInventory() {
        console.log(`
            Bamazon's Current Low Inventory
        `);
        // Display all products
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            res.forEach(product => {
                if(product.stock_quantity <= 10) {
                    console.log(`Item#: ${product.item_id}, Product: ${product.product_name}, Department: ${product.department_name}, Price: ${product.price}, Quantity: ${product.stock_quantity} `);
                }
            });
            displayQuestion();
        });
    }

    function addToInventory () {
        
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            

            inquirer
              .prompt([
                {
                    name: 'chosenItem',
                    type: 'input',
                    message: "What product would you like to add (please choose the item ID)?",
                },
                {
                  name: "increaseQuantity",
                  type: "input",
                  message: "How much would you like to add?",
                },
              ])
              .then(function(answer) {
                for (var i = 0; i < res.length; i++) {
                    result = res[i];
                
                let chosen = parseInt(answer.chosenItem);
                let amount = parseInt(answer.increaseQuantity);
                // var increaseStock = result.stock_quantity + parseInt(answer.increaseQuantity);

                if(chosen == result.item_id) {
                    console.log(`You have successfully added ${answer.increaseQuantity} to ${result.product_name}. `);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: result.stock_quantity = result.stock_quantity + amount,
                        },
                        {
                            item_id: chosen,
                        },
                    ],
                    function(err) {
                        if(err) throw err;

                    });
                    // End of if statement
                }
            }
                
                    displayQuestion();
                
          });
        });

          //End of function
    }

    function addNewProduct() {
        console.log(`
            Adding to Bamazon's Inventory
        `);
        
        inquirer
        .prompt([
            {
                name: 'addProduct',
                type: 'input',
                message: 'What is your product?',
            },
            {
                name: 'addDepartment',
                type: 'input',
                message: 'What is department do you want to locate your product?',
            },
            {
                name: 'addPrice',
                type: 'input',
                message: 'What is the cost of your product?',
            },
            {
                name: 'addQuantity',
                type: 'input',
                message: 'How many do you want to stock?',
            },
        ]).then(function(answer) {
            price = parseFloat(answer.addPrice);
            quantity = parseFloat(answer.addQuantity);
            var addInventory = [answer.addProduct, answer.addDepartment, price, quantity];
            console.log(addInventory);

            connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.addProduct,
                department_name: answer.addDepartment,
                price: price,
                stock_quantity: quantity,
            },
                function(err) {
                    if(err) throw err;
                   
                });   

                console.log(`You just added ${answer.addProduct} to Bamazon Inventory.  You have ${quantity} in stock.`)
                displayQuestion();
        });
    }