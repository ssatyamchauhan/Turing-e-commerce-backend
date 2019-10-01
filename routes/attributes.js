module.exports = (attributes,knex)=>{
    attributes.get('/',(req,res)=>{
        knex.select('*').from('attribute')
        .then((data)=>{
            console.log(data)
            return res.send(data)
        })
        .catch((err)=>{
            console.log(err.message)
            return res.send(err.message)
        });
    });

    attributes.get('/:attribute_id',(req,res)=>{
        
        knex.select('*').from('attribute')
        .where('attribute_id',req.params.attribute_id)
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    });

    attributes.get('/value/:attribute_id',(req,res)=>{
        knex.select('attribute_value.attribute_value_id','attribute_value.value').from('attribute_value')
        .where('attribute_id',req.params.attribute_id)
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    });

    attributes.get('/inProduct/:product_id',(req,res)=>{
        knex.select('attribute.name as attribute_name','attribute_value.attribute_value_id','attribute_value.value')
        .from('attribute_value')
        .join('attribute','attribute.attribute_id','=','attribute_value.attribute_id')
        .join('product_attribute','attribute_value.attribute_value_id','=','product_attribute.attribute_value_id')
        .where('product_id',req.params.product_id)
        .then((data)=>{return res.send(data)})
        .catch((err)=>{return res.send(err)})
    })

}