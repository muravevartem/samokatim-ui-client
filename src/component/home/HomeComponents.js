import {
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay, AlertIcon,
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
    Slide,
    Stack,
    Tag,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {EquipmentLogo, NumberOfDayWeek, ShortDaysOfWeek, tariffUnit, zIndexes} from "../util.js";
import React, {useEffect, useState} from "react";
import {AppEvents, eventBus} from "../../service/EventBus.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {rentService} from "../../service/RentService.js";
import moment from "moment";
import {FaParking} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {fileService} from "../../service/FileService.js";
import {IoMdInformationCircle, IoMdQrScanner} from "react-icons/io";
import {MdBikeScooter} from "react-icons/md";
import {FcStart} from "react-icons/fc";

export function InventoryModal() {
    const [inventory, setInventory] = useState();
    const [disabled, setDisabled] = useState(true);
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
        let onSelectedInventory = eventBus.on(AppEvents.SelectedInventory,
            data => {
                setInventory(data.inventory);
                setDisabled(data.disabled ?? false)
            });
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
                            Для подтверждждение аренды нужно оплатить депозит.
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
                        <Center bgGradient={disabled ? null : "linear(to-l, #7928CA,#FF0080)"}
                                bgColor={disabled ? 'gray' : null}
                                p={2}
                                rounded={10}>
                            <EquipmentLogo type={inventory?.model?.type} size={32} color='white'/>
                        </Center>

                        <Stack spacing={0}>
                            <Text color={disabled ? 'gray' : 'brand.600'}
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
                {!inventory.supportsTelemetry &&
                    <HStack alignItems='start' spacing={1}>
                        <IoMdInformationCircle size='48' color='pink'/>
                        <Stack p={1} spacing={0}>
                            <Text color={'brand.600'}
                                  p={2}
                                  fontWeight='extrabold'>
                                Оборудование не поддерживает отслеживание
                            </Text>
                            <Text color='brand.600'
                                  p={2}
                                  fontWeight='extrabold'>
                                Начало и завершение аренды возможны только в
                                пунктах проката организации проката
                            </Text>
                        </Stack>
                    </HStack>
                }
                <HStack overflowX='auto'>
                    {inventory?.tariffs?.map(item => (
                        <Stack key={item?.id}
                               bgColor={disabled ? 'gray' : 'brand.300'}
                               cursor='pointer'
                               rounded={10}
                               p={2}
                               onClick={() => {
                                   if (!disabled) {
                                       setSelectedTariff(item);
                                       onOpen();
                                   }
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
                {disabled &&
                    <Stack bgColor={'gray'}
                           cursor='pointer'
                           rounded={10}
                           p={2}>
                        <Stack spacing={0}>
                            <Text color='white'
                                  textAlign='center'
                                  fontWeight='extrabold'>
                                Пункт проката в котором находится данный инвентарь закрыт
                            </Text>
                        </Stack>
                    </Stack>
                }
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

    if (!rent)
        return null;

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

                        <Stack spacing={0}>
                            <Text color='brand.600'
                                  fontSize="2xl"
                                  textAlign='start'
                                  fontWeight="extrabold">
                                {rent?.inventory?.model?.name}
                            </Text>
                            <HStack spacing={1}>
                                <IoMdQrScanner/>
                                <Text fontSize="md"
                                      textAlign='start'>
                                    {rent?.inventory?.alias}
                                </Text>
                            </HStack>
                        </Stack>
                    </HStack>
                    <CloseButton onClick={() => setRent(undefined)}/>
                </HStack>
                <HStack>
                    <Image src={fileService.url(rent?.inventory?.organization?.logo)} rounded='50%' boxSize={14}/>
                    <Text color='brand.600' fontWeight='bold'>{rent?.inventory?.organization?.name}</Text>
                </HStack>
                <VStack w='100%' alignItems='start' divider={<Divider/>}>
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
                                {rent?.tariff?.initialPrice} ₽ + {rent?.tariff?.price} {tariffUnit[rent?.tariff?.type]}
                            </Tag>
                        </HStack>
                    </Stack>
                    <Stack fontWeight='extrabold'>
                        <Text color='brand.800'>Депозит</Text>
                        <HStack px={2}>
                            <Tag colorScheme="brand">{rent?.tariff?.deposit} ₽</Tag>
                        </HStack>
                    </Stack>
                    {!rent?.inventory?.supportsTelemetry &&
                        <HStack alignItems='start' spacing={1}>
                            <IoMdInformationCircle size='48' color='pink'/>
                            <Stack p={1} spacing={0}>
                                <Text color='brand.600'
                                      p={2}
                                      fontWeight='extrabold'>
                                    Оборудование не поддерживает отслеживание
                                </Text>
                                <Text color='brand.600'
                                      p={2}
                                      fontWeight='extrabold'>
                                    Начало и завершение аренды возможны только в
                                    пунктах проката организации проката
                                </Text>
                                <Text color='brand.600'
                                      p={2}
                                      fontWeight='extrabold'>
                                    Для завершения аренды назовите сотруднику пункта проката номер аренды:
                                    <Badge colorScheme='brand' fontSize='md'>{rent?.id}</Badge>
                                </Text>
                            </Stack>
                        </HStack>
                    }
                    {(rent?.status === 'ACTIVE' && rent?.inventory?.supportsTelemetry) &&
                        <HStack justifyContent='center' w='100%'>
                            <Button w={250}
                                    isDisabled={loading}
                                    onClick={stopRent}
                                    colorScheme='brand'>
                                Завершить
                            </Button>
                        </HStack>
                    }
                </VStack>
            </Stack>
        </Slide>
    )
}

export function OfficeModal() {
    const [office, setOffice] = useState();
    const [loading, setLoading] = useState(false);
    let [officeClosed, setOfficeClosed] = useState(false);
    let toast = useToast();

    function onSelectInventory(inventory) {
        setOffice(undefined);
        eventBus.raise(AppEvents.SelectedInventory,
            {
                inventory: inventory,
                disabled: officeClosed
            })
    }


    useEffect(() => {
        let onSelectedOffice = eventBus.on(AppEvents.SelectedOffice, data => {
            setOffice(data)
            let now = moment();
            let todayDay = now.isoWeekday();
            let todaySDay = data.schedules.filter(sDay => NumberOfDayWeek[sDay.day] === todayDay)[0];
            if (todaySDay.dayOff) {
                setOfficeClosed(true);
                return;
            }
            let splitedStart = todaySDay.start.split(':').map(str => Number.parseInt(str));
            let splitedEnd = todaySDay.end.split(':').map(str => Number.parseInt(str));
            let startTime = moment().set({hour: splitedStart[0], minute: splitedStart[1]});
            let endTime = moment().set({hour: splitedEnd[0], minute: splitedEnd[1]});
            setOfficeClosed(!now.isBetween(startTime, endTime));
        });
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

                        <Stack spacing={0}>
                            <Text color='brand.600'
                                  fontSize="2xl"
                                  textAlign='start'
                                  fontWeight="extrabold">
                                {office?.alias}
                            </Text>
                            <HStack spacing={1}>
                                <Text fontSize="md"
                                      textAlign='start'>
                                    Пункт проката
                                </Text>
                            </HStack>
                        </Stack>
                    </HStack>
                    <CloseButton onClick={() => setOffice(undefined)}/>
                </HStack>
                <HStack>
                    <Image src={fileService.url(office?.organization?.logo)} rounded='50%' boxSize={14}/>
                    <Text color='brand.600' fontWeight='bold'>{office?.organization?.name}</Text>
                </HStack>
                <Stack>
                    <Text color='brand.600' fontWeight='bold' textAlign='center'>{office?.address}</Text>
                </Stack>
                <VStack w='100' divider={<Divider/>}>
                    <VStack fontWeight='extrabold'>
                        <VStack spacing={0}>
                            <Text color='brand.800'>Режим работы</Text>
                        </VStack>
                        <Stack>
                            {(office?.schedules ?? []).map(schedule => {
                                    if (schedule.dayOff)
                                        return (
                                            <HStack columns={2}>
                                                <Tag colorScheme='brand' w={10}>
                                                    <Text textAlign='center' w='100%'>
                                                        {ShortDaysOfWeek[schedule.day]}
                                                    </Text>
                                                </Tag>
                                                <Text color='darkgray'>Выходной</Text>
                                            </HStack>
                                        )
                                    return (
                                        <HStack columns={2} gap={2} key={schedule.day} w='100%'>
                                            <Tag colorScheme='brand' w={10}>
                                                <Text textAlign='center' w='100%'>
                                                    {ShortDaysOfWeek[schedule.day]}
                                                </Text>
                                            </Tag>
                                            <HStack>
                                                <Text>{schedule.start}</Text>
                                                <Text>-</Text>
                                                <Text>{schedule.end}</Text>
                                            </HStack>
                                        </HStack>
                                    )
                                }
                            )}
                        </Stack>
                    </VStack>
                    <VStack w='100%'>
                        {office?.inventories?.map(inventory => (
                            <HStack bgColor='white'
                                    key={inventory.id}
                                    justifyContent='space-between'
                                    w='100%'
                                    p={3}
                                    rounded={10}
                                    onClick={() => onSelectInventory(inventory)}>
                                <HStack>
                                    <Center bgGradient={officeClosed ? null : "linear(to-l, #7928CA,#FF0080)"}
                                            bgColor={officeClosed ? 'gray' : null}
                                            p={2}
                                            rounded={10}>
                                        <EquipmentLogo type={inventory?.model?.type} size={32} color='white'/>
                                    </Center>

                                    <Stack spacing={0}>
                                        <Text color={officeClosed ? 'gray' : 'brand.600'}
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
                            </HStack>
                        ))}
                    </VStack>
                    {officeClosed &&
                        <Alert colorScheme='brand'
                               color='brand.600'
                               fontWeight='extrabold'
                               rounded={10}>
                            <AlertIcon/>
                            Пункт проката сейчас не работает
                        </Alert>
                    }
                </VStack>
            </Stack>
        </Slide>
    )
}

export function RentCounter() {
    let {isOpen, onClose, onOpen, onToggle} = useDisclosure();
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(false);

    let toast = useToast();


    async function load() {
        try {
            setLoading(true)
            let loadedRents = await rentService.getActiveRents();
            if (rents.length < loadedRents.length) {
                setShowNewMessage(true);
            }
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
        let interval = setInterval(load, 5000);
        return () => {
            clearInterval(interval);
        }
    }, [])

    return (
        <>
            {rents.length > 0 &&
                <Button onClick={onOpen} colorScheme='brand'>
                    <HStack>
                        <MdBikeScooter/>
                        <Text>{rents.length}</Text>
                    </HStack>
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
                                <Text>В аренде</Text>
                                <CloseButton onClick={onClose}/>
                            </HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Stack divider={<Divider/>} p={2}>
                                {rents?.map(rent => (
                                    <VStack onClick={() => onClick(rent)}>
                                        <HStack>
                                            <Center bgGradient="linear(to-l, #7928CA,#FF0080)" p={2} rounded={10}>
                                                <EquipmentLogo type={rent?.inventory?.model?.type} size={32}
                                                               color='white'/>
                                            </Center>
                                            <Stack spacing={0}>
                                                <Text color='brand.600'
                                                      fontSize="2xl"
                                                      textAlign='start'
                                                      fontWeight="extrabold">
                                                    {rent?.inventory?.model?.name}
                                                </Text>
                                                <HStack spacing={1}>
                                                    <IoMdQrScanner/>
                                                    <Text fontSize="md"
                                                          textAlign='start'>
                                                        {rent?.inventory?.alias}
                                                    </Text>
                                                </HStack>
                                                <HStack>
                                                    <FcStart/>
                                                    <Tag>
                                                        {moment(rent.startTime).format('lll')}
                                                    </Tag>
                                                </HStack>
                                            </Stack>
                                        </HStack>
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
