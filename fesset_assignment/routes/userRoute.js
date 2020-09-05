/*
Created by Umar Tahir
*/

const router = require('express').Router();
const jsonWebToken = require('jsonwebtoken');
const database = require('../models');
const customMiddleware = require('../middlewares/customMiddlewares.js');
const verifyJwtToken = customMiddleware.verifyJwtToken;
const isAdmin = customMiddleware.isAdmin;
const userStatus = customMiddleware.userStatus;
const jwtKey = require('../config/config.json').jwtKey;

/*//////////////////////////////////
        USER ROUTES
/////////////////////////////////*/

//register user
router.post('/registerUser', (request, response) => {
    database.user.create({
        userName: request.body.userName,
        userPassword: request.body.userPassword,
    }).then(result => response.send(result))
        .catch(error => response.send({error}));
});

//user login
router.post('/loginUser', (request, response) => {
    database.user.findAll({
        raw: true,
        where: {
            userName: request.body.userName,
            userPassword: request.body.userPassword
        }
    }).then(user => {
        if (user.length === 1) {
            if (user[0]['userStatus'] !== 1) {
                response.send("Sorry, you cannot login until you are activated by the admin!")
                return;
            }

            jsonWebToken.sign({user}, `${jwtKey}`, {expiresIn: '3600s'}, (error, token) => {
                response.send(
                    {
                        "message": "Login was successful!",
                        token
                    });
            });
        } else {
            response.send("Sorry, no information found!");
        }
    })
        .catch(error => response.send({error}));
});

//add customer information (for activated user only)
router.post('/addCustomerInformation', verifyJwtToken, userStatus, (request, response) => {

    jsonWebToken.verify(request.jwtToken, `${jwtKey}`, (error, authData) => {
        if (error) {
            response.sendStatus(403);
        } else {
            database.customer.create({
                customerName: request.body.customerName,
                customerEmail: request.body.customerEmail,
                customerPhoneNumber: request.body.customerPhoneNumber,
                userId: request.body.userId
            }).then(result => response.send(
                {
                    result,
                    authData
                }
            ))
                .catch(error => response.send({error}));
        }
    });
});

//retrieve customer information (for activated user only)
router.get('/getAllCustomers', verifyJwtToken, userStatus, (request, response) => {
    jsonWebToken.verify(request.jwtToken, `${jwtKey}`, (error, authData) => {
        if (error) {
            response.sendStatus(403);
        } else {
            database.customer.findAll({
                where: {
                    userId: request.body.userId
                }
            }).then(customer => response.send(
                {
                    customer,
                    authData
                }
            ))
                .catch(error => response.send({error}));
        }
    });
});

//delete customer by id (for activated users only)
router.delete('/deleteCustomer', verifyJwtToken, userStatus, (request, response) => {
    jsonWebToken.verify(request.jwtToken, `${jwtKey}`, (error, authData) => {
        if (error) {
            response.sendStatus(403);
        } else {
            database.customer.destroy({
                where: {
                    id: request.body.customerId,
                    userId: request.body.userId
                }
            }).then(() => response.send(
                {
                    "message": "Customer was deleted successfully!",
                    authData
                }
            ))
                .catch(error => response.send({error}));
        }
    });
});

//delete all customers (for activated users only)
router.delete('/deleteAllCustomers', verifyJwtToken, userStatus, (request, response) => {
    jsonWebToken.verify(request.jwtToken, `${jwtKey}`, (error, authData) => {
        if (error) {
            response.sendStatus(403);
        } else {
            database.customer.destroy({
                where: {
                    userId: request.body.userId
                }
            }).then(() => response.send(
                {
                    "message": "All customers were deleted successfully!",
                    authData
                }
            ));
        }
    });
});


/*//////////////////////////////////
        ADMIN USER ROUTES
/////////////////////////////////*/

//get all users (for admin only)
router.get('/getAllUsers', isAdmin, (request, response) => {
    database.user.findAll().then(users => response.send(users))
        .catch(error => response.send({error}));
});

//get user by id (for admin only)
router.get('/getUser', isAdmin, (request, response) => {
    database.user.findAll({
        where: {
            id: request.body.userId
        }
    }).then(user => response.send(user.length === 1 ? user : 'Sorry, no record found!'))
        .catch(error => response.send({error}));
});

//activate user (for admin only)
router.put('/activateUser', isAdmin, (request, response) => {
    database.user.findAll({
        raw: true,
        where: {
            id: request.body.userId
        }
    }).then(user => {
        if (user.length === 1 && user[0]['userStatus'] === 1) {
            response.send('User is already activated!');
        } else {
            database.user.update(
                {
                    userStatus: 1
                },
                {
                    where: {
                        id: request.body.userId
                    }
                }
            ).then(() => response.send("User activated successfully!"));
        }
    })
        .catch(error => response.send({error}));
});

module.exports = router;