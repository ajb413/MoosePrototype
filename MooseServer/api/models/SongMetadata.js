//SongMetadata

module.exports = {

  attributes: {

  	region: { model: 'region' }, //one to many relationship, SongMetadata is the many end

	contents: { type:'string', required: true, unique: true, primaryKey: true  }, //path to file on disk

	title: { type: 'string', required: true },

	artist: { type: 'string', required: true },

	fileType: { type: 'string', required: true }, //mp3, wav, ect.

	id: { type: 'integer', autoIncrement: true },

	date: { type: 'string' },

	//user: { type: 'string', required: true }, //id of the user who uploaded this song

	//originGPS {}, //GPS of where the song originated

  },

  seedData: [
  	{
  		region: 1,
  		contents: 'api/song-fs/radio1/UnderTheBridgeSample.mp3',
  		title: 'Under the Bridge Sample',
  		artist: 'RHCP',
  		fileType: 'mp3',
  		id: 1,
  	},
  	{
  		region: 1,
  		contents: 'api/song-fs/radio1/SandstormSample.mp3',
  		title: 'Sandstorm Sample',
  		artist: 'Darude',
  		fileType: 'mp3',
  		id: 2,
  	}
  ]

};

