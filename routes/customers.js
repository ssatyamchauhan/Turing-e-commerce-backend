require('dotenv').config();
module.exports = (customers,knex,jwt,jwtVerify) => {
    customers.post('/customers', (req,res) => {
        var customer = req.body
        knex('customer')
            .insert(customer)
            .then((data) => {
                knex('customer').where('customer_id',data[0])
                .then(data => {                    
                    delete data[0].password;
                    jwt.sign(
                        {
                            email:customer.email,
                            password: customer.password
                        },
                            process.env.SECRET,
                        {
                            expiresIn: '5m'
                        },
                    function(err, token) {
                        if(!err){
                            res.cookie('key',token)
                            return res.send(
                                {
                                    "customer" : {
                                        "schema":data[0]
                                    },
                                    "Authorization" : {
                                        "accessToken": token,
                                        "expiresIn" : '24h'                     
                                    }
                                }
                            )
                        }
                        else{
                          return res.send(err)
                        }
                    });
                })
                .catch(err => res.json(err))
            })
            .catch(err => res.json(err.message))
    })

    customers.get('/customers/login', (req,res) =>{
        knex('customer')
        .where('customer.email',req.body.email)
        .andWhere('customer.password',req.body.password)
            .then(data =>{
                delete data[0].password;
                    jwt.sign(
                        {
                            email:req.body.email,
                            password: req.body.password
                        },
                            process.env.SECRET,
                        {
                            expiresIn: 60*60
                        },
                    function(err, token) {
                        if(!err){
                            res.clearCookie('key')
                            res.cookie('key',token)
                            return res.send(
                                {
                                    "customer" : {
                                        "schema":data[0]
                                    },
                                    "Authorization" : {
                                        "accessToken": token,
                                        "expiresIn" : '24h'                     
                                    }
                                }
                            )
                        }
                        else{
                          return res.send(err)
                        }
                    });
                
            })
            .catch(err => {
                return res.json(err)
            })

    })

    customers.get('/customers/facebook' ,(req,res) => {
        res.json({
            status:404,
            message:"This feature will come soon!"
        })
    })

    customers.get('/customer',jwtVerify, (req,res) =>{
        knex('customer')
        .where('customer.email',req.email)
            .then(data => {
                delete data[0].password;
                return res.json(data[0])
            })
            .catch(err => {
                return (res.json(err))
            })
    })

    customers.put('/customer', jwtVerify, (req,res) => {
        knex('customer')
        .update(req.body)
        .where('customer.email',req.email)
            .then(() => {
                knex('customer')
                .where('customer.email',req.email)
                    .then(data =>{
                        delete data[0].password;
                        return res.json(data[0])
                    })
                    .catch(err => {
                        return res.json(err)
                    })
            })
            .catch(err => {
                res.send(err)
            })
    })


    customers.put('/customers/address', jwtVerify, (req,res) => {
        knex('customer')
        .update(req.body)
        .where('customer.email',req.email)
            .then(() => {
                knex('customer')
                .where('customer.email',req.email)
                    .then(data =>{
                        delete data[0].password;
                        return res.json(data[0])
                    })
                    .catch(err => {
                        return res.json(err)
                    })
            })
            .catch(err => {
                res.send(err)
            })
    })

    customers.put('/customers/creditCard',jwtVerify, (req,res) => {
        knex('customer')
        .update(req.body)
        .where('customer.email',req.email)
            .then(() => {
                knex('customer')
                .where('customer.email',req.email)
                    .then(data =>{
                        delete data[0].password;
                        return res.json(data[0])
                    })
                    .catch(err => {
                        return res.json(err)
                    })
            })
            .catch(err => {
                res.send(err)
            })
            
    })


}