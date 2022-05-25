const path = require('path');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerUser } = require('../Utils/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../Utils/AppUtil');

const admin = require('express').Router()


admin.use(async (req, res, next) => {
    let ccp = buildCCPOrg1();
    req.caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    req.wallet = await buildWallet(Wallets, path.join(__dirname, '..', 'wallet'));
    next()
})


admin.post('/registerUser', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let mspId = 'Org1MSP'
    let department = req.body.department

    await registerUser(req.caClient, mspId, username, password, department, req.wallet)

    res.json({
        status: 200,
        message: `${username} is registered successfully`
    })
})

module.exports = admin