import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Link,
    Skeleton,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useMediaQuery,
    useToast
} from "@chakra-ui/react";
import {
    IoMdArrowBack,
    IoMdArrowDown,
    IoMdArrowForward,
    IoMdArrowUp,
    IoMdEye,
    IoMdEyeOff,
    IoMdKey,
    IoMdMenu
} from "react-icons/io";
import React, {useEffect, useState} from "react";
import {userService} from "../service/UserService.js";
import {useNavigate} from "react-router-dom";
import {errorConverter} from "../error/ErrorConverter.js";
import {routes} from "../routes.js";

export function MainHeader({fixed}) {

    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
    const { isOpen, onOpen, onClose } = useDisclosure()
    let navigate = useNavigate();

    return (
        <>
            <HStack p={4}
                    justifyContent='space-between'
                    position={fixed ? 'fixed' : 'relative'}
                    top={0}
                    left={0}
                    bgColor='brand.800'
                    color='brand.100'
                    zIndex={999}
                    w='100%'>
                {isLargerThan800 &&
                    <HStack alignItems='center' spacing={4}>
                        <Link href={routes.home}
                              fontSize="2xl"
                              textAlign='center'
                              fontWeight="extrabold">
                            Самокатим.Бизнес
                        </Link>
                        {/*<Link href={routes}*/}
                        {/*      fontSize="xl"*/}
                        {/*      textAlign='center'*/}
                        {/*      fontWeight="extrabold">*/}
                        {/*    Инвентарь*/}
                        {/*</Link>*/}
                        {/*<Link href={routes.offices}*/}
                        {/*      fontSize="xl"*/}
                        {/*      textAlign='center'*/}
                        {/*      fontWeight="extrabold">*/}
                        {/*    Офисы*/}
                        {/*</Link>*/}
                    </HStack>
                }
                {!isLargerThan800 &&
                    <>
                        <IconButton fontSize="xl"
                                    bgGradient="linear(to-l, #7928CA,#FF0080)"
                                    _hover={{bgColor: "linear(to-l, #7928CA,#FF0080)"}}
                                    textAlign='center'
                                    fontWeight="extrabold"
                                    onClick={onOpen}
                                    icon={<IoMdMenu/>}

                                    aria-label={'Меню'}>
                        </IconButton>
                        <Drawer
                            isOpen={isOpen}
                            placement='left'
                            onClose={onClose}
                        >
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader color='brand.500'>
                                </DrawerHeader>

                                <DrawerBody>
                                    <Stack p={3} color='brand.500' spacing={4} divider={<Divider/>}>
                                        <Link href={routes.home}
                                              fontSize="2xl"
                                              fontWeight="extrabold">
                                            Самокатим.Бизнес
                                        </Link>
                                        {/*<Link href={routes.inventories}*/}
                                        {/*      fontSize="xl"*/}
                                        {/*      fontWeight="extrabold">*/}
                                        {/*    Инвентарь*/}
                                        {/*</Link>*/}
                                        {/*<Link href={routes.offices}*/}
                                        {/*      fontSize="xl"*/}
                                        {/*      fontWeight="extrabold">*/}
                                        {/*    Офисы*/}
                                        {/*</Link>*/}
                                    </Stack>
                                </DrawerBody>

                            </DrawerContent>
                        </Drawer>
                    </>
                }
                {userService.authenticated() &&
                    <Button fontSize="xl"
                            bgGradient="linear(to-l, #7928CA,#FF0080)"
                            _hover={{bgColor: "linear(to-l, #7928CA,#FF0080)"}}
                            textAlign='center'
                            onClick={() => userService.signout()}
                            fontWeight="extrabold">
                        Выйти
                    </Button>
                }
                {!userService.authenticated() &&
                    <Button fontSize="xl"
                            bgGradient="linear(to-l, #7928CA,#FF0080)"
                            _hover={{bgColor: "linear(to-l, #7928CA,#FF0080)"}}
                            textAlign='center'
                            onClick={() => navigate(routes.signIn)}
                            fontWeight="extrabold">
                        Войти
                    </Button>
                }
            </HStack>
            <div style={{height: 70}}/>
        </>
    )
}


export function InputPassword(props) {
    let [isHidden, setHidden] = useState(true);

    function changeMode() {
        if (props.onlyHidden) {
            setHidden(true)
        } else {
            setHidden(!isHidden)
        }
    }

    return (
        <InputGroup>
            {props.showLeftAddons &&
                <InputLeftAddon>
                    <IoMdKey/>
                </InputLeftAddon>
            }
            <Input type={isHidden ? 'password' : 'text'}
                   {...props}
            />
            {!props.onlyHidden &&
                <InputRightElement>
                    <IconButton aria-label='show password'
                                size={32}
                                onClick={changeMode}
                                icon={isHidden ? <IoMdEyeOff/> : <IoMdEye/>}
                    />
                </InputRightElement>
            }
        </InputGroup>
    )
}


export function Pageable({loader, columns, label, baseUrl}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({number: 0})
    const [pageable, setPageable] = useState({page: 0, size: 5})
    const [sort, setSort] = useState({
        asc: ['id'],
        desc: []
    })

    let toast = useToast();
    let navigate = useNavigate();


    async function loadData() {
        try {
            setLoading(true);
            let joinedAsc = 'sort=' + sort.asc.join(',') + ',asc';
            let joinedDesc = 'sort=' + sort.desc.join(',') + ',desc';
            let loadedData = await loader({
                page: pageable.page,
                size: pageable.size,
                sort: [joinedAsc, joinedDesc].join('&')
            });
            setData(loadedData)
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            })
        } finally {
            setLoading(false)
        }
    }

    function changeSort(fieldName, direction) {
        if (direction === 'asc')
            setSort({
                asc: [...sort.asc, fieldName],
                desc: sort.desc.filter(f => f !== fieldName)
            })
        if (direction === 'desc')
            setSort({
                asc: sort.asc.filter(f => f !== fieldName),
                desc: [...sort.desc, fieldName]
            })
        if (direction === 'none')
            setSort({
                asc: sort.asc.filter(f => f !== fieldName),
                desc: sort.desc.filter(f => f !== fieldName)
            })
    }



    useEffect(
        () => {
            loadData()
        },
        [pageable, sort]
    )

    return (
        <Stack>
            <Stack w='100%' p={4}>
                <Stack>
                    <HStack justifyContent='space-between'>
                        <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                              bgClip='text'
                              p={2}
                              fontSize="4xl"
                              textAlign='center'
                              fontWeight="extrabold">
                            {label}
                        </Text>
                        <Button colorScheme='brand'
                                onClick={() => navigate(`${baseUrl}/new`)}>
                            Добавить
                        </Button>
                    </HStack>
                </Stack>
                <TableContainer minH='75vh'>
                    <Table variant='unstyled'>
                        <Thead>
                            <Tr>
                                {columns.map(col => (
                                    <Th textAlign='center'>
                                        {col.name}
                                        {!col.disabledSort &&
                                            <ButtonSort fieldName={col.fieldName}
                                                        defaultDirection={col.defaultSort}
                                                        onClick={changeSort}/>
                                        }
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data?.content?.map(item => (
                                <Tr key={item.id}
                                    onClick={() => navigate(`${baseUrl}/${item.id}`)}
                                    _hover={{bgColor: 'purple.50'}}>
                                    {columns.map(col => (
                                        <Td textAlign='center'>{col.getValue(item)}</Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <HStack justifyContent='center'>
                    <IconButton icon={<IoMdArrowBack/>}
                                onClick={() => setPageable({...pageable, page: pageable.page - 1})}
                                isDisabled={data.first}/>
                    <Button>
                        <Skeleton isLoaded={!loading && !isNaN(data.number + 1)}>
                            {data.number + 1}
                        </Skeleton>
                    </Button>
                    <IconButton icon={<IoMdArrowForward/>}
                                onClick={() => setPageable({...pageable, page: pageable.page + 1})}
                                isDisabled={data.last}/>
                </HStack>
            </Stack>
        </Stack>
    )
}


function ButtonSort({fieldName, onClick, defaultDirection}) {
    const [direction, setDirection] = useState(defaultDirection ?? 'none')

    useEffect(() => {
        onClick(fieldName, direction)
    }, [direction])

    switch (direction) {
        case 'asc': {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('desc')}
                            aria-label='sort'
                            icon={<IoMdArrowUp/>}/>
            )
        }
        case 'desc': {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('none')}
                            aria-label='sort'
                            icon={<IoMdArrowDown/>}/>
            )
        }
        default : {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('asc')}
                            aria-label='sort'
                            icon={<IoMdArrowBack/>}/>
            )
        }
    }


}
