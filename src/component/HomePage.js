import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Card,
    Container,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Slide,
    Text,
    VStack
} from "@chakra-ui/react";
import {MapContainer, Marker, TileLayer, Tooltip, useMap} from "react-leaflet";
import {locations, locationService} from "../service/LocationService.js";
import {errorService} from "../service/ErrorService.js";
import {events, eventService} from "../service/EventService.js";
import {MdLocationOn, MdMenu} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {routes} from "../routers.js";
import {userService} from "../service/UserService.js";
import L from 'leaflet'
import {companyService} from "../service/CompanyService.js";
import isEmpty from "validator/es/lib/isEmpty.js";

export function HomePage() {
    const [openSearch, setOpenSearch] = useState(false);
    let navigate = useNavigate();
    useEffect(() => {
        if (!userService.authenticated())
            navigate(routes.login)
    },[])

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


    const myIcon = new L.Icon({
        iconUrl: 'myLocation.png',
        iconSize: [48,48],
    });

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
        <Marker position={position} icon={myIcon}>
            <Tooltip direction="top" permanent offset={[0, -20]}>
                <Text fontWeight='bold'>Вы здесь</Text>
            </Tooltip>
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

function CompanyCard({company}) {
    return (
        <Card width='100%'>
            <VStack alignItems='start' w='100%' p={3} spacing={1}>
                <Heading size='sm'>{company.name}</Heading>
                <Text>ИНН: {company.inn}</Text>
                <Text>Телефон: {company.tel}</Text>
                <Text>Email: {company.email}</Text>
                <HStack w='100%' justifyContent='end'>
                    <Button>Выбрать</Button>
                </HStack>
            </VStack>
        </Card>
    )
}

function SearchBar() {
    const [open, setOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    async function searchCompanies(text) {
        try {
            setLoading(true);
            const companyPage = await companyService.search(text, {size: 30, page: 0})
            setCompanies(companyPage.content);
        } catch (e) {

        } finally {
            setLoading(false);
        }
    }

    function onChangeText(event) {
        let text = event.target.value;

        if (isEmpty(text)) {
            setOpen(false);
        } else {
            if (!open) {
                setOpen(true);
            }
        }

        searchCompanies(text);
    }

    return (
        <Box paddingTop={15}
             paddingX={15}
             zIndex={9999}
             width='100%'>
            <InputGroup size='lg'>
                <Input bgColor='white'
                       pl='1rem'
                       display='block'
                       width='100%'
                       placeholder='Поиск...'
                       shadow='lg'
                       onChange={onChangeText}
                />
            </InputGroup>
            <Menu>
                <Box position='fixed' bottom={5} left={5}>
                    <MenuButton>
                        <IconButton aria-label='menu' icon={<MdMenu/>} colorScheme='green'/>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => navigate(routes.profile)}>Профиль</MenuItem>
                        <MenuItem onClick={() => navigate(routes.orders)}>История</MenuItem>
                        <MenuItem onClick={() => {}}>Настройки</MenuItem>
                    </MenuList>
                </Box>
            </Menu>

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
                            overflowY='auto'
                    >
                        {loading &&
                            <HStack w='100%' justifyContent='center'>
                                <Heading size='sm'>Загружаю...</Heading>
                            </HStack>
                        }
                        {companies.map(company => <CompanyCard key={company.id} company={company}/>)}
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
