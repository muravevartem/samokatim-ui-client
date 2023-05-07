import React, {useEffect, useState} from "react";
import {Button, Divider, Grid, GridItem, Heading, HStack, Skeleton, Tag, useToast, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {equipmentIcons} from "../service/EquipmentService.js";
import {rentService} from "../service/RentService.js";
import {errorService} from "../service/ErrorService";
import {IoMdCash} from "react-icons/io";

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

    async function onLoad() {
        try {
            setLoading(true);
            const pageable = {page: data.page + 1, size: data.size, sort: 'id,desc', last: true};
            console.log(pageable);
            let rents = await rentService.getMyArchiveRents(pageable);
            setData({
                content: [...data.content, ...rents.content],
                page: rents.number,
                size: rents.size,
                last: rents.last
            });
        } catch (e) {
            toast({
                status: 'error',
                title: errorService.beautify(e)
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onLoad();
    }, [])

    return (
        <VStack alignItems='center'
                w='100%'
                divider={<Divider/>}
                spacing={4}
                paddingY={10}>
            {data.content.map(rent => <RentCard rent={rent} key={rent.id}/>)}
            {!data.last &&
                <Skeleton isLoaded={!loading}>
                    <Button onClick={onLoad}>Показать ещё</Button>
                </Skeleton>
            }
        </VStack>

    )
}

function RentCard({rent}) {
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
                    </Heading>
                    <Heading size='md'>
                        {moment(rent.startTime).format('lll')}
                    </Heading>
                    <HStack>
                        <IoMdCash/>
                        <Tag>{rent.price ?? '1000'} P</Tag>
                    </HStack>



                </VStack>
            </GridItem>
            <GridItem colStart={5} colEnd={5}>
                <HStack justifyContent='end'>
                    {equipmentIcons[rent.equipmentType] ? equipmentIcons[rent.equipmentType](iconParams) : equipmentIcons.UNKNOWN(iconParams)}
                </HStack>
            </GridItem>
        </Grid>
    )
}
