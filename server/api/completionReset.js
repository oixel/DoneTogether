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

// 
async function handleCompletionReset(database) {
    // Grabs the current date for comparison
    const currentDate = moment().format("YYYY-MM-DD");

    // If the date is no longer a match, reset the completion status of goals
    if (currentDate != previousResetDate) {
        await resetCompletion(database);
        console.log(`${currentDate} :: Completion status of goals was reset!`)

        // Update the previous reset date to be today!     
        await fs.writeFileSync(serverInfoPath, JSON.stringify({ "previousResetDate": currentDate }));
    }
}

// 
async function resetCompletion(database) {
    // Do a query check:
    // if reset = "daily"
    // if reset = current day of week (0-6)
    // if reset = day of month (01-31)
    // (with consideration for days with fewer months)

    // 
    try {
        const dayOfWeek = new Date().getUTCDay().toString();
        const dayOfMonth = new Date().getUTCDate().toString().padStart(2, '0');

        const filter = {
            $or: [
                { resetType: "daily" },
                { resetType: dayOfWeek },
                { resetType: dayOfMonth }
            ]

        };

        //
        var update = { $set: { "users.$[].completed": false } };

        // 
        await database.collection('goals').updateMany(filter, update);
    }
    catch (error) {  // 
        console.error(`Ran into error while resetting goal completion: ${error}...`);
    }
}

module.exports = { updatePreviousResetDate, initializeCompletionReset, handleCompletionReset }