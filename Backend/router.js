const express = require('express');
const router = express.Router();

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

// Route for changing password
router.post('/change-password', ctrl.changePassword);

// Route for adding a task
router.post('/add-task', auth.checkUser, ctrl.addTask);

// Route for showing tasks by date
router.get('/tasks/:date', ctrl.showTaskByDate);

// Route for deleting a task
router.delete('/tasks/:taskId', ctrl.deleteTask);

// Route for scheduling a reminder
router.post('/tasks/:taskId/reminders', ctrl.reminders);

// Route for sending a reminder
router.post('/users/:userId/reminders', ctrl.sendReminder);

// Export the router
module.exports = router;
