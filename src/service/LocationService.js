export const locationService = {
    getMyLocation: () => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    }
}


export const locations = {
    moscow: [55.753271, 37.621561]
}
