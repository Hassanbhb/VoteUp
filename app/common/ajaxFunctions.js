"use strict"
const appUrl = window.location.origin;

const ajaxFunctions = {
	ready: function ready(fn){
		//check if fn is a function
		if (typeof fn !== 'function') {
			//if fn not a function don't do anything
			return;
		}

		if (document.readyState === 'complete') {
			return fn();
		}
		//if document has not yet loaded 
		document.addEventListener('DOMContentLoaded', fn, false);
	},

	ajaxRequest: function ajaxRequest(method, url, callback){
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if (xmlHttp.readyState == 4 && xmlHttp.status === 200) {
				callback(xmlHttp.response);
			}
		}
		xmlHttp.open(method, url, true);
		xmlHttp.send();
	}
}