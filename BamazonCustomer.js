var mysql = require("mysql");
var prompt = require('prompt');
//var db = require('./database.js');

var db = mysql.createConnection ({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "Bamazon"
});

//Connect to the database
db.connect(function(err) {
	if (err) throw err;
	console.log("Connected to thread: " + db.threadId + " ------------------------------------------------------------- \n");
});


//db.connect();
prompt.start();

//Display all of the items available for sale. Include the ids, names, and prices of products for sale.
function listProducts () {
	db.query("SELECT * FROM Products WHERE StockQuantity > 0", function(err, result) {
		if (err) throw err;

		console.log("List of Available Products");

		for (i=0; i < result.length; i++) {
			console.log(result[i].ItemID + ", " + result[i].ProductName + ",  " + result[i].DepartmentName + ",  $" + parseFloat(result[i].Price).toFixed(2) + " (In Stock: " + result[i].StockQuantity + ")");
		}

		console.log("\n");

		//Prompt the customer to place an order
		promptOrder();
	});
}

//Prompt users with two messages:
//	* The first should ask them the ID of the product they would like to buy. 
//	* The second message should ask how many units of the product they would like to buy.

function promptOrder() {
	prompt.get(['ProductID', 'Quantity'], function(err, result) {
		var id = result.ProductID;
		var qty = parseInt(result.Quantity);

		if (id == 0 || qty == 0) {
			console.log("Exiting..........\n");
			return;
		}

		db.query('SELECT * FROM Products WHERE ItemID = ?', [id], function(err, result) {
			if (err) throw err;

			var item = result[0];
			checkAvailability(item, qty);
		});
	});
}

//Check if your store has enough of the product to meet the customer's request. 
//	* If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
//However, if your store does have enough of the product, you should fulfill the customer's order. 
function checkAvailability(item, qty) {
	console.log(item, qty);
	var newStockQty = item.StockQuantity - qty

	// if the item is available, place the order, otherwise, let the user know the item is out of stock
	if (newStockQty > 0) {
		placeOrder(item, qty);
	} else {
		console.log("Sorry, but there are not enough of the item in stock. There are " + item.StockQuantity + " items available.")
		promptOrder();
	}
}

//	* This means updating the SQL database to reflect the remaining quantity.
//	* Once the update goes through, show the customer the total cost of their purchase.
function placeOrder(item, qty) {
	var newStockQty = item.StockQuantity - qty

	db.query("UPDATE Products SET StockQuantity=? WHERE ItemID=?", [newStockQty, item.ItemID], function(err, result){
	 	if (err) throw err;
		var total = qty * item.Price;

		console.log("Your order for " + item.ProductName + " has been placed. Your total is $" + total + ".\nThank you for shopping at Bamazon!")
		console.log("New Stock Quantity for " + item.ProductName + " is: " + newStockQty);

		promptOrder();
	});
}

//Start the app -------------------------------------------------------------
listProducts();


