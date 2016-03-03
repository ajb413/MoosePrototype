//region

module.exports = {

  attributes: {

  	songs: { collection: 'SongMetadata', via: 'region' },

  	id: { type: 'integer', autoIncrement: true, unique: true, required: true, primaryKey: true }

  	//location: {} //gps coordinates

  },

	seedData:[
		{
			songs: null,
			id: 1
		},
	],

};

