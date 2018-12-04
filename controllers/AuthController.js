const AuthModel= require('../models/M_Auth');

exports.getLogin=(req,res,next)=>{
  res.render('auth/login',{path:'auth/login',pageTitle:'Login',isAuthenticated:false});
}

exports.postLogin=(req,res,next)=>{
  console.log('posting creds');
  const l=req.body.login_user;
  const p=req.body.pwd_user;
  AuthModel.checkUser(req,auth=>{
    //console.log(auth.login_user);
    if(auth.length > 0)
    {
      req.session.isAuthenticated=true;
      req.session.login=auth[0].login_user;
      req.session.isAdmin = auth[0].admin;
      req.session.droitsUser = auth[0].droits_user;
      //console.log(auth[0].isAdmin);
      res.redirect('/');
    }
    else
    {
      res.redirect('/auth/login');
    }
  })

}

exports.postLogout =(req,res,next)=>
{
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/auth/login');
  });
};