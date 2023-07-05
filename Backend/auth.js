const sqlite3 = require('sqlite3').verbose();

// Middleware function to check if the user exists
function checkUser(req, res, next) {
  if(req.session && req.session.user) next()
  else {
    res.status(401)
    res.send("401 Unauthorized")
  }
}

// Export the middleware function(s)
module.exports = {checkUser, };
