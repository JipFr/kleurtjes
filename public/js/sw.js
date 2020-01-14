const CACHE_NAME = "colors2-0";
let urlsToCache= [
	"/",
	"/css/universal.css",
	"/js/universal.js",
	"/icon.png",
	"/log-in/"
];

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
	);
	self.skipWaiting();
});


self.addEventListener("fetch", (event) => {
	let url = event.request.url;
	let dont_include = [".mp3", ".mp4", ".m3u8", "video", "cdn", "openload", "fruithosts", "streamango", "googleusercontent", "api"];
	let can_send = true;
	dont_include.forEach(str => {
		if(url.includes(str)) {
			can_send = false;
		}
	});

	if(!can_send) {
		return false;
	} else {
		event.respondWith(async function() {
			try {
				return await fetch(event.request);
			} catch (err) {
				return caches.match(event.request);
			}
		}());
	}
});