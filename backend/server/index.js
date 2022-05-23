const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin, registerUser, enrollUser } = require('./Utils/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./Utils/AppUtil');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

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


const express = require('express')
const cors = require('cors');
const reception = require('./Routes/receiption.js');
const universal = require('./Routes/universal.js');
const { getContract } = require('./Utils/Utils.js');
const consultation = require('./Routes/consultation.js');
const lab = require('./Routes/lab.js');

const app = express()

app.use(express.json())
app.use(express.urlencoded({urlencoded: true}))

app.use(cors())


app.use(universal)
app.use('/reception',reception)
app.use('/consultation', consultation)
app.use('/lab', lab)

app.get('/init', async (req, res) => {
    await enrollAdmin(caClient, wallet, mspOrg1);

    // await registerAndEnrollUser(caClient, wallet, mspOrg1, 'receptionist', 'org1.department1');

    await registerUser(caClient, mspOrg1, 'receptionist1', 'receptionist1', 'org1.department1', wallet)
    await registerUser(caClient, mspOrg1, 'doctor1', 'doctor1', 'org1.department1', wallet)
    await registerUser(caClient, mspOrg1, 'technician1', 'technician1', 'org1.department1', wallet)
    await registerUser(caClient, mspOrg1, 'accountant1', 'accountant1', 'org1.department1', wallet)

    let contract = await getContract('admin')
    contract.submitTransaction('InitLedger')

    res.send('done')
})

app.post('/enroll', async (req, res) => {
    let userId = req.body.userId
    let userSecret = req.body.userSecret
    
    let response = await enrollUser(caClient, userId, userSecret, wallet, mspOrg1)

    console.log(response);
    if (response) {
        res.status(200).json({status: 200, message: 'Enrolled user successfully'})
    } else {
        res.status(500).json({status: 500, message: 'Failed to enroll user'})
    }
})

app.get('/download-id/:userId', async(req, res) => {
    let userId = req.params.userId

    try {
        res.status(200).download('wallet/'+userId+'.id')
    } catch (error) {
        res.status(404).end()
    }

})



app.listen(5000, ()=>console.log("Server listening at 5000"))
