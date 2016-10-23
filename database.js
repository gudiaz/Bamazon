exports.connect = function() {
	//Connect to the database
	db.connect(function(err) {
		if (err) throw err;
		console.log("Connected to thread: " + connection.threadId + " ------------------------------------------------------------- \n");
		return;
	};
};

