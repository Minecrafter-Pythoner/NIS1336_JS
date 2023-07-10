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
    filename: sqlPath,
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
  const db = await openDB();

  // Prepare the SQL statement with placeholders for the username and password
  const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
  const values = [username, password];

  try {
    const row = await db.get(sql, values);
    console.log('User added successfully!');
    console.log('User ID:', this.lastID);
  } catch (err) {
    console.error('Error adding user:', err);
  } finally {
    db.close();
  }
}


async function addTask(name, startTime, priority, category, reminderTime, userId) {
  const db = await openDB();
  let rst = false;

  const sql = `
      INSERT INTO Tasks (name, startTime, priority, category, reminderTime, user, done)
      VALUES (?, ?, ?, ?, ?, ?, false)
    `;
  const values = [name, startTime, priority, category, reminderTime, userId];

  try {
    await db.get(sql, values);
    console.log('Task added successfully!');
    console.log('Task ID:', this.lastID);
    rst = true;
  } catch (err) {
    console.error('Error adding task:', err)
  } finally {
    db.close();
  }
  return rst;
}

async function showTaskByDate(date) {
  const db = await openDB();

  const sql = `
    SELECT *
    FROM Tasks
    WHERE DATE(startTime) = DATE(?)
    ORDER BY startTime
  `;
  const values = [date];

  try {
    const rows = db.get(sql, values);
    console.log(rows);

    console.log('Shown Tasks By Date!');
    rst = rows;
  } catch (err) {
    console.log(err);
  } finally {
    db.close;
  }
}

async function deleteTask(taskId) {//ERR: Not working as expected: always log deleted successfully but actually did not delete the task
  const db = await openDB();

  const sql = 'DELETE FROM Tasks WHERE id = ?';
  const values = [taskId];
  let rst = false;

  try {
    const row = await db.get(sql, values);
    console.log(row);

    console.log('Successfully deleted Task ', taskId, '! ');
    rst = true;
  } catch (err) {
    console.error('Error deleting task:', err);
  } finally {
    db.close();
  }
  return rst;
}


async function loginUser(username, password) {//ERR: Not working as expected always return true even if password is incorrect
  const db = await openDB();
  let rst = 0;
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
  const db = await openDB();

  const sql = 'UPDATE Users SET password = ? WHERE id = ?';
  const values = [newPassword, userId];
  let rst = false;

  try {
    await db.get(sql, values);
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


async function scheduleReminder(taskId, reminderTime) {
  // Implement your logic to schedule reminders here
  // This function may involve external libraries or services to handle reminders
  // You can integrate with a notification service or schedule tasks in the server

  console.log('Reminder scheduled for Task ID:', taskId);
}

async function sendReminder(userId, reminderMessage) {
  // Implement your logic to send reminders to the user
  // This function may involve sending emails, push notifications, or other forms of notifications

  console.log('Reminder sent to User ID:', userId);
}

async function checkUser(username, password) {  // Retrieve the username and password from the request body or headers

  // Open the database connection
  const db = await openDB();


  db.close();
  // Call the next middleware or route handler
  next();
  ;
}

async function queryTasks(user) {
  const db = await openDB();

  const sql = 'SELECT * FROM Tasks WHERE user = ?';
  const values = [user];

  try {
    const rows = await db.all(sql, values);
    const tasks = await rows.map((row) => {
      return {
        taskId: row.id,
        name: row.name,
        startTime: row.startTime,
        priority: row.priority,
        category: row.category,
        reminderTime: row.reminderTime,
        userId: row.user,
        done: row.done
      };
    });
    return JSON.stringify(tasks);
  } catch (err) {
    console.error('Error querying tasks:', err);
    return null;
  } finally {
    db.close();
  }
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
  queryTasks
};

async function register(username, password){
  const db = await openDB();
  let rst = false;
  const sql = `
    INSERT INTO Users (username, password)
    VALUES (?, ?)
  `
  const values = [username, password];

  try{
    await db.get(sql, values);
    console.log('User added successfully!');
    rst = true;
  } catch(err){
    console.error('Error adding user:', err)
  } finally {
    db.close();
  }
  return rst;
}

// Export the services object
initialize()

module.exports = services;
