import React, {useState} from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    Heading,
    HStack,
    Slide,
    Spinner,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {Header, pageTitle} from "./util.js";
import moment from "moment";
import {equipmentIcons} from "../service/EquipmentService.js";
import InfiniteScroll from "react-infinite-scroll-component";

export function ArchiveRentPage() {
    pageTitle('Самокатим.История')

    return (
        <VStack alignItems='start'
                w='100%'
                padding={5}>
            <Header title='История'/>
            <HistoricalOrderBlock/>
        </VStack>
    );
}

let id = 10;
const orders = {
    content: [
        {
            id: 2,
            price: 234,
            type: 'BIKE',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 25'
            }
        },
        {
            id: 3,
            price: 234,
            type: 'BIKE',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 21'
            }
        },
        {
            id: 4,
            price: 234,
            type: 'SCOOTER',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 25'
            }
        },
        {
            id: 5,
            price: 234,
            type: 'SCOOTER',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 25'
            }
        },
        {
            id: 6,
            price: 234,
            type: 'SCOOTER',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 25'
            }
        },
        {
            id: 7,
            price: 234,
            type: 'SCOOTER',
            tracked: true,
            start: {
                time: new Date(),
                address: 'Ул.Блинова, 25'
            }
        }
    ],
    last: false
};

function HistoricalOrderBlock() {
    const [data, setData] = useState(orders);
    const [loading, setLoading] = useState(false);

    function onLoad(e) {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setData({
                content: data.content.concat(orders.content),
                last: false
            })
        }, 1000)
    }

    return (
        <VStack alignItems='center'
                w='100%'
                spacing={4}
                paddingY={10}>
            {data.content.map((value, index, array) => <OrderBlock order={value} key={index}/>)}
            {loading ? <Spinner/> : <Button onClick={onLoad}>Показать ещё</Button>}
        </VStack>

    )
}

function OrderBlock({order}) {
    let navigate = useNavigate();
    let iconParams = {size: 48, color: 'black'};
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <Card w='100%'
              maxW={768}
              transition='1s'
              _hover={{shadow: 'lg'}}>
            <CardBody>
                <Grid templateColumns='repeat(5, 1fr)'>
                    <GridItem colSpan={4}>
                        <VStack alignItems='start'>
                            <Heading size='md'>
                                {moment(order.start.time).format('LLL')}
                            </Heading>
                            {!order.tracked &&
                                <Box>
                                    <Badge colorScheme='yellow'
                                           onClick={onOpen}>
                                        Без отслеживания
                                    </Badge>
                                    <Slide direction='bottom' in={isOpen} style={{zIndex: 999}}>
                                        <VStack p={10}
                                                bgColor='green.100'
                                                alignItems='start'>
                                            <Heading size='md'>Геолокации оборудования</Heading>
                                            <Text>
                                                Для оборудования с поддержкой отслеживания геолокации
                                                возможно сохранение пройденного пути в истории заказов
                                            </Text>
                                            <HStack justifyContent='end' w='100%'>
                                                <Button onClick={onClose}>Закрыть</Button>
                                            </HStack>
                                        </VStack>
                                    </Slide>
                                </Box>

                            }
                            <Text>{order.start.address}</Text>
                            <Text>{order.price}₽</Text>
                            <Button zIndex={1} onClick={() => navigate(`/orders/${order.id}`)}>Подробнее</Button>
                        </VStack>
                    </GridItem>
                    <GridItem colStart={5} colEnd={5}>
                        <HStack justifyContent='end'>
                            {equipmentIcons[order.type] ? equipmentIcons[order.type](iconParams) : equipmentIcons.UNKNOWN(iconParams)}
                        </HStack>
                    </GridItem>
                </Grid>
            </CardBody>
        </Card>
    )
}
