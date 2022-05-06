const { getContract } = require('../Utils/Utils');

const lab = require('express').Router()


lab.get('/getPatients', async (req, res) => {
    let contract = await getContract('receptionist');
    let result = await contract.submitTransaction('getLabPatients', 'Org1');
    res.json({status: 200, data: JSON.parse(result.toString())})
})


module.exports = lab