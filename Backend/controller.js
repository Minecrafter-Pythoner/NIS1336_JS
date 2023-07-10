
//Access-Control-Allow-Origin: any;
const svr = require('./services')

const login =  async (req, res) => {
    const { username, password } = req.body;
    const rst = await svr.loginUser(username, password);
    if(rst > 0) {
        req.session = req.session || '' ;
        req.session.user = rst;
        res.status(200);
        res.redirect('/dashboard');
    } else {
        res.status(401);
        res.send('Login failed');
    }
}

const changePassword =  async (req, res) => {
    const { userId, newPassword } = req.body;
    const rst = await svr.changePassword(userId, newPassword);
    if(rst){
        res.status(200);
        res.send('Password Changed Successfully');
    } else {
        res.status(404);
        res.send('Failed to change password');
    }
    // Send appropriate response to the client
}

const addTask = (req, res) => {
    const userId = req.session.user;    
    const {name, startTime, priority, category, reminderTime} = req.body;
    svr.addTask(name, startTime, priority, category, reminderTime, userId);
    res.send('Success')
    // Send appropriate response to the client
}

const showTaskByDate = (req, res) => {
    const { date } = req.params;
    svr.showTaskByDate(date);
    // Send appropriate response to the client
}

const deleteTask =  async (req, res) => {
    const { taskId } = req.body;
    const rst = await svr.deleteTask(taskId);
    if(rst){
        res.status(200);
        res.send(`Deleted task ${taskId} successfully.`)
    }
    else{
        res.status(404);
        res.send(`Could not delete task ${taskId}.`)
    }
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
    svr.sendReminder(userId, reminderMessage);
    // Send appropriate response to the client
}

async function queryTasks(req, res){
    console.log('1');
    const userId = req.session.user;
    const result = await svr.queryTasks(userId);
    console.log(JSON.stringify(result));
    res.send(result);
}


const register = (req, res) => {
    const {username, password} = req.body;
    svr.addUser(username, password);
    res.send('Success')
}


module.exports = {
    login,
    register,
    changePassword,
    addTask,
    showTaskByDate,
    deleteTask,
    reminders,
    queryTasks,
    sendReminder,
    register
}