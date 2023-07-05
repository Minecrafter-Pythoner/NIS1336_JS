
//Access-Control-Allow-Origin: any;

const login =  (req, res) => {
    const { username, password } = req.body;
    loginUser(username, password);
    // Send appropriate response to the client
}

const changePassword = (req, res) => {
    const { userId, newPassword } = req.body;
    changePassword(userId, newPassword);
    // Send appropriate response to the client
}

const addTask = (req, res) => {
    const { name, startTime, priority, category, reminderTime } = req.body;
    addTask(name, startTime, priority, category, reminderTime);
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