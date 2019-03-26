// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://onixoni:q1w2e3r4@aniksandbox-6djkq.mongodb.net/admin";
const dbName = 'sandbox';
const ObjectId = require('mongodb').ObjectId;

var self = module.exports = {
	
	getCollection: function (collectionName)
	{
		return MongoClient.connect(url, {
			useNewUrlParser: true
		}).then(function(client) {
			return Promise.resolve(client.db(dbName));
		}).then(function(db) {
			return db.collection(collectionName);
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	},
	
	getProductList: function (category_info)
	{
		console.log(category_info);
		return this.getCollection('item_info').then(function(result) {
			return result.find({category_id:category_info.category_id}).toArray();
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	},
	
	getProduct: function (product_id)
	{
		return new Promise((resolve) => {
			return this.getCollection('item_info').then(function(result) {
				const o_id = new ObjectId(product_id);
				// return result.findOne({_id:o_id});
				resolve(result.findOne({_id:o_id}));
			}, function(err) {
				console.log(err);
				return err;
			});
		});
		
		
	},
	
	createUser: function (user_info, selected_store = "")
	{
		console.log("createUser");
		const insert = {
			user_id : user_info.id,
			platform : user_info.platform,
			selected_store : selected_store.store_id,
			create_date : new Date().toISOString(),
			update_date : new Date().toISOString(),
		};
		
		return this.getCollection('user_info').then(function(result) {
			return result.insertOne(insert);
		}, function(err) {
			console.log(err);
			return err;
		}).catch();
	}
	
	
};