const { json } = require('express')
const Router = require('express')
const { getContract } = require('../Utils/Utils')

const consultation = Router()

consultation.get('/getPatients', async (req, res) => {
    const contract = await getContract('doctor1')

    let result = await contract.evaluateTransaction('getConsultationPatients', 'Org1')

    res.json({status: 200, data: result.toString()})

})

consultation.post('/sendToLab', async (req, res) => {
    console.log(req.body);
    let complain = req.body.complain
    let historyComplain = req.body.historyComplain
    let tests = req.body.tests
    let patient_id = req.body.patient_id

    const contract = await getContract('doctor1')

    let result = await contract.submitTransaction('sendPatientToLab', patient_id, 'Doctor 1', 'Org1', complain, historyComplain, JSON.stringify(tests));

    console.log(result.toString());
    res.json(JSON.parse(result.toString()))

})

consultation.post('/sendToAccountant', async (req, res) => {
    let patient_id = req.body.patient_id
    let prescriptions = req.body.prescriptions

    const contract = await getContract('doctor1')

    let result = await contract.submitTransaction('addPrescription', patient_id, 'Org1', JSON.stringify(prescriptions))

    console.log(result);
    res.json(JSON.parse(result.toString()))

})

module.exports = consultation