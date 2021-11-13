function initSession(sdk, postMessage) {
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }

    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    function sendSessionStartEvent(sdk, data) {
        let session_id = uuidv4(),
            payload = {
                "session_id": session_id,
                "ip": data['ipAddress'],
                "location": data["countryName"],
                "os": getOS()
            };
        console.log(payload);
        sendEvent("SESSION_STARTED", payload)
        sdk.sessionId = session_id;
    }

    if (sdk.sessionId === undefined) {
        fetch("https://api.db-ip.com/v2/free/self").then(response => response.json()).then(sendSessionStartEvent);
    }
    return {
        sendEvent: function(name, payload){
            if (sdk.sessionId !== undefined) payload["session_id"] = sdk.sessionId;
            console.log("Sending event", name, payload);
            postMessage({templateEvent: name, templatePayload: payload}, '*');
        }
    }
}