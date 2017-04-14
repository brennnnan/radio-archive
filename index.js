var icy = require('icy');
var lame = require('lame');
var Speaker = require('speaker');
var fs = require('fs');
var writeStreams = []
writeStreams.push(0)
writeStreams.push(0)
var counter = 0;

// URL to dublab stream
var url = 'http://14123.live.streamtheworld.com/SAM01AAC269_SC';


function makeFileName() {
	d = new Date();
	var timeString = d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+"_"+d.getHours()+"'"+d.getMinutes()+"'"+d.getSeconds()+'.mp3';
	return timeString
}


// connect to the remote stream
		icy.get(url, function (res) {
			
			
			var wstream = fs.createWriteStream(makeFileName());
			console.log('Starting new mp3 file');
			writeStreams[0] = wstream;
			counter++;
			
			// log the HTTP response headers
			//console.error(res.headers);
			
			// gets time for recording start
			var theDate = new Date();
			startTime = theDate.getTime();
			
			// starts piping stream to mp3 file
			res.pipe(wstream);
			
			setInterval(function() {
				theDate = new Date();
				
				// If stream has been recording for an hour
				if(theDate.getTime()-a > 3500000) {
					// reset a to 
					a = theDate.getTime();
					// create new write stream
					writeStreams[counter%2] = fs.createWriteStream(makeFileName());

					// start writing to new file and ends old one
					res.pipe(writeStreams[counter%2]);
					res.unpipe(writeStreams[(counter-1)%2])
					console.log('Starting new mp3 file');
					counter++;
					}
			}, 600000);
				
				
			
				
		});
