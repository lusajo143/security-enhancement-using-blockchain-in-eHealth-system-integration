const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
// const { BlockDecoder } = require('fabric-common')
const path = require('path');
const { buildCAClient, enrollAdmin, registerUser, enrollUser } = require('./Utils/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./Utils/AppUtil');
const fs = require('fs')



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
        app.locals.wallet = await buildWallet(Wallets);

    } catch (error) {
    }
}
init()


const express = require('express')
const cors = require('cors');
const reception = require('./Routes/receiption.js');
const universal = require('./Routes/universal.js');
const { getContract, getQSCC } = require('./Utils/Utils.js');
const consultation = require('./Routes/consultation.js');
const lab = require('./Routes/lab.js');
const admin = require('./Routes/admin.js');
const accountant = require('./Routes/accountant.js');
const pharmacy = require('./Routes/pharmacy.js');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ urlencoded: true }))

app.use(cors())

// Wallet middleware
app.use((req, res, next) => {
    res.locals.wallet = app.locals.wallet
    // console.log(res.locals.wallet);
    next()
})


app.use(universal)
app.use('/admin', admin)
app.use('/reception', reception)
app.use('/consultation', consultation)
app.use('/lab', lab)
app.use('/accountant', accountant)
app.use('/pharmacy', pharmacy)

app.get('/init', async (req, res) => {
    // await enrollAdmin(caClient, wallet, 'admin', 'adminpw', mspOrg1);

    // await registerAndEnrollUser(caClient, wallet, mspOrg1, 'receptionist', 'org1.department1');

    await registerUser(caClient, mspOrg1, 'receptionist1', 'receptionist1', 'org1.department1', wallet, 'reception')
    await registerUser(caClient, mspOrg1, 'doctor1', 'doctor1', 'org1.department1', wallet, 'consultation')
    await registerUser(caClient, mspOrg1, 'technician1', 'technician1', 'org1.department1', wallet, 'lab')
    await registerUser(caClient, mspOrg1, 'accountant1', 'accountant1', 'org1.department1', wallet, 'accountant')
    await registerUser(caClient, mspOrg1, 'pharmacy1', 'pharmacy1', 'org1.department1', wallet, 'pharmacy')

    // let contract = await getContract('admin')
    // contract.submitTransaction('InitLedger')


    res.send('done')
})

app.post('/enroll', async (req, res) => {
    let userId = req.body.userId
    let userSecret = req.body.userSecret


    if (userId == 'admin') {
        let response = await enrollAdmin(caClient, wallet, userId, userSecret, mspOrg1);

        let contract = await getContract('admin')
        contract.submitTransaction('InitLedger')
        res.status(200).json({ status: 200, section: 'admin' })
    } else {
        response = await enrollUser(caClient, userId, userSecret, wallet, mspOrg1)

        console.log(response);
        if (response) {
            const contract = await getContract(userId)
            let attr = await contract.evaluateTransaction('getUserAttrs')
            let AttrJson = JSON.parse(attr.toString())
            console.log(AttrJson);
            res.status(200).json({ status: 200, section: AttrJson.user })
        } else {
            res.json({ status: 500, message: 'Failed to enroll user' })
        }
    }

})

app.get('/download-id/:userId', async (req, res) => {
    let userId = req.params.userId

    try {
        res.status(200).download('wallet/' + userId + '.id')

        // fs.unlink('wallet/'+userId+'.id')
    } catch (error) {
        res.status(404).end()
    }

})

// app.get('/b', async (req, res) => {

//     let contract = await getQSCC('admin')
//     let info = await contract.evaluateTransaction('GetChainInfo', channelName)
//     const blockProto = JSON.stringify(common.BlockchainInfo.decode(info));
//     console.log(blockProto);
//     // let block  = await contract.evaluateTransaction('GetBlockByNumber',
//     // 'mychannel', 0)
//     // console.log(BlockDecoder.decode(block));
//     res.send('contract')
// })

app.post('', async (req, res) => {
    console.log(req.body);
    // Default is not connected (check the use of jwt)
    if (req.body.type == 'check') {
        let username = req.body.username
        let id = await app.locals.wallet.get(username)
        if (id) {
            res.json({ state: 1 })
        } else {
            res.json({ state: 0 })
        }
    } else if (req.body.type == 'connect') {
        try {
            let username = req.body.username
            await app.locals.wallet.put(username, JSON.parse(req.body.id))
            console.log(username);
            let wallet = await buildWallet(Wallets, walletPath)

            await wallet.put(username, JSON.parse(req.body.id))

            let section = 'admin'

            if (username != 'admin') {
                const contract = await getContract(username)

                let attr = await contract.evaluateTransaction('getUserAttrs')
                let AttrJson = JSON.parse(attr.toString())
                console.log(AttrJson);

                if (AttrJson.user == "reception") {
                    section = 'reception'
                } else if (AttrJson.user == 'consultation') section = 'consult'
                else if (AttrJson.user == 'lab') section = 'lab'
                else if (AttrJson.user == 'accountant') section = 'account'
                else if (AttrJson.user == 'pharmacy') section = 'pharmacy'

            }

            res.json({ url: `http://localhost:4200/${section}/dashboard` })
        } catch (error) {
            console.log(error);
        }
    } else if (req.body.type == 'logout') {
        app.locals.wallet.remove(req.body.username)
        res.json({}).end()
    }
})


app.post('/enrollAdmin', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let response = await enrollAdmin(caClient, wallet, username, password, mspOrg1);

    if (response) {
        let contract = await getContract('admin')
        contract.submitTransaction('InitLedger')
        res.status(200).json({ status: 200, message: 'Successfully enrolled admin' })
    } else {
        res.status(500).json({ status: 500, message: 'Failed to enroll admin' })
    }

})

app.get('/getDrugs', async (req, res) => {
    const contract = await getContract('admin')
    let result = await contract.evaluateTransaction('getDrugs', 'Org1')
    res.json(JSON.parse(result.toString()))
})

app.post('/calcost', async (req, res) => {
    let amount = req.body.amount
    let drug_id = req.body.drug_id

    let contract = await getContract('admin')
    let result = await contract.evaluateTransaction('calculateDrugCost', 'Org1', drug_id, amount)
    res.send(result.toString())
})

app.post('/getPatient', async (req, res) => {
    let patient_id = req.body.patient_id

    console.log(patient_id);

    let contract = await getContract('admin')
    let result = await contract.evaluateTransaction('getPatient', patient_id)
    res.json({ status: 200, data: JSON.parse(result.toString()) })
})

app.get('/getDashData', async(req, res) => {

    let contract = await getContract('admin')
    let orgs = await contract.evaluateTransaction('getAllOrgs')
    let patients = await contract.evaluateTransaction('getAllPatients')
    let Orgs =  JSON.parse(orgs.toString())
    let active = 0
    let treated = 0
    Orgs.forEach(org => {
        if (org.orgId == 'Org1') {
            active = org.patients_Track.length,
            treated = org.patients_Treated.length
        }
    });

    res.json({ status: 200, data: {
        orgs: Orgs,
        patients: JSON.parse(patients.toString()),
        active,
        treated,
        ccp: buildCCPOrg1()
    } })
})

app.listen(5000, () => console.log("Server listening at 5000"))
