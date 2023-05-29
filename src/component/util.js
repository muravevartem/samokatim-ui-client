import React from "react";
import {MdElectricBike, MdElectricScooter, MdPedalBike, MdTaxiAlert} from "react-icons/md";
import {BsScooter} from "react-icons/bs";
import moment from 'moment-timezone';


export function toLastPoint(track) {
    if (track) {
        return track[track.length - 1];
    }
    return null;
}

export const RubleLogo = '₽';
export const BRAND_GRADIENT = "linear(to-l, #7928CA,#FF0080)";

export const DEFAULT_EMAIL = "samokatim@internet.ru"


export const DaysOfWeek = {
    MONDAY: 'Понедельник',
    TUESDAY: 'Вторник',
    WEDNESDAY: 'Среда',
    THURSDAY: 'Четверг',
    FRIDAY: 'Пятница',
    SATURDAY: 'Суббота',
    SUNDAY: 'Воскресенье'
}

export const ShortDaysOfWeek = {
    MONDAY: 'Пн',
    TUESDAY: 'Вт',
    WEDNESDAY: 'Ср',
    THURSDAY: 'Чт',
    FRIDAY: 'Пт',
    SATURDAY: 'Сб',
    SUNDAY: 'Вс'
}

export const toDayName = (dayOfWeek) => {
    switch (dayOfWeek) {
        case 'MONDAY':
            return 'Понедельник';
        case 'TUESDAY':
            return 'Вторник';
        case 'WEDNESDAY':
            return 'Среда';
        case 'THURSDAY':
            return 'Четверг';
        case 'FRIDAY':
            return 'Пятница';
        case 'SATURDAY':
            return 'Суббота';
        case 'SUNDAY':
            return 'Воскресенье';
        default:
            return undefined;
    }
}

export const tariffUnit = {
    MINUTE_BY_MINUTE: '₽/мин',
    LONG_TERM: '₽/день',
    TRAVEL_CARD: '₽/мес'
}


export const currentTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const toLocalTime = (value) => {
    return moment(value, 'HH:mm:ss.SSSZ').tz(currentTimezone()).format('HH:mm')
}

export const toOffsetTime = (value) => {
    return moment(value, 'HH:mm').tz(currentTimezone()).format('HH:mm:ss.SSSZ');
}

export const zIndexes = {
    Background: -1,
    Normal: 0,
    Popover: 1200,
    Profile: 1020
}

export function EquipmentLogo(props) {
    if (props.type === 'BICYCLE')
        return <MdPedalBike {...props}/>
    if (props.type === 'BICYCLE_EL')
        return <MdElectricBike {...props}/>
    if (props.type === 'SCOOTER_EL')
        return <MdElectricScooter {...props}/>
    if (props.type === 'SCOOTER')
        return <BsScooter {...props}/>
    return <MdTaxiAlert {...props}/>
}
