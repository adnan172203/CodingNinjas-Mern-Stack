const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

//db
const {connectDB} = require('./config/db');

//connection database
connectDB();

//init middleware
app.use(express.json({ extended:false }));

app.get('/',(req,res) =>{
    res.send('api running');
});



//Route 
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const postsRoute = require('./routes/posts');

//Define routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));