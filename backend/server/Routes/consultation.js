const Router = require('express')
const { getContract } = require('../Utils/Utils')

const consultation = Router()

consultation.get('/getPatients', async (req, res) => {
    const contract = await getContract('receptionist')

    let result = await contract.evaluateTransaction('getConsultationPatients', 'Org1')

    res.json({status: 200, data: result.toString()})

})

module.exports = consultation