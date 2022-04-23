/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        
        const orgs = [
            {
                orgId: 'Org1',
                name: 'Muhimbili Hospital'
            },
            {
                orgId: 'Org2',
                name: 'Benjamin Mkapa Hospital'
            },
            {
                orgId: 'Org3',
                name: 'Dodoma Hospital'
            }
        ]

        // Initialize patients
        const patients = [{name: 'he'}]
        await ctx.stub.putState('Patients', Buffer.from(stringify(patients)))

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


    async registerPatient(ctx, id, fname, mname, lname, kinName, phone, dob, kinPlace, relationship, kinPhone) {
        const patient = {
            id, fname, mname, lname, kinName, phone, dob, kinPlace, relationship, kinPhone
        }

        // var patients = await ctx.stub.getState('Patients')
        var patients = await ctx.stub.getState('Patients')

        var patientsJson = JSON.parse(patients.toString())
        patientsJson.push(patient)
        await ctx.stub.putState('Patients', Buffer.from(stringify(patientsJson)))
        
        return patientsJson.toString()
        
    }

    async getAllPatients(ctx) {
        const patientsJson = await ctx.stub.getState('Patients')
        if (!patientsJson || patientsJson == null) {
            throw new Error("Error occured")
        }

        return patientsJson.toString()

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
