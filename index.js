var icy = require('icy');
var lame = require('lame');
var Speaker = require('speaker');
var fs = require('fs');
var writeStreams = []
writeStreams.push(0)
writeStreams.push(0)
var counter = 0;

// URL to a known ICY stream
var url = 'http://14123.live.streamtheworld.com/SAM01AAC269_SC';
var theDate = new Date();


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// connect to the remote stream
		icy.get(url, function (res) {
			a = theDate.getTime();
			// gets time for recording start
			var d = new Date();
			var timeString = d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+"_"+d.getHours()+"'"+d.getMinutes()+"'"+d.getSeconds()+'.mp3';
			var wstream = fs.createWriteStream(timeString);
			console.log('Starting new mp3 file');
			writeStreams[0] = wstream
			counter++;
			
			
			// log the HTTP response headers
			//console.error(res.headers);

			res.pipe(wstream);
			
			setInterval(function() {
				theDate = new Date();
				
				// If stream has been recording for 2 hours
				if(theDate.getTime()-a > 3600000) {
					a = theDate.getTime();
					// create new write stream
					timeString = theDate.getMonth()+"-"+theDate.getDate()+"-"+theDate.getFullYear()+"_"+theDate.getHours()+"'"+theDate.getMinutes()+"'"+theDate.getSeconds()+'.mp3';
					writeStreams[counter%2] = fs.createWriteStream(timeString);
					
					res.pipe(writeStreams[counter%2]);
					res.unpipe(writeStreams[(counter-1)%2])
					console.log('Starting new mp3 file');
					}
			}, 500000);
				
				
			
				
		});
