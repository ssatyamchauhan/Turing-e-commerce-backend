const express = require('express');
var jwt = require('jsonwebtoken');
var jwtVerify = require('./Authentication/jwtVerify')
require('dotenv').config();
var app = express()

app.use(express.json())

var conn = {
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
}

var knex = require('knex')({client:'mysql',connection:conn});

var PORT = process.env.PORT || 2000;
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
require('./routes/products')(products,knex);

var customers = express.Router();
app.use('/',customers);
require('./routes/customers')(customers,knex,jwt,jwtVerify);

var shoppingcart = express.Router();
app.use('/shoppingcart',shoppingcart);
require('./routes/shoppingcart')(shoppingcart,knex,jwtVerify);

app.listen(PORT,()=>{
    console.log('Your app is listening',PORT)
});