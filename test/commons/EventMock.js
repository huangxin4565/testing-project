module.exports = {
	context: {
		stage: 'local',
		// username: 'liang.zhou@nufindata.com854',
		// username: 'nathalie.nhu.y@gmail.com781',
		username: 'liang.zhou@nufindata.com423',
		source_ip: '10.10.120.59',
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
		financingRequestID: 10,
		disbursementAmount: '123',
		disbursementCurrencyCode: 'SGD',
		disbursementDate: '2019-03-30T16:00:00.000Z',
	},
};
