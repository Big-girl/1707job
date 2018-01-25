var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'sqld.duapp.com',
    port:4050,
    user     : '046ebc5aeb634e01a95bda99d4113795',
    password : '96433d9114c64adcaca75baad115c98c',
    database : 'DsNaBGpqaSxZVLDyMXsa'
});
connection.query("set names utf8");

module.exports=connection;