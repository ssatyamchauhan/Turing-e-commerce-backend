var _ = require('underscore')
module.exports = (shoppingcart,knex,jwtVerify) => {

    shoppingcart.post('/add', jwtVerify, (req,res) =>{
        console.log(req.email)
        knex('customer')
        .where('email', req.email)
            .then(data => {
                // console.log(data)
                knex('shopping_cart')
                .select('cart_id')
                .where('shopping_cart.cart_id',data[0].customer_id)
                    .then(newdata => {
                        console.log(newdata)
                        if(newdata.length>0){
                            console.log('exists')
                            knex.select('product_id')
                            .where('product_id',req.body.product_id)
                            .from('product')
                            .then(pdata => {
                                console.log('pdata',pdata)
                                knex('shopping_cart')
                                .where(
                                    'shopping_cart.product_id',req.body.product_id
                                    )
                                .andWhere(
                                    'shopping_cart.attributes',
                                    req.body.attributes
                                )
                                    .then(ndata => {
                                        console.log('ndata  ', ndata)
                                        if(ndata.length>0){

                                            console.log('same data',ndata)
                                            knex('shopping_cart')
                                            .update(
                                                {quantity: ndata[0].quantity+1}
                                                )

                                            .where(
                                                "shopping_cart.cart_id",
                                                    ndata[0].cart_id
                                                )
                                            .andWhere(
                                                "shopping_cart.product_id",req.body.product_id
                                            )
                                            .andWhere(
                                                "shopping_cart.attributes",
                                                req.body.attributes
                                            )
                                                .then(() =>{
                                                    knex.select(
                                                        'sc.item_id',
                                                        'p.name',
                                                        'sc.attributes',
                                                        'sc.product_id',
                                                        'p.image',
                                                        'p.price',
                                                        'sc.quantity'
                                
                                                        )
                                                    .from('product as p')
                                                    .join(
                                                        'shopping_cart as sc',
                                                        'sc.product_id', '=',
                                                        'p.product_id'
                                                    )
                                                    .where('sc.cart_id',ndata[0].cart_id)
                                                        .then(data =>{
                                                            var userData = data.filter((i,e) => {
                                                                 i["subtotal"] = i.price * i.quantity
                                                                 return i;
                                                            })
                                                            console.log(userData)
                                                            res.send(userData)
                                                        })
                                                        .catch(err =>{
                                                            res.send(err)
                                                        })
                                                })
                                                .catch((err) => {
                                                    return res.send(err.message)
                                                })

                                        }
                                        else{
                                            console.log('hey there',newdata)
                                            pdata[0]["quantity"] = 1;
                                            pdata[0]["cart_id"] = newdata[0].cart_id
                                            pdata[0]["attributes"] = req.body.attributes
                                            pdata[0]["quantity"] = 1;
                                            pdata[0]["added_on"] = new Date()
                                            console.log(pdata)


                                            knex('shopping_cart')
                                            .insert(pdata)
                                            .where(
                                                "shopping_cart.cart_id",
                                                    newdata[0].cart_id
                                                )
                                                .then(() =>{
                                                    console.log('hey i am')
                                                    knex.select(
                                                        'sc.item_id',
                                                        'p.name',
                                                        'sc.attributes',
                                                        'sc.product_id',
                                                        'p.image',
                                                        'p.price',
                                                        'sc.quantity'
                                
                                                        )
                                                    .from('product as p')
                                                    .join(
                                                        'shopping_cart as sc',
                                                        'sc.product_id', '=',
                                                        'p.product_id'
                                                    )
                                                    .where('sc.cart_id',newdata[0].cart_id)
                                                        .then(data =>{
                                                            var userData = data.filter((i,e) => {
                                                                 i["subtotal"] = i.price * i.quantity
                                                                 return i;
                                                            })
                                                            console.log(userData)
                                                            res.send(userData)
                                                        })
                                                        .catch(err =>{
                                                            res.send(err)
                                                        })
                                                })
                                                .catch(() => {
                                                    return res.send(err.message)
                                                })
                                            

                                        }
                                    })
                            })
                            .catch(err => {
                                return res.json(err)
                            })
                        }
                        else{
                            // console.log('else data',data)
                            req.body.cart_id = data[0].customer_id;
                            console.log(req.body)
                            knex.select(
                                'product_id',
                                
                                )
                            .from('product')
                            .where('product.product_id',req.body.product_id)
                                .then(elsedata =>{
                                    // console.log(elsedata)

                                    elsedata[0]["cart_id"] = req.body.cart_id
                                    elsedata[0]["attributes"] = req.body.attributes
                                    elsedata[0]["quantity"] = 1;
                                    elsedata[0]["added_on"] = new Date()
                                    // elsedata[0]["subtotal"] = elsedata[0].price
                                    
                                    console.log('my else data is going on here',elsedata)
                                    knex('shopping_cart')
                                    .insert(elsedata[0])
                                        .then(() => {
                                            console.log(elsedata)
                                            knex.select(
                                                'sc.item_id',
                                                'p.name',
                                                'sc.attributes',
                                                'sc.product_id',
                                                'p.image',
                                                'p.price',
                                                'sc.quantity'
                        
                                                )
                                            .from('product as p')
                                            .join(
                                                'shopping_cart as sc',
                                                'sc.product_id', '=',
                                                'p.product_id'
                                            )
                                            .where('sc.cart_id',elsedata[0].cart_id)
                
                                                .then(data =>{
                                                    var userData = data.filter((i,e) => {
                                                         i["subtotal"] = i.price * i.quantity
                                                         return i;
                                                    })
                                                    console.log(userData)
                                                    res.send(userData)
                                                })
                                                .catch(err =>{
                                                    res.send(err)
                                                })
                                        })
                                        .catch(err =>{
                                            res.send(err.message)
                                        }) 

                                })
                                .catch((err) => {
                                    return res.json(err)
                                })
                            
                        }
                    })
            })
        
    })

    shoppingcart.get('/:cart_id',jwtVerify, (req,res) =>{
        console.log(req.email)
        knex.select(
            'sc.item_id',
            'p.name',
            'sc.attributes',
            'sc.product_id',
            'p.image',
            'p.price',
            'sc.quantity'

            )
        .from('product as p')
        .join(
            'shopping_cart as sc',
            'sc.product_id', '=',
            'p.product_id'
        )
        .where('sc.cart_id',req.params.cart_id)
            .then(data =>{
                var userData = data.filter((i,e) => {
                     i["subtotal"] = i.price * i.quantity
                     return i;
                })
                console.log(userData)
                res.send(userData)
            })
            .catch(err =>{
                res.send(err)
            })
    })

    shoppingcart.put('/update/:item_id',jwtVerify, (req,res) =>{
        console.log(req.body)
        knex('shopping_cart')
        .update({quantity:req.body.quantity})
        .where('shopping_cart.item_id',req.params.item_id)
            .then(() =>{
                knex.select(
                    'sc.item_id',
                    'p.name',
                    'sc.attributes',
                    'sc.product_id',
                    'p.price',
                    'sc.quantity'
        
                    )
                .from('product as p')
                .join(
                    'shopping_cart as sc',
                    'sc.product_id', '=',
                    'p.product_id'
                )
                .where('sc.item_id',req.params.item_id)
                    .then(data =>{
                        var userData = data.filter((i,e) => {
                             i["subtotal"] = i.price * i.quantity
                             return i;
                        })
                        console.log(userData)
                        res.send(userData)
                    })
                    .catch(err =>{
                        res.send(err)
                    })
            })
            .catch((err) =>{
                res.json(err.message)
            })
    })

    shoppingcart.delete('/empty/:cart_id', jwtVerify, (req,res) => {
        knex('shopping_cart')
        .where('shopping_cart.cart_id', req.params.cart_id)
        .del()
            .then(() =>{
                res.json([])
            })
            .catch(err =>{
                res.json(err)
            })
   })

    shoppingcart.get('/totalAmount/:cart_id',jwtVerify, (req,res) =>{
        knex('shopping_cart')
        .where('shopping_cart.cart_id', req.params.cart_id)
            .then(data =>{
                knex.select(
                    'p.price',
                    'sc.quantity'
                    )
                .from('product as p')
                .join(
                    'shopping_cart as sc',
                    'sc.product_id', '=',
                    'p.product_id'
                )
                .where('sc.cart_id',req.params.cart_id)
                    .then(pricedata =>{
                        var userData = pricedata.filter((i,e) => {
                             i["subtotal"] = i.price * i.quantity
                             return i;
                        })
                        var totalAmount = _.reduce(userData, (memo, num) => { return memo + num.subtotal; }, 0)                        
                        res.send([{totalAmount:totalAmount}])
                    })
                    .catch(err =>{
                        res.send(err)
                    })
                
            })
            .catch(err =>{
                res.json(err)
            })
    })

    shoppingcart.get('/saveForLater/:item_id', jwtVerify, (req,res) => {
        
        knex.schema.hasTable('save_later')
            .then((exists) => {
                console.log(exists)
                if (!exists) {
                    return knex.schema.createTable('save_later', function(table) {
                        table.integer('item_id').primary();
                        table.string('cart_id');
                        table.integer('product_id');
                        table.string('attributes');
                        table.string('quantity');


                        knex.select(
                            'sc.item_id',
                            'sc.cart_id',
                            'sc.product_id',
                            'sc.attributes',
                            'sc.quantity'
                            )
                        .from('product as p')
                        .join(
                            'shopping_cart as sc',
                            'sc.product_id', '=',
                            'p.product_id'
                        )
                        .where('sc.item_id',req.params.item_id)
                            .then(data =>{
                                knex('save_later')
                                .insert(data[0])
                                    .then(() => {
                                        knex('shopping_cart')
                                        .where('shopping_cart.item_id',req.params.item_id)
                                        .del()
                                            .then(() =>{
                                                res.json({status:200,message:"data moved successfully!"})
                                            })
                                            .catch(err => res.json(err.message))
                                    })
                                    .catch((err) => res.json(err))

                            })
                            .catch(err =>{
                                res.send(err)
                            })
                    })
                }
                else{
                    console.log('else is working')
                    knex.select(
                        'sc.item_id',
                        'sc.cart_id',
                        'sc.product_id',
                        'sc.attributes',
                        'sc.quantity'
                        )
                    .from('product as p')
                    .join(
                        'shopping_cart as sc',
                        'sc.product_id', '=',
                        'p.product_id'
                    )
                    .where('sc.item_id',req.params.item_id)
                        .then(data =>{
                            console.log(data)
                            knex('save_later')
                            .insert(data[0])
                                .then(() => {
                                    knex('shopping_cart')
                                    .where('shopping_cart.item_id',req.params.item_id)
                                    .del()
                                        .then(() =>{
                                            res.json({status:200,message:"data moved successfully!"})
                                        })
                                        .catch(err => res.json(err.message))
                                })
                                .catch((err) => res.json(err))

                        })
                        .catch(err =>{
                            res.send(err)
                        })
                }
            })
            .catch(err =>{
                res.json(err)
            })
        })


}