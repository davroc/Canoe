const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const AuthMiddleware = require ('../middleware/isAuth');
const AdminController = require('../controllers/adminController');

const router = express.Router();



// user list
router.get('/userslist',AuthMiddleware.isAdmin,AdminController.getUsersList);
router.get('/user_edit/:userid',AuthMiddleware.isAdmin, AdminController.viewUser);
router.post('/user_edit',AuthMiddleware.isAdmin, AdminController.postEditUser);

//delete user
router.get('/delete_user/:userid' ,AuthMiddleware.isAdmin, AdminController.deleteUser);
// user add
// getting the form
router.get('/adduser',AuthMiddleware.isAdmin, AdminController.addUser);
// submiting new user
router.post('/adduser',AuthMiddleware.isAdmin, AdminController.postNewUser );


exports.routes = router;
module.exports = router;
