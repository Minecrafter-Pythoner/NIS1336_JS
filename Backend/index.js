const express = require('express');
const app = express();
const port = 3000;

// Set up middleware, such as body-parser, to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and use the router
const router = require('./router');
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
