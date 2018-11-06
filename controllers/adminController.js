const AdminModel= require('../models/M_Admin');
//const db=require('../util/db');

exports.getUsersList =  (req, res, next) => {
   AdminModel.getUsersList(liste =>{
    res.render('admin/userslist', { pageTitle: 'Utilisateurs', path: '/admin/userslist',Usr: liste });
  });
};

exports.addUser = (req, res, next) => {
  res.render('admin/adduser', { pageTitle: 'Ajouter un utilisateur', path: '/admin/adduser' });
};

exports.viewUser =(req,res,next) =>{
  const UserId=req.params.userid;
  //console.log(UserId);
  AdminModel.getUserDetail(UserId,detail =>{
    console.log(detail);
    res.render('admin/userDetail',{pageTitle:'Informations Utilisateur', path: '/admin/userDetail',user_data: detail})
  });
};

exports.postNewUser = (req, res, next) => {
  //products.push({ title: req.body.title });
  res.redirect('/');
};