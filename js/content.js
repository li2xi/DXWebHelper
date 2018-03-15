{

	(function () {

	    'use strict';

		document.onreadystatechange = function () {
			if (document.readyState === "complete") {
				// initSetting();
			}
		}

	}());

	// add extension script to current webpage
	function addScript(path) {
		console.log("add script, ", path)
		var s = document.createElement("script");
		s.src = chrome.extension.getURL(path);
		s.onload = function() {
		    this.remove();
		};
		(document.head || document.documentElement).appendChild(s);
	}


	function initScript() {

		addScript("js/dx_sdk.js")
		addScript("js/http_response_process.js")


	}

	initScript()
	

	window.addEventListener("message", function(event) {
		console.log("entry.js, listener")
	    // We only accept messages from ourselves
	    if (event.source != window)
	        return;

	    if (event.data.type && (event.data.type == "FROM_PAGE")) {
	        console.log("Content script received message: " + event.data.text);
	        if (event.data.action == 'getOption') {
	        	console.log('entry.js, will send runtime message')
	        	chrome.runtime.sendMessage( {action: 'getOption',
											option: event.data.option,
											callback: function(value) {
													console.log("getOption", value);
													window.postMessage({type: 'optionUpdated',
																		option: event.data.option,
																		value: value}, "*")
												}})



	        	var port = chrome.runtime.connect({name: "敲门"});
				port.postMessage({action: 'getOption',
											option: event.data.option});
				port.onMessage.addListener(function(msg) {
					console.log("port.onMessage", msg);
					window.postMessage({action: 'optionUpdated',
										option: event.data.option,
										value:msg}, "*")
				});
	        	
	        }
	    }
	});

}
