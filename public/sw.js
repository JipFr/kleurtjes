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
	event.respondWith(async function() {
		try {
			return await fetch(event.request);
		} catch (err) {
			return caches.match(event.request);
		}
	}());
});