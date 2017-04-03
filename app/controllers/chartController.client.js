"use strict";

const buttons = document.querySelectorAll('div.options > button');
const deleteButton = document.querySelector('.delete');

if (deleteButton) {
	deleteButton.addEventListener('click', function(e){
		const apiurl = window.location.href;

		ajaxFunctions.ajaxRequest('DELETE', apiurl, function(info){
			window.location.replace('http://localhost:8080/user-polls');
		})
	})

}


for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", function(e){
		//send the button value the url
		const apiUrl= window.location.href+"index="+e.target.value;
		//post a req to url route
		ajaxFunctions.ajaxRequest('POST', apiUrl, function(info){
			//try JSON.parse(info)
			try{
				//if it does not produce an error reload page
				//which means the response is json
				//also which means that the user is logged in
				const infos = JSON.parse(info);
				if (infos) {
					//if response is and error obj then the user already voted
					if (JSON.stringify(infos) !== '{"error":"you have already voted"}') {
						location.reload();
					}else{
						alert("you have already voted on this chart");
						window.location.replace('http://localhost:8080/polls');
					}
				}
			//if it produces an error catch it and redirect visitoe to login page
			}catch(error){
				window.location.replace('http://localhost:8080/login');
			}
		});
	})
}