var _  = require('underscore')
module.exports = (orders,knex,jwtVerify) => {
            
            orders.post('/orders', jwtVerify, (req,res) => {
                
                knex('shopping_cart')
                .where('shopping_cart.cart_id',req.body.cart_id)
                    .then((data) => {
                        // console.log('shopping_Cart')
                    if(data.length>0){
                        knex.select(
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
                        .where('sc.cart_id',req.body.cart_id)
                            .then(pricedata =>{
                                // console.log(pricedata)
                                var userData = pricedata.filter((i,e) => {
                                     i["subtotal"] = i.price * i.quantity
                                     return i;
                                })
                                var totalAmount = _.reduce(userData, (memo, num) => { return memo + num.subtotal; }, 0)     
                                var orderDetails = {
                                                        "total_amount": totalAmount,
                                                        "created_on": new Date(),
                                                        "customer_id": req.body.cart_id,
                                                        "shipping_id": req.body.shipping_id,
                                                        "tax_id": req.body.tax_id
                                                    }
                                        knex('orders')
                                        .insert(orderDetails)
                                            .then((data) =>{
                                                var insertOrderDetail = {
                                                                            "order_id": data[0],
                                                                            "product_id": pricedata[0].product_id,
                                                                            "attributes": pricedata[0].attributes,
                                                                            "product_name": pricedata[0].name,
                                                                            "quantity": pricedata[0].quantity,
                                                                            "unit_cost": pricedata[0].price
                                                                        }
                                               knex('order_detail')
                                               .insert(insertOrderDetail)
                                                    .then(() =>{
                                                        knex('shopping_cart')
                                                        .where('shopping_cart.cart_id', req.body.cart_id)
                                                        .del()
                                                            .then(() =>{
                                                                res.json({"order_id":data[0]})
                                                            })
                                                            .catch(err => res.json(err))
                                                    })
                                                
                                            })
                                            .catch(err => {
                                                res.json(err)
                                            })
                            })
                            .catch(err =>{
                                res.send(err)
                            })
                        }
                        else{
                            res.json({status:"Not Okay","message":"cart is empty"})
                        }
                        
                    })
                    .catch(err => {
                        res.json(err)
                    })
            })

        orders.get('/orders/:order_id', jwtVerify, (req,res) =>{
            knex('order_detail')
            .where('order_detail.order_id',req.params.order_id)
                .then(data =>{
                    res.json(data)
                })
                .catch(err =>{
                    res.json(err)
                })
        })


        orders.get('/orders/inCustomer/data',jwtVerify, (req,res) => {
            knex.select(
                'order_id',
                'total_amount',
                'created_on',
                'shipped_on',
                'status',
                'name'
            )
            .from('orders')
            .join('customer', 'customer.customer_id','=', 'orders.customer_id')
            .where('customer.email', req.email)
                .then(data => {
                    res.json(data)
                })
                .catch(err => {
                    res.json(err)
                })
        })

        orders.get('/orders/shortDetail/:order_id',jwtVerify, (req,res) => {
            knex.select(
                'order_id',
                'total_amount',
                'created_on',
                'shipped_on',
                'status',
                'name'
            )
            .from('customer')
            .join('orders','customer.customer_id','=','orders.customer_id')
            .where('orders.order_id',req.params.order_id)
                .then(data => {
                    res.json(data)
                })
                .catch(err => {
                    res.json(err)
                })
        })
}