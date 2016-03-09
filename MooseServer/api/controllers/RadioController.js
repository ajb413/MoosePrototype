//RadioController

module.exports = {

	getRegionId: function (req, res)
	{
		//fetches the region id associated based on the user's location
		//returns the one and only radio for now, id: 1
		return res.send(200, 1);
	},

	getRadioQueue: function (req, res)
	{
		var sessionData;

		//create a helper to better validate the request data later
		if (!req.param('sessionData'))
		{
			return res.badRequest("No session data in request!");
		}
		else
		{
			sessionData = req.param('sessionData');
		}

		//tune model query based on request data
		//TODO: fine tune this later
		Region.findOne({id : sessionData.regionId})
		.populate('songs')
		.then(function (regionObject)
		{
			return res.send(regionObject);
		})
		.catch(function (err)
		{
			console.error(err);
			return res.serverError("Error occured with region model query.");
		});
			
	},

	stream: function (req, res)
	{
		//get song that is in request and send it down
		//place a timestamp on the account owner to restrict them to no more than 3 song req per minute

		//TODO: first validate the request file path
		var path = req.param('api') + '/' + req.param('fs') + '/' + req.param('radio') + '/' + req.param('song');

		//TODO: .then()
		var inputStream = sails.fs.createReadStream(path);
		inputStream.pipe(res);

		//return res.ok();

		//TODO: .then(), add the restriction to the account
		//.then() return 200 ok
	},

	addSongToRadio: function (req, res)
	{
		//create helpers to validate the request data later
		if (!req.param('newSong'))
		{
			return res.badRequest("No session data in request!");
		}
		
		var newSong = JSON.parse(req.param('newSong'));

		var hexString = byteArrayToHexString(newSong.contents);
		var fileName = newSong.title + '.' + newSong.fileType;

		//hard coded target path, do this dynamically later
		var filePath = "api/song-fs/radio1/" + fileName;

		//writes hex string to the song file on the server file system
		sails.fs.writeFile(filePath, hexString, 'hex', function (err)
		{
			if (err)
			{
				console.log(err);
				return res.serverError("File write error!");
			}
			else
			{
				//if the file write is successful, add song entry to model
				SongMetadata.create({
					region: 1,
					title: newSong.title,
					artist: newSong.artist,
					contents: filePath,
					fileType: newSong.fileType
				})
				.then(function (created)
				{
					SongMetadata.find({}).exec(function (error, records)
					{
						if (error)
						{
							console.log(err);
							return res.serverError("Song failed to be added.");
						}
						return res.send(200, "Song uploaded to radio successfully.");
					});
				})
				.catch(function (err2)
				{
					console.log(err2);
					return res.serverError("Add song to Model failed.");
				});
			}
		});
	},
};

function byteArrayToHexString (byteArray)
{
	var hexString = "";

	for (var i = 0; byteArray[i.toString()] !== undefined; i++)
	{
		var currentByte = byteArray[i.toString()].toString(16);

		//make sure hex value represents both nibbles of the byte
		if (currentByte.length === 1)
		{
			currentByte = '0' + currentByte;
		}

		//add byte to total hex string
		hexString += currentByte;
	}

	return hexString;
}

