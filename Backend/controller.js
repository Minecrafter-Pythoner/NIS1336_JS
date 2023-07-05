
//Access-Control-Allow-Origin: any;
const svr = require('./services')
const login =  async (req, res) => {
    const { username, password } = req.body;
    const rst = await svr.loginUser(username, password);
    console.log('controller')
    if(rst) {
        req.session = req.session || '' 
        req.session.user = username
        res.status(200)
        res.send('loggedin')
    } else {
        res.status(401)
        res.send('login fail')
    }
    
    // Send appropriate response to the client
}

const changePassword = (req, res) => {
    const { userId, newPassword } = req.body;
    changePassword(userId, newPassword);
    // Send appropriate response to the client
}

const addTask = (req, res) => {    
    const { name, startTime, priority, category, reminderTime } = req.body;
    svr.addTask(name, startTime, priority, category, reminderTime);
    res.send('Success')
    // Send appropriate response to the client
}

const showTaskByDate = (req, res) => {
    const { date } = req.params;
    showTaskByDate(date);
    // Send appropriate response to the client
}

const deleteTask = (req, res) => {
    const { taskId } = req.params;
    deleteTask(taskId);
    // Send appropriate response to the client
}

const reminders =  (req, res) => {
    const { taskId } = req.params;
    const { reminderTime } = req.body;
    scheduleReminder(taskId, reminderTime);
    // Send appropriate response to the client
}

const sendReminder = (req, res) => {
    const { userId } = req.params;
    const { reminderMessage } = req.body;
    sendReminder(userId, reminderMessage);
    // Send appropriate response to the client
}

const register = (req, res) => {

}

module.exports = {
    login,
    changePassword,
    addTask,
    showTaskByDate,
    deleteTask,
    reminders,
    sendReminder
}