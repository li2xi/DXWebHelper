
(function() {

	console.log("http_response_process.js added.")

	var dx_ids_to_block_setting = ["155164"]


	var data = { type: "FROM_PAGE", text: "Hello from the webpage!", action: 'getOption', option: 'ids_to_block' };
	window.postMessage(data, "*");

	window.addEventListener("message", function(event){
		if (event.data.action == 'optionUpdated') {
			value = event.data.value
			if (event.data.option == 'ids_to_block') {
				ids = event.data.value
				console.log("message_blocker.js getOption", ids);
				ids = ids.split(",");
				dx_ids_to_block_setting = ids;
			}
		}
	})



	function pruneResponse(ori_response, dx_ids_to_block) {


		// console.log(ori_response)
		// console.log(ori_response.data.res[0])

		reses = []
		for (var i = 0; i < ori_response.data.res.length; i++) {
			var parsed_obj = Protocol.Response.fromBase64(ori_response.data.res[i]);
			console.log("parsed_obj", parsed_obj)

			pruned_msgs = []
			for (i in parsed_obj.msgs) {
				msg_obj = parsed_obj.msgs[i]
				console.log(dx_ids_to_block)
				console.log(msg_obj.fromUid)
				console.log(dx_ids_to_block.includes(msg_obj.fromUid))
				if (!dx_ids_to_block.includes(msg_obj.fromUid)) {
					pruned_msgs.push(msg_obj)
				}
			}
			parsed_obj.msgs = pruned_msgs
			parsed_obj.bufferInited = false
			reses.push(parsed_obj.getBase64())
		}


		return {"data": { "res":reses,
							"next":ori_response.data.next},
				"rescode": 0}
	}


	function modifyResponse(response) {

	    var original_response, modified_response;

	    if (this.readyState === 4) {
	        // 使用在 openBypass 中保存的相关参数判断是否需要修改
	        if (this.requestURL == 'https://api.neixin.cn/msg/api/chat/v1/history/byid') {

	        	try {

		        	console.log("original_response", this)
		            original_response = response.target.responseText;
		            Object.defineProperty(this, "responseText", {writable: true});
		            modified_response = pruneResponse(JSON.parse(original_response), dx_ids_to_block_setting)
		            // 根据 sendBypass 中保存的数据修改响应内容
		            console.log("modified")
		            console.log(JSON.stringify(modified_response))
		            this.responseText = JSON.stringify(modified_response);
	        	} catch(e) {
	        		console.log(e)
	        	} 

	        }
	    }
	}

	function openBypass(original_function) {

	    return function(method, url, async) {
	        // 保存请求相关参数
	        this.requestMethod = method;
	        this.requestURL = url;

	        this.addEventListener("readystatechange", modifyResponse);
	        return original_function.apply(this, arguments);
	    };

	}

	function sendBypass(original_function) {
	    return function(data) {
	        // 保存请求相关参数
	        this.requestData = data;
	        return original_function.apply(this, arguments);
	    };
	}

	XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
	XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);


}());

