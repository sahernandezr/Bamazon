require("dotenv").config();
var mysql = require("mysql");

var connection = mysql.createConnection({ 
    host : process.env.DB_HOST,
    port: process.env.DB_PORT, 
    user : process.env.DB_USER, 
    password : process.env.DB_PASS, 
    database : process.env.DB_NAME });

connection.connect(function (err) {
    if (err) throw err;
    searchProducts();
    connection.end();
});

function searchProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("ID | Product | Department | Price | Stock");
        for (var i in res) {
            console.log(res[i].item_id+" | "+res[i].product_name+" | "+res[i].department_name+" | "+res[i].price+" | "+res[i].stock_quantity);
        };
});
};
