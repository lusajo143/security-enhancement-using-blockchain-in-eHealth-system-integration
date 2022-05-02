const { json } = require('express')
const Router = require('express')
const { getContract } = require('../Utils/Utils')

const consultation = Router()

consultation.get('/getPatients', async (req, res) => {
    const contract = await getContract('receptionist')

    let result = await contract.evaluateTransaction('getConsultationPatients', 'Org1')

    res.json({status: 200, data: result.toString()})

})

consultation.post('/sendToLab', async (req, res) => {
    console.log(req.body);
    let complain = req.body.complain
    let historyComplain = req.body.historyComplain
    let tests = req.body.tests
    let patient_id = req.body.patient_id

    const contract = await getContract('receptionist')

    let result = await contract.submitTransaction('sendPatientToLab', patient_id, 'Doctor 1', 'Org1', complain, historyComplain, tests.toString());

    console.log(result.toString());
    res.json(JSON.parse(result.toString()))

})

module.exports = consultation