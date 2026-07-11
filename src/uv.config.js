/*global Ultraviolet*/

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hostSuffixPattern(suffix) {
	return new RegExp(`(^|\\.)${escapeRegExp(suffix)}$`, "i");
}

const allowedHostPatterns = [
	"bloxd.io",
	"bloxd.com",
	"bloxd.dev",
	"bloxd.play",
	"bloxd.site",
	"bloxd.us",
	"bloxdhop.io",
	"bloxdk12.com",
	"doodlecube.io",
	"discord.com",
	"discordapp.com",
	"discord.co",
	"recaptcha.net",
	"google.com",
	"gstatic.com",
	"googleusercontent.com",
	"cloudflare.com",
	"crazygames.com",
	"xsolla.net",
	"xsolla.com",
	"adinplay.com",
	"aditude.io",
	"gamedistribution.com",
	"gamemonetize.com",
	"jsdelivr.net",
	"unpkg.com",
	"googleapis.com",
	"github.com",
	"githubusercontent.com",
	"youtube.com",
	"youtu.be",
	"tiktok.com",
	"instagram.com",
	"x.com",
	"twitch.tv",
	"microsoft.com",
	"msn.com",
	"forms.gle",
].map(hostSuffixPattern);

const allowedUrlProtocols = new Set([
	"http:",
	"https:",
	"ws:",
	"wss:",
	"blob:",
	"about:",
	"data:",
	"mailto:",
	"javascript:",
]);

function isAllowedHost(hostname) {
	return allowedHostPatterns.some((pattern) => pattern.test(hostname));
}

function isAllowedUrl(input, meta = {}) {
	try {
		const url = input instanceof URL ? input : new URL(String(input), meta.base);

		if (!allowedUrlProtocols.has(url.protocol)) return true;

		if (["blob:", "about:", "data:", "mailto:", "javascript:"].includes(url.protocol)) {
			return true;
		}

		return isAllowedHost(url.hostname);
	} catch {
		return true;
	}
}

self.__uv$config = {
	prefix: "/service/",
	startUrl: "https://bloxd.io/",
	forceIsolation: true,
	allowedHostPatterns,
	isAllowedHost,
	isAllowedUrl,
	encodeUrl: Ultraviolet.codec.xor.encode,
	decodeUrl: Ultraviolet.codec.xor.decode,
	handler: "/uv.handler.js",
	client: "/uv.client.js",
	bundle: "/uv.bundle.js",
	config: "/uv.config.js",
	sw: "/uv.sw.js",
};
