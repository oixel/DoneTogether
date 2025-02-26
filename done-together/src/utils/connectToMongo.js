const mongoose = require('mongoose');
const url = process.env.MONGO_CONNECTION_URL;

// 
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// 
connect.then(_ => {
    console.log("Successfully connected to Mongo Database!");
}).catch(err => {
    console.log(err);
});