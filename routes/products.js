module.exports = (products,knex)=>{
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

    products.get('/inDepartments/:department_id',(req,res)=>{
        knex.select('p.product_id', 'p.name', 'p.description', 'p.price', 'p.discounted_price', 'p.thumbnail').from('product as p').join('product_category as c','c.product_id','=','p.product_id').join('category as C','C.category_id','=','c.category_id').where('C.department_id',req.params.department_id)
        .then((data)=>{return res.json({"count":data.length,"rows":data})})
        .catch((err)=>{return res.json(err.message)})
    })
    
    

}