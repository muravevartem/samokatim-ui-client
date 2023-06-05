import React, {useEffect, useState} from "react";
import {Marker, Tooltip, useMap} from "react-leaflet";
import L from 'leaflet';
import {Text, useToast} from "@chakra-ui/react";
import {errorConverter} from "../error/ErrorConverter.js";
import {mapService} from "../service/MapService.js";
import {AppEvents, eventBus} from "../service/EventBus.js";
import {tariffUnit} from "./util.js";

export const Icons = {
    INVENTORY_ICON: new L.Icon({
        iconUrl: '/icons/inventory-icon.png',
        iconSize: new L.Point(24, 24)
    }),
    RENTED_INVENTORY_ICON: new L.Icon({
        iconUrl: '/icons/Rented-icon.png',
        iconSize: new L.Point(24, 24)
    }),
    ME_ICON: new L.Icon({
        iconUrl: '/icons/account-tie-custom.png',
        iconSize: new L.Point(24, 24)
    }),
    PARKING_ICON: new L.Icon({
        iconUrl: '/icons/parking-custom.png',
        iconSize: new L.Point(32,32)
    })
}

export const MapInventoryIcon = {
    BICYCLE: new L.Icon({
        iconUrl: '/icons/bicycle-custom.png',
        iconSize: new L.Point(24,24)
    }),
    BICYCLE_EL: new L.Icon({
        iconUrl: '/icons/bicycle-electric-custom.png',
        iconSize: new L.Point(24,24)
    }),
    SCOOTER: new L.Icon({
        iconUrl: '/icons/scooter-custom.png',
        iconSize: new L.Point(24,24)
    }),
    SCOOTER_EL: new L.Icon({
        iconUrl: '/icons/scooter-electric-custom.png',
        iconSize: new L.Point(24,24)
    })
}


export function LocationMarker({show, location, onChange}) {

    const map = useMap();

    useEffect(() => {
        map.on('zoom', event => {
            localStorage.setItem('MyLastZoom', event.target.getZoom())
        });
        map.on('move', event => {
            localStorage.setItem('MyLastCenter', JSON.stringify(event.target.getCenter()))
        });
        map.on('locationfound', event => {
            if (!location) {
                let latlng = event.latlng;
                onChange(latlng)
                map.flyTo(latlng, map.getZoom())
            }
        })

        let onMyLocated = eventBus.on(AppEvents.MyLocated, () => map.locate());

        return () => {
            onMyLocated()
        }
    }, [])

    if (location)
        return (<Marker position={location} icon={Icons.ME_ICON}/>)

    return null;
}


export function ApplicationMarkers() {
    let [state, setState] = useState({});
    let [loading, setLoading] = useState(false);

    let map = useMap();

    let toast = useToast();

    async function loadMapInfo() {
        try {
            setLoading(true);
            let loadedState = await mapService.getMapInfo({
                northEast: map.getBounds().getNorthEast(),
                southWest: map.getBounds().getSouthWest()
            });
            setState(loadedState);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMapInfo()
        map.on('moveend', event => {
            loadMapInfo()
        })
    }, [])

    return (
        <>
            {(state.free ?? []).map(m =>
                <Marker icon={MapInventoryIcon[m.model.type]}
                        key={'free' + m.id}
                        eventHandlers={{
                            click() {
                                eventBus.raise(AppEvents.SelectedInventory, m)
                            }
                        }}
                        position={[m.lastMonitoringRecord.lat, m.lastMonitoringRecord.lng]}>
                    {(m.tariffs.length > 0 && map.getZoom() > 15) &&
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                            <Text fontWeight='bold'>
                                От {(m.tariffs[0])?.price} {tariffUnit[m.tariffs[0]?.type]}
                            </Text>
                        </Tooltip>
                    }
                </Marker>
            )}
            {(state.rented ?? []).map(rent =>
                <Marker icon={Icons.RENTED_INVENTORY_ICON}
                        key={'rent' + rent.id}
                        eventHandlers={{
                            click() {
                                eventBus.raise(AppEvents.SelectedRent, rent)
                            }
                        }}
                        position={[rent.inventory.lastMonitoringRecord.lat, rent.inventory.lastMonitoringRecord.lng]}/>
            )}
            {(state.offices ?? []).map(office =>
                <Marker icon={Icons.PARKING_ICON}
                        key={'office' + office.id}
                        eventHandlers={{
                            click() {
                                eventBus.raise(AppEvents.SelectedOffice, office)
                            }
                        }}
                        position={[office.lat, office.lng]}/>
            )}
        </>
    )


}
