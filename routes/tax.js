module.exports = (tax,knex,jwtVerify) => {
    
    tax.get('/',jwtVerify, (req,res) => {
        
        knex.select('*')
        .from('tax')
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.json(err)
            })
    })

    tax.get('/:tax_id',jwtVerify, (req,res) => {
        
        knex('tax')
        .where('tax_id',req.params.tax_id)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.json(err)
            })
    })
}