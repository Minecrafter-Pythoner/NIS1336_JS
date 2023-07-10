const express = require('express');
const router = express.Router();
const path = require('path');
// Import the backend functions
const {
  loginUser,
  changePassword,
  addTask,
  showTaskByDate,
  deleteTask,
  scheduleReminder,
  sendReminder,
} = require('./services');      

const ctrl = require('./controller')
const auth = require('./auth')

// Define routes and map them to the corresponding functions

// Route for user login
router.post('/login', ctrl.login);

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route for changing password
router.post('/change-password', ctrl.changePassword);

// Route for adding a task
//router.post('/add-task', auth.checkUser, ctrl.addTask);
router.post('/add-task', auth.checkUser, ctrl.addTask);

// Route for showing tasks by date
router.get('/tasks/:date', auth.checkUser, ctrl.showTaskByDate);

// Route for deleting a task
//router.delete('/tasks/:taskId', auth.checkUser, ctrl.deleteTask);
router.delete('/tasks', auth.checkUser, ctrl.deleteTask);


// Route for scheduling a reminder
router.post('/tasks/:taskId/reminders', ctrl.reminders);

// Route for sending a reminder
router.post('/users/:userId/reminders', ctrl.sendReminder);

router.get('/query-tasks', ctrl.queryTasks);

// Export the router
module.exports = router;
