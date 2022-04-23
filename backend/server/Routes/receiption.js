const Router = require('express').Router

const reception = Router()

let ccp
let caClient
let wallet
let contract

async function init() {
    try {
        ccp = buildCCPOrg1();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        wallet = await buildWallet(Wallets, walletPath);

        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: 'receptionist',
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await gateway.getNetwork(channelName);

            contract = network.getContract(chaincodeName);

        } catch (error) {

        }
    } catch (error) {

    }
}
init()

reception.post('/registerPatient', async (req, res) => {
    let fname = req.body.fname
    let mname = req.body.mname
    let lname = req.body.lname
    let kinName = req.body.kinName
    let phone = req.body.phone
    let dob = req.body.dob
    let kinPlace = req.body.kinPlace
    let relationship = req.body.relationship
    let kinPhone = req.body.kinPhone

    let result = await contract.submitTransaction('registerPatient', Date.now().toString(), fname,
        mname, lname, kinName, phone, dob, kinPlace,
        relationship, kinPhone)

    if (result.toString() == "Done") {
        res.json({status: 200, message: 'Patient registration completed'})
    } else {
        res.json({status: 500, message: 'Server error occured'})
    }
})

module.exports = reception


