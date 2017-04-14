// Setup
var icy = require('icy');
var lame = require('lame');
var Speaker = require('speaker');
var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');

// globals
var writeStreams = []
writeStreams.push(0)
writeStreams.push(0)
var counter = 0;
var files = []
var archiveHours = 6;


//Setup



function getRecordings() {
	fs.readdir(__dirname+"/recordings/", function(err, files) {
		if (err) return;
		files.forEach(function(f) {
			console.log('Files: ' + f);
		});
	});
}


// URL to dublab stream
var url = 'http://14123.live.streamtheworld.com/SAM01AAC269_SC';


function makeFileName() {
	d = new Date();
	var timeString = d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+"_"+d.getHours()+"'"+d.getMinutes()+"'"+d.getSeconds()+'.mp3';
	return "./recordings/"+timeString
}

function manageFiles(filePath) {
	if(files.length < archiveHours) {
		files.push(filePath);
	} else {
		var expired = files.splice(0,1)[0];
		fs.unlink(expired);
		files.push(filePath)
	}
}


// connect to the remote stream
		icy.get(url, function (res) {
			
			var fileName = makeFileName()
			var wstream = fs.createWriteStream(fileName);
			files.push(fileName)
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
				
				// If its a new hour, make new file
				if(theDate.getMinutes == 0) {
				//if(theDate.getTime() - startTime > 2000) {
					// reset a to 
					startTime = theDate.getTime();
					// create new write stream
					fileName = makeFileName()
					writeStreams[counter%2] = fs.createWriteStream(fileName);

					// start writing to new file and ends old one
					res.pipe(writeStreams[counter%2]);
					res.unpipe(writeStreams[(counter-1)%2])
					
					manageFiles(fileName);
					console.log('Starting new mp3 file');
					counter++;
				}
			}, 50000);
				
				
			
				
		});
