import {MdElectricScooter, MdInfo, MdPedalBike} from "react-icons/md";
import {events, eventService} from "./EventService.js";
import {$monitor_api} from "../http.js";

export const equipmentIcons = {
    BIKE: ({size, color}) => <MdPedalBike size={size ? size : 48} color={color ? color : 'black'}/>,
    SCOOTER: ({size, color}) => <MdElectricScooter size={size ? size : 48} color={color ? color : 'black'}/>,
    UNKNOWN: ({size, color}) => <MdInfo size={size ? size : 48} color={color ? color : 'black'}/>
}

export class EquipmentService {

    constructor() {
        eventService.subscribe(events.moveMap, data => this.getPoints(data))
    }

    async getPoints(data) {
        let response = await $monitor_api.post(`/api/v1/geo-points?actual`, {
            northEast: data.northEast,
            southWest: data.southWest
        });
        let points = response.data;
        eventService.raiseWithData(events.newEquipmentLocations, points)
    }
}

export const equipmentService = new EquipmentService();
