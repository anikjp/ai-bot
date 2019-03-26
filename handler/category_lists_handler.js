// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const dbHandler = require('../models/execution-db');
const userModel = require('../models/userModel');
const {
	Card,
	Suggestion,
	Payload
} = require('dialogflow-fulfillment');

module.exports = {
	
	index: function (agent)
	{
		let store_info = agent.query.replace("start shopping", "");
		store_info = JSON.parse(store_info);
		const originalRequest = agent.originalRequest;
		let sender_user= {};
		let elements = [];
		if (originalRequest && originalRequest.source === "facebook") {
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
		
		return userModel.getUser(sender_user, store_info).then(function (result) {
			if (result) {
				return dbHandler.getCatagories().then(function (result) {
					if (result){
						result.forEach(function(item) {
							let ctx = {
								"category_id": item._id,
								"category_name": item.category_name
							};
							const element = {
								"title": item.category_name,
								"image_url": item.category_image,
								"subtitle": item.category_short_desc,
								"default_action": {
									"type": 'web_url',
									"url": item.category_image,
								},
								"buttons": [
									{
										"type": 'postback',
										"title": 'Show Products',
										"payload": 'show-products' + JSON.stringify(ctx)
									}
								]
							};
							elements.push(element);
						});
						console.log(elements);
						facebookPayload.attachment.payload.elements = elements;
						console.log(facebookPayload);
						return new Payload(agent.FACEBOOK, facebookPayload);
					}
					else {
						agent.add("Sorry There is no catagories for this store.Choose other stores.");
					}
				}).catch();
			}
		});
	}
	
};