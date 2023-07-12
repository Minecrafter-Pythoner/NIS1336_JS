const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require('crypto-js');
const sqlite = require("sqlite");

const dbPath = './data/data.db';
const sqlPath = './data/data.sqlite';

const key = "ToDo";

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
  const db = await openDB();

  // Prepare the SQL statement with placeholders for the username and password
  const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
  var encryptedPassword = CryptoJS.SHA256(password).toString();
  const values = [username, encryptedPassword];
  // console.log(encryptedPassword);

  try {
    const row = await db.get(sql, values);
    console.log('User added successfully!');
    console.log('User ID:', this.lastID);
  } catch (err) {
    console.error('Error adding user:', err);
    throw (err);
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
  let rst = [];

  const sql = `
    SELECT * FROM Tasks WHERE startTime like '${date}%'
  `;

  try {
    const rows = await db.all(sql);
    //console.log(rows);
    rst = rows.map((row) => {
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

    console.log('Shown Tasks By Date!');
  } catch (err) {
    console.log(err);
    throw(err);
  } finally {
    db.close;
    return rst;
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
  const encryptedPassword = CryptoJS.SHA256(password).toString();
  const values = [username, encryptedPassword];

  try {
    const row = await db.get(sql, values);
    //console.log(row);

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
  const encryptedNewPassword = CryptoJS.SHA256(newPassword).toString();
  const values = [newPassword, userId];
  let rst = false;

  try {
    await db.get(sql, values);
    console.log('Password changed successfully!');
    rst = true;
  } catch (err) {
    console.log('Error changing password: ', err);
    throw (err);
  } finally {
    db.close();
    return rst;
  }
}

async function checkTaskUser(taskId, userId) {  // Retrieve the username and password from the request body or headers

  // Open the database connection
  const db = await openDB();
  const sql = `SELECT * from Tasks WHERE id = ${taskId} and user = ${userId}`
  // const values = [taskId, userId];
  let rst = false;

  try {
    const row = await db.get(sql);
    rst = (row.length !== 0);
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
  return rst;
}

async function queryTasks(user) {
  const db = await openDB();

  const sql = 'SELECT * FROM Tasks WHERE user = ?';
  const values = [user];

  try {
    const rows = await db.all(sql, values);
    const tasks = rows.map((row) => {
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
  queryTasks,
  checkTaskUser
};

// Export the services object
initialize()

module.exports = services;
