import {MdElectricScooter, MdInfo, MdPedalBike} from "react-icons/md";
import {events, eventService} from "./EventService.js";
import {$api} from "../http.js";

export const equipmentIcons = {
    BICYCLE: ({size, color}) => <MdPedalBike size={size ? size : 48} color={color ? color : 'black'}/>,
    SCOOTER_EL: ({size, color}) => <MdElectricScooter size={size ? size : 48} color={color ? color : 'black'}/>,
    UNKNOWN: ({size, color}) => <MdInfo size={size ? size : 48} color={color ? color : 'black'}/>
}

export class EquipmentService {

    constructor() {
        eventService.subscribe(events.moveMap, data => this.getPoints(data))
        eventService.subscribe(events.selectEquipment, console.log)
    }

    async getPoints(data) {
        let response = await $api.post(`/api/v1/inventories/map-square`, {
            northEast: data.northEast,
            southWest: data.southWest
        });
        let points = response.data;
        return points;
    }

    async getOne(id) {
        let response = await $api.get(`/api/v1/inventories/${id}`);
        return response.data;
    }
}

export const equipmentService = new EquipmentService();
