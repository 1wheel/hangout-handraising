var participants;		//people currently running an instance of the hangout

gapi.hangout.onApiReady.add(function(eventObj){
	if (eventObj.isApiReady) {
		participants = gapi.hangout.getEnabledParticipants();
		console.log(participants);
		printParticipants();

		gapi.hangout.onParticipantsChanged.add(onParticipantsChange);
	}
});

var onParticipantsChange = function(eventObj) {
	participants = eventObj.participants;
	printParticipants();
};


function printParticipants(){
	var members = "";
	for (var i = 0; i < participants.length; i++){
		members = members + participants[i].person.displayName;
	}
	document.getElementById('particpantsList').innerHTML = members;
} 

// Allocate image resource
var greenDot = gapi.hangout.av.effects.createImageResource('http://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png');

// Use an onLoad handler
greenDot.onLoad.add( function(event) {
	if ( !event.isLoaded ) {
		alert("Could not load your overlay.");
		greenDot.dispose();
	} 
	else {
		alert("Overlay loaded.");
	}});

// Create a statically positioned overlay that will be 50% of the width
// of the video feed.
var greenDotOverlay = greenDot.createOverlay(
	{'scale':
		{'magnitude': 0.5, 'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});

// Place the text x-centered and halfway down the frame
greenDotOverlay.setPosition(0, 0.25);
greenDotOverlay.setVisible(true);