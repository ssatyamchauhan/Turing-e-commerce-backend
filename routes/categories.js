module.exports = (categories,knex)=>{
    categories.get('/',(req,res)=>{
        knex.select('*').from('category')
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{return res.send(err.message)})
    })

    categories.get('/:category_id',(req,res)=>{
        knex('category').where('category_id',req.params.category_id)
        .then((data)=>{return res.send(data[0])})
        .catch((err)=>{return res.send(err.message)});
    })
    
    categories.get('/inProduct/:product_id',(req,res)=>{
        knex.select('category.category_id','category.department_id','category.name').from('category')
        .join('product_category','product_category.category_id','=','category.category_id',)
        .where('product_id','=',req.params.product_id)
        .then((data)=>{
            return res.send(data)
        })
        .catch((err)=>{console.log(err);return res.send(err.message)})
    })

    categories.get('/inDepartment/:department_id',(req,res)=>{
        knex.select('*').where('category.department_id','=',req.params.department_id)
        .from('category')
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    })
    
}

