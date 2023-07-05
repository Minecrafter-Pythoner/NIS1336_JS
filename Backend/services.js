const sqlite3 = require("sqlite3").verbose();

function openDatabase() {
    // Specify the path to your SQLite .db file
    const dbPath = './data/data.db';
    // Create a new SQLite database object
    const db = new sqlite3.Database(dbPath);
    // Return the database object
    return db;
}

function initialize() {
    const db = openDatabase();
  
    db.serialize(() => {
      // Execute SQL statements to create the tables
      db.run(`
        CREATE TABLE IF NOT EXISTS Tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          startTime TEXT NOT NULL,
          priority TEXT,
          category TEXT,
          reminderTime TEXT,
          user INTEGER, 
          done BOOL
        )
      `);
  
      db.run(`
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);
    });
  
    db.close();
}
 
function addUser(username, password) {
    const db = openDatabase();
  
    // Prepare the SQL statement with placeholders for the username and password
    const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
    const values = [username, password];
  
    // Execute the prepared statement with the provided values
    db.run(sql, values, function (err) {
      if (err) {
        console.error('Error adding user:', err);
      } else {
        console.log('User added successfully!');
        console.log('User ID:', this.lastID);
      }
    });
  
    db.close();
}

function addTask(name, startTime, priority, category, reminderTime) {
    const db = openDatabase();
  
    const sql = `
      INSERT INTO Tasks (name, startTime, priority, category, reminderTime)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, startTime, priority, category, reminderTime];
  
    db.run(sql, values, function (err) {
      if (err) {
        console.error('Error adding task:', err);
      } else {
        console.log('Task added successfully!');
        console.log('Task ID:', this.lastID);
      }
    });
  
    db.close();
}
  
function showTaskByDate(date) {
    const db = openDatabase();
  
    const sql = `
      SELECT *
      FROM Tasks
      WHERE DATE(startTime) = DATE(?)
      ORDER BY startTime
    `;
    const values = [date];
  
    db.all(sql, values, function (err, rows) {
      if (err) {
        console.error('Error retrieving tasks:', err);
      } else {
        console.log('Tasks for', date + ':');
        rows.forEach((row) => {
          console.log(row.name, row.startTime);
        });
      }
    db.close();
    });
  
    //db.close();
}

function deleteTask(taskId) {
    const db = openDatabase();
  
    const sql = 'DELETE FROM Tasks WHERE id = ?';
    const values = [taskId];
  
    db.run(sql, values, function (err) {
      if (err) {
        console.error('Error deleting task:', err);
      } else {
        console.log('Task deleted successfully!');
      }
    });
  
    db.close();
}

function loginUser(username, password) {
    const db = openDatabase();
  
    const sql = 'SELECT id FROM Users WHERE username = ? AND password = ?';
    const values = [username, password];
  
    db.get(sql, values, function (err, row) {
      if (err) {
        console.error('Error authenticating user:', err);
      } else if (row) {
        console.log('User authenticated!');
        console.log('User ID:', row.id);
      } else {
        console.log('Invalid credentials!');
      }
    });
  
    db.close();
  }
  
  function changePassword(userId, newPassword) {
    const db = openDatabase();
  
    const sql = 'UPDATE Users SET password = ? WHERE id = ?';
    const values = [newPassword, userId];
  
    db.run(sql, values, function (err) {
      if (err) {
        console.error('Error changing password:', err);
      } else {
        console.log('Password changed successfully!');
      }
    });
  
    db.close();
}

function scheduleReminder(taskId, reminderTime) {
    // Implement your logic to schedule reminders here
    // This function may involve external libraries or services to handle reminders
    // You can integrate with a notification service or schedule tasks in the server
  
    console.log('Reminder scheduled for Task ID:', taskId);
}
  
  function sendReminder(userId, reminderMessage) {
    // Implement your logic to send reminders to the user
    // This function may involve sending emails, push notifications, or other forms of notifications
  
    console.log('Reminder sent to User ID:', userId);
}

const services = {
    initialize,
    addUser,
    addTask,
    showTaskByDate,
    deleteTask,
    loginUser,
    changePassword,
    scheduleReminder,
    sendReminder,
  };
  
  // Export the services object
  module.exports = services;

module.exports = services;
