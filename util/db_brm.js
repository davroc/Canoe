const mysql = require('mysql2');

const pool =mysql.createPool({
  host:'pcw00002scan0.services.prod', 
  user:'u122495',
  database:'PBRM01P_CLI02',
  password:'T0matito21',
  port:1698
});

//console.log(pool);

module.exports = pool.promise();
