const mysql = require('mysql2');

const pool =mysql.createPool({
  host:'localhost', 
  user:'root',
  database:'canoe_db',
  password:''
});

//console.log(pool);

module.exports = pool.promise();
