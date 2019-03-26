// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const addToCartModel = require('../models/addToCartModel');
const productModel = require('../models/productModel');
const fetch = require('node-fetch');

const {
	Card,
	Suggestion,
	Payload
} = require('dialogflow-fulfillment');


var self = module.exports = {
	
	index: function (agent)
	{
		let elements = [];
		let item_info = agent.query.replace("add-to-list", "");
		item_info = JSON.parse(item_info);
		console.log(item_info);
		let originalRequest = agent.originalRequest;
		let sender_user= {};
		if (originalRequest.source === "facebook") {
			sender_user.id =  originalRequest.payload.data.sender.id;
			sender_user.platform = "facebook";
		}
		
		return addToCartModel.addCart(item_info, sender_user).then(function (result) {
			if (result) {
				return "You have selected item  [" + item_info.item_name + "]";
			}
			else {
				return "Sorry We could not add to cart.Please wait for a moment.";
			}
		}).catch();
	},
	
	getCart: function(agent)
	{
		let elements = [];
		let originalRequest = agent.originalRequest;
		let sender_user= {};
		if (originalRequest.source === "facebook") {
			sender_user.id =  originalRequest.payload.data.sender.id;
			sender_user.platform = "facebook";
		}
		
		return addToCartModel.getCartList(sender_user).then(function (allCartInfo) {
			const cartInfos=[];
			if (allCartInfo) {
				const productInfos=[];
				
				[1,2,3].reduce((promise,item) => {
					return promise.then(() => {
						return new Promise((resolve, reject)=> {
							resolve(item);
						})
					})
				},Promise.resolve());
				
				let resultresult = allCartInfo.reduce(function(promise, item) {
					console.log("allCartInfo----------",item);
					return promise.then(function() {
						productInfos.push(productModel.getProduct(item.product_id).then((result) => {
							return result; // important to return the value
						}));
					});
				}, Promise.resolve());
				console.log(resultresult);
				return productInfos;
			}
			else {
				return "Sorry We could not add to cart.Please wait for a moment.";
			}
		}).then(function (result) {
			console.log("result----------");
			console.log(result);
			return self.sendTextMessage(result, sender_user.id);
		}).catch();
	},
	
	sendTextMessage: function (productInfo, recipient_id) {
		
		
		const message = {
			"attachment":{
				"type":"template",
				"payload":{
					"template_type":"receipt",
					"recipient_name":"Stephane Crozatier",
					"order_number":"12345678902",
					"currency":"USD",
					"payment_method":"Visa 2345",
					"order_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjG7B1O6FyVHlXRzmz1KwOxB8Yy-G5LFNIVljguM5ltaiWQ8V_",
					"timestamp":"1428444852",
					"address":{
						"street_1":"1 Hacker Way",
						"street_2":"",
						"city":"Menlo Park",
						"postal_code":"94025",
						"state":"CA",
						"country":"US"
					},
					"summary":{
						"subtotal":75.00,
						"shipping_cost":4.95,
						"total_tax":6.19,
						"total_cost":56.14
					},
					"adjustments":[
						{
							"name":"New Customer Discount",
							"amount":20
						},
						{
							"name":"$10 Off Coupon",
							"amount":10
						}
					],
					"elements":[
						{
							"title":"Classic White T-Shirt",
							"subtitle":"100% Soft and Luxurious Cotton",
							"quantity":2,
							"price":50,
							"currency":"USD",
							"image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjG7B1O6FyVHlXRzmz1KwOxB8Yy-G5LFNIVljguM5ltaiWQ8V_"
						},
						{
							"title":"Classic Gray T-Shirt",
							"subtitle":"100% Soft and Luxurious Cotton",
							"quantity":1,
							"price":25,
							"currency":"USD",
							"image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjG7B1O6FyVHlXRzmz1KwOxB8Yy-G5LFNIVljguM5ltaiWQ8V_"
						}
					]
				}
			}
		};
		
		console.log("-------productInfo------");
		// console.log(productInfo);

		return fetch(
			`https://graph.facebook.com/v2.6/166756946856766/messages?access_token=EAAMVT32OZBEgBACkZBcIX4QkCiiXti2P68KWnVfjcbA09DXnWEPErVyoSBupXy2lIiLvHBKdmOEwFZArlOKCyO0ZAbVQPllUWZBZBPaNuZCe0ZBpOwSebHEEN7HFNsHnY10le9HeTBpmI1H49exOX7KodLg6MZAlIOLg5SZCbmEvbLewdkYr7qBDvT`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					messaging_type: 'RESPONSE',
					recipient: {
						id: recipient_id,
					},
					"message":message,
				}),
			}
		);
	}
	
};
