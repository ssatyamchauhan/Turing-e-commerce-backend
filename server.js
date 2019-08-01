const express = require('express');
var mysql = require('mysql')
var app = express()

var conn = {
    host:'localhost',
    user:'root',
    password:'Navgurukul',
    database:'turingDb'
}
var knex = require('knex')({client:'mysql',connection:conn});

//Departments section
//Router is a middleware, through router we instantiate the object which works same as app
//App.use helps to invoke the add the middleware in the express
var departments = express.Router();
app.use('/departments',departments);
require('./routes/departments')(departments,knex)

//categories section
var categories = express.Router();
app.use('/categories',categories);
require('./routes/categories')(categories,knex)

//Attributes section
var attributes = express.Router();
app.use('/attributes',attributes);
require('./routes/attributes')(attributes,knex)

//Products section
var products = express.Router();
app.use('/products',products);
require('./routes/products')(products,knex)

app.listen(2000,()=>{
    console.log('Your app is listening')
});