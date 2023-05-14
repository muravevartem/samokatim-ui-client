import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Button,
    Center,
    CloseButton,
    Divider,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Slide,
    Stack,
    Tag,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {EquipmentLogo, tariffUnit, toDayName, toLocalTime, zIndexes} from "../util.js";
import React, {useEffect, useState} from "react";
import {AppEvents, eventBus} from "../../service/EventBus.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {rentService} from "../../service/RentService.js";
import moment from "moment";
import {FaParking} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {fileService} from "../../service/FileService.js";
import {IoMdQrScanner} from "react-icons/io";

export function InventoryModal() {
    const [inventory, setInventory] = useState();
    const [selectedTariff, setSelectedTariff] = useState();
    const [loading, setLoading] = useState(false);
    let {isOpen, onOpen, onClose} = useDisclosure();
    let toast = useToast();

    async function startRent(tariff) {
        try {
            setLoading(true);
            let obj = await rentService.start({
                inventoryId: inventory.id,
                tariffId: tariff.id
            });
            setInventory(undefined)
            window.location.href = obj.confirmationUrl;
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

    if (!inventory) {
        return null;
    }


    return (
        <Slide in={inventory} style={{zIndex: zIndexes.Popover}} direction='bottom'>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Подтверждение аренды</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text>
                            Для подтверждждение аренды нужно заплатить депозит.
                            Будет списано <Badge>{selectedTariff?.deposit} ₽</Badge>.
                            После успешного окончания аренды депозит будет возвращен
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Отмена</Button>
                        <Button colorScheme='brand' onClick={() => startRent(selectedTariff)}>Перейти к оплате</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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

                        <Stack spacing={0}>
                            <Text color='brand.600'
                                fontSize="2xl"
                                textAlign='start'
                                fontWeight="extrabold">
                                {inventory?.model?.name}
                            </Text>
                            <HStack spacing={1}>
                                <IoMdQrScanner/>
                                <Text fontSize="md"
                                      textAlign='start'>
                                    {inventory?.alias}
                                </Text>
                            </HStack>
                        </Stack>
                    </HStack>
                    <CloseButton onClick={() => setInventory(undefined)}/>
                </HStack>
                <HStack>
                    <Image src={fileService.url(inventory?.organization?.logo)} rounded='50%' boxSize={14}/>
                    <Text color='brand.600' fontWeight='bold'>{inventory?.organization?.name}</Text>
                </HStack>
                <HStack overflowX='auto'>
                    {inventory?.tariffs?.map(item => (
                        <Stack key={item?.id}
                               bgColor='brand.300'
                               cursor='pointer'
                               rounded={10}
                               p={2}
                               onClick={() => {
                                   setSelectedTariff(item);
                                   onOpen();
                               }}
                               w='max-content'>
                            <Stack spacing={0}>
                                <Text color='white'
                                      fontWeight='extrabold'>
                                    {item?.alias}
                                </Text>
                                <Text color='lightgray'
                                      fontWeight='bolder'>
                                    {item?.initialPrice ? item.initialPrice + ' ₽ + ' : ''}{item?.price} {tariffUnit[item?.type]}
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

    let navigate = useNavigate();

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
            window.location.href = obj.confirmationUrl;
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
                            <Tag colorScheme='brand'>
                                {rent?.tariff?.deposit} ₽ + {rent?.tariff?.price} {tariffUnit[rent?.tariff?.type]}
                            </Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Депозит</Text>
                        <HStack px={2}>
                            <Tag colorScheme="brand">{rent?.tariff?.deposit} ₽</Tag>
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

export function OfficeModal() {
    const [office, setOffice] = useState();
    const [loading, setLoading] = useState(false);
    let toast = useToast();

    function onSelectInventory(inventory) {
        setOffice(undefined);
        eventBus.raise(AppEvents.SelectedInventory, inventory)
    }


    useEffect(() => {
        let onSelectedOffice = eventBus.on(AppEvents.SelectedOffice, data => setOffice(data));
        return () => {
            onSelectedOffice()
        }
    }, [])


    return (
        <Slide in={office} style={{zIndex: zIndexes.Popover}} direction='bottom'>
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
                            <FaParking size={32} color='white'/>
                        </Center>

                        <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                              bgClip='text'
                              fontSize="4xl"
                              textAlign='start'
                              fontWeight="extrabold">
                            {office?.alias}
                        </Text>
                    </HStack>
                    <CloseButton onClick={() => setOffice(undefined)}/>
                </HStack>
                <VStack w='100' divider={<Divider/>}>
                    <VStack fontWeight='extrabold'>
                        <Text color='brand.800'>Режим работы</Text>
                        <Stack>
                            {(office?.schedules ?? []).map(schedule => {
                                    if (schedule.dayOff)
                                        return (
                                            <SimpleGrid columns={2}>
                                                <Tag>{toDayName(schedule.day)}</Tag>
                                                <Text>Выходной</Text>
                                            </SimpleGrid>
                                        )
                                    return (
                                        <SimpleGrid columns={2}>
                                            <Tag>{toDayName(schedule.day)}</Tag>
                                            <HStack>
                                                <Text>{toLocalTime(schedule.start)}</Text>
                                                <Text>-</Text>
                                                <Text>{toLocalTime(schedule.end)}</Text>
                                            </HStack>
                                        </SimpleGrid>
                                    )
                                }
                            )}
                        </Stack>
                    </VStack>
                    <VStack fontWeight='extrabold' w='100%'>
                        {office?.inventories?.map(inventory => (
                            <HStack bgColor='white'
                                    p={3}
                                    rounded={10}
                                    onClick={() => onSelectInventory(inventory)}>
                                <Stack px={2}>
                                    <Text fontSize='xl' color='brand.600'>
                                        {inventory.alias}
                                    </Text>
                                    <Text>
                                        {inventory.model.name}
                                    </Text>
                                </Stack>
                                <EquipmentLogo type={inventory.model.type} size={32}/>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            </Stack>
        </Slide>
    )
}

export function RentCounter() {
    let {isOpen, onClose, onOpen, onToggle} = useDisclosure();
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(false);

    let toast = useToast();


    async function load() {
        try {
            setLoading(true)
            let loadedRents = await rentService.getActiveRents();
            setRents(loadedRents)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false)
        }
    }

    function onClick(rent) {
        onClose();
        eventBus.raise(AppEvents.SelectedRent, rent)
    }

    useEffect(() => {
        load()
        let onStartRent = eventBus.on(AppEvents.StartRent, load);
        return () => {
            onStartRent()
        }
    }, [])

    return (
        <>
            {rents.length > 0 &&
                <Button onClick={onOpen} colorScheme='brand'>
                    В аренде
                </Button>
            }
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            <HStack justifyContent='space-between'>
                                <Text>Инвентарь</Text>
                                <CloseButton onClick={onClose}/>
                            </HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Stack divider={<Divider/>} p={2}>
                                {rents?.map(rent => (
                                    <VStack onClick={() => onClick(rent)}>
                                        <Text fontSize='xl' fontWeight='extrabold'>
                                            Аренда #{rent.id}
                                        </Text>
                                        <Tag>
                                            {moment(rent.startTime).format('lll')}
                                        </Tag>
                                    </VStack>
                                ))}
                            </Stack>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}
