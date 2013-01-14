var _participants;		//people currently running an instance of the hangout

gapi.hangout.onApiReady.add(function(eventObj){
	if (eventObj.isApiReady) {
		_participants = gapi.hangout.enabledParicipants;
		printParticipants();
	}
}

function printParticipants(){
	var members = "";
	for (var i = 0; i < _participants.length; i++){
		members = members + _participants[i].displayName;
	}
	document.getElementById('particpants').innerHTML = members;
}