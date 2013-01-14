var participants;		//people currently running an instance of the hangout

gapi.hangout.onApiReady.add(function(eventObj){
	if (eventObj.isApiReady) {
		participants = gapi.hangout.getEnabledParticipants();
		console.log(participants);
		printParticipants();
	}
});

function printParticipants(){
	var members = "";
	for (var i = 0; i < participants.length; i++){
		members = members + participants[i].person.displayName;
	}
	document.getElementById('particpants').innerHTML = members;
}