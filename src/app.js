const config = self.__uv$config;
const statusEl = document.getElementById("status");
const launchUrl = new URL(
	`${config.prefix}${config.encodeUrl(config.startUrl)}`,
	location.origin
).href;
const bareMuxWorkerUrl = new URL("bare-mux-worker.js", location.href).href;

function createBareMuxPort() {
	if (!("SharedWorker" in window)) {
		throw new Error("SharedWorker is not supported in this browser.");
	}

	const worker = new SharedWorker(bareMuxWorkerUrl, {
		name: "bare-mux-worker",
	});
	worker.port.start();
	return worker.port;
}

function setStatus(message) {
	if (statusEl) statusEl.textContent = message;
}

navigator.serviceWorker?.addEventListener("message", (event) => {
	if (event.data?.type !== "getPort") return;
	if (!event.data?.port) return;

	try {
		const port = createBareMuxPort();
		event.data.port.postMessage(port, [port]);
	} catch (error) {
		console.error("Failed to provide bare-mux port", error);
	}
});

async function launchBloxd() {
	setStatus("Registering service worker...");

	try {
		if (!("serviceWorker" in navigator)) {
			throw new Error("Service workers are not supported in this browser.");
		}

		await navigator.serviceWorker.register("sw.js");
		await navigator.serviceWorker.ready;
		setStatus("Launching Bloxd.io...");
		location.replace(launchUrl);
	} catch (error) {
		console.error(error);
		setStatus(`Launch failed: ${error.message}`);
	}
}

launchBloxd();
