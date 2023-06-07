import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertIcon,
    Avatar,
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    IconButton,
    Input,
    Skeleton,
    Switch,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {MdDone, MdEdit} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {AxiosError} from "axios";
import validator from "validator/es";
import {routes} from "../routes.js";
import {events, eventService} from "../service/EventService.js";

export function ProfilePage() {

    let [loading, setLoading] = useState(false);
    let [user, setUser] = useState({});

    let toast = useToast();
    let navigate = useNavigate();

    async function loadUser() {
        try {
            setLoading(true);
            let currentUser = await userService.me();
            setUser({
                ...currentUser,
                password: '*******'
            });
        } catch (e) {
            toast({
                status: 'error',
                title: 'Ошибка',
                description: 'Ошибка загрузки информации о пользователе'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUser()
        eventService.subscribe(events.updatedUserName, loadUser)
    }, [])

    return (
        <VStack w='100%' p={5}>
            <VStack divider={<Divider/>} maxW={768} w='100%'>
                {(!loading && (!user.firstName || !user.lastName)) &&
                    <Alert status='warning'>
                        <AlertIcon/>
                        Давайте познакомимся
                    </Alert>
                }
                <ProfileBlock user={user} loading={loading}/>
                <ProfileInfo loaded={!loading}
                             onChange={() => eventService.raise(events.updatedUserName)}
                             fieldName='firstname'
                             validate={value => !validator.isEmpty(value)}
                             beautifulName='Имя'
                             v={user.firstName ?? ''}/>
                <ProfileInfo loaded={!loading}
                             onChange={() => eventService.raise(events.updatedUserName)}
                             fieldName='lastname'
                             validate={value => !validator.isEmpty(value)}
                             beautifulName='Фамилия'
                             v={user.lastName ?? ''}/>
                <ProfileInfo loaded={!loading}
                             fieldName='tel'
                             validate={value => validator.isMobilePhone(value, 'ru-RU')}
                             beautifulName='Номер телефона'
                             v={user.tel ?? ''}/>
                <ProfileInfo beautifulName='Электронная почта'
                             fieldName='email'
                             onChange={() => {
                                 userService.signout();
                                 navigate(routes.signIn)
                             }}
                             validate={value => validator.isEmail(value)}
                             loaded={!loading}
                             type='email'
                             v={user.email ?? ''}/>
                {/*<NotificationInfo loading={loading}/>*/}
                <ButtonBlock/>
            </VStack>
        </VStack>
    )
}

function ProfileBlock({user, loading}) {

    return (
        <HStack paddingY={10}>
            <Skeleton isLoaded={!loading}>
                <Avatar name={`${user.lastName} ${user.firstName}`} size='2xl'/>
            </Skeleton>
            <Box p={2}>
                <Skeleton isLoaded={!loading}>
                    <Heading>{user.lastName} {user.firstName}</Heading>
                </Skeleton>
            </Box>
        </HStack>
    )
}

function ProfileInfo({loaded, fieldName, beautifulName, v, immutable, type, validate, onChange}) {
    let toast = useToast();
    const [value, setValue] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(!loaded)
    const [error, setError] = useState(false);

    useEffect(() => {
        setValue(v);
    }, [v])

    async function onChangeMode() {
        if (editMode) {
            await change()
            return;
        }
        setEditMode(true);
    }

    async function changeValue(e) {
        let textValue = e.target.value;
        setError(!(validate(textValue)));
        setValue(textValue);
    }

    async function change() {
        try {
            setLoading(true);
            await userService.modify(fieldName, value)
            toast({
                title: 'Изменения успешно сохранены',
                status: 'success',
                duration: 5000,
                isClosable: true
            })
            setEditMode(false)
            if (onChange)
                onChange();
        } catch (e) {
            if (e instanceof AxiosError) {
                toast({
                    title: e.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                })
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <HStack justifyContent='space-between' w='100%'>
            <Box p={3} w='100%'>
                <Heading size='md'>{beautifulName}</Heading>
                {!editMode &&
                    <Skeleton isLoaded={!loading}>
                        <Text>{type === 'password' ? '**********' : value}</Text>
                    </Skeleton>
                }
                {editMode &&
                    <Skeleton isLoaded={!loading}>
                        <Input value={value} onChange={changeValue} type={type} w='100%'/>
                        {error && <Text color='red'>Не валидное значение</Text>}
                    </Skeleton>
                }
            </Box>
            {!immutable &&
                <IconButton aria-label='Edit'
                            isDisabled={error}
                            colorScheme={error ? 'red' : 'gray'}
                            icon={editMode ? <MdDone/> : <MdEdit/>}
                            onClick={!error ? onChangeMode : e => {
                            }}/>
            }
        </HStack>
    )
}

function NotificationInfo({loading}) {
    return (
        <HStack justifyContent='space-between' w='100%' p={3}>
            <Heading size='sm'>Получать уведомление про акции</Heading>
            <Skeleton isLoaded={!loading}>
                <Switch/>
            </Skeleton>
        </HStack>
    )
}

function ButtonBlock({loading}) {
    let navigate = useNavigate();

    async function signout() {
        try {
            await userService.signout();
            navigate(routes.signIn);
        } catch (e) {
        }
    }

    return (
        <VStack w='100%'>
            <Box w='100%' p={3}>
                <Skeleton isLoaded={!loading}>
                    <Button w='100%'
                            onClick={() => navigate(routes.archiveRents)}
                            colorScheme='brand'>
                        История поездок
                    </Button>
                </Skeleton>
            </Box>
            <Box w='100%' p={3}>
                <Button w='100%' onClick={signout}>Выйти из аккаунта</Button>
            </Box>
        </VStack>
    )
}
