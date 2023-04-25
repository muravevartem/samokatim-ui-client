import React, {useEffect, useRef, useState} from "react";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CloseButton,
    Container, Divider,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, SimpleGrid,
    Skeleton,
    Slide, Stack, Stat, StatHelpText, StatLabel, StatNumber,
    Tag,
    Text,
    VStack
} from "@chakra-ui/react";
import {MapContainer, Marker, TileLayer, Tooltip, useMap} from "react-leaflet";
import {locations, locationService} from "../service/LocationService.js";
import {errorService} from "../service/ErrorService.js";
import {events, eventService} from "../service/EventService.js";
import {MdBikeScooter, MdLocationOn, MdMenu} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {routes} from "../routers.js";
import {userService} from "../service/UserService.js";
import {companyService} from "../service/CompanyService.js";
import isEmpty from "validator/es/lib/isEmpty.js";
import {equipmentService} from "../service/EquipmentService.js";
import {paymentService} from "../service/PaymentService";
import moment from "moment";
import {FOR_RENT_EQUIPMENT_ICON, MY_LOCATION_ICON, RENTED_EQUIPMENT_ICON} from "./Icons";
import {IoMdCash} from "react-icons/io";
import {StatV2} from "./util";

export function HomePage() {
    let navigate = useNavigate();

    useEffect(() => {
        if (!userService.authenticated())
            navigate(routes.login)
    }, [])

    return (
        <VStack spacing={0} width='100%' minH={'100vh'}>
            <MainView/>
            <MapBox/>
        </VStack>
    )
}

export function MapBox() {
    const [error, setError] = useState();

    let center = JSON.parse(localStorage.getItem('MyLastCenter'));
    let zoom = localStorage.getItem('MyLastZoom');


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
                <EquipmentLocationMarkers/>
            </MapContainer>
        </Box>
    )
}

function ZoomBox() {
    const map = useMap();

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    return (
        <VStack pos='fixed'
                right={2}
                bottom='50%'
                zIndex={9999}>
            <Button colorScheme='gray'
                    color='green'
                    rounded='lg'
                    onDoubleClick={() => {
                    }}
                    onClick={() => {
                        if (mounted.current) {
                            map.setZoom(map.getZoom() + 1)
                        }
                    }}>
                +
            </Button>
            <Button colorScheme='gray'
                    color='green'
                    rounded='lg'
                    onDoubleClick={() => {
                    }}
                    onClick={() => {
                        if (mounted.current) {
                            map.setZoom(map.getZoom() - 1)
                        }
                    }}>
                -
            </Button>
        </VStack>
    );
}


function LocationMarker({onError}) {
    const [position, setPosition] = useState(null)
    const map = useMap();

    const mounted = useRef(false);

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
        mounted.current = true;
        map.on('zoom', event => {
            if (mounted.current) {
                localStorage.setItem('MyLastZoom', event.target.getZoom())
            }
        })
        map.on('move', event => {
            if (mounted.current) {
                localStorage.setItem('MyLastCenter', JSON.stringify(event.target.getCenter()))
            }
        })
        eventService.subscribe(events.myLocation, () => {
                if (mounted) {
                    toMyLocation()
                }
            }
        )
        return () => mounted.current = false;
    }, [])

    return position === null ? null : (
        <Marker position={position} icon={MY_LOCATION_ICON}>
            <Tooltip direction="top" permanent offset={[0, -10]}>
                <Text fontWeight='bold'>Вы здесь</Text>
            </Tooltip>
        </Marker>
    )
}

function EquipmentLocationMarkers() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(false);

    const map = useMap();

    function toPoints(map) {
        let bounds = map.getBounds();
        let northEast = bounds.getNorthEast();
        let southWest = bounds.getSouthWest();
        return {
            northEast: northEast,
            southWest: southWest
        }
    }

    async function loadPoints() {
        try {
            if (!loading) {
                setLoading(true);
                let points = await equipmentService.getPoints(toPoints(map));
                setPoints(points)
            }
        } catch (e) {

        } finally {
            setLoading(false);
            setTimeout(loadPoints, 10000)
        }
    }

    useEffect(() => {
        map.on('moveend', event => {
            loadPoints()
        })
        eventService.subscribe(events.newEquipmentLocations, loadPoints)
        loadPoints();
    }, [])


    return (
        <>
            {points.map(point => (
                <EquipmentMarker point={point} key={point.id}/>
            ))}
        </>
    )
}

function EquipmentMarker({point}) {


    const eventHandlers = {
        click() {
            console.log(`selected ${point.id}`)
            eventService.raiseWithData(events.selectedEquipment, point);
        },
    }

    return (
        <Marker position={[point.lat, point.lng]}
                icon={point.status === 'WAITING' ? RENTED_EQUIPMENT_ICON : FOR_RENT_EQUIPMENT_ICON}
                eventHandlers={eventHandlers}>
        </Marker>
    )
}

function ButtonMyLocation() {
    return (
        <IconButton
            position='fixed'
            isRound
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

function EquipmentCard() {
    const [selectedEquipment, setSelectedEquipment] = useState({});
    const [selectedGeoObject, setSelectedGeoObject] = useState({})
    const [selectedRate, setSelectedRate] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setError(null);
    }, [open])

    async function loadEquipment(equipmentPoint) {
        try {
            setSelectedGeoObject(equipmentPoint);
            setLoading(true)
            setOpen(true)
            let equipment = await equipmentService.getOne(equipmentPoint.id);
            setSelectedEquipment(equipment);
        } catch (e) {
            setSelectedEquipment(null);
        } finally {
            setLoading(false);
        }
    }

    async function startRent() {
        if (!loading) {
            try {
                setLoading(true)
                await paymentService.startRent({equipmentId: selectedEquipment.id});
                eventService.raise(events.startRent);
                setOpen(false);
                eventService.raise(events.newEquipmentLocations);
            } catch (e) {
                setError(errorService.beautify(e));
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        eventService.subscribe(events.selectedEquipment, (equipmentPoint) => loadEquipment(equipmentPoint));
    }, [])


    return (
        <Slide
            direction='bottom'
            in={open}
            style={{
                zIndex: 15
            }}>

            {error &&
                <Alert status='error'><AlertIcon/>{error.message}</Alert>
            }

            <Skeleton isLoaded={!loading}>
                <VStack bgColor='white' minH={200} alignItems='start' p={5} w='100%' spacing={6} divider={<Divider/>}>
                    <HStack w='100%' justifyContent='space-between'>
                        <VStack alignItems='start' spacing={0}>
                            <Heading size='lg'>{selectedEquipment.name}</Heading>
                            <Text>{selectedEquipment?.owner?.name}</Text>
                        </VStack>
                        <CloseButton onClick={() => setOpen(false)}/>
                    </HStack>
                    {selectedEquipment &&
                        <RateView equipment={selectedEquipment} value={selectedRate} setValue={setSelectedRate}/>
                    }
                    {selectedGeoObject.status === 'USED' &&
                        <RentPrompt geoObject={selectedGeoObject}/>
                    }
                    {selectedGeoObject.status === 'WAITING' &&
                        <Button colorScheme='green'
                                w='100%'
                                p={3}
                                disabled={loading}
                                onClick={startRent}>
                            Арендовать
                        </Button>
                    }

                </VStack>
            </Skeleton>


        </Slide>
    )
}

function RentPrompt({geoObject}) {
    const [loading, setLoading] = useState(false);
    const [rent, setRent] = useState({});
    const [error, setError] = useState();
    const navigate = useNavigate();

    async function loadRent() {
        try {
            setLoading(true);
            let rent = await paymentService.getMyRentOfEquipment(geoObject.id);
            setRent(rent);
        } catch (e) {
            setError(errorService.beautify(e));
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadRent()
    }, []);

    async function stopRent() {
        try {
            setLoading(true);
            console.log(rent)
            await paymentService.stopRent(rent);
            navigate(`${routes.rent}/${rent.id}`)
        } catch (e) {
            setError(errorService.beautify(e));
        } finally {
            setLoading(false);
        }
    }

    if (error)
        return (
            <Alert><AlertIcon/>{error.message}</Alert>
        )

    return (
        <VStack w='100%' alignItems='start' spacing={3}>
            <Heading size='md'>Аренда #{rent.id}</Heading>
            <Stack>
                <Heading size='sm'>Начало</Heading>
                <Tag>{moment(rent.startTime).format('LLL')}</Tag>
            </Stack>
            <VStack alignItems='start'>
                <Heading size='sm'>Продолжительность</Heading>
                <Tag>{moment().diff(moment(rent.startTime), 'minutes')} мин</Tag>
            </VStack>


            <Button colorScheme='yellow'
                    w='100%'
                    onClick={stopRent}>
                Прекратить аренду
            </Button>
        </VStack>
    )

}

function RateView({equipment}) {
    const [rate, setRate] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    async function loadRate() {
        let orgId = equipment?.owner?.id;
        if (orgId) {
            try {
                setLoading(true);
                let rate = await paymentService.getRatesForOrganization(orgId);
                setRate(rate);
            } catch (e) {
                let errorObj = errorService.beautify(e);
                setError(errorObj);
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        loadRate();
    }, [])

    if (error) {
        return <Alert status='error'><AlertIcon/>{error.message}</Alert>
    }

    return (
        <VStack w='100%' alignItems='start'>
            <Heading size='md'>Тариф</Heading>
            <HStack>
                <IoMdCash color='green' size={24}/>
                <Heading size='sm'>{rate.price} P/мин</Heading>
            </HStack>
        </VStack>
    )
}

function ActiveRents() {

    const [loading, setLoading] = useState(false);
    const [rents, setRents] = useState([]);
    const [open, setOpen] = useState(false);

    async function loadRents() {
        try {
            setLoading(true);
            let rents = await paymentService.getMyActiveRent();
            setRents(rents);
        } catch (e) {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRents()
        eventService.subscribe(events.startRent, () => loadRents());
        eventService.subscribe(events.stopRent, () => loadRents());
    }, [])

    if (!loading && rents.length === 0)
        return (
            <></>
        )

    return (


        <Skeleton isLoaded={!loading}>
            <Button leftIcon={<MdBikeScooter/>}
                    onClick={() => setOpen(true)}
                    zIndex={10} colorScheme={rents.length > 0 ? 'yellow' : 'gray'}>
                {rents.length}
            </Button>
            <Slide direction='bottom'
                   in={open}
                   style={{
                       zIndex: 10
                   }}>
                <VStack bgColor='white' alignItems='start' w='100%' p={2}>
                    <HStack justifyContent='end' w='100%'>
                        <CloseButton onClick={() => setOpen(false)}/>
                    </HStack>
                    <VStack spacing={4} w='100%'>
                        {rents.length === 0 &&
                            <Text>Пусто</Text>
                        }
                        {rents.map(rent => (
                            <RentView rent={rent} key={rent.id}/>
                        ))}
                    </VStack>
                </VStack>
            </Slide>

        </Skeleton>

    )
}

function RentView({rent}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    let navigate = useNavigate();

    async function stopRent() {
        try {
            setLoading(true);
            let stopedRent = await paymentService.stopRent(rent);
            eventService.raiseWithData(events.stopRent, stopedRent);
            navigate(`${routes.rent}/${rent.id}`)
        } catch (e) {
            setError(errorService.beautify(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card key={rent.id} w='100%'>
            {error &&
                <Alert status='error'>{error.message}</Alert>
            }
            <CardHeader>
                <Heading size='lg'>Аренда #{rent.id} <Badge colorScheme='yellow'>Активно</Badge></Heading>
            </CardHeader>
            <CardBody>
                <VStack spacing={3} alignItems='start'>
                    <Tag>{moment(rent.startTime).format('LLL')}</Tag>
                </VStack>
            </CardBody>
            <CardFooter>
                <Skeleton isLoaded={!loading}>
                    <Button size='sm' colorScheme='yellow' onClick={stopRent}>
                        Остановить
                    </Button>
                </Skeleton>
            </CardFooter>
        </Card>
    )
}

function MainView() {
    const [open, setOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    async function searchCompanies(text) {
        try {
            if (!loading) {
                setLoading(true);
                const companyPage = await companyService.search(text, {size: 30, page: 0})
                setCompanies(companyPage.content);
            }
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
            <Box position='fixed' bottom={5}>
                <HStack w='100%' justifyContent='start'>
                    <Menu>
                        <MenuButton as={Button} leftIcon={<MdMenu/>}>
                            Меню
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => navigate(routes.profile)}>Профиль</MenuItem>
                            <MenuItem onClick={() => navigate(routes.archive)}>История</MenuItem>
                            <MenuItem onClick={() => {
                            }}>Настройки</MenuItem>
                        </MenuList>
                    </Menu>
                    <ActiveRents/>
                </HStack>
            </Box>


            <EquipmentCard/>
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
