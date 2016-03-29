$(function ()
{
	//TODO: set domain to the address of the server app so ajax calls will work
	var domain = 'http://192.168.1.x:1337/';

	//local vars
	var radioQueueUl = $('#RadioQueueUl');
	var newSongInput = $('#NewSongInput');
	var newSongTitle = $('#NewSongTitle');
	var newSongArtist = $('#NewSongArtist');
	var submitSongButton = $('#SubmitSong');
	var songQueue; //song queue singleton
	var musicIsPlaying = false;

	//event handlers
	submitSongButton.on('click', function (event)
	{
		var file = newSongInput.get(0).files[0]; //1 file at a time
		var title = newSongTitle.val();
		var artist = newSongArtist.val();

		if (file && title && artist)
		{
			submitSongButtonHandler(file, title, artist);
		}
	});

	//user name, location data, local app settings
	var sessionData = {
		userName: "",
		locationData: {},
		appSettings: {}
	}; //TODO: collect this dynamically later

	//start music player
	initializeMoose();

	function initializeMoose()
	{
		getRegionId(sessionData)
		.then(function (regionId)
		{
			sessionData.regionId = regionId;

			//Get the array of songs in the server song queue
			return getRadioQueue(sessionData);
		})
		.then(function (radioQueue)
		{
			//Create array of HTML list elements for the view's song queue
			var domRadioQueueMembers = createDomRadioQueue(radioQueue.songs);

			//Add members to the view's song queue
			radioQueueUl.html(domRadioQueueMembers);

			//ready to play music
			if (musicIsPlaying)
			{
				songQueue = radioQueue.songs; //set singleton
			}
			else
			{
				songQueue = radioQueue.songs; //set singleton
				playMusic();
			}
		});
	}	

	//TODO: later this function will have a formal parameter with information about the user making the request
	//in order to serve them a proper radio queue based on their location and personal app settings
	function getRadioQueue (sessionData)
	{
		var deferred = $.Deferred();
		$.ajax(
		{
			method: 'GET',
			url: domain+'radio/getRadioQueue',
			data: { sessionData : sessionData }
		})
		.done(function (res)
		{
			deferred.resolve(res);
		})
		.fail(function (res)
		{
			console.error(res);
			deferred.reject(res);
		});

		return deferred.promise();
	}

	function createDomRadioQueue (radioQueue)
	{
		var songListElements = [];

		for (var i = 0; i < radioQueue.length; i++)
		{
			var liText = radioQueue[i].title + ' - ' + radioQueue[i].artist;
			var li = $('<li>');
			li.text(liText);
			songListElements.push(li);
		}

		return songListElements;
	}

	function selectNewSong (file)
	{
		var deferred = $.Deferred();

		//make sure the audio file is ~5MB or less, and that it's a valid type
		if (file.size <= 5000000 && file.type === ('audio/mp3' || 'audio/wav'))
		{
			fileReader = new FileReader();
			fileReader.readAsArrayBuffer(file);
			fileReader.onload = function (readerEvent) 
			{
				var byteArray = new Uint8Array(readerEvent.target.result)
				deferred.resolve(byteArray);
			};
		}
		else
		{
			//invalid file
			deferred.reject(null);
		}
		return deferred.promise();
	}

	function uploadNewSong (song)
	{
		var json = JSON.stringify(song);
		$.ajax(
		{
			method: 'POST',
			url: domain+'radio/addSongToRadio',
			data: { newSong : json }
		})
		.done(function (res)
		{
			clearSongInputData();
			//updates DOM queue with newly uploaded song
			initializeMoose();
			return res;
		})
		.fail(function (res)
		{
			console.error(res);
		});
	}

	function submitSongButtonHandler(file, songTitle, songArtist)
	{
		selectNewSong(file)
		.then(function (songContents)
		{
			var fileType = file.type.substring(file.type.length-3);

			var newSongFile = {
				"title": songTitle,
				"artist": songArtist,
				"contents": songContents,
				"fileType": fileType
			};

			uploadNewSong(newSongFile);
		})
		.fail(function (err)
		{
			console.error(err);
		});
	}

	function clearSongInputData()
	{
		newSongInput.val(null);
		newSongTitle.val(null);
		newSongArtist.val(null);
	}

	function getRegionId(sessionData)
	{
		var deferred = $.Deferred();
		$.ajax(
		{
			method: 'GET',
			url: domain+'radio/getRegionId',
			data: { sessionData : sessionData }
		})
		.done(function (res)
		{
			deferred.resolve(res);
		})
		.fail(function (res)
		{
			console.error(res);
			deferred.reject(null);
		});
		
		return deferred.promise();
	}

	function playMusic(songs)
	{
		var index = 0;

		playSong(index);
	}

	function playSong(index)
	{
		if (index >= songQueue.length)
		{
			index = 0;
		}

		var audio = new Audio(domain+'radio/stream/' + songQueue[index].contents);

		audio.onended = function()
		{
			playSong(index+1);
		};

		audio.play();
		musicIsPlaying = true;
	}
});