import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Slide,
    VStack
} from "@chakra-ui/react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {locations, locationService} from "../service/LocationService.js";
import {errorService} from "../service/ErrorService.js";
import {events, eventService} from "../service/EventService.js";
import {MdLocationOn, MdMenu} from "react-icons/md";
import {useNavigate} from "react-router-dom";

export function HomePage() {
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <VStack spacing={0} width='100%' minH={'100vh'}>
            <SearchBar/>
            <MapBox/>
        </VStack>
    )
}

export function MapBox() {
    const [error, setError] = useState();
    let center = JSON.parse(localStorage.getItem('MyLastCenter'));
    let zoom = localStorage.getItem('MyLastZoom');
    console.log(center)
    return (
        <Box w='100%' h='100vh' position='fixed' zIndex={1} top={0}>
            {error &&
                <Alert status='error'>
                    <AlertIcon/>
                    {error.message}
                </Alert>
            }
            <ButtonMyLocation/>
            <MapContainer
                zoomControl={false}
                center={center ? center : locations.moscow}
                zoom={zoom ? zoom : 11}
                scrollWheelZoom={true}
                style={{width: '100%', height: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomBox/>
                <LocationMarker onError={setError}/>
            </MapContainer>
        </Box>
    )
}

function ZoomBox() {
    const map = useMap();
    return (
        <VStack pos='fixed'
                right={2}
                bottom='50%'
                zIndex={9999}>
            <Button colorScheme='gray'
                    color='green'
                    rounded='lg'
                    onDoubleClick={() => {}}
                    onClick={() => map.setZoom(map.getZoom() + 1)}>
                +
            </Button>
            <Button colorScheme='gray'
                    color='green'
                    rounded='lg'
                    onDoubleClick={() => {}}
                    onClick={() => map.setZoom(map.getZoom() - 1)}>
                -
            </Button>
        </VStack>
    );
}


function LocationMarker({onError}) {
    const [position, setPosition] = useState(null)
    const map = useMap();

    map.on('zoom', event => localStorage.setItem('MyLastZoom', event.target.getZoom()))
    map.on('move', event => localStorage.setItem('MyLastCenter', JSON.stringify(event.target.getCenter())))

    const toMyLocation = async () => {
        try {
            let location = await locationService.getMyLocation();
            onError(null);
            let geoPoint = [location.coords.latitude, location.coords.longitude];
            setPosition(geoPoint)
            map.flyTo(geoPoint, map.getZoom())
        } catch (e) {
            if (onError) {
                onError(errorService.beautify(e));
            }
        }
    }

    useEffect(() => {
        eventService.subscribe(events.myLocation, () => toMyLocation())
    }, [])

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

function ButtonMyLocation() {
    return (
        <IconButton
            position='fixed'
            right={5}
            bottom={5}
            onClick={() => eventService.raise(events.myLocation)}
            aria-label='my location'
            icon={<MdLocationOn/>}
            zIndex={9999}
            size='lg'
            colorScheme='green'/>
    )
}

function CompanyCard() {
    return (
        <Card width='100%'>
            <CardHeader>
                <Heading size='md'>Помидорка</Heading>
            </CardHeader>
            <CardBody>

            </CardBody>
            <CardBody>
                <Button>Выбрать</Button>
            </CardBody>
        </Card>
    )
}

function SearchBar({onFocus, onBlur}) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    let navigate = useNavigate();

    function onChangeText(event) {
        setText(event.target.value);
        setOpen(true);
    }

    return (
        <Box paddingTop={15}
             paddingX={15}
             zIndex={9999}
             width='100%'>
            <InputGroup size='lg'>
                <Input bgColor='white'
                       pl='3.5rem'
                       display='block'
                       width='100%'
                       placeholder='Поиск...'
                       shadow='lg'
                       value={text}
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={onChangeText}
                />
                <InputLeftElement>
                    <IconButton size='md'
                                colorScheme='green'
                                onClick={() => navigate('/menu')}>
                        <MdMenu/>
                    </IconButton>
                </InputLeftElement>
            </InputGroup>
            <Slide direction='bottom'
                   in={open}
                   style={{
                       zIndex: 10
                   }}
            >
                <VStack bgColor='whitesmoke' width='100%' maxHeight='75vh' shadow='xl' zIndex={9999} roundedTop='md'>
                    <VStack width='100%'
                            padding={4}
                            spacing={2}
                            overflowY='scroll'
                    >
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                        <CompanyCard/>
                    </VStack>
                    <Container>
                        <Button onClick={() => setOpen(false)}
                                aria-label='close'
                                w='100%'
                                colorScheme='green'
                                size='lg'>
                            Закрыть
                        </Button>
                    </Container>
                </VStack>
            </Slide>
        </Box>
    )
}
