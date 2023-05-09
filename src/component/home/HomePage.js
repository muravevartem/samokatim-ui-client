import React, {useState} from "react";
import {Avatar, HStack, IconButton, Stack} from "@chakra-ui/react";
import {MapContainer, TileLayer} from "react-leaflet";
import {ApplicationMarkers, Icons, LocationMarker} from "../MapComponents.js";
import {zIndexes} from "../util.js";
import {InventoryModal, OfficeModal, RentCounter, RentModal} from "./HomeComponents.js";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes.js";
import {IoMdLocate} from "react-icons/io";
import {AppEvents, eventBus} from "../../service/EventBus.js";

export function HomePage() {

    let [currenPos, setCurrentPos] = useState();
    let navigate = useNavigate();

    const center = JSON.parse(localStorage.getItem('MyLastCenter'));

    return (
        <Stack w='100%' h='100vh' zIndex={zIndexes.Normal}>
            <MapContainer center={center ? [center.lat, center.lng] : [46, 46]}
                          zoom={localStorage.getItem('MyLastZoom') ?? 13}
                          scrollWheelZoom={true}
                          zoomControl={false}
                          style={{width: '100%', height: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker location={currenPos}
                                onChange={setCurrentPos}
                                icon={Icons.INVENTORY_ICON}/>
                <ApplicationMarkers/>
            </MapContainer>
            <InventoryModal/>
            <RentModal/>
            <OfficeModal/>
            <HStack position='fixed'
                    top={0}
                    left={0}
                    w='100%'
                    justifyContent='space-between'
                    zIndex={zIndexes.Profile}
                    p={3}>
                <Avatar onClick={() => navigate(routes.profile)}/>
                <RentCounter/>
            </HStack>
            <HStack position='fixed'
                    bottom={0}
                    left={0}
                    w='100%'
                    justifyContent='space-between'
                    zIndex={zIndexes.Profile}
                    p={3}>
                <div/>
                <IconButton aria-label='current-location'
                            colorScheme='brand'
                            size='lg'
                            isRound
                            onClick={() => eventBus.raise(AppEvents.MyLocated)}
                            icon={<IoMdLocate/>}
                />
            </HStack>
        </Stack>
    )
}
