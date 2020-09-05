/*
Created by Umar Tahir
*/

const express = require('express');
const server = express();
const database = require('./models');
const port = process.env.PORT || 8081;

server.use(express.urlencoded({extended: true}));
server.use(express.json());

const userRoute = require('./routes/userRoute');
server.use('/api', userRoute);

database.sequelize.sync(/*{force : true}*/).then(() => {
    server.listen(port, () => {
        console.log("Server started listening on port %d", port);
    });
});