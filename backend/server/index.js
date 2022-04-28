const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./Utils/CAUtil.js');
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

const app = express()

app.use(express.json())
app.use(express.urlencoded({urlencoded: true}))

app.use(cors())


app.use(universal)
app.use('/reception',reception)

app.get('/init', async (req, res) => {
    await enrollAdmin(caClient, wallet, mspOrg1);

    await registerAndEnrollUser(caClient, wallet, mspOrg1, 'receptionist', 'org1.department1');

    let contract = await getContract('admin')
    contract.submitTransaction('InitLedger')

    res.send('done')
})



app.listen(5000, ()=>console.log("Server listening at 5000"))
