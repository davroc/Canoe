const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const db=require('./util/db');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const paramRoutes = require('./routes/app_params');
//console.log(paramRoutes);
const analyseRoutes = require('./routes/code_analyse');
// db.execute('SELECT * from bios_sous_famille')
// .then(res=>{console.log(res[0])})
// .catch(err=>{console.log(err)});



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); 
app.use('/params', paramRoutes);
app.use('/analyse',analyseRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);