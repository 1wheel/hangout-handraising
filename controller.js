var participants = [];		//people currently running an instance of the hangout
var queue = [];				//list of participant ids waiting to speak. 0 is the current speaker
var timeOut;			//unix time of when the current speaker's turn will end
var currentSpeakerId;	//id of the current speaker; on updates if it doesn't match queue, manager sets new time

var greenDot = gapi.hangout.av.effects.createImageResource('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90BDwMNIxL4LdEAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAuNJREFUeNrtmy2M2mAYx3/tTsxchliWnDi1kAxBhsE0aTBkbkPg0Ljhlp1CYnF3Dj03wbBnSJOaMywTXLKcOkGyICBnJrhsog9Lj7Xlo3y078s/qSx9/z+e9/N5XoMdy3Z5BpwBOaAgTw44B14CM2AC3ANDYCDPEBg5Fo+7bJ+xI9MvgBJQB97H/Lke0AH6jsU0sQBsFwMoAs0tmI6C0QJuHIs/iQAgxsvAFwnpfWgM1IDruCCMmObfAl+B1xxGd0DVsfi+VwC2y3MJxU8kQ22g6Vj83jkA2+UN8AM4IVmaAXnH4nadl8w1zX+Q6Slp5pE2DaWN2wdgu3wEuiRfXWnr9gDYLp+BS9KjS2lz/DFAaKbJvF8Nx+JqYwDSn7qkWxXH4tvaAGS0H6KGcmGzgxExzz8kdLTfdIo8DVonhA2CLYXMz6fI1koRIMvbAWqqsLhsNgI2Nj8PuLbfx94h699ALXaBssLmEW/lwAiQf//XHre0h9IYeDWPAn8EFDUwj3gsBnWBJvqo+aQLyBneBL2UcSym8wgooZ9K/i5Q1xBAHcCQc/sZeurExEta6KozEy9Lo6tyJl6qSlcVjgCOXcDL0uqqcxPIaAwgY6K5TA33AH5NTLzKDF11b6LO0fcmGpqoewC6igZHAMcuACONAYxMqcPraWi+51g8zhdCHQ0BdOYLIYC+hgD6/wBIBWZPs/Cf+iMAQrKniqrl3wvMdYOXNlJdY/H6FIDkymoaAKhFZYev8VLIqupOPBIIQMhUFQZQXSyu/u9ARCoo2gqabwcVVYedCDVRK1s0IyT7HQhAqqnyCgHIh1WSh54JSl1dRQHzlagK8shDUamwbKTYfCOqSnQpAIFwBVyk0PzFsjphWOPCRMqKphurmF8LgEBIQ/F0ZVnYbwxAIOh7ZcY3O5wmbLHUxiuGvl33Re2vzcXKDcqHs8C7PW+lx/LNbBzzsSNgIRr0vDobAkO/y9MRMBJ9ff4vhV3btM/DqFkAAAAASUVORK5CYII=');
var greenDotOverlay = greenDot.createOverlay(
	{'scale':
		{'magnitude': 0.15, 'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});

var yellowDot = gapi.hangout.av.effects.createImageResource('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90BDwMXCA5pLkoAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAuFJREFUeNrtmyts21AUhj97BiPVCiZLBUVzpAVUKykuqca2gLDgsoVNKwoMDWtZ8NhAFloSXJJpIJXmooJIVkCjkoFbbcAnk5vZzsN52Pfml8yS+P5fzn2ecy3WrMB3XgAHQBk4lqcMHAKvAQU8APfAAOjLMwCGrqee1tk+a02mXwGnwDnwIePPdYE20HM9Nc4tgMB3LOAEaKzAdBqMJnDjeupPLgCI8TPgq4T0JjQCasB1VhBWRvPvgG/AG7ajO6DqeurHRgEEvvNSQvEz+VALaLie+r12AIHvvAV+Ag75kgKOXE/dLvIle0HzH2V6ypt5pE0DaePqAQS+8wnokH91pK2rAxD4zhfgkuLoUtqcfQwQmkUyH1Xd9dTV0gCkP3Uotiqup74vDEBG+wF6qJw0O1gp8/xjTkf7ZafIvbh1QtIg2NTI/GSKbM4VAbK87aOnjqeXzVbMxubXFtf2m9g7lKIbqOkucKaxecTbWWwEyL8fbHBLuy2NAHcSBdEIODHAPOLxJK4LNDBHjWddQM7wHjBL+66nxpMIOMU8nUa7wLmBAM4BLDm3V5gpxyZMWpiqA5swS2OqyjZhqspUHe8A7LpAmKU1VYc2sG8wgH0bw2UbuAeI6sEmrMwwVfc2+hx9L6OBjb4HoPOovwOw6wIwNBjA0JY6vK6B5ruup54mC6G2gQDak4UQQM9AAL1/AKQCs2tY+I+jEQAJ2VNN1YzuBSa6IUwb6a6ReH0OQHJlNQMA1NKyw9eEKWRddSceiQUgZKoaA6hOF1f/dyAiFRQtDc234oqqd0VScZ+WDx5p9O8fJVWSJ54JSl1dRQPzlbQK8tRDUamwrBfYfD2tSnQmAIFwBVwU0PzFrDrhxEEwYWAsUtF0fR7zCwEQCEUonq7MCvulAQgEc6/MRGaHvZwtlloyz98u+kXjr81lyg3Ki0vA+w1vpUfyzlIW85kjYCoazLw6mwDDvMvTKTByfX3+L4KL/xorzXR/AAAAAElFTkSuQmCC');
	var yellowDotOverlay = yellowDot.createOverlay(
	{'scale':
		{'magnitude': 0.15, 'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});

var buttonDisabled = false;	//true when button is clicked to prevent joining the queue several times

gapi.hangout.onApiReady.add(function(eventObj){
	if (eventObj.isApiReady) {
		participants = gapi.hangout.getEnabledParticipants();
		console.log(participants);
		printParticipants();

		gapi.hangout.onParticipantsChanged.add(onParticipantsChange);
		gapi.hangout.data.onStateChanged.add(onDataChange);
	}
});

function onParticipantsChange(eventObj) {
	participants = eventObj.participants;
	printParticipants();
};

function onDataChange (eventObj){
	var state = gapi.hangout.data.getState();
	queue = JSON.parse(state.queue);
	timeOut = JSON.parse(state.timeOut);
}

function onServerUpdate(){
	printParticipants();
	clearOverlay();
	var queuePosition = currentQueuePosition(gapi.hangout.getParticipantId());
	if (queuePosition == 0){
		placeGreenDot();
	}
	else if (queuePosition != -1){
		placeYellowDot();
	}

	//lowest order participant manages time updates 
	//and checks for disconnected queue memembers
	if (isManager()){
		console.log("managing update...");


	}
}

function printParticipants(){
	var members = "";
	for (var i = 0; i < participants.length; i++){
		members = members + participants[i].person.displayName;
	}
	document.getElementById('particpantsList').innerHTML = members;
} 

function buttonClick(){
	if (!buttonDisabled){
		buttonDisabled = true;
		var queuePosition = currentQueuePosition(gapi.hangout.getParticipantId());
		if (queuePosition == 0){
			queue.shift();
			gapi.hangout.data.submitDelta({'queue':JSON.stringify(queue)});
		}
		else if (queuePosition == -1){
			queue.push(gapi.hangout.getParticipantId());	
			gapi.hangout.data.submitDelta({'queue':JSON.stringify(queue)});
		}
	}
}

function placeGreenDot(){
	greenDotOverlay.setPosition(.4, -.35);
	greenDotOverlay.setVisible(true);
}

function placeYellowDot(){
	yellowDotOverlay.setPosition(.4, -.35);
	yellowDotOverlay.setVisible(true);	
}

function clearOverlay(){
	greenDotOverlay.setVisible(false);
	yellowDotOverlay.setVisible(false);
}

//returns the passed id place in the queue
//-1 if they are not currently in the queue
function currentQueuePosition(id){
	var rv = -1;
	for (var i = 0; i < queue.length; i++){
		if (queue[i].id == id){
			rv = i;
		}
	}
	return rv;
}

function isManager(){
	return (participants[0].person.id == gapi.hangout.getParticipantId());
}