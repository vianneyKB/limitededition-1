// external import
const mongoose = require('mongoose');
                 require('dotenv').config();

// function to house the connection
async function dbConnect() {

}
module.exports = dbConnect;

// using mongoose to connect the app to the db createtd on mongoDB using the DB_URL string
mongoose.connect(process.env.DB_URL,
    {
        // here let put some options to make sure the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(()=> {
        console.log('Connected to mongoDB successfully');
    }).catch((error)=> {
        console.log('unable to connect to mongoDB');
        console.error(error);
    })

    module.exports = dbConnect;