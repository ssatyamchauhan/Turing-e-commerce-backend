module.exports = (products,knex,jwtVerify)=>{
    products.get('/',(req ,res)=>{
        var page = req.query.page;
        var limits = req.query.limit;
        var description = req.query.description;
        if (page!=1){var offsets = limits*page-limits}
        else{var offsets=0}
        knex.select('*').from('product').limit(limits).offset(offsets)
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    })

    products.get('/search',(req,res)=>{
        var string = req.query.string;  
        knex.select('*').from('product').where('name','like', '%'+string+'%')
        // .andWhere('name','like', '%'+string)
        .then((data)=>{return res.send({'count':data.length,'rows':data})})
        .catch((err)=>{return res.send(err)})
    })

    products.get('/:product_id',(req,res)=>{
        knex.select('*').from('product').where('product_id',req.params.product_id)
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    })

    products.get('/inCategory/:category_id',(req,res)=>{
        knex.select('p.product_id', 'p.name', 'p.description', 'p.price', 'p.discounted_price', 'p.thumbnail').from('product as p').join('product_category as c', 'c.product_id','=','p.product_id').where('c.category_id',req.params.category_id)
        .then((data)=>{return res.send({"count":data.length,"rows":data})})
        .catch((err)=>{console.log(err);return res.send(err.message)})
    })

    products.get('/inDepartment/:department_id',(req,res)=>{
        knex.select('p.product_id', 'p.name', 'p.description', 'p.price', 'p.discounted_price', 'p.thumbnail').from('product as p').join('product_category as c','c.product_id','=','p.product_id').join('category as C','C.category_id','=','c.category_id').where('C.department_id',req.params.department_id)
        .then((data)=>{return res.json({"count":data.length,"rows":data})})
        .catch((err)=>{return res.json(err.message)})
    })
    
    products.get('/:product_id/details',(req,res) => {
        knex('product as p' ).select('p.product_id',  'p.name', 'p.description', 'p.price', 'p.discounted_price', 'p.image', 'p.image_2').where('p.product_id', req.params.product_id)
        .then(data => res.json(data))
        .catch(err => res.json(err.message))
    })
    
    products.get('/:product_id/locations',(req,res) => {
        knex.select('pc.category_id', 'c.name as category_name', 'c.department_id', 'd.name as department_name').from('product_category as pc').join('category as c', 'pc.category_id', '=', 'c.category_id').join('department as d', 'd.department_id','=','c.department_id').where('pc.product_id',req.params.product_id)
        .then(data => res.json(data))
        .catch(err => res.json(err.message))
    })

    products.post('/:product_id/reviews', jwtVerify, (req,res) =>{
        var postReview = req.body;
        knex.select(
            'customer_id'
        )
        .from('customer')
        .where('customer.email',req.email)
            .then(data => {
                postReview["customer_id"] = data[0].customer_id
                postReview["created_on"] = new Date()
                postReview["product_id"] = req.params.product_id;

                knex('review')
                .insert(postReview)
                    .then(data => {
                        res.json({status:200,message:"review has posted successfully!"})
                    })
                    .catch(err => {
                        res.json(err)
                    })
            })
    })

    products.get('/:product_id/reviews', jwtVerify, (req,res) => {
        knex.select(
            'customer.name',
            'review.review',
            'review.rating',
            'review.created_on'
        )
        .from('customer')
        .join('review', 'customer.customer_id','=','review.customer_id')
        .where('review.product_id',req.params.product_id)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.json(err)
            })
    })

}