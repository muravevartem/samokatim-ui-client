import React, {useEffect, useState} from "react";
import {
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Link,
    Skeleton,
    Stack,
    useToast
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {IoMdEye, IoMdEyeOff, IoMdKey, IoMdMail} from "react-icons/io";
import isEmail from "validator/es/lib/isEmail.js";

export function LoginPage() {
    const [state, setState] = useState({
        username: '',
        password: '',
        showPass: false
    });
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    let toast = useToast();

    useEffect(() => {
        if (userService.authenticated())
            navigate(-1);
    }, [])

    async function onSubmit() {
        setLoading(true);
        try {
            let signInResult = await userService.signin(state);
            navigate(-1)
        } catch (e) {
            toast({
                status: 'error',
                title: 'Ошибка аунтентификации',
                description: e.response.data.message,
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
        }
    }

    async function onRegister() {
        try {
            setLoading(true);
            await userService.registration(state);
            await onSubmit()
        } catch (e) {
            toast({
                status: 'error',
                title: 'Ошибка аунтентификации',
                description: e.response.data.message,
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
        }
    }

    function onChange(value) {
        setState({
            ...state,
            ...value
        })
    }

    return (
        <Center minH='100vh'>
            <Stack spacing={6} w='100%'>
                <Heading textAlign='center'>Самокатим</Heading>
                <Divider/>
                <Skeleton isLoaded={!loading}>
                    <InputGroup>
                        <InputLeftAddon>
                            <IoMdMail/>
                        </InputLeftAddon>
                        <Input
                            value={state.username}
                            isInvalid={state.username !== '' && !isEmail(state.username)}
                            w='100%'
                            onChange={event => onChange({
                                username: event.target.value
                            })}
                            placeholder='mail@samokatim.com'
                        />
                    </InputGroup>
                </Skeleton>
                <Skeleton isLoaded={!loading}>
                    <InputGroup>
                        <InputLeftAddon>
                            <IoMdKey/>
                        </InputLeftAddon>
                        <Input type={state.showPass ? 'text' : 'password'}
                               isInvalid={state.password !== '' && state.password.length < 8}
                               value={state.password}
                               onChange={e => setState({...state, password: e.target.value})}
                        />
                        <InputRightElement>
                            <IconButton aria-label='show password'
                                        onClick={() => setState({...state, showPass: !state.showPass})}
                                        icon={state.showPass ? <IoMdEye/> : <IoMdEyeOff/>}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Skeleton>
                <Stack spacing={3}>
                    <Button onClick={onSubmit}
                            isDisabled={!isEmail(state.username) || state.password < 8}
                            colorScheme='green'>
                        Войти
                    </Button>
                    <HStack justifyContent='center'>
                        <Link onClick={onRegister}>
                            Зарегистрировать
                        </Link>
                    </HStack>
                </Stack>
            </Stack>
        </Center>
    )
}
