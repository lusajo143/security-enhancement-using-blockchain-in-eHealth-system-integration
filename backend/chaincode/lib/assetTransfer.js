/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity

class AssetTransfer extends Contract {

    async InitLedger(ctx) {

        const orgs = [
            {
                orgId: 'Org1',
                name: 'Muhimbili Hospital',
                patients_Track: [],
                drugs: []
            },
            {
                orgId: 'Org2',
                name: 'Benjamin Mkapa Hospital',
                patients_Track: [],
                drugs: []
            },
            {
                orgId: 'Org3',
                name: 'Dodoma Hospital',
                patients_Track: [],
                drugs: []
            }
        ]

        // Initialize patients
        const patients = []
        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        // Initialize medical records
        const medicalRecords = []
        await ctx.stub.putState('medicalRecords', Buffer.from(stringify(medicalRecords)))

        // Initialize Organizations (Hospitals)
        await ctx.stub.putState('Orgs', Buffer.from(stringify(orgs)))


        // Initialize specific org data
        for (const org of orgs) {
            await ctx.stub.putState(org.orgId, Buffer.from(JSON.stringify(org)))
        }

    }

    // Utils

    async isPatientRegistered(ctx, fname) {
        const patients = await ctx.stub.getState('Patients')
        let found = 'not found'
        for (const patient of patients) {
            if (patient.fname == fname) {
                found = 'found'
            }
        }
        return found
    }

    async getAllOrgs(ctx) {
        const orgs = await ctx.stub.getState('Orgs')
        if (!orgs || orgs.length === 0) {
            throw new Error('Organizations not found')
        }
        return orgs.toString()
    }

    async getUserId(ctx) {
        let cid = new ClientIdentity(ctx.stub)
        return cid.getUserId
    }


    async registerPatient(ctx, id, fname, mname, lname, gender, kinName, phone, dob, kinPlace, relationship, kinPhone, plocation) {
        const patient = {
            id, fname, mname, lname, gender, kinName, phone, dob, kinPlace, relationship, kinPhone, plocation,
            visits: []
        }

        // var patients = await ctx.stub.getState('Patients')
        var patients = await ctx.stub.getState('Patients')

        var patientsJson = JSON.parse(patients.toString())
        patientsJson.push(patient)
        await ctx.stub.putState('Patients', Buffer.from(stringify(patientsJson)))

        return "Done"

    }

    async getAllPatients(ctx) {
        const patientsJson = await ctx.stub.getState('Patients')
        if (!patientsJson || patientsJson == null) {
            throw new Error("Error occured")
        }

        return patientsJson.toString()

    }

    async updatePatientStatus(ctx, patient_id, org, status) {
        let orgs = await ctx.stub.getState(org)

        if (!orgs || orgs == null) {
            throw new Error(`${org} is not a registered organization`)
        }

        orgs = JSON.parse(orgs.toString())

        let found = false

        for (let i = 0; i < orgs.patients_Track.length; i++) {
            if (patient_id == orgs.patients_Track[i].patient_id) {
                found = true
                orgs.patients_Track[i].status = status
                await ctx.stub.putState(org, Buffer.from(stringify(orgs)))
                return stringify({ status: 200, message: "Updated patient status successfully" })

                // break
            }
        }

        if (!found) {
            orgs.patients_Track.push({
                patient_id,
                status
            })
            await ctx.stub.putState(org, Buffer.from(stringify(orgs)))
            return stringify({ status: 200, message: "Recorded new patient status successfully" })
        }
    }

    async getReceptionPatients(ctx, Org) {
        // Get all patients
        let Patients = await ctx.stub.getState('Patients')
        if (!Patients || Patients == null) throw new Error('Patients not found')

        Patients = JSON.parse(Patients.toString())

        // Get Tracked patients
        let org = await ctx.stub.getState(Org)
        let OrgJson = JSON.parse(org.toString())
        let TrackedPatients = OrgJson.patients_Track

        // Filter patients
        let results = []

        Patients.forEach(patient => {
            let found = false
            TrackedPatients.forEach(trackedPatient => {
                if (patient.id == trackedPatient.patient_id) found = true
            });
            if (!found) {
                results.push(patient)
            }
        });

        return JSON.stringify(results)

    }

    // Consultation
    async getConsultationPatients(ctx, Org) {
        // Get all patients
        let Patients = await ctx.stub.getState('Patients')
        if (!Patients || Patients == null) throw new Error('Patients not found')

        Patients = JSON.parse(Patients.toString())

        // Get Tracked patients
        let org = await ctx.stub.getState(Org)
        let OrgJson = JSON.parse(org.toString())
        let TrackedPatients = OrgJson.patients_Track

        // Filter patients
        let results = []

        TrackedPatients.forEach(trackedPatient => {
            // let found = false

            Patients.forEach(patient => {
                if ((patient.id == trackedPatient.patient_id && trackedPatient.status == "consultation") ||
                (patient.id == trackedPatient.patient_id && trackedPatient.status == "labconsultation")) {
                    results.push(patient)
                }
            });

        });

        return JSON.stringify(results)
    }

    async sendPatientToLab(ctx, patient_id, doctor, org, complain, historyComplain, tests) {
        // Send patient to lab

        let results = await this.updatePatientStatus(ctx, patient_id, org, 'lab')

        results = JSON.parse(results.toString())

        if (!results || results == null || results.status != 200) {
            throw new Error('Failed to update status')
        }

        let patients = await ctx.stub.getState('Patients')

        patients = JSON.parse(patients.toString())

        // Prepare visit
        // let doctor = await this.getUserId(ctx)
        const visit = {
            doctor,
            examination: {
                complain,
                historyComplain,
                tests
            }
        }

        for (let index = 0; index < patients.length; index++) {
            let patient = patients[index];
            if (patient.id == patient_id) {
                patient.visits.push(visit)
                break
            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        return JSON.stringify({status: 200, message: 'Successfuly sent patient to examination'})

    }

    async addPrescription(ctx, patient_id, org, prescription) {
        let results = await this.updatePatientStatus(ctx, patient_id, org, 'accountant')

        results = JSON.parse(results.toString())

        if (!results || results == null || results.status != 200) {
            throw new Error('Failed to update status')
        }

        let patients = await ctx.stub.getState('Patients')

        patients = JSON.parse(patients.toString())

        let fullname = ''

        for (let index = 0; index < patients.length; index++) {
            let patient = patients[index];
            if (patient.id == patient_id) {
                patient.visits[patient.visits.length-1].prescription = JSON.parse(prescription)
                fullname = patient.fname+' '+patient.mname+' '+patient.lname
                 
            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        return JSON.stringify({status: 200, message: `Successfuly sent ${fullname} to accountant`})
       
    }



    // Lab
    async getLabPatients(ctx, Org) {
        // Get all patients
        let Patients = await ctx.stub.getState('Patients')
        if (!Patients || Patients == null) throw new Error('Patients not found')

        Patients = JSON.parse(Patients.toString())

        // Get Tracked patients
        let org = await ctx.stub.getState(Org)
        let OrgJson = JSON.parse(org.toString())
        let TrackedPatients = OrgJson.patients_Track

        // Filter patients
        let results = []

        TrackedPatients.forEach(trackedPatient => {
            // let found = false

            Patients.forEach(patient => {
                if (patient.id == trackedPatient.patient_id && trackedPatient.status == "lab") {
                    results.push(patient)
                }
            });

        });

        return JSON.stringify(results)
    }

    async enterPatientTests(ctx, patient_id, org, visit) {
        let results = await this.updatePatientStatus(ctx, patient_id, org, 'labconsultation')

        results = JSON.parse(results.toString())

        if (!results || results == null || results.status != 200) {
            throw new Error('Failed to update status')
        }

        let patients = await ctx.stub.getState('Patients')

        patients = JSON.parse(patients.toString())

        let fullname = ''

        for (let index = 0; index < patients.length; index++) {
            let patient = patients[index];
            if (patient.id == patient_id) {
                patient.visits[patient.visits.length-1] = JSON.parse(visit)
                fullname = patient.fname+' '+patient.mname+' '+patient.lname
                 
            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        return JSON.stringify({status: 200, message: `Successfuly entered tests results for ${fullname}`})
       
    }



    // Accountant
    async getAccountantPatients(ctx, Org) {
         // Get all patients
         let Patients = await ctx.stub.getState('Patients')
         if (!Patients || Patients == null) throw new Error('Patients not found')
 
         Patients = JSON.parse(Patients.toString())
 
         // Get Tracked patients
         let org = await ctx.stub.getState(Org)
         let OrgJson = JSON.parse(org.toString())
         let TrackedPatients = OrgJson.patients_Track
 
         // Filter patients
         let results = []
 
         TrackedPatients.forEach(trackedPatient => {
             // let found = false
 
             Patients.forEach(patient => {
                 if ((patient.id == trackedPatient.patient_id && trackedPatient.status == "accountant")) {
                     results.push(patient)
                 }
             });
 
         });
 
         return JSON.stringify(results)
    }


    // Pharmacy
    async addDrug(ctx, Org, id, name, strength, type, quantity, price, vendor_name, location,
        phone, email, manu_date, exp_date, per_maker) {
            const drug = {
                id: `MD_${id}`,
                name, strength, type, quantity, price, vendor_name, location, phone, email,
                manu_date, exp_date, per_maker
            }

            let org = await ctx.stub.getState(Org)
            if (!org || org == null) {
                throw new Error(`${Org} is not found`)
            }

            org = JSON.parse(org.toString())

            org.drugs.push(drug)

            await ctx.stub.putState(Org, Buffer.from(stringify(org)))

            return JSON.stringify({status: 200, message: `Drug with id MD_${id} has been added successfully`})

        }

    // Get organization's drugs
    async getDrugs(ctx, Org) {
        let org = await ctx.stub.getState(Org)

        if (!org || org == null) {
            throw new Error(`${Org} is not found`)
        }

        org = JSON.parse(org.toString())
        return JSON.stringify({status: 200, data: org.drugs})
    }


    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
