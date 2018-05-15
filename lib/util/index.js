module.exports.updateVersion = function updateVersion(latestVersion, type) {
	const regexp = /\d+/g
	const array = latestVersion.match(regexp)
	let major = parseInt(array[0], 10)
	let minor = parseInt(array[1], 10)
	let patch = parseInt(array[2], 10)
	switch (type) {
		case 'major':
			major += 1
			minor = 0
			patch = 0
			break
		case 'minor':
			minor += 1
			patch = 0
			break
		case 'patch':
			patch += 1
			break
		default:
			break
	}
	return `v${major}.${minor}.${patch}`
}
