const { getContract } = require('../Utils/Utils')

const Router = require('express').Router

const reception = Router()





reception.post('/registerPatient', async (req, res) => {
    let fname = req.body.fname
    let mname = req.body.mname
    let lname = req.body.lname
    let gender = req.body.gender
    let kinName = req.body.kinName
    let phone = req.body.phone
    let dob = req.body.dob
    let kinPlace = req.body.kinPlace
    let relationship = req.body.relationship
    let kinPhone = req.body.kinphone

    console.log(req.body);
    let contract = await getContract('receptionist')
    let result = await contract.submitTransaction('registerPatient', Date.now().toString(), fname,
        mname, lname, gender, kinName, phone, dob, kinPlace,
        relationship, kinPhone)
        
    result = result.toString()

    if (result == "Done") {
        res.json({status: 200, message: 'Patient registration completed'})
    } else {
        res.json({status: 500, message: 'Server error occured'})
    }
})

module.exports = reception


