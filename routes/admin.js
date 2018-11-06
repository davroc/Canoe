const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const AdminController = require('../controllers/adminController');

const router = express.Router();



// user list
router.get('/userslist',AdminController.getUsersList);

// user add
// getting the form
router.get('/adduser', AdminController.addUser);

// submiting new user
router.post('/adduser', AdminController.postNewUser );

//detail user
router.get('/view_user/:userid', AdminController.viewUser);

exports.routes = router;
module.exports = router;
