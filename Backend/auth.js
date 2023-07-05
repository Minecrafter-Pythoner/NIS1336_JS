const sqlite3 = require('sqlite3').verbose();

// Middleware function to check if the user exists
function checkUser(req, res, next) {
  // Retrieve the username and password from the request body or headers
  const { username, password } = req.body;

  // Open the database connection
  const db = new sqlite3.Database('./data/data.db');

  // Prepare the SQL statement to retrieve the user by username and password
  const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  const values = [username, password];

  // Execute the prepared statement
  db.get(sql, values, (err, row) => {
    if (err) {
      // Handle any database error
      console.error('Error retrieving user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If the user is not found or the credentials are incorrect, send an error response
    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Attach the user object to the request object for further processing
    req.user = row;

    // Close the database connection
    db.close();

    // Call the next middleware or route handler
    next();
  });
}

// Export the middleware function(s)
module.exports = {checkUser, };
