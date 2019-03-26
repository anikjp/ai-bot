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
	
	getStore: function (user_info)
	{
		return this.getCollection('user_info').then(function(result) {
			return result.find({user_id:user_info.id}).toArray();
		}).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
	},
	
};