const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

//routes
const routes = require('./routes/routes');
const secureRoute = require('./routes/secureRoutes');

//models
const UserModel = require("./model/userModel");

mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log("database connected");
    });

mongoose.Promise = global.Promise;

require('./auth/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route

// app.use('/user', passport.authenticate('jwt', { session: false,failureRedirect:'/rToken' }), secureRoute);
app.use('/user', passport.authenticate('aToken', { session: false }), secureRoute);

//Handle errors
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(port, () => {
    console.log("app on port :" + port);
})