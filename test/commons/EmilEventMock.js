module.exports = {
	context: {
		stage: 'local',
		// username: 'liang.zhou@nufindata.com854',
		// username: 'nathalie.nhu.y@gmail.com781',
		//   username: 'nathalie.nhu.y@gmail.com209',
		username: 'garick.chong@nufindata.com279',
		//   username: 'xiaoyong.fang@nufindata.com836',
	},
	document: {
		document_path: '/fakepath',
		document_uuid: '123',
	},
	path: '/anotherfakepath',
	data: {
		limit: {
			index: 0,
			page: 100,
		},
		fin_data: undefined,
		search_query: undefined,
		sort_query: {
			field: undefined,
			order: undefined,
		},
		date_range: {
			date_field: undefined,
			searchdate_end: undefined,
			searchdate_start: undefined,
		},
	},
};
