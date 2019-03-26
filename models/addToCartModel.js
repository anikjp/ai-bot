// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://onixoni:q1w2e3r4@aniksandbox-6djkq.mongodb.net/admin";
const dbName = 'sandbox';


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
	
	getCartList: function (user_info)
	{
		return this.getCollection('cart_list').then(function(result) {
			return result.find({user_id:user_info.id}).toArray();
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	},
	
	updateCart: function (user_info)
	{
		return this.getCollection('cart_list').then(function(result) {
			return result.find({user_id:user_info.id}).toArray();
		}, function(err) {
			console.log(err);
			return err;
		});
	},
	
	addCart: function (item_info, user_info)
	{
		console.log("addCart");
		const insert = {
			user_id : user_info.id,
			product_id : item_info.item_id,
			category_id : item_info.category_id,
			store_id : item_info.store_owner_id,
			quality : item_info.quality || 1,
			create_date : new Date().toISOString(),
			update_date : new Date().toISOString(),
		};
		
		return this.getCollection('cart_list').then(function(result) {
			return result.insertOne(insert);
		}, function(err) {
			console.log(err);
			return err;
		}).catch();
	}
	
	
};