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
    displayProducts();
});

function displayProducts() {
    console.log(`
        Welcome to BAmazon, my online store.
    `);
    // Display all products
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        res.forEach(product => {
            console.log(`Item #: ${product.item_id}, Product: ${product.product_name}, Department: ${product.department_name}, Price: ${product.price}, Quantity: ${product.stock_quantity} `);
        });
        inquirer
            .prompt(
                {
                    name: 'doSomething',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: ['PURCHASE PRODUCT', 'EXIT'],
                }
            ).then(function(answer) {
                if(answer.doSomething === "PURCHASE PRODUCT") {
                    purchaseProducts();
                } else {
                    connection.end();
                }
            });
    });
}



function purchaseProducts () {

    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
            name: 'choice',
            type: 'input',
            message: "What item would you like to purchase?(choose item id)",
            },
            {
                name: "itemAmount",
                type: "input",
                message: "How how many would you like?",
            },
        ])
        .then(function(answer) {
            var choice = parseFloat(answer.choice);
            var itemAmount = parseFloat(answer.itemAmount);
            var result;
            for(var i = 0; i < res.length; i ++) {
                result = res[i];
            
                if (choice == result.item_id) {
                    console.log("Item choosen: " + result.product_name);
                    console.log("Purchase placed!  You have spent $" + (itemAmount * parseFloat(result.price)) + " today");
                    anotherPurchase();
                
                connection.query(
                    "UPDATE products SET ? WHERE ? ",
                    [
                        {
                            stock_quantity: result.stock_quantity = result.stock_quantity - itemAmount,
                        },
                        {
                            item_id: choice,
                        },
                    ],
                    function(err) {
                        if(err) throw err;
                    });   
                   
                } else if (result.stock_quantity <= 2) {
                    console("Insufficent amount, please choose another item");
                    purchaseProducts();
                }        
            }                  
        });    
    });
}


function anotherPurchase() {
    inquirer
        .prompt(
        {
        name: 'choice',
        type: 'list',
        message: "Would you like to purchase another item?",
        choices: ['YES', 'NO'],
        })
        .then(function(answer) {
            if(answer.choice == 'YES') {
                console.log('You choose to purchase another item');
                purchaseProducts();
            } else {
                console.log("Ok, thanks for your purchase! Have a beautiful day!");
                connection.end();
            }
        });
}