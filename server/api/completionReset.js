const fs = require('fs');
const moment = require('moment');

const serverInfoPath = 'config/serverInfo.json';

// Initialize the previous goal completion date as a global variable
let previousResetDate;

async function updatePreviousResetDate() {
    // If server information does not exist, create a new one
    const currentDate = moment().format("YYYY-MM-DD");
    await fs.writeFileSync(serverInfoPath, JSON.stringify({ "previousResetDate": currentDate }));
    previousResetDate = currentDate;
}

// 
function initializeCompletionReset() {
    // 
    if (fs.existsSync(serverInfoPath)) {
        // Grab the date from JSON file stating the last time that goal completion was reset
        fs.readFile(serverInfoPath, 'utf8', function (error, data) {
            if (error) throw error;
            previousResetDate = JSON.parse(data).previousResetDate;
        });
    }
    else {
        updatePreviousResetDate();
    }
}

function handleCompletionReset(app, database) {
    // Every five seconds, check whether it is a new day. If it is, reset completion status on goals
    setInterval(async function () {
        // Grabs the current date for comparison
        const currentDate = moment().format("YYYY-MM-DD");

        // If the date is no longer a match, reset the completion status of goals
        if (currentDate != previousResetDate) {
            await resetCompletion(app, database);
            console.log(`${currentDate} :: Completion status of goals was reset!`)

            // Update the previous reset date to be today!     
            await fs.writeFileSync(serverInfoPath, JSON.stringify({ "previousResetDate": currentDate }));
        }
    }, 5000);
}

// 
function resetCompletion(app, database) {
    // Do a query check:
    // if reset = "daily"
    // if reset = current day of week (0-6)
    // if reset = day of month (01-31)
    // (with consideration for days with fewer months)
}

module.exports = { updatePreviousResetDate, initializeCompletionReset, handleCompletionReset }