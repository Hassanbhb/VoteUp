"use strict"

const f = document.querySelector('form');
const button = document.querySelector('.add');
const input = "<input class='option' type='text' placeholder='New Option' required>";

button.addEventListener('click', function(){
	createNewInput();
});

//value is two to count for the two already existing fields
let count = 2;
function createNewInput(){
	if (count < 8) {
		const newInput = document.createElement("input");
		newInput.className = "option";
		newInput.type = "text";
		newInput.name = "options["+(count+=1)+"][option]";
		newInput.placeholder = "New Option";
		document.querySelector('.inputs').appendChild(newInput);
	}else{
		alert('maximum is 8 options');
	}
	
}





