import React, {useEffect, useId, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertIcon,
    Box,
    Center,
    CircularProgress, Divider,
    Heading,
    HStack, IconButton,
    Skeleton, Stack,
    Tag, Text,
    VStack
} from "@chakra-ui/react";
import {Header, toLastPoint} from "./util";
import {paymentService} from "../service/PaymentService";
import {errorService} from "../service/ErrorService";
import {MapContainer, Polygon, Polyline, TileLayer} from "react-leaflet";
import {locations} from "../service/LocationService";
import {IoMdCash, IoMdTime} from "react-icons/io";
import {MdArrowBack} from "react-icons/md";
import moment from "moment";

export function RentPage() {
    const params = useParams();
    const rentId = params['rentId'];
    const [loading, setLoading] = useState(false);
    const [rent, setRent] = useState({});
    const [error, setError] = useState();
    const navigate = useNavigate();

    async function loadRent() {
        try {
            setLoading(true);
            let rent = await paymentService.getRent(rentId);
            setRent(rent);
        } catch (e) {
            navigate('/rents/error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRent()
    }, [])

    if (loading || !(rent.id))
        return (
            <Center w='100%' h='100vh'>
                <CircularProgress isIndeterminate color='green'/>
            </Center>
        )

    if (error)
        return (
            <Center w='100%' h='100vh'>
                <Alert status='error'><AlertIcon/>{error.message}</Alert>
            </Center>
        )

    return (
        <VStack w='100%' alignItems='start'>
            {rent.track &&
                <Box h='50vh' w='100%'>
                    <MapContainer
                        zoomControl={false}
                        scrollWheelZoom={true}
                        center={toLastPoint(rent.track)}
                        zoom={13}
                        style={{width: '100%', height: '100%'}}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Polyline pathOptions={{color: 'orange'}} positions={rent.track.map(point => [point.lat, point.lng])}/>
                    </MapContainer>
                </Box>
            }
            {!rent.track &&
                <Alert><AlertIcon/>Маршрут передвижения не записывался</Alert>
            }
            <IconButton aria-label='Back'
                        colorScheme='green'
                        onClick={()=>navigate(-1)}
                        size='lg'
                        rounded='50%'
                        position='fixed'
                        right={5}
                        bottom={5}
                        icon={<MdArrowBack/>}/>
            <RentView rent={rent}/>
        </VStack>
    )
}

function RentView({rent}) {
    return (
        <VStack alignItems='start' p={5} w='100%' spacing={5}>
            <Heading>Аренда #{rent.id}</Heading>
            <HStack>
                <IoMdCash/>
                <Tag>{rent.price ?? '1000'} P</Tag>
            </HStack>
            <HStack>
                <IoMdTime/>
                <Tag>{moment(rent.endTime).diff(moment(rent.startTime), 'minutes')} мин</Tag>
            </HStack>
            <Divider/>
            <VStack alignItems='start'>
                <Heading size='sm'>Тариф</Heading>
                <Tag>5 Р/мин</Tag>
            </VStack>
            <Divider/>
            <VStack alignItems='start'>
                <Heading size='sm'>Время начала</Heading>
                <Tag>{moment(rent.startTime).format('lll')}</Tag>
            </VStack>
            <VStack alignItems='start'>
                <Heading size='sm'>Время окончания</Heading>
                <Tag>{moment(rent.endTime).format('lll')}</Tag>
            </VStack>
            <Divider/>
            <VStack alignItems='start'>
                <Heading size='sm'>Оборудование</Heading>
                <Tag size='lg'>{rent?.equipment?.name}</Tag>
            </VStack>
            <Divider/>
            <VStack alignItems='start'>
                <Heading size='sm'>Организация</Heading>
                <Tag size='lg'>{rent?.equipment?.owner?.fullName}</Tag>
            </VStack>
        </VStack>
    )
}