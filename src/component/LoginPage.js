import React, {useEffect, useState} from "react";
import {
    AbsoluteCenter,
    Box,
    Button,
    ButtonGroup,
    Center,
    Container,
    Heading,
    Input, Link, Skeleton,
    Stack, useToast,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {AxiosError} from "axios";

export function LoginPage() {
    const [signInObject, setSignInObject] = useState({login: '', password: ''});
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
            let signInResult = await userService.signin(signInObject);
            if (signInResult.newUser) {
                toast({
                    status: 'success',
                    title: 'Добро пожаловать',
                    duration: 2000,
                    isClosable: true,
                })
            }
            setTimeout(() => navigate(-1), 2000);
        } catch (e) {
            console.log(e)
            if (e instanceof AxiosError) {
                toast({
                    status: 'error',
                    title: 'Ошибка аунтентификации',
                    description: e.response.data.message,
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    status: 'error',
                    title: 'Неизвестная ошибка',
                    duration: 3000,
                    isClosable: true,
                })
            }
            setLoading(false);
        }
    }


    function onChange(value) {
        setSignInObject({
            ...signInObject,
            ...value
        })
    }

    return (
        <AbsoluteCenter>
            <VStack spacing={6}>
                <Heading colorScheme='yellow'>Вход</Heading>
                <Skeleton isLoaded={!loading}>
                    <Input
                        value={signInObject.login}
                        w='100%'
                        onChange={event => onChange({login: event.target.value})}
                        placeholder='+79871234568'
                    />
                </Skeleton>
                <VStack w='75%' spacing={4}>
                    <Button colorScheme='yellow'
                            w='100%'
                            onClick={onSubmit}>
                        Войти
                    </Button>
                </VStack>
            </VStack>
        </AbsoluteCenter>
    )
}

function InternalLoginComponent(props) {



    return (
        <VStack spacing={5}>

        </VStack>
    );
}
