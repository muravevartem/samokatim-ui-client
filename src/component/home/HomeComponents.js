import {
    Button,
    Center,
    CloseButton,
    Divider,
    HStack,
    Slide,
    Stack,
    Tag,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {EquipmentLogo, tariffUnit, zIndexes} from "../util.js";
import React, {useEffect, useState} from "react";
import {AppEvents, eventBus} from "../../service/EventBus.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {rentService} from "../../service/RentService.js";
import moment from "moment";

export function InventoryModal() {
    const [inventory, setInventory] = useState();
    const [loading, setLoading] = useState(false);
    let toast = useToast();

    async function startRent(tariff) {
        try {
            setLoading(true);
            let obj = await rentService.start({
                inventoryId: inventory.id,
                tariffId: tariff.id
            });
            toast({
                status: 'info',
                title: 'Аренда начата'
            })
            setInventory(undefined)
            eventBus.raise(AppEvents.SelectedRent, obj)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let onSelectedInventory = eventBus.on(AppEvents.SelectedInventory, data => setInventory(data));
        return () => {
            onSelectedInventory()
        }
    }, [])


    return (
        <Slide in={inventory} style={{zIndex: zIndexes.Popover}} direction='bottom'>
            <Stack p={3}
                   backdropFilter='blur(10px)'
                   spacing={4}
                   divider={<Divider/>}
                   w='100%'
                   bgColor='whiteAlpha.700'
                   zIndex={zIndexes.Popover}>
                <HStack justifyContent='space-between'>
                    <HStack>
                        <Center bgGradient="linear(to-l, #7928CA,#FF0080)" p={2} rounded={10}>
                            <EquipmentLogo type={inventory?.model?.type} size={32} color='white'/>
                        </Center>

                        <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                              bgClip='text'
                              fontSize="4xl"
                              textAlign='start'
                              fontWeight="extrabold">
                            {inventory?.alias}
                        </Text>
                    </HStack>
                    <CloseButton onClick={() => setInventory(undefined)}/>
                </HStack>
                <VStack w='100%' alignItems='start'>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Модель</Text>
                        <HStack px={2}>
                            <Tag colorScheme='brand'>{inventory?.model?.name}</Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Владелец</Text>
                        <HStack px={2}>
                            <Tag colorScheme='brand'>{inventory?.organization?.name}</Tag>
                        </HStack>
                    </Stack>
                </VStack>
                <HStack overflowX='auto'>
                    {inventory?.tariffs?.map(item => (
                        <Stack key={item?.id}
                               bgColor='brand.300'
                               cursor='pointer'
                               rounded={10}
                               p={2}
                               onClick={() => startRent(item)}
                               w='max-content'>
                            <Stack spacing={0}>
                                <Text color='white'
                                      fontWeight='extrabold'>
                                    {item?.alias}
                                </Text>
                                <Text color='lightgray'
                                      fontWeight='bolder'>
                                    {item?.price} {tariffUnit[item?.type]}
                                </Text>
                            </Stack>
                        </Stack>
                    ))}
                </HStack>
            </Stack>
        </Slide>
    )
}

export function RentModal() {
    const [rent, setRent] = useState();
    const [loading, setLoading] = useState(false);
    let toast = useToast();

    async function stopRent() {
        try {
            setLoading(true);
            let obj = await rentService.stop(rent?.id);
            toast({
                status: 'info',
                title: 'Аренда завершена',
                description: `${moment(obj.endTime).diff(moment(obj.startTime), 'minutes')} мин`
            })
            setRent(undefined)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        let onSelectedRent = eventBus.on(AppEvents.SelectedRent, data => setRent(data));
        return () => {
            onSelectedRent()
        }
    }, [])


    return (
        <Slide in={rent} style={{zIndex: zIndexes.Popover}} direction='bottom'>
            <Stack p={3}
                   backdropFilter='blur(10px)'
                   spacing={4}
                   divider={<Divider/>}
                   w='100%'
                   bgColor='whiteAlpha.700'
                   zIndex={zIndexes.Popover}>
                <HStack justifyContent='space-between'>
                    <HStack>
                        <Center bgGradient="linear(to-l, #7928CA,#FF0080)" p={2} rounded={10}>
                            <EquipmentLogo type={rent?.inventory?.model?.type} size={32} color='white'/>
                        </Center>

                        <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                              bgClip='text'
                              fontSize="4xl"
                              textAlign='start'
                              fontWeight="extrabold">
                            {rent?.inventory?.alias}
                        </Text>
                    </HStack>
                    <CloseButton onClick={() => setRent(undefined)}/>
                </HStack>
                <VStack w='100%' alignItems='start' divider={<Divider/>}>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Модель</Text>
                        <HStack px={2}>
                            <Tag colorScheme='brand'>{rent?.inventory?.model?.name}</Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Владелец</Text>
                        <HStack px={2}>
                            <Tag colorScheme='brand'>{rent?.inventory?.organization?.name}</Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Начало аренды</Text>
                        <HStack px={2}>
                            <Tag colorScheme='brand'>{moment(rent?.startTime).format('lll')}</Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Тариф</Text>
                        <HStack px={2}>
                            <Tag colorScheme="brand">{rent?.tariff?.alias}</Tag>
                            <Tag colorScheme='brand'>{rent?.tariff?.price} {tariffUnit[rent?.tariff?.type]}</Tag>
                        </HStack>
                    </Stack>
                    <HStack justifyContent='center' w='100%'>
                        <Button w={250}
                                isDisabled={loading}
                                onClick={stopRent}
                                colorScheme='brand'>
                            Завершить
                        </Button>
                    </HStack>
                </VStack>
            </Stack>
        </Slide>
    )
}

