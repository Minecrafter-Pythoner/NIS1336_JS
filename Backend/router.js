const express = require('express');
const router = express.Router();
const path = require('path');

const ctrl = require('./controller')
const auth = require('./auth')

// Define routes and map them to the corresponding functions
router.get('/', (req, res) => {
  if (req.session && req.session.user) { res.redirect('/dashboard'); }
  else { res.redirect('/login'); }
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route for user login
router.post('/login', ctrl.login);

router.post('/signup', ctrl.register);

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard_2.html'));
});

// Route for changing password
router.post('/change-password',auth.checkUser, ctrl.changePassword);

// Route for adding a task
//router.post('/add-task', auth.checkUser, ctrl.addTask);
router.post('/add-task', auth.checkUser, ctrl.addTask);

// Route for showing tasks by date
router.get('/tasks', auth.checkUser, ctrl.showTaskByDate);

// Route for deleting a task
router.delete('/delete-task', auth.checkUser, ctrl.deleteTask);

router.get('/query-tasks', ctrl.queryTasks);

// Export the router
module.exports = router;
