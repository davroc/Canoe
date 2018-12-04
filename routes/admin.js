const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const AdminController = require('../controllers/adminController');

const router = express.Router();



// user list
router.get('/userslist',AdminController.getUsersList);
router.get('/user_edit/:userid', AdminController.viewUser);
router.post('/user_edit',AdminController.postEditUser);

//delete user
router.get('/delete_user/:userid', AdminController.deleteUser);
// user add
// getting the form
router.get('/adduser', AdminController.addUser);
// submiting new user
router.post('/adduser', AdminController.postNewUser );


exports.routes = router;
module.exports = router;
