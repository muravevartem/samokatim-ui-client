import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Skeleton,
    Stack,
    Tag,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {rentService} from "../../service/RentService.js";
import {IoMdCash} from "react-icons/io";
import {errorConverter} from "../../error/ErrorConverter.js";
import {EquipmentLogo} from "../util.js";

export function ArchiveRentPage() {

    return (
        <VStack alignItems='start'
                w='100%'
                padding={5}>
            <HistoricalOrderBlock/>
        </VStack>
    );
}

function HistoricalOrderBlock() {
    const [data, setData] = useState({content: [], page: -1, size: 15});
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    async function repay(rent) {
        try {
            let paymentOpt = await rentService.repay(rent.id);
            document.location.href = paymentOpt.confirmationUrl;
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    async function onLoad() {
        try {
            setLoading(true);
            const pageable = {page: data.page + 1, size: data.size, sort: 'endTime,desc', last: true};
            console.log(pageable);
            let rents = await rentService.getAll(pageable);
            setData({
                content: [...data.content, ...rents.content],
                page: rents.number,
                size: rents.size,
                last: rents.last
            });
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, [])

    return (
        <Stack
            w='100%'
            spacing={4}
            paddingY={10}>
            <Text fontSize='4xl'
                  fontWeight='extrabold'
                  color='brand.600'>
                Поездки
            </Text>
            <Stack divider={<Divider/>}>
                {data.content.map(rent => <RentCard rent={rent} key={rent.id} onRetry={() => repay(rent)}/>)}
            </Stack>
            {!data.last &&
                <Skeleton isLoaded={!loading}>
                    <Button onClick={onLoad}>Показать ещё</Button>
                </Skeleton>
            }
        </Stack>

    )
}

function RentCard({rent, onRetry}) {
    let navigate = useNavigate();
    let iconParams = {size: 48, color: 'black'};
    return (
        <Grid templateColumns='repeat(5, 1fr)'
              w='100%'
              p={3}
              onClick={() => navigate(`/rents/${rent.id}`)}>
            <GridItem colSpan={4}>
                <VStack alignItems='start'>
                    <Heading size='md'>
                        Аренда #{rent.id}
                        {rent.cheque.status !== 'COMPLETED' &&
                            <Badge>Не оплачено</Badge>
                        }
                    </Heading>
                    <Heading size='md'>
                        {rent.startTime ? moment(rent.startTime).format('lll') : ' - '}
                    </Heading>
                    <HStack>
                        <IoMdCash/>
                        <Tag>{rent?.cheque?.price?.toFixed(2) ?? '-'} ₽</Tag>
                    </HStack>
                    {rent.cheque.status !== 'COMPLETED' &&
                        <Button size='sm'
                                onClick={onRetry}
                                colorScheme='brand'>
                            Оплатить
                        </Button>
                    }
                </VStack>
            </GridItem>
            <GridItem colStart={5} colEnd={5}>
                <HStack justifyContent='end'>
                    <EquipmentLogo type={rent.inventory.model.type} size={48}/>
                </HStack>
            </GridItem>
        </Grid>
    )
}
