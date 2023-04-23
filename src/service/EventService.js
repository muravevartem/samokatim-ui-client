class EventService {
    constructor() {
        this.handlers = {};
    }

    subscribe(type, handler) {
        if (!(this.handlers[type])) this.handlers[type] = [];
        this.handlers[type].push(handler)
    }

    raise(type) {
        if (this.handlers[type]) {
            this.handlers[type].forEach(handler => handler());
        }
    }

    raiseWithData(type, data) {
        if (this.handlers[type]) {
            this.handlers[type].forEach(handler => handler(data));
        }
    }
}


export const eventService = new EventService();

export const events = {
    myLocation: 'my-location',
    error: 'error',
    searchFocus: 'search-focus',
    searchBlur: 'search-focus',
    error403: 'error-403',
    updatedUserName: 'updated-user-name',
    moveMap: 'move-map',
    newEquipmentLocations: 'new-equipment-locations',
    selectedEquipment: 'selected-equipment',
    startRent: 'start-rent',
    stopRent: 'stop-rent',
}
