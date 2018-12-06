exports.isLoggedIn = (req,res,next)=>{
  if (!req.session.isAuthenticated)
  {
    return res.redirect('/auth/login');
  }
  next();
}

exports.isAdmin = (req,res,next) =>{
  if (!req.session.isAdmin)
  {
    return res.redirect('/auth/login');
  }
  next();
}

exports.isParam = (req,res,next) =>{
  if (!req.session.isParam)
  {
    return res.redirect('/auth/login');
  }
  next();
}