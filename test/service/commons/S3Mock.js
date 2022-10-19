module.exports = class S3Class {
	constructor(data) {}
	deleteObject(data) {
		return {
			promise: () => {
				return true;
			},
		};
	}
};
