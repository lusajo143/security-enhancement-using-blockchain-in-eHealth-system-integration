const { getContract } = require('../Utils/Utils')

const accountant = require('express').Router()

accountant.get('/getPatients', async (req, res) => {
    const contract = await getContract('accountant1')

    let result = await contract.evaluateTransaction('getAccountantPatients', 'Org1')

    res.json({status: 200, data: result.toString()})

})


module.exports = accountant