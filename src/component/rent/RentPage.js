import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertIcon,
    Box,
    Center,
    CircularProgress,
    Divider,
    HStack,
    Stack,
    Tag,
    Text,
    VStack
} from "@chakra-ui/react";
import {BRAND_GRADIENT, tariffUnit, toLastPoint} from "../util.js";
import {rentService} from "../../service/RentService.js";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
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
            let rent = await rentService.getOne(rentId);
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

    return (
        <VStack w='100%' alignItems='start'>
            {!rent.inventory &&
                <Alert>
                    <AlertIcon/>
                    Инвентарь не поддерживает отправку телеметрии
                </Alert>
            }
            {rent.inventory && <Box h='50vh' w='100%'>
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
                    <Polyline pathOptions={{color: 'orange'}}
                              positions={(rent.track??[]).map(point => [point.lat, point.lng])}/>
                </MapContainer>
            </Box>}
            <RentView rent={rent}/>
        </VStack>
    )
}

function RentView({rent}) {
    return (
        <Stack p={5} w='100%' spacing={5}>
            <Text fontSize='4xl'
                  fontWeight='extrabold'
                  color='brand.600'>
                Аренда #{rent.id}
            </Text>
            <Text textAlign='center'
                  fontSize='3xl'
                  fontWeight='extrabold'
                  bgGradient={BRAND_GRADIENT}
                  bgClip='text'>
                Стоимость
            </Text>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Тариф
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {rent.tariff.alias}
                    </Tag>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {rent.tariff.price} {tariffUnit[rent.tariff.type]}
                    </Tag>
                </HStack>
            </Stack>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Стоимость
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {rent?.cheque?.price?.toFixed(2)} ₽
                    </Tag>
                </HStack>
            </Stack>
            <Divider/>
            <Text textAlign='center'
                  fontSize='3xl'
                  fontWeight='extrabold'
                  bgGradient={BRAND_GRADIENT}
                  bgClip='text'>
                Время
            </Text>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Продолжительность
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {moment(rent.endTime).diff(moment(rent.startTime), 'minutes')} мин
                    </Tag>
                </HStack>
            </Stack>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Старт
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {moment(rent.startTime).format('lll')}
                    </Tag>
                </HStack>
            </Stack>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Финиш
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {moment(rent.endTime).format('lll')}
                    </Tag>
                </HStack>
            </Stack>
            <Divider/>
            <Text textAlign='center'
                  fontSize='3xl'
                  fontWeight='extrabold'
                  bgGradient={BRAND_GRADIENT}
                  bgClip='text'>
                Инвентарь
            </Text>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Инвентарь
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {rent.inventory.alias}
                    </Tag>
                </HStack>
            </Stack>
            <Divider/>
            <Stack>
                <Text fontWeight='extrabold' size='2xl'>
                    Организация
                </Text>
                <HStack>
                    <Tag colorScheme='brand'
                         size='xl'
                         p={2}
                         fontWeight='extrabold'>
                        {rent.inventory.organization.name}
                    </Tag>
                </HStack>
            </Stack>
        </Stack>
    )
}
