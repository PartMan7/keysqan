const crypto = require('crypto');
const seed = SECRETS.NONCE_SEED;

module.exports = function checkNonce (nonce) {
	if (!nonce) return null;
	const time = Date.now();
	// Clamp time to the closest 30s
	const timeSeed = Math.floor(Date.now() / 30_000);
	const previousTimeSeed = timeSeed - 1;
	// Incredibly complicated hashing algorithm that fuses two strings
	// before generating a non-reversible hash of the combined seeds.
	// Or, in other words, SHA256(seed1 + seed2)
	const hash = s => crypto.createHash('sha256').update(s).digest('hex');
	if (hash(seed + timeSeed) === nonce) return true;
	if (hash(seed + previousTimeSeed) === nonce) return 1;
	return false;
}
