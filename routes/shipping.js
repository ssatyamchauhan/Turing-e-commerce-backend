module.exports = (shipping,knex,jwtVerify) => {

    shipping.get('/regions',jwtVerify, (req,res) => {
        knex('shipping_region')
            .then((data) =>{
                res.json(data)
            })
            .catch(err => {
                res.json(err)
            })

    })

    shipping.get('/regions/:shipping_region_id',jwtVerify, (req,res)=> {

        knex('shipping')
        .select(
            "shipping.shipping_id",
            "shipping.shipping_type",
            "shipping.shipping_cost",
            "shipping_region.shipping_region_id"
        )
        .from('shipping')
        .join('shipping_region','shipping.shipping_region_id','=','shipping_region.shipping_region_id')
        .where('shipping.shipping_region_id',req.params.shipping_region_id)
            .then(data => {
                res.json(data)
            })
            .catch(err =>{
                res.json(err)
            })
    })
    
}