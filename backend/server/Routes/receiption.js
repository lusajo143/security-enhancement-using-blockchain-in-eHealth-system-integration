const Router = require('express').Router

const reception = Router()

let ccp
let caClient
let wallet

async function init() {
    try {
        ccp = buildCCPOrg1();
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		wallet = await buildWallet(Wallets, walletPath);
    } catch (error) {
        
    }
}
init()

reception.post('/registerPatient', (req, res) => {
    let fname = req.body.fname
    let mname = req.body.mname
    let lname = req.body.lname
    let kinName = req.body.kinName
    let phone = req.body.phone
    let dob = req.body.dob
    let kinPlace = req.body.kinPlace
    let relationship = req.body.relationship
    let kinPhone = req.body.kinPhone
})

module.exports = reception


