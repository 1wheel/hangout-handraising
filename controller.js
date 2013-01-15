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
var greenDot = gapi.hangout.av.effects.createImageResource('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90BDwMNIxL4LdEAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAuNJREFUeNrtmy2M2mAYx3/tTsxchliWnDi1kAxBhsE0aTBkbkPg0Ljhlp1CYnF3Dj03wbBnSJOaMywTXLKcOkGyICBnJrhsog9Lj7Xlo3y078s/qSx9/z+e9/N5XoMdy3Z5BpwBOaAgTw44B14CM2AC3ANDYCDPEBg5Fo+7bJ+xI9MvgBJQB97H/Lke0AH6jsU0sQBsFwMoAs0tmI6C0QJuHIs/iQAgxsvAFwnpfWgM1IDruCCMmObfAl+B1xxGd0DVsfi+VwC2y3MJxU8kQ22g6Vj83jkA2+UN8AM4IVmaAXnH4nadl8w1zX+Q6Slp5pE2DaWN2wdgu3wEuiRfXWnr9gDYLp+BS9KjS2lz/DFAaKbJvF8Nx+JqYwDSn7qkWxXH4tvaAGS0H6KGcmGzgxExzz8kdLTfdIo8DVonhA2CLYXMz6fI1koRIMvbAWqqsLhsNgI2Nj8PuLbfx94h699ALXaBssLmEW/lwAiQf//XHre0h9IYeDWPAn8EFDUwj3gsBnWBJvqo+aQLyBneBL2UcSym8wgooZ9K/i5Q1xBAHcCQc/sZeurExEta6KozEy9Lo6tyJl6qSlcVjgCOXcDL0uqqcxPIaAwgY6K5TA33AH5NTLzKDF11b6LO0fcmGpqoewC6igZHAMcuACONAYxMqcPraWi+51g8zhdCHQ0BdOYLIYC+hgD6/wBIBWZPs/Cf+iMAQrKniqrl3wvMdYOXNlJdY/H6FIDkymoaAKhFZYev8VLIqupOPBIIQMhUFQZQXSyu/u9ARCoo2gqabwcVVYedCDVRK1s0IyT7HQhAqqnyCgHIh1WSh54JSl1dRQHzlagK8shDUamwbKTYfCOqSnQpAIFwBVyk0PzFsjphWOPCRMqKphurmF8LgEBIQ/F0ZVnYbwxAIOh7ZcY3O5wmbLHUxiuGvl33Re2vzcXKDcqHs8C7PW+lx/LNbBzzsSNgIRr0vDobAkO/y9MRMBJ9ff4vhV3btM/DqFkAAAAASUVORK5CYII=');

// Create a statically positioned overlay that will be 25% of the width
var greenDotOverlay = greenDot.createOverlay(
	{'scale':
		{'magnitude': 0.25, 'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});

// Place the text x-centered and halfway down the frame
greenDotOverlay.setPosition(.4, -.35);
greenDotOverlay.setVisible(true);