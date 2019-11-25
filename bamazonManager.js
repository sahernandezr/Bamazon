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
    selectOption();
});

function selectOption() {
    inquirer.
    prompt([
        {
            type: "list",
            message: "What do you want to do?",
            name: "option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(response) {
        switch(response.option) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    }    
    )
}

var productList = [];

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID | Product | Department | Price | Stock");
        for (var i in res) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            productList.push(res[i].product_name); 
               
        };
        //console.log(productList)
    });
}

function viewLowInventory () {
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?", [0,4], (err, respo) => {
        if (err) throw err;
        for (var i in respo) {
            console.log(respo[i].item_id + " | " + respo[i].product_name + " | " + respo[i].department_name + " | " + respo[i].price + " | " + respo[i].stock_quantity);
        }
        console.log("\n----------------\n");
    });
}

function addInventory() {
    console.log("something");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID | Product | Department | Price | Stock");
        for (var i in res) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            productList.push(res[i].product_name);
         };
    

    inquirer
    .prompt([
        {
            type: "rawlist",
            message: "Which product would you like to increase?",
            name: "increaseProduct",
            choices: productList
        },
        {
            type: "number",
            message: "How many would you like to add to the stock?",
            name: "addStock"
        }
    ])
    .then(function(response) {
        console.log(response);
        // var increaseProduct = response.increaseProduct;
        // var index = productList.indexOf(increaseProduct);
        
        
        // connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: index}, (err,res) => {
        //     if (err) throw err;
        //     var currentStock = res[0].stock_quantity;
        //     console.log("Current Stock is: "+currentStock)
        // })
    
        // var addStock = currentStock + response.addStock;

        // connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [addStock,index], (err,res) => {
        //     if (err) throw err;
        //     console.log("Stock of" + increaseProduct + " increased by "+response.addStock);
        // }

        // )
    })
});
}

function addNewProduct() {
    //should allow the manager to add a completely new product to the store.
    console.log("Add New Product");
}