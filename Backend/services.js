const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require('crypto-js');
const sqlite = require("sqlite");

const dbPath = './data/data.db';
const sqlPath = './data/data.sqlite';

// function openDB() {
//   // Create a new SQLite database object
//   //const db = new sqlite3.Database(dbPath);
//   const db = new sqlite.Database(sqlPath);
//   // Return the database object
//   return db;
// }

async function openDB() {
  return sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

async function initialize() {
  const db = await openDB();

  await db.run(`
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

  await db.run(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

  db.close();
}

async function addUser(username, password) {
  const db = openDB();

  // Prepare the SQL statement with placeholders for the username and password
  const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
  const values = [username, password];

  try {
    await new Promise((resolve, reject) => {
      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log('User added successfully!');
    console.log('User ID:', this.lastID);
  } catch (err) {
    console.error('Error adding user:', err);
  } finally {
    db.close();
  }
}


function addTask(name, startTime, priority, category, reminderTime) {
  const db = openDB();

  const sql = `
      INSERT INTO Tasks (name, startTime, priority, category, reminderTime, done)
      VALUES (?, ?, ?, ?, ?, false)
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

async function showTaskByDate(date) {
  const db = openDB();

  const sql = `
    SELECT *
    FROM Tasks
    WHERE DATE(startTime) = DATE(?)
    ORDER BY startTime
  `;
  const values = [date];

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    console.log('Tasks for', date + ':');
    rows.forEach((row) => {
      console.log(row.name, row.startTime);
    });
  } catch (err) {
    console.error('Error retrieving tasks:', err);
  } finally {
    db.close();
  }
}


async function deleteTask(taskId) {//ERR: Not working as expected: always log deleted successfully but actually did not delete the task
  const db = openDB();

  const sql = 'DELETE FROM Tasks WHERE id = ?';
  const values = [taskId];

  try {
    await new Promise((resolve, reject) => {
      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log('Task deleted successfully!');
    return true;
  } catch (err) {
    console.error('Error deleting task:', err);
    return false;
  } finally {
    db.close();
  }
}


async function loginUser(username, password) {//ERR: Not working as expected always return true even if password is incorrect
  const db = await openDB();
  console.log(db)
  let rst = 0
  const sql = 'SELECT id FROM Users WHERE username = ? AND password = ?';
  const values = [username, password];

  try {
    const row = await db.get(sql, values);
    console.log(row);
    
    console.log('User authenticated!');
    console.log('User ID:', row.id);
    rst = row.id;
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
  return rst;
}

async function changePassword(userId, newPassword) {//ERR: Not working as expected always return true even if invalid userId
  const db = openDB();

  const sql = 'UPDATE Users SET password = ? WHERE id = ?';
  const values = [newPassword, userId];
  let rst = false;

  try {
    await db.run(sql, values);
    console.log('Password changed successfully!');
    rst = true;
  } catch (err) {
    console.log('Error changing password: ', err);
  } finally {
    db.close();
    return rst;
  }

  // try {
  //   await new Promise((resolve, reject) => {
  //     let rst = false;
  //     db.run(sql, values, function (err) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  //   console.log('Password changed successfully!');
  //   rst = true;
  // } catch (err) {
  //   console.error('Error changing password:', err);
  // } finally {
  //   db.close();
  //   return rst;
  // }
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

function checkUser(username, password) {  // Retrieve the username and password from the request body or headers

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
initialize()

module.exports = services;
