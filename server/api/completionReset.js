const fs = require('fs');
const moment = require('moment');

const serverInfoPath = 'config/serverInfo.json';

// Initialize the previous goal completion date as a global variable
let previousResetDate;

// If server information does not exist, create a new one
async function createServerInfo() {
    const currentDate = moment().format("YYYY-MM-DD");
    await fs.writeFileSync(serverInfoPath, JSON.stringify({ "previousResetDate": currentDate }));
    previousResetDate = currentDate;
}

// Called on start up. Grabs information on when the completion statuses in the DB were last reset 
// OR creates serverInfo.json if the file does not exist
function initializeCompletionReset() {
    // If serverInfo.json exists, grab the stored previousResetDate
    if (fs.existsSync(serverInfoPath)) {
        // Grab the date from JSON file stating the last time that goal completion was reset
        fs.readFile(serverInfoPath, 'utf8', function (error, data) {
            if (error) console.error(`Ran into error while loading local serverInfo.json: ${error}...`);
            previousResetDate = JSON.parse(data).previousResetDate;
        });
    }
    else {  // Otherwise, create a new serverInfo.json
        createServerInfo();
    }
}

// Gets called in the setInterval function in the main server file. 
// If it is a new day, reset completion statuses and update the local file to reflect the current date as the previous reset date
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

// Queries the MongoDB database for all goals that are meant to be reset today and resets the completion of all its users
async function resetCompletion(database) {
    /*
        Never: will be stored as "never"
        Daily: will be stored as "daily"
        Weekly: will be a string of a number representing the day of the week (0 = Sunday, 6 = Saturday)
        Monthly: will be stored as a string of the any day of the month where anything < 10 will be padded with a zero (e.g. 7 -> "07")
          This is to allow both weekly and monthly to coexist without overlap (since weekly is < 10 with no padding!)
    */

    // Try to update the completion statuses of all the goals in the database that should be reset today
    try {
        // Conver the current day into their properly formatted string for querying
        const dayOfWeek = new Date().getUTCDay().toString();
        const dayOfMonth = new Date().getUTCDate().toString().padStart(2, '0');

        // Any goal satisfying any expression in the or statement will have all their user's completion statuses reset!
        const filter = {
            $or: [
                { resetType: "daily" },
                { resetType: dayOfWeek },
                { resetType: dayOfMonth }
            ]

        };

        // Resets the completion status of all users in a goal to false
        var update = { $set: { "users.$[].completed": false } };

        // Update as many goals that match the filter
        await database.collection('goals').updateMany(filter, update);
    }
    catch (error) {  // If any error arises, output it to the server's console
        console.error(`Ran into error while resetting goal completion: ${error}...`);
    }
}

module.exports = { initializeCompletionReset, handleCompletionReset }