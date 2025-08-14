const mongoose= require('mongoose');


function connectDB() {
    mongoose.connect(process.env.MONGOOSE_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    
}


module.exports = connectDB;
