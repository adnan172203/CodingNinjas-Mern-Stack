//mongoose connect
const mongoose = require('mongoose');

//connection database

module.exports.connectDB= () => {
    mongoose
  .connect('mongodb://localhost:27017/social-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('database connection successfull'));
}
