require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err;
    searchProducts();
});

var productList = [];

function searchProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID | Product | Department | Price | Stock");
        for (var i in res) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            productList.push(res[i].product_name);
        };
        selectProduct();
    });
}

function selectProduct() {
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "Which product would you like to buy?",
                name: "productToBuy",
                choices: productList
            },
            {
                type: "number",
                message: "How many would you like to buy?",
                name: "quantityToBuy"
            }
        ])
        .then(function (response) {
            var productToBuy = response.productToBuy;
            var quantityToBuy = response.quantityToBuy;
            var index = productList.indexOf(productToBuy)
            var databaseIndex = index + 1;
            connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?', { item_id: databaseIndex }, (err, res) => {
                if (err) throw err;
                var stock = res[0].stock_quantity;
                var price = res[0].price;

                if (quantityToBuy > stock) {
                    console.log("Insufficient quantity! Only " + stock + " available\n----------\n");
                    connection.end();
                }
                else {
                    var newStock = stock - quantityToBuy;
                    connection.query('UPDATE products SET stock_quantity=?, items_sold=? WHERE item_id=?', [newStock, quantityToBuy, databaseIndex], (err, res) => {
                        if (err) throw err;
                        console.log("Order confirmed! Your total is: " + price * quantityToBuy + " dollars \n----------\n");
                        connection.end();
                    }

                    )
                    
                }

            }
            )
        })
        
}


