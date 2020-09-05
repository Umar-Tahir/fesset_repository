/*
Created by Umar Tahir
*/

const database = require('../models');

//verifyJwtToken middleware
verifyJwtToken = (request, response, next) => {
    const bearer = request.headers['authorization'];

    if (typeof bearer !== 'undefined') {
        request.jwtToken = bearer.split(' ')[1];
        next();
    } else {
        response.sendStatus(403);
    }
}

//isAdmin middleware
isAdmin = (request, response, next) => {
    database.user.findAll({
        raw: true,
        where: {
            id: request.body.adminId
        }
    }).then(user => {
        if (user[0]['isAdmin'] === 1) {
            next();
        } else {
            response.send("You are not the Admin!");
        }
    })
        .catch(error => response.send({error: "Sorry, something went wrong!"}));
}

//userStatus middleware
userStatus = (request, response, next) => {
    database.user.findAll({
        raw: true,
        where: {
            id: request.body.userId
        }
    }).then(user => {
        if (user[0]['userStatus'] === 1) {
            next();
        } else {
            response.send("Sorry, you need to be activated by the Admin!");
        }
    })
        .catch(error => response.send({error: "Sorry, something went wrong!"}));
}

module.exports = {verifyJwtToken, isAdmin, userStatus};