// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const productModel = require('../models/productModel');
const {
	Card,
	Suggestion,
	Payload
} = require('dialogflow-fulfillment');

module.exports = {
	
	index: function (agent)
	{
		let elements = [];
		let category_info = agent.query.replace("show-products", "");
		category_info = JSON.parse(category_info);
		console.log(category_info);
		let originalRequest = agent.originalRequest;
		let sender_user= {};
		if (originalRequest.source === "facebook") {
			sender_user.id =  originalRequest.payload.data.sender.id;
			sender_user.platform = "facebook";
		}
		
		const facebookPayload = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: []
				}
			}
		};
		
		return productModel.getProductList(category_info).then(function (result) {
			if (result) {
				result.forEach(function(item) {
					let ctx = {
						"item_id": item._id,
						"item_name": item.item_name,
						"category_id": item.category_id,
						"store_owner_id": item.store_owner_id,
					};
					const element = {
						"title": item.item_name,
						"image_url": item.item_image,
						"subtitle": item.item_price + " ¥",
						"default_action": {
							"type": 'web_url',
							"url": item.item_image,
						},
						"buttons": [
							{
								"type": 'postback',
								"title": 'Add To List',
								"payload": 'add-to-list' + JSON.stringify(ctx)
							}
						]
					};
					elements.push(element);
				});
				facebookPayload.attachment.payload.elements = elements;
				return new Payload(agent.FACEBOOK, facebookPayload);
			}
			else {
				agent.add("Sorry There is no catagories for this store.Choose other stores.");
			}
		}).catch();
	}
	
};