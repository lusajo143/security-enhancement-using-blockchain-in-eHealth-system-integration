const Router  = require('express').Router

const universal = Router()

universal.get('/getPatients', (req, res) => {
    const patients = [
        {
            pid: '011',
            name: 'Lusajo',
            gender: 'Male',
            age: 23,
            location: 'Dodoma',
            payment: 'Cash'
        },
        {
            pid: '012',
            name: 'Boss mdg',
            gender: 'Female',
            age: 23,
            location: 'Dodoma',
            payment: 'Cash'
        }
    ]

    res.json({status: 200, data: patients})
})


module.exports = universal

