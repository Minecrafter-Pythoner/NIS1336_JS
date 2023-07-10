const sqlite3 = require('sqlite3').verbose();

// Middleware function to check if the user exists
function checkUser(req, res, next) {
  if(req.session && req.session.user) next()
  else {
    res.status(401)
    res.send("401 Unauthorized")
  }
}

async function authorizeUser(req, res, next) {
  if(req.session && req.session.user) {
    const userId = req.session.user;
    next(userId);
  }
  else {
    res.status(401)
    res.send("401 Unauthorized")
  }

}

// Export the middleware function(s)
const auth = {
  checkUser,
  authorizeUser
};
module.exports = auth;
