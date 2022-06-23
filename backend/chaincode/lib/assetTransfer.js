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

    async getUserIdentity(ctx) {
        let cid = new ClientIdentity(stub);
        return stringify(cid)
        // if (cid.assertAttributeValue('role', 'approver')) {
        //     throw new Error('Not a valid user');
        // }
    }

    async getUserAttrs(ctx) {
        let cid = new ClientIdentity(ctx.stub)
    
        let user = {
            user: cid.getAttributeValue('_type').toString(),
            // position: cid.getAttributeValue('position').toString(),
            // org: cid.getAttributeValue('org').toString() // Org1
        }
    
        return user
    }
    

    async InitLedger(ctx) {

        const orgs = [
            {
                orgId: 'Org1',
                name: 'Branch A',
                users: [],
                patients_Track: [],
                patients_Treated: [],
                drugs: []
            },
            {
                orgId: 'Org2',
                name: 'Branch B',
                users: [],
                patients_Track: [],
                patients_Treated: [],
                drugs: []
            },
            {
                orgId: 'Org3',
                name: 'Branch C',
                users: [],
                patients_Track: [],
                patients_Treated: [],
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

    async registerUser(ctx, username, Org, type) {
        let org = await ctx.stub.getState(Org)
        if (!org || org == null) {
            throw new Error('Organization not found')
        }
        let OrgJson = JSON.parse(org.toString())
        OrgJson.users.push({
            username,
            type
        })
        await ctx.stub.putState(Org, Buffer.from(stringify(OrgJson)))
        return "done"
    }

    async getUsers(ctx, Org) {
        let org = await ctx.stub.getState(Org)
        if (!org || org == null) {
            throw new Error('Organization not found')
        }
        let OrgJson = JSON.parse(org.toString())
        return stringify(OrgJson.users)
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

    async getPatient(ctx, patient_id) {
        let patients = await ctx.stub.getState('Patients')
        if (!patients || patients == null) {
            throw new Error('Error occured')
        }

        patients = JSON.parse(patients.toString())
        let Patient
        patients.forEach(patient => {
            if (patient.id == patient_id) {
                Patient = patient
            }
        });

        return JSON.stringify(Patient)

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
            org,
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

        return JSON.stringify({ status: 200, message: 'Successfuly sent patient to examination' })

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
                patient.visits[patient.visits.length - 1].prescription = JSON.parse(prescription)
                fullname = patient.fname + ' ' + patient.mname + ' ' + patient.lname
                break
            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        return JSON.stringify({ status: 200, message: `Successfuly sent ${fullname} to accountant` })

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
                patient.visits[patient.visits.length - 1] = JSON.parse(visit)
                fullname = patient.fname + ' ' + patient.mname + ' ' + patient.lname

            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

        return JSON.stringify({ status: 200, message: `Successfuly entered tests results for ${fullname}` })

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

    async calculateDrugCost(ctx, Org, drug_id, amount) {
        let org = await ctx.stub.getState(Org)
        if (!org || org == null) {
            throw new Error(`Organization ${Org} not found`)
        }

        org = JSON.parse(org.toString())
        let cost
        org.drugs.forEach(drug => {
            if (drug.id == drug_id) {
                cost = amount * drug.price
            }
        });

        return cost.toString()
    }

    async changePaymentStatus(ctx, patient_id, status) {
        let patients = await ctx.stub.getState('Patients')

        patients = JSON.parse(patients.toString())

        for (let index = 0; index < patients.length; index++) {
            let patient = patients[index];
            if (patient.id == patient_id) {
                patient.visits[patient.visits.length - 1].paymentStatus = status
                break
            }
        }

        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))
        return JSON.stringify({ status: 200, message: 'Payment status updated successfully' })

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

        return JSON.stringify({ status: 200, message: `Drug with id MD_${id} has been added successfully` })

    }

    async getPharmacyPatients(ctx, Org) {
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
                if ((patient.id == trackedPatient.patient_id && trackedPatient.status == "pharmacy")) {
                    results.push(patient)
                }
            });

        });

        return JSON.stringify(results)
    }

    async endVisit(ctx, Org, patient_id) {
        // Get Tracked patients
        let org = await ctx.stub.getState(Org)
        let OrgJson = JSON.parse(org.toString())
        let TrackedPatients = OrgJson.patients_Track

        let tIndex = 0

        for (let index = 0; index < TrackedPatients.length; index++) {
            const tPatient = TrackedPatients[index];
            if (tPatient.patient_id == patient_id) {
                tIndex = index
                break
            }
        }

        // Remove patient from tracked patients
        OrgJson.patients_Track.splice(tIndex, 1)
        let found = false
        OrgJson.patients_Treated.forEach((patient) => {
            if (patient == patient_id) {
                found = true
            }
        });

        if (!found) {
            OrgJson.patients_Treated.push(patient_id)
        }

        await ctx.stub.putState(Org, Buffer.from(stringify(OrgJson)))

        return JSON.stringify({ status: 200, message: 'Ended visit successfully' })

    }

    // Get organization's drugs
    async getDrugs(ctx, Org) {
        let org = await ctx.stub.getState(Org)

        if (!org || org == null) {
            throw new Error(`${Org} is not found`)
        }

        org = JSON.parse(org.toString())
        return JSON.stringify({ status: 200, data: org.drugs })
    }


}

module.exports = AssetTransfer;
