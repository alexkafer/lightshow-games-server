export const askForPermission = (body) => {
    return new Promise((resolve, reject) => {

        if (window.DeviceMotionEvent) {
            if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
                window.DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        console.log("Access granted");
                        resolve();
                    } else {
                        // permission not granted
                        console.log("Access denied");
                        reject();
                    }
                });
            } else {
                // non iOS 13+
                console.log("Not iOS 13");
                reject();
            }
        } else {
            console.log("Not supported");
            reject();
        }
    });
    
};