var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createconnection({
	host: 'loclahost'
	port: 3306,

	user: 'root',
	password: '',
	database: 'bamazon'
});


function Input(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Integer entered must be greater then 1.';
	}
};


function userPrompt() {
	inquirer.prompt([
	{
		type: 'input',
		name: 'item_id',
		message: 'Enter ID number of item picked.',
		validate: Input
		filter: Number
	},

	{
		type: 'input',
		name: 'quantity',
		message: 'How many of this item would you like to purchase?',
		validate: Input,
		filter: Number
	}
	]).then(function(input) {

		var item = input.item_id;
		var quantity = input.quantity;

		var queryString = 'SELECT * FROM products WHERE ?';

		connection.query(queryString, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('Item ID not valid. A valid Item ID must be entered.');
				displayItems();

			} else {
				var productData = data[0];

				
				if (quantity <= productData.stock_quantity) {
					console.log('Your order is being place!');

					
					var updateQuery = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

					
					connection.query(updateQuery, function(err, data) {
						if (err) throw err;

						console.log('Your order has been completed! Your total is $' + productData.price * quantity);
						console.log('Bamazon thanks you for you purchase!');

						
						connection.end();
					})
				} else {
					console.log('Are there enough Products? Selecting a smaller quantity will help.');

					displayInventory();
				}
			}
		})
	})
}



function displayItems() {
	
	queryString = 'SELECT * FROM products';


	connection.query(queryString, function(err, data) {
		if (err) throw err;

		console.log('Items now available for sale: ');

		var stringList = '';
		for (var i = 0; i < data.length; i++) {
			stringList = '';
			stringList += 'Item ID: ' + data[i].item_id + '\n';
			stringList += 'Product Name: ' + data[i].product_name + '\n';
			stringList += 'Department: ' + data[i].department_name + '\n';
			stringList += 'Price: $' + data[i].price + '\n';

			console.log(stringList);
		}

	  	
	  	promptUser();
	})
}

function runApp() {
	displayItems();
}

runApp();