const express = require('express');
const session = require('express-session')
const app = express();
const port = 3000;

// Set up middleware, such as body-parser, to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./'));

app.use(
  session({
    secret: 'secretKey', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Import and use the router
const router1 = require('./router');
app.use('/', router1);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
