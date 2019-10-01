module.exports = (departments,knex)=>{
    departments.get('/',(req,res)=>{
        knex.select('*').from('department')
        .then((data)=>{
            console.log(data);
            return res.send(data)
        })
        .catch((err)=>{
            console.log('you are getting error',err)
        })                  
    });


    departments.get('/:department_id',(req,res)=>{
    knex('department').where({
        'department_id':req.params.department_id
    })
    .then((data)=>{
        console.log(data[0])
        return res.send(data[0])
    })
    .catch((err)=>{
        console.log(err.message)
    })
    })
};