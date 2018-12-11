const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require ('express-session');
const MySQLStore = require('express-mysql-session')(session);
const FileWatcher =require('chokidar');
const compression = require('compression');
const ImportDataController = require('./controllers/ImportsController')
const ReportingController = require('./controllers/ReportingController')

//watching the import data directory

//const __IMPORT_DIR = 'D:/Donnees/js/Canoe/input_data';
const __IMPORT_DIR = '//somtous/SOMTOUS/PEPS_ECH_A/MS_ECH_DIR/CANOE';
var watcher = FileWatcher.watch(__IMPORT_DIR, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish:true,
    ignorePermissionErrors:true
  });

  watcher
  .on('add', path => {
      console.log(`File ${path} has been added`);    
      ImportDataController.Import(path);
    })
//   .on('change', path => {
//       console.log(`File ${path} has been changed`);
//       //ImportDataController.Import(path);
//     })
  .on('unlink', path => console.log(`File ${path} has been removed`));


//scheduler for reportings
var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = 9;
rule.minute = 36;
 
var j = schedule.scheduleJob(rule, function(){
    console.log('planif');
    ReportingController.dailyAlarmReporting();
});



const db=require('./util/db');


const app = express();
app.use(compression())


app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const paramRoutes = require('./routes/app_params');
const analyseRoutes = require('./routes/analyse');
const authRoutes=require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
var sessionStore = new MySQLStore({}/* session store options */, db);
app.use(session({secret:'145409KLDKFDF09jkrueiufsd7!.efsdf',resave:false,saveUninitialized:false,store: sessionStore}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); 
app.use('/params', paramRoutes);
app.use('/analyse',analyseRoutes);
app.use('/auth',authRoutes);
app.use('/' ,(req,res,next)=>{
    res.redirect('/analyse/alarmes');
})


app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);