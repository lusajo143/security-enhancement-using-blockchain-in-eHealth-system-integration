const { getContract } = require('../Utils/Utils')

const accountant = require('express').Router()

accountant.get('/getPatients', async (req, res) => {
    const contract = await getContract('accountant1')

    let result = await contract.evaluateTransaction('getAccountantPatients', 'Org1')

    res.json({status: 200, data: result.toString()})

})

accountant.post('/changePaymentStatus', async (req, res) => {
    let patient_id = req.body.patient_id
    let status = req.body.status

    console.log(status+' '+ patient_id+'\n');

    const contract = await getContract('accountant1')

    let result = await contract.submitTransaction('changePaymentStatus', 'Org1', patient_id, status)

    res.json(JSON.parse(result.toString()))

})


module.exports = accountant