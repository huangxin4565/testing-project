'use strict';

//unit test libs
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const faker = require('faker');
const proxyquireStrict = require('proxyquire').noCallThru();

//import mock objects
const S3Mock = require('./commons/S3Mock');
const EventMock = require('./commons/EventMock');
const ContextMock = require('./commons/ContextMock');

//import db sequelize
// const { db, sequelize } = require('../../models/index');

let userUtilsModule = {
	getUserInfo: (_) => {},
};
let mockDocID = undefined;

describe('unit testing for UOB error Email', async function () {
	before(async function () {
		// Create a fake document record to test
		// mockDocID = await db.documents.create({
		//     document_category_id: 1,
		//     document_uuid: "123",
		//     reference_type: "BUSINESS_ENTITY",
		//     document_path: "SG/230",
		//     document_uuid: "fakepath"
		// });
		// console.log("mockDocID: " + mockDocID.document_id);
	});
	after(async function () {
		//clean up if test fails
		// try {
		//     await db.documents.destroy({
		//         where: {
		//             document_path: "SG/230",
		//             document_uuid: "fakepath"
		//         }
		//     })
		// } catch (err) { }
	});

	it('if zip is working', async function () {
		this.timeout(5000);
		process.env.bucket_name = 'test_bucket';
		process.env.env = 'local';

		//generate fake event and context
		let event = EventMock;
		event.data = {
			invoice_id: 116,
			// invoice_number: 'INV90',
			// currency_code: 'SGD',
			// //invoice_issue_date
			// invoice_start_date: "2019-01-17",
			// invoice_due_date: "2019-03-31",
			// //purchase_order_reference_number
			// //invoice_total_tax_amount: wait for update, leave empty first
			// invoice_total_amount: 11550,
			// buyer_id: 245,
			// source: "CREATE",
			// status: "PENDING",
			// vendor_type: "VENDOR",
			// last_updated_datetime: new Date(),
			// payment_term: "7 Days",

			// address_id: 45,

			// invoice_line_item: [
			//     {
			//         quantity: 1000,
			//         price: 1050,
			//         item_name: 'fried chicken',
			//         uom_name: 'kg',
			//         unit_price: 1,
			//         tax_rate: 0.05,
			//         //tax_amount: 50,
			//         product_code: 'fc01'
			//     },

			//     {
			//         quantity: 10000,
			//         price: 10500,
			//         item_name: 'chicken legs',
			//         uom_name: 'kg',
			//         unit_price: 1,
			//         tax_rate: 0.05,
			//         //tax_amount: 500,
			//         product_code: 'cl01'
			//     }
			// ],
			// invoice_tax: {
			//     tax_id: 32,
			//     invoice_total_tax_amount: 50,
			//     tax_code: "GST",
			//     tax_rate: 5,
			//     tax_amount_in_local_currency: 50
			// }
		};
		let context = ContextMock;

		//test functions
		// sinon.stub(userUtilsModule, "getUserInfo").returns({
		//     user: {
		//         business_entity_id: 1,
		//         business_entity: {
		//             country_code: 1
		//         }
		//     }
		// });

		// mock required modulesn
		var sftp = proxyquireStrict('../../modules/bank-integration/cloudwatch-check-sftp', {
			// "../../utils/user-utils": userUtilsModule,
			'aws-sdk': {
				S3: S3Mock,
			},
		});

		// get business result from function
		let resp = await sftp.handler(event, context);
		let result = JSON.stringify(resp);
		console.log('result: ' + result);

		//retrieve the result
		// let mockDocObj = await db.documents.findOne({
		//     where: {
		//         document_id: mockDocID.document_id
		//     }
		// });

		// expect(mockDocObj).to.be.null;
	});
});
